// ============================================================
// InputHandler.ts — Mouse & keyboard input, NPC click detection
// ============================================================

import type { Camera }    from '../renderer/Camera';
import type { WorldMap }  from '../renderer/WorldMap';
import type { NPC }       from '../core/types';
import { screenToWorld, zoomAt, clampCamera } from '../renderer/Camera';
import { TILE_SIZE }      from '../renderer/TilemapRenderer';
import { NPCRenderer }    from '../renderer/NPCRenderer';
import { tileToWorld }    from '../renderer/WorldMap';
import {characterHitBounds} from '../renderer/CharacterTextures';

export class InputHandler {
  selectedNpcId: string | null = null;
  private _onSelect: ((id: string | null) => void) | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly cam: Camera,
    public map: WorldMap,
    private readonly getNpcRenderer: () => NPCRenderer | undefined,
    private readonly getNpcs: () => NPC[],
  ) {
    this.bindEvents();
  }

  onSelect(cb: (id: string | null) => void): void {
    this._onSelect = cb;
  }

  private bindEvents(): void {
    const canvas = this.canvas;
    const cam    = this.cam;

    // ── Pan (drag) ───────────────────────────────────────────
    canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      cam.isDragging = true;
      cam.dragStartScreenX = e.clientX;
      cam.dragStartScreenY = e.clientY;
      cam.dragStartCamX = cam.targetX;
      cam.dragStartCamY = cam.targetY;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!cam.isDragging) return;
      const dx = (e.clientX - cam.dragStartScreenX) / cam.zoom;
      const dy = (e.clientY - cam.dragStartScreenY) / cam.zoom;
      cam.targetX = cam.dragStartCamX - dx;
      cam.targetY = cam.dragStartCamY - dy;
      clampCamera(cam, this.map.width * TILE_SIZE, this.map.height * TILE_SIZE);
    });

    canvas.addEventListener('mouseup', (e) => {
      if (!cam.isDragging) return;
      cam.isDragging = false;

      // If barely moved, treat as a click
      const moved = Math.abs(e.clientX - cam.dragStartScreenX) + Math.abs(e.clientY - cam.dragStartScreenY);
      if (moved < 5) {
        this.handleClick(e.clientX, e.clientY);
      }
    });

    canvas.addEventListener('mouseleave', () => { cam.isDragging = false; });

    // ── Zoom (scroll wheel) ──────────────────────────────────
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoomAt(
        cam,
        e.clientX - rect.left,
        e.clientY - rect.top,
        -e.deltaY,
        canvas.width, canvas.height,
      );
      clampCamera(cam, this.map.width * TILE_SIZE, this.map.height * TILE_SIZE);
    }, { passive: false });

    // ── Keyboard shortcuts ───────────────────────────────────
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.selectedNpcId = null;
        this._onSelect?.(null);
      }
    });
  }

  private handleClick(cx: number, cy: number): void {
    const npcRenderer = this.getNpcRenderer();
    if (!npcRenderer) {
      this.selectedNpcId = null;
      this._onSelect?.(null);
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const sx = cx - rect.left;
    const sy = cy - rect.top;

    const { wx, wy } = screenToWorld(sx, sy, this.cam, this.canvas.width, this.canvas.height);

    // Select the visible character body, including its head at high zoom.
    const npcs = this.getNpcs().filter(n => n.isAlive);
    let best: NPC | null = null;
    let bestDist = Infinity;
    const bounds=characterHitBounds(this.cam.zoom);

    for (const npc of npcs) {
      const state = npcRenderer.getStateAt(npc.id);
      if (!state) continue;
      const dx = (state.drawnWx??state.currWx) - wx;
      const dy = (state.drawnWy??state.currWy) - wy;
      if(Math.abs(dx)>bounds.halfWidth||dy>bounds.top||dy< -bounds.bottom)continue;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < bestDist) {
        bestDist = dist2;
        best = npc;
      }
    }

    this.selectedNpcId = best?.id ?? null;
    this._onSelect?.(this.selectedNpcId);
  }

  /** Return the NPC id under (sx, sy) screen coords without selecting it — used for tooltips */
  getHoveredNpcId(
    sx: number, sy: number,
    canvasW: number, canvasH: number,
    cam: Camera,
  ): string | null {
    const npcRenderer = this.getNpcRenderer();
    if (this.cam.isDragging || !npcRenderer) return null;
    const { wx, wy } = screenToWorld(sx, sy, cam, canvasW, canvasH);
    const npcs = this.getNpcs().filter(n => n.isAlive);
    let best: string | null = null;
    let bestDist = Infinity;
    const bounds=characterHitBounds(cam.zoom);
    for (const npc of npcs) {
      const state = npcRenderer.getStateAt(npc.id);
      if (!state) continue;
      const dx = (state.drawnWx??state.currWx) - wx;
      const dy = (state.drawnWy??state.currWy) - wy;
      if(Math.abs(dx)>bounds.halfWidth||dy>bounds.top||dy< -bounds.bottom)continue;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < bestDist) { bestDist = dist2; best = npc.id; }
    }
    return best;
  }
}
