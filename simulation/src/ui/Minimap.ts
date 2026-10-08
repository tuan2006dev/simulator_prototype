// ============================================================
// Minimap.ts — Realtime minimap in bottom-right corner
// ============================================================

import type { Camera }  from '../renderer/Camera';
import type { WorldMap } from '../renderer/WorldMap';
import type { NPC, Island }      from '../core/types';
import { screenToWorld, worldToScreen } from '../renderer/Camera';
import { TILE_SIZE }     from '../renderer/TilemapRenderer';
import type { TilemapRenderer } from '../renderer/TilemapRenderer';

// Terrain color map (same palette as TilemapRenderer)
const MINI_COLOR: Record<string, string> = {
  deep_water:    '#0d2137',
  shallow_water: '#1a4a7a',
  sand:          '#c8a96e',
  grass:         '#4a8c3f',
  forest:        '#2d6b2a',
  mountain:      '#8b7355',
};

const OCC_COLOR: Record<string, string> = {
  farmer:   '#f4d03f',
  gatherer: '#a8d5a2',
  warrior:  '#e74c3c',
  elder:    '#bb8fce',
  craftsman:'#f39c12',
  child:    '#85c1e9',
};

export class Minimap {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly offscreen: HTMLCanvasElement;
  private readonly offCtx: CanvasRenderingContext2D;
  private readonly map: WorldMap;

  // Scale from tile coords to minimap pixels
  private readonly scaleX: number;
  private readonly scaleY: number;
  private textureRevision = -1;

  constructor(map: WorldMap, private readonly renderer?: TilemapRenderer) {
    this.map = map;
    this.canvas = document.getElementById('minimap-canvas') as HTMLCanvasElement;
    this.ctx    = this.canvas.getContext('2d')!;

    // Pre-render terrain to offscreen once
    this.offscreen = document.createElement('canvas');
    this.offscreen.width  = this.canvas.width;
    this.offscreen.height = this.canvas.height;
    this.offCtx = this.offscreen.getContext('2d')!;

    this.scaleX = this.canvas.width  / map.width;
    this.scaleY = this.canvas.height / map.height;

    this.prerenderTerrain();
    this.bindClick();
  }

  private prerenderTerrain(): void {
    const ctx = this.offCtx;
    const { width, height, tiles } = this.map;
    const sx = this.scaleX;
    const sy = this.scaleY;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        ctx.fillStyle = MINI_COLOR[tiles[y][x]] ?? '#000';
        ctx.fillRect(x * sx, y * sy, Math.ceil(sx), Math.ceil(sy));
      }
    }
  }

  /** Click on minimap → teleport camera */
  private bindClick(): void {
    // stored as closure, Camera is passed per draw()
    this.canvas.style.cursor = 'crosshair';
  }

  onMinimapClick(
    e: MouseEvent,
    cam: Camera,
    mainCanvasW: number,
    mainCanvasH: number,
  ): void {
    const rect = this.canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * this.canvas.width / rect.width;
    const py = (e.clientY - rect.top) * this.canvas.height / rect.height;

    // Convert minimap pixel → tile → world coords
    const tileX = px / this.scaleX;
    const tileY = py / this.scaleY;

    const worldX = (tileX - this.map.width  / 2 + 0.5) * TILE_SIZE;
    const worldY = (tileY - this.map.height / 2 + 0.5) * TILE_SIZE;

    cam.targetX = worldX;
    cam.targetY = worldY;
  }

  draw(npcs: NPC[], cam: Camera, mainCanvasW: number, mainCanvasH: number,island?:Island): void {
    const ctx = this.ctx;
    const W   = this.canvas.width;
    const H   = this.canvas.height;
    const sx  = this.scaleX;
    const sy  = this.scaleY;

    // Terrain base
    if (this.renderer && this.textureRevision !== this.renderer.textureRevision) {
      this.offCtx.clearRect(0, 0, W, H);
      this.offCtx.drawImage(this.renderer.texture, 0, 0, W, H);
      this.textureRevision = this.renderer.textureRevision;
    }
    ctx.drawImage(this.offscreen, 0, 0);

    // NPC dots — draw colored 2px dots per living NPC
    for (const npc of npcs) {
      if (!npc.isAlive) continue;
      const state = (npc as any)._minimapPos as { tx: number; ty: number } | undefined;
      if (!state) continue;
      ctx.fillStyle = OCC_COLOR[npc.occupation] ?? '#ffffff';
      const dx = state.tx * sx;
      const dy = state.ty * sy;
      ctx.fillRect(dx - 1, dy - 1, 3, 3);
    }

    if(island?.exploration){const fog=island.exploration;for(let y=0;y<this.map.height;y++)for(let x=0;x<this.map.width;x++){const k=`${x},${y}`;if(fog.visible.has(k))continue;ctx.fillStyle=fog.discovered.has(k)?'rgba(17,34,42,.42)':'#172c38';ctx.fillRect(x*sx,y*sy,Math.ceil(sx),Math.ceil(sy));}}
    // Camera viewport rectangle
    const halfW  = mainCanvasW / 2;
    const halfH  = mainCanvasH / 2;
    const worldMapW = this.map.width  * TILE_SIZE;
    const worldMapH = this.map.height * TILE_SIZE;

    // Convert camera world bounds to tile coords
    const tlWorldX = cam.x - halfW / cam.zoom;
    const tlWorldY = cam.y - halfH / cam.zoom;
    const brWorldX = cam.x + halfW / cam.zoom;
    const brWorldY = cam.y + halfH / cam.zoom;

    const toTileX = (wx: number) => (wx / TILE_SIZE + this.map.width  / 2) * sx;
    const toTileY = (wy: number) => (wy / TILE_SIZE + this.map.height / 2) * sy;

    const rx = toTileX(tlWorldX);
    const ry = toTileY(tlWorldY);
    const rw = toTileX(brWorldX) - rx;
    const rh = toTileY(brWorldY) - ry;

    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(rx, ry, rw, rh);
    ctx.fillStyle   = 'rgba(255,255,255,0.05)';
    ctx.fillRect(rx, ry, rw, rh);
  }
}
