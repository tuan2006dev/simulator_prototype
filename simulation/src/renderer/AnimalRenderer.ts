// ============================================================
// AnimalRenderer.ts — Phase 4: Draw animals on the world canvas
// Smooth movement + status indicators + selection
// ============================================================

import type { Animal, AnimalSpecies } from '../core/types';
import { ANIMAL_CONFIG } from '../core/types';
import type { Camera } from './Camera';
import type { WorldMap } from './WorldMap';
import { worldToScreen } from './Camera';
import { tileToWorld } from './WorldMap';
import { TILE_SIZE } from './TilemapRenderer';
import { drawGameIcon, drawSymbolIcon } from '../ui/GameIcons';

export interface AnimalRenderState {
  prevWx: number; prevWy: number;
  currWx: number; currWy: number;
}

export class AnimalRenderer {
  private states = new Map<string, AnimalRenderState>();

  constructor(private readonly map: WorldMap) {}

  /** Called once per simulation tick — update positions */
  onTick(animals: Animal[]): void {
    for (const animal of animals) {
      if (!animal.isAlive) { this.states.delete(animal.id); continue; }

      const { wx, wy } = tileToWorld(animal.tileX, animal.tileY, TILE_SIZE, this.map.width, this.map.height);

      const state = this.states.get(animal.id);
      if (state) {
        state.prevWx = state.currWx;
        state.prevWy = state.currWy;
        state.currWx = wx;
        state.currWy = wy;
      } else {
        this.states.set(animal.id, {
          prevWx: wx, prevWy: wy,
          currWx: wx, currWy: wy,
        });
      }
    }
  }

  /** Get interpolated screen position for hover/click detection */
  getWorldPos(animalId: string, lerpT: number): { wx: number; wy: number } | null {
    const state = this.states.get(animalId);
    if (!state) return null;
    return {
      wx: state.prevWx + (state.currWx - state.prevWx) * lerpT,
      wy: state.prevWy + (state.currWy - state.prevWy) * lerpT,
    };
  }

  /** Draw all living animals */
  draw(
    ctx: CanvasRenderingContext2D,
    animals: Animal[],
    cam: Camera,
    canvasW: number,
    canvasH: number,
    lerpT: number,
    selectedAnimalId: string | null,
  ): void {
    for (const animal of animals) {
      if (!animal.isAlive) continue;
      const state = this.states.get(animal.id);
      if (!state) continue;

      const wx = state.prevWx + (state.currWx - state.prevWx) * lerpT;
      const wy = state.prevWy + (state.currWy - state.prevWy) * lerpT;
      const { sx, sy } = worldToScreen(wx, wy, cam, canvasW, canvasH);

      // Cull off-screen
      const cullR = Math.max(4, 8 * cam.zoom);
      if (sx + cullR < 0 || sx - cullR > canvasW || sy + cullR < 0 || sy - cullR > canvasH) continue;

      this.drawAnimal(ctx, animal, sx, sy, cam.zoom, animal.id === selectedAnimalId);
    }
  }

  private drawAnimal(
    ctx: CanvasRenderingContext2D,
    animal: Animal,
    sx: number, sy: number,
    zoom: number,
    selected: boolean,
  ): void {
    const cfg = ANIMAL_CONFIG[animal.species];
    const r = Math.max(2.5, 4.5 * zoom);

    // Selection ring
    if (selected) {
      ctx.beginPath();
      ctx.arc(sx, sy, r + 3 * zoom, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,230,80,0.9)';
      ctx.lineWidth = 2 * zoom;
      ctx.stroke();
    }

    // Wild animals have a slightly transparent appearance
    ctx.globalAlpha = animal.status === 'wild' ? 0.65 : 1.0;

    // Species-specific shape
    if (animal.species === 'chicken') {
      // Chicken: small diamond shape
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.rect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
      ctx.fillStyle = cfg.color;
      ctx.fill();
      ctx.strokeStyle = '#b8960a';
      ctx.lineWidth = Math.max(0.8, zoom * 0.6);
      ctx.stroke();
      ctx.restore();
    } else {
      // Cattle & Dog: rounded square
      const rr = r * (animal.species === 'cattle' ? 1.3 : 1.0);
      const corner = rr * 0.4;
      ctx.beginPath();
      ctx.roundRect(sx - rr, sy - rr * 0.8, rr * 2, rr * 1.6, corner);
      ctx.fillStyle = cfg.color;
      ctx.fill();
      ctx.strokeStyle = animal.species === 'cattle' ? '#8b6914' : '#6b4226';
      ctx.lineWidth = Math.max(0.8, zoom * 0.6);
      ctx.stroke();
    }

    // Trust bar for wild/taming animals
    if ((animal.status === 'wild' || animal.status === 'taming') && zoom > 1.0) {
      const cfg2 = ANIMAL_CONFIG[animal.species];
      const barW = r * 2.4;
      const pct = animal.trust / cfg2.trustNeeded;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(sx - barW / 2, sy + r + 1 * zoom, barW, 3 * zoom);
      ctx.fillStyle = animal.status === 'taming' ? '#00c896' : 'rgba(255,255,255,0.4)';
      ctx.fillRect(sx - barW / 2, sy + r + 1 * zoom, barW * Math.min(1, pct), 3 * zoom);
    }

    // Domesticated: small heart indicator
    if (animal.status === 'domesticated' || animal.status === 'guarding' || animal.status === 'breeding') {
      if (zoom > 1.5) {
        ctx.font = `${Math.round(7 * zoom)}px serif`;
        ctx.textAlign = 'center';
        drawGameIcon(ctx,animal.status === 'guarding' ? 'shield' : 'heart',sx,sy-r-4*zoom,9*zoom);
      }
    }

    // Species emoji (only when zoomed in enough)
    if (zoom > 2.0) {
      ctx.font = `${Math.round(8 * zoom)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawSymbolIcon(ctx,cfg.icon,sx,sy,13*zoom);
    }

    ctx.globalAlpha = 1.0;
    ctx.textBaseline = 'alphabetic';
  }

  /** Detect if a screen coordinate hits an animal */
  getAnimalAt(
    sx: number, sy: number,
    animals: Animal[],
    cam: Camera,
    canvasW: number, canvasH: number,
    lerpT: number,
  ): Animal | null {
    let best: Animal | null = null;
    let bestDist = (12 / cam.zoom) ** 2;

    for (const animal of animals) {
      if (!animal.isAlive) continue;
      const state = this.states.get(animal.id);
      if (!state) continue;
      const wx = state.prevWx + (state.currWx - state.prevWx) * lerpT;
      const wy = state.prevWy + (state.currWy - state.prevWy) * lerpT;
      const { sx: asx, sy: asy } = worldToScreen(wx, wy, cam, canvasW, canvasH);
      const dx = asx - sx, dy = asy - sy;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDist) { bestDist = d2; best = animal; }
    }
    return best;
  }
}
