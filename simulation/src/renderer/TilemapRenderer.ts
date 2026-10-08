// ============================================================
// TilemapRenderer.ts — Pre-renders island to offscreen canvas
// ============================================================

import type { Camera }    from './Camera';
import type { WorldMap, TileType } from './WorldMap';
import { worldToScreen }  from './Camera';

export const TILE_SIZE = 16; // pixels per tile in world space

type TileCanvas = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

function tileRandom(x: number, y: number, salt = 0): () => number {
  let state = (Math.imul(x + 1, 0x45d9f3b) ^ Math.imul(y + 7, 0x27d4eb2d) ^ salt) >>> 0;
  return () => {
    state = (Math.imul(state ^ (state >>> 15), 1 | state) + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function isWater(tile?: TileType): boolean {
  return tile === 'deep_water' || tile === 'shallow_water';
}

function drawTile(
  ctx: TileCanvas,
  tile: TileType,
  px: number,
  py: number,
  ts: number,
  x: number,
  y: number,
  tiles: TileType[][],
): void {
  const rand = tileRandom(x, y, tile.length * 971);
  const edge = Math.max(1.1, ts * 0.085);
  const seaN = isWater(tiles[y - 1]?.[x]);
  const seaE = isWater(tiles[y]?.[x + 1]);
  const seaS = isWater(tiles[y + 1]?.[x]);
  const seaW = isWater(tiles[y]?.[x - 1]);
  const seaNearby = seaN || seaE || seaS || seaW;

  // Continuous biome colors avoid a checkerboard; local shapes provide the texture.
  const palettes: Record<TileType, string> = {
    deep_water: '#126084', shallow_water: '#62c8d1',
    sand: '#f0d39a', grass: '#79bd59',
    forest: '#4e9650', mountain: '#a99a7d',
  };
  ctx.fillStyle = palettes[tile];
  ctx.fillRect(px, py, ts + 0.5, ts + 0.5);

  if (tile === 'deep_water' || tile === 'shallow_water') {
    // Layered wavelets make the sea read as one continuous painted surface.
    for (let i = 0; i < (tile === 'deep_water' ? 3 : 4); i++) {
      const wx = px + 1 + rand() * (ts - 5);
      const wy = py + 2 + rand() * (ts - 4);
      ctx.beginPath();
      ctx.ellipse(wx, wy, ts * (.16 + rand() * .16), Math.max(.4, ts * .035), -.12, 0, Math.PI * 2);
      ctx.fillStyle = tile === 'deep_water' ? 'rgba(170,239,236,.18)' : 'rgba(246,255,222,.38)';
      ctx.fill();
    }
    if (tile === 'shallow_water') {
      ctx.beginPath();
      ctx.ellipse(px + ts * .5, py + ts * .5, ts * .38, ts * .31, .2, Math.PI * .08, Math.PI * .8);
      ctx.strokeStyle = 'rgba(225,249,224,.24)';
      ctx.lineWidth = Math.max(.55, ts * .04);
      ctx.stroke();
    }
    if (tile === 'deep_water' && rand() > .58) {
      ctx.strokeStyle = 'rgba(101,207,218,.18)';
      ctx.lineWidth = Math.max(.4, ts * .03);
      ctx.beginPath();
      ctx.moveTo(px + ts * .08, py + ts * (.78 + rand() * .1));
      ctx.quadraticCurveTo(px + ts * .5, py + ts * (.65 + rand() * .18), px + ts * .9, py + ts * (.76 + rand() * .1));
      ctx.stroke();
    }
    return;
  }

  if (tile === 'sand') {
    // Fine warm grains and occasional shell-like flecks.
    for (let i = 0; i < 4; i++) {
      const sx = px + 2 + rand() * (ts - 4), sy = py + 2 + rand() * (ts - 4);
      ctx.beginPath(); ctx.ellipse(sx, sy, .45 + rand() * .75, .35 + rand() * .45, rand(), 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? 'rgba(255,248,208,.68)' : 'rgba(143,111,57,.25)'; ctx.fill();
    }
    if (seaNearby) {
      ctx.strokeStyle = 'rgba(255,250,220,.52)'; ctx.lineWidth = edge;
      ctx.beginPath();
      if (seaN) { ctx.moveTo(px, py + edge); ctx.quadraticCurveTo(px + ts * .5, py - edge * .35, px + ts, py + edge); }
      if (seaS) { ctx.moveTo(px, py + ts - edge); ctx.quadraticCurveTo(px + ts * .5, py + ts + edge * .35, px + ts, py + ts - edge); }
      if (seaW) { ctx.moveTo(px + edge, py); ctx.quadraticCurveTo(px - edge * .35, py + ts * .5, px + edge, py + ts); }
      if (seaE) { ctx.moveTo(px + ts - edge, py); ctx.quadraticCurveTo(px + ts + edge * .35, py + ts * .5, px + ts - edge, py + ts); }
      ctx.stroke();
    }
    return;
  }

  if (tile === 'grass') {
    if (rand() > .62) {
      ctx.fillStyle = rand() > .5 ? 'rgba(151,203,77,.22)' : 'rgba(38,126,59,.16)';
      ctx.beginPath();
      ctx.ellipse(px + ts * (.2 + rand() * .6), py + ts * (.25 + rand() * .55), ts * (.26 + rand() * .2), ts * (.13 + rand() * .1), rand(), 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 5; i++) {
      const gx = px + 2 + rand() * (ts - 4), gy = py + 2 + rand() * (ts - 4);
      ctx.beginPath(); ctx.ellipse(gx, gy, .55 + rand() * .85, .35 + rand() * .55, rand(), 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? 'rgba(215,232,124,.55)' : 'rgba(37,112,54,.28)'; ctx.fill();
    }
    if (rand() > .88) {
      ctx.beginPath(); ctx.arc(px + 4 + rand() * (ts - 8), py + 4 + rand() * (ts - 8), Math.max(.65, ts * .045), 0, Math.PI * 2);
      ctx.fillStyle = '#fff0be'; ctx.fill();
    }
    return;
  }

  if (tile === 'forest') {
    // Leave undergrowth between tree crowns so this reads as a forest, not a tile grid.
    if (rand() < .34) {
      ctx.beginPath(); ctx.ellipse(px + ts * (.3 + rand() * .4), py + ts * (.35 + rand() * .35), ts * .18, ts * .11, rand(), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(164,198,95,.32)'; ctx.fill();
      return;
    }
    // Layered rounded crowns with a short warm trunk: readable at normal zoom.
    const cx = px + ts * (.48 + (rand() - .5) * .18), cy = py + ts * (.5 + (rand() - .5) * .14);
    ctx.fillStyle = 'rgba(37,67,43,.28)';
    ctx.beginPath(); ctx.ellipse(cx + ts * .06, py + ts * .77, ts * .28, ts * .1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#89633d'; ctx.fillRect(cx - ts * .045, cy + ts * .04, ts * .09, ts * .27);
    const crown = [
      { dx: -.16, dy: .02, r: .22, c: '#397742' }, { dx: .08, dy: -.10, r: .25, c: '#62a34b' },
      { dx: .24, dy: .06, r: .18, c: '#4d8b43' }, { dx: -.02, dy: .10, r: .25, c: '#77b954' },
    ];
    for (const b of crown) { ctx.beginPath(); ctx.arc(cx + ts * b.dx, cy + ts * b.dy, ts * b.r, 0, Math.PI * 2); ctx.fillStyle = b.c; ctx.fill(); }
    ctx.beginPath(); ctx.arc(cx - ts * .08, cy - ts * .08, ts * .075, 0, Math.PI * 2); ctx.fillStyle = 'rgba(205,237,129,.48)'; ctx.fill();
    return;
  }

  if (tile === 'mountain') {
    // Most mountain cells read as rock; selected cells carry a snow-capped peak.
    if (rand() < .62) {
      ctx.beginPath(); ctx.ellipse(px + ts * (.3 + rand() * .4), py + ts * (.65 + rand() * .12), ts * (.2 + rand() * .15), ts * .09, rand(), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(92,77,57,.28)'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(px + ts * (.35 + rand() * .3), py + ts * .56, ts * .11, ts * .045, -.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240,226,195,.36)'; ctx.fill();
      return;
    }
    // Faceted rock shoulders and a pale summit highlight.
    const peakX = px + ts * (.4 + rand() * .2), peakY = py + ts * (.15 + rand() * .11);
    ctx.beginPath(); ctx.moveTo(px + ts * .09, py + ts * .88); ctx.lineTo(peakX, peakY); ctx.lineTo(px + ts * .91, py + ts * .88); ctx.closePath();
    const rock = ctx.createLinearGradient(px, py, px + ts, py + ts);
    rock.addColorStop(0, '#e0cfaa'); rock.addColorStop(.48, '#ae9874'); rock.addColorStop(1, '#77654f');
    ctx.fillStyle = rock; ctx.fill();
    ctx.strokeStyle = 'rgba(80,66,53,.26)';
    ctx.lineWidth = Math.max(.5, ts * .035);
    ctx.beginPath();
    ctx.moveTo(px + ts * .28, py + ts * .82);
    ctx.lineTo(px + ts * .43, py + ts * .48);
    ctx.lineTo(px + ts * .54, py + ts * .68);
    ctx.lineTo(px + ts * .7, py + ts * .36);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(peakX, peakY); ctx.lineTo(px + ts * .62, py + ts * .53); ctx.lineTo(px + ts * .49, py + ts * .52); ctx.lineTo(px + ts * .38, py + ts * .68); ctx.closePath();
    ctx.fillStyle = 'rgba(255,247,216,.45)'; ctx.fill();
    if (rand() > .55) {
      ctx.beginPath(); ctx.moveTo(peakX - ts * .13, peakY + ts * .15); ctx.lineTo(peakX, peakY); ctx.lineTo(peakX + ts * .13, peakY + ts * .15); ctx.lineTo(peakX + ts * .04, peakY + ts * .12); ctx.lineTo(peakX, peakY + ts * .21); ctx.closePath();
      ctx.fillStyle = '#f5f0df'; ctx.fill();
    }
  }
}

// ── TilemapRenderer ────────────────────────────────────────────────────────────

export class TilemapRenderer {
  private readonly offscreen: HTMLCanvasElement;
  private readonly offCtx: CanvasRenderingContext2D;
  private readonly artwork = new Map<string, HTMLImageElement>();
  private dirty = false;
  private revision = 0;

  get texture(): HTMLCanvasElement { return this.offscreen; }
  get textureRevision(): number { return this.revision; }

  constructor(private readonly map: WorldMap) {
    const w = map.width  * TILE_SIZE;
    const h = map.height * TILE_SIZE;
    this.offscreen = document.createElement('canvas');
    this.offscreen.width  = w;
    this.offscreen.height = h;
    this.offCtx = this.offscreen.getContext('2d')!;
    this.prerender();
    for (const name of ['tree', 'tree-small', 'peak', 'rock', 'grass', 'water']) {
      const image = new Image();
      image.onload = () => { this.artwork.set(name, image); this.dirty = true; };
      image.src = `assets/reference/${name}.png`;
    }
  }

  private prerender(): void {
    const ctx = this.offCtx;
    const { width, height, tiles } = this.map;
    ctx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        drawTile(ctx, tiles[y][x], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, x, y, tiles);
      }
    }
    // A low-resolution color field interpolates biome edges, while the original
    // tile map remains authoritative for painting, navigation, and harvesting.
    const colors: Record<TileType, string> = {
      deep_water: '#269abc', shallow_water: '#76d7d3', sand: '#eedbb0',
      grass: '#a3c86c', forest: '#7fa955', mountain: '#a6aa83',
    };
    const field = document.createElement('canvas');
    field.width = width; field.height = height;
    const f = field.getContext('2d')!;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      f.fillStyle = colors[tiles[y][x]]; f.fillRect(x, y, 1, 1);
    }
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = 1;
    ctx.drawImage(field, 0, 0, this.offscreen.width, this.offscreen.height);
    ctx.restore();

    const stamp = (name: string, x: number, y: number, w: number, h: number) => {
      const image = this.artwork.get(name);
      if (image) ctx.drawImage(image, x, y, w, h);
    };
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const tile = tiles[y][x], px = x * TILE_SIZE, py = y * TILE_SIZE;
      const rand = tileRandom(x, y, 724);
      if (tile === 'deep_water' || tile === 'shallow_water') {
        ctx.strokeStyle = tile === 'deep_water' ? 'rgba(196,246,246,.22)' : 'rgba(250,255,233,.45)';
        ctx.lineWidth = .6;
        ctx.beginPath();
        const wy = py + rand() * TILE_SIZE;
        ctx.moveTo(px, wy); ctx.quadraticCurveTo(px + 7, wy - 2, px + 13, wy - 1); ctx.stroke();
      } else if (tile === 'grass' || tile === 'forest') {
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = i % 2 ? 'rgba(240,233,146,.24)' : 'rgba(61,117,50,.12)';
          ctx.beginPath();
          ctx.ellipse(px + rand()*16, py + rand()*16, 1 + rand()*2, .5 + rand(), rand(), 0, Math.PI*2);
          ctx.fill();
        }
      }
      if (tile === 'sand') {
        ctx.strokeStyle = '#f6ffeb'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
          if (!isWater(tiles[y+dy]?.[x+dx])) continue;
          const cx = px + 8 + dx*7, cy = py + 8 + dy*7;
          ctx.moveTo(cx - dy*8, cy - dx*8);
          ctx.quadraticCurveTo(cx + dx*3, cy + dy*3, cx + dy*8, cy + dx*8);
        }
        ctx.stroke();
      }
    }
    // Draw the extracted artwork in row order so the foreground overlaps the
    // background naturally. Sparse placement avoids repeating a sprite per tile.
    for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
      const tile = tiles[y][x], rand = tileRandom(x, y, 1809);
      const px = (x + .5) * TILE_SIZE, py = (y + .8) * TILE_SIZE;
      const chance = rand();
      if ((tile === 'forest' && chance < .32) || (tile === 'grass' && chance < .045)) {
        const size = 25 + rand() * 17;
        ctx.fillStyle = 'rgba(36,83,54,.2)'; ctx.beginPath();
        ctx.ellipse(px + 4, py - 2, size*.38, size*.12, -.3, 0, Math.PI*2); ctx.fill();
        stamp(rand() > .5 ? 'tree' : 'tree-small', px-size/2, py-size, size, size*1.12);
      } else if (tile === 'mountain' && chance < .16) {
        const size = 40 + rand()*35;
        stamp('peak', px-size/2, py-size, size, size*1.05);
      } else if (tile === 'sand' && chance < .12) {
        const size = 9 + rand()*10;
        stamp('rock', px-size/2, py-size*.7, size, size);
      }
    }
    this.dirty = false;
    this.revision++;
  }

  draw(ctx: CanvasRenderingContext2D, cam: Camera, canvasW: number, canvasH: number): void {
    if (this.dirty) this.prerender();
    // Top-left world corner of the map
    const topLeftWx = -(this.map.width  * TILE_SIZE) / 2;
    const topLeftWy = -(this.map.height * TILE_SIZE) / 2;
    const { sx, sy } = worldToScreen(topLeftWx, topLeftWy, cam, canvasW, canvasH);

    const dw = this.map.width  * TILE_SIZE * cam.zoom;
    const dh = this.map.height * TILE_SIZE * cam.zoom;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(this.offscreen, sx, sy, dw, dh);
    // Fade only the outer ocean margin into the infinite sea behind the map.
    const fade = Math.min(dw, dh) * .065;
    for (const [x, y, w, h, horizontal, reverse] of [
      [sx, sy, fade, dh, true, false], [sx+dw-fade, sy, fade, dh, true, true],
      [sx, sy, dw, fade, false, false], [sx, sy+dh-fade, dw, fade, false, true],
    ] as const) {
      const gradient = ctx.createLinearGradient(x, y, horizontal ? x+w : x, horizontal ? y : y+h);
      gradient.addColorStop(reverse ? 1 : 0, '#269abc');
      gradient.addColorStop(reverse ? 0 : 1, 'rgba(38,154,188,0)');
      ctx.fillStyle = gradient; ctx.fillRect(x, y, w, h);
    }
  }

  updateTile(x: number, y: number, tile: TileType): void {
    if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height) return;
    this.map.tiles[y][x] = tile;
    this.dirty = true;
    drawTile(this.offCtx, tile, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, x, y, this.map.tiles);
    // Neighboring shore tiles need a redraw when water/land boundaries change.
    for (let ny = Math.max(0, y - 1); ny <= Math.min(this.map.height - 1, y + 1); ny++) {
      for (let nx = Math.max(0, x - 1); nx <= Math.min(this.map.width - 1, x + 1); nx++) {
        if (nx !== x || ny !== y) drawTile(this.offCtx, this.map.tiles[ny][nx], nx * TILE_SIZE, ny * TILE_SIZE, TILE_SIZE, nx, ny, this.map.tiles);
      }
    }
    
    // update land tiles
    this.map.landTiles = [];
    for (let j = 0; j < this.map.height; j++) {
      for (let i = 0; i < this.map.width; i++) {
        if (this.map.tiles[j][i] !== 'deep_water' && this.map.tiles[j][i] !== 'shallow_water') {
          this.map.landTiles.push({ x: i, y: j });
        }
      }
    }
  }
}
