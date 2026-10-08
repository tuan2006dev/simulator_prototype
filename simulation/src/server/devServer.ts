// Development-only authoritative session API. Bind to loopback; production must
// replace the fixed dev principal with authenticated connection identity.
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { createIsland } from '../core/factory';
import { SimulationSession, type CommandEnvelope } from '../core/SimulationSession';
import { generateWorldMap } from '../renderer/WorldMap';
import { spawnResources } from '../renderer/ResourceSpawner';
import type { WorldConfig } from '../ui/StartScreen';

interface HostedSession {
  lastClockTime:number;
  session: SimulationSession;
  config: Pick<WorldConfig, 'seed' | 'shape' | 'size' | 'startPop'>;
  players: Map<string, string>;
}

const sessions = new Map<string, HostedSession>();
const ALLOWED_ORIGINS = new Set([
  'http://127.0.0.1:3000', 'http://localhost:3000',
  'http://127.0.0.1:5173', 'http://localhost:5173',
]);
const MAX_BODY_BYTES = 16 * 1024;
const MAX_SESSIONS = 64;
const MAX_PLAYERS_PER_SESSION = 16;

function send(res: ServerResponse, status: number, data: unknown): void {
  const payload = JSON.stringify(data);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(payload);
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > MAX_BODY_BYTES) throw new RangeError('body_too_large');
    chunks.push(buffer);
  }
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new TypeError('invalid_json_object');
  return parsed as Record<string, unknown>;
}

function findSession(pathname: string): { id: string; entry: HostedSession; suffix: string } | null {
  const match = pathname.match(/^\/api\/islands\/([a-f0-9-]+)(\/(?:commands|join))?$/i);
  if (!match) return null;
  const entry = sessions.get(match[1]);
  return entry ? { id: match[1], entry, suffix: match[2] ?? '' } : null;
}

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('access-control-allow-origin', origin);
    res.setHeader('vary', 'Origin');
    res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
    res.setHeader('access-control-allow-headers', 'content-type');
  } else if (origin) {
    send(res, 403, { error: 'origin_not_allowed' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? '/', 'http://127.0.0.1');
  if (req.method === 'GET' && url.pathname === '/api/health') {
    send(res, 200, { ok: true, mode: 'development-loopback', sessions: sessions.size });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/islands') {
    if (sessions.size >= MAX_SESSIONS) {
      send(res, 503, { error: 'session_capacity_reached' });
      return;
    }
    let body: Record<string, unknown>;
    try { body = await readJson(req); } catch (error) {
      send(res, error instanceof RangeError ? 413 : 400, { error: error instanceof Error ? error.message : 'invalid_request' });
      return;
    }
    const population = body.population;
    const seed = body.seed;
    const shape = body.shape;
    const size = body.size;
    if (typeof population !== 'number' || !Number.isSafeInteger(population) || population < 3 || population > 15) {
      send(res, 400, { error: 'invalid_island_config', allowed: { population: 'integer 3–15' } });
      return;
    }
    const dimensions = {
      small: [50, 35], medium: [80, 50], large: [120, 80],
    } as const;
    if (!Number.isSafeInteger(seed) || (seed as number) < 1 || (seed as number) > 999999 ||
        !['circle', 'elongated', 'archipelago', 'crescent'].includes(String(shape)) ||
        !(size === 'small' || size === 'medium' || size === 'large')) {
      send(res, 400, { error: 'invalid_world_config' });
      return;
    }

    const [width, height] = dimensions[size];
    const worldMap = generateWorldMap(width, height, seed as number, shape as 'circle' | 'elongated' | 'archipelago' | 'crescent');
    const island = createIsland('Đảo Thiên Nguyên', population as number);
    island.sharedFood = population as number * 5;
    island.wood = 0;
    island.stone = 0;
    island.resources = spawnResources(worldMap, seed as number);
    const id = randomUUID();
    const config = {
      seed: seed as number,
      shape: shape as WorldConfig['shape'],
      size: size as WorldConfig['size'],
      startPop: population as number,
    };
    const players = new Map<string, string>();
    const connectionToken = randomUUID();
    players.set(connectionToken, randomUUID());
    const entry = { session: new SimulationSession(island, worldMap), config, players, lastClockTime:performance.now() };
    sessions.set(id, entry);
    send(res, 201, { islandId: id, connectionToken, worldConfig: config, ...entry.session.snapshot() });
    return;
  }

  const found = findSession(url.pathname);
  if (!found) {
    send(res, 404, { error: 'session_not_found' });
    return;
  }

  if (req.method === 'POST' && found.suffix === '/join') {
    if (found.entry.players.size >= MAX_PLAYERS_PER_SESSION) {
      send(res, 503, { error: 'island_player_capacity_reached' });
      return;
    }
    const connectionToken = randomUUID();
    found.entry.players.set(connectionToken, randomUUID());
    send(res, 200, {
      islandId: found.id,
      connectionToken,
      worldConfig: found.entry.config,
      ...found.entry.session.snapshot(),
    });
    return;
  }

  if (req.method === 'GET' && !found.suffix) {
    send(res, 200, { islandId: found.id, ...found.entry.session.snapshot() });
    return;
  }

  if (req.method === 'POST' && found.suffix === '/commands') {
    let body: Record<string, unknown>;
    try { body = await readJson(req); } catch (error) {
      send(res, error instanceof RangeError ? 413 : 400, { error: error instanceof Error ? error.message : 'invalid_request' });
      return;
    }
    const connectionToken = body.connectionToken;
    const playerId = typeof connectionToken === 'string' ? found.entry.players.get(connectionToken) : undefined;
    if (!playerId) {
      send(res, 401, { error: 'invalid_session_connection' });
      return;
    }
    const envelope = { ...body, playerId } as unknown as CommandEnvelope;
    const result = found.entry.session.submit(envelope);
    send(res, result.accepted ? 200 : 409, result);
    return;
  }

  send(res, 405, { error: 'method_not_allowed' });
}

export function createDevelopmentServer(): Server {
  return createServer((req, res) => {
    void handle(req, res).catch(error => {
      console.error('[dev-server] request failed:', error);
      if (!res.headersSent) send(res, 500, { error: 'internal_error' });
      else res.destroy();
    });
  });
}

export function startDevelopmentServer(port = Number(process.env.PORT ?? 3001)): Server {
  const server = createDevelopmentServer();
  const clock = setInterval(() => {
    for (const [id, hosted] of sessions) {
      try { const now=performance.now();let elapsed=Math.max(0,now-hosted.lastClockTime);hosted.lastClockTime=now;while(elapsed>0){const batch=Math.min(elapsed,120000);hosted.session.advanceTime(batch,false);elapsed-=batch;} }
      catch (error) { console.error(`[dev-server] tick failed for ${id}:`, error); }
    }
  }, 1000);
  server.on('close', () => clearInterval(clock));
  server.listen(port, '127.0.0.1', () => {
    const address = server.address();
    const boundPort = typeof address === 'object' && address ? address.port : port;
    console.log(`[dev-server] loopback API listening at http://127.0.0.1:${boundPort}`);
    console.log('[dev-server] development only; no account auth, database, or internet-facing listener');
  });
  return server;
}

if (process.argv[1]?.split('\\').join('/').endsWith('/src/server/devServer.ts')) {
  startDevelopmentServer();
}
