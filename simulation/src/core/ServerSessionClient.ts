import type { Island, LaborRole } from './types';
import type { NPCCommandType } from '../game/GameState';
import type { WorldConfig } from '../ui/StartScreen';

const SERVER_API = 'http://127.0.0.1:3001/api';

interface ServerEnvelope {
  islandId: string;
  connectionToken: string;
  revision: number;
  island: unknown;
}

export interface RemoteSnapshot {
  islandId: string;
  revision: number;
  island: Island;
}

function restoreMaps(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(restoreMaps);
  if (!value || typeof value !== 'object') return value;
  const record = value as Record<string, unknown>;
  if (record.__type === 'Map' && Array.isArray(record.entries)) {
    return new Map((record.entries as unknown[][]).map(([key, entryValue]) => [key, restoreMaps(entryValue)]));
  }
  return Object.fromEntries(Object.entries(record).map(([key, entryValue]) => [key, restoreMaps(entryValue)]));
}

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body?.error ?? `server_http_${response.status}`);
  return body;
}

export class ServerSessionClient {
  private sequence = 0;

  private constructor(
    readonly islandId: string,
    private readonly connectionToken: string,
    public revision: number,
    readonly island: Island,
  ) {}

  static async create(config: WorldConfig): Promise<ServerSessionClient> {
    const response = await fetch(`${SERVER_API}/islands`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ population: config.startPop, seed: config.seed, shape: config.shape, size: config.size }),
    });
    const snapshot = await readResponse<ServerEnvelope>(response);
    return new ServerSessionClient(snapshot.islandId, snapshot.connectionToken, snapshot.revision, restoreMaps(snapshot.island) as Island);
  }

  static async join(islandId: string): Promise<{ client: ServerSessionClient; config: WorldConfig }> {
    const response = await fetch(`${SERVER_API}/islands/${encodeURIComponent(islandId)}/join`, { method: 'POST' });
    const snapshot = await readResponse<ServerEnvelope & { worldConfig: WorldConfig }>(response);
    const client = new ServerSessionClient(
      snapshot.islandId,
      snapshot.connectionToken,
      snapshot.revision,
      restoreMaps(snapshot.island) as Island,
    );
    return { client, config: { ...snapshot.worldConfig, mode: 'server-dev' } };
  }

  async assignLabor(npcId: string, role: LaborRole): Promise<boolean> {
    return this.submit({ type: 'assign_labor', npcId, role });
  }

  async inviteSettler(tileX: number, tileY: number): Promise<boolean> {
    return this.submit({ type: 'invite_settler', tileX, tileY });
  }

  async placeNPC(npcId: string, tileX: number, tileY: number): Promise<boolean> {
    return this.submit({ type: 'place_npc', npcId, tileX, tileY });
  }

  async issueAction(npcId: string, action: NPCCommandType): Promise<boolean> {
    return this.submit({ type: 'manual_action', npcId, action });
  }

  private async submit(command: Record<string, unknown>): Promise<boolean> {
    const response = await fetch(`${SERVER_API}/islands/${this.islandId}/commands`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        connectionToken: this.connectionToken,
        sequence: ++this.sequence,
        command,
      }),
    });
    const result = await response.json() as { accepted?: boolean; revision?: number; error?: string };
    if (response.status === 409 && !result.accepted) return false;
    if (!response.ok || !result.accepted) throw new Error(result.error ?? `server_http_${response.status}`);
    this.revision = Math.max(this.revision, result.revision ?? this.revision);
    return true;
  }

  async fetchSnapshot(): Promise<RemoteSnapshot> {
    const response = await fetch(`${SERVER_API}/islands/${this.islandId}`, { cache: 'no-store' });
    const snapshot = await readResponse<ServerEnvelope>(response);
    return {
      islandId: snapshot.islandId,
      revision: snapshot.revision,
      island: restoreMaps(snapshot.island) as Island,
    };
  }
}
