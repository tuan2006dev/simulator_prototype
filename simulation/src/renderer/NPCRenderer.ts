// ============================================================
// NPCRenderer.ts — Draws NPCs as original animated chibi sprites
// ============================================================

import type { NPC }       from '../core/types';
import type { Camera }    from './Camera';
import type { WorldMap }  from './WorldMap';
import { worldToScreen }  from './Camera';
import { tileToWorld, getNeighbors } from './WorldMap';
import { TILE_SIZE }      from './TilemapRenderer';
import { drawGameIcon, drawSymbolIcon } from '../ui/GameIcons';
import {drawCharacter,characterPose,type CharacterEra,type CharacterDirection} from './CharacterTextures';

// Status emojis shown above NPC heads
const STATUS_EMOJI: Record<string, string> = {
  eating:   '🍖',
  sleeping: '💤',
  working:  '⛏️',
  chatting: '💬',
  courting: '💕',
  stealing: '🤏',
  fighting: '⚔️',
  fleeing:  '💨',
  praying:  '🙏',
  idle:     '',
};

export interface NPCRenderState {
  prevWx: number; prevWy: number;
  currWx: number; currWy: number;
  tx: number; ty: number;
  facing?: CharacterDirection;
  drawnWx?: number; drawnWy?: number;
}

export class NPCRenderer {
  private states = new Map<string, NPCRenderState>();

  constructor(private readonly map: WorldMap) {}

  /** Assign random land-tile positions to all NPCs at game start */
  initPositions(npcs: NPC[]): void {
    const land = this.map.landTiles;
    npcs.forEach((npc, i) => {
      const tile = land[i % land.length];
      const { wx, wy } = tileToWorld(tile.x, tile.y, TILE_SIZE, this.map.width, this.map.height);
      this.placeNPC(npc.id, tile.x, tile.y, wx, wy);
    });
  }

  placeNPC(id: string, tx: number, ty: number, wx: number, wy: number): void {
    this.states.set(id, {
      prevWx: wx, prevWy: wy,
      currWx: wx, currWy: wy,
      tx, ty,
    });
    // Write tile position back to NPC for Minimap
    const npc = (globalThis as any).__islandNpcs?.find?.((n: any) => n.id === id);
    if (npc) (npc as any)._minimapPos = { tx, ty };
  }

  /** Apply authoritative server tile positions without running client-side wandering. */
  syncPositions(npcs: NPC[]): void {
    for (const npc of npcs) {
      const position = npc.position;
      if (!position) continue;
      const { tileX, tileY } = position;
      const { wx, wy } = tileToWorld(tileX, tileY, TILE_SIZE, this.map.width, this.map.height);
      const state = this.states.get(npc.id);
      if (state) {
        state.prevWx = state.currWx;
        state.prevWy = state.currWy;
        state.currWx = wx;
        state.currWy = wy;
        state.tx = tileX;
        state.ty = tileY;
      } else {
        this.placeNPC(npc.id, tileX, tileY, wx, wy);
      }
      (npc as any)._minimapPos = { tx: tileX, ty: tileY };
    }
  }

  /** Expose state to logic for pathfinding start pos */
  getState(id: string): NPCRenderState | undefined {
    return this.states.get(id);
  }

  /** Called once per simulation tick — pick a new target tile for each NPC */
  onTick(npcs: NPC[]): void {
    for (const npc of npcs) {
      if (!npc.isAlive) continue;
      const state = this.states.get(npc.id);
      if (!state) continue;

      // Remember where we just were
      state.prevWx = state.currWx;
      state.prevWy = state.currWy;

      // Path following or wandering
      if (npc.path && npc.path.length > 0) {
        const next = npc.path.shift()!;
        const { wx, wy } = tileToWorld(next.x, next.y, TILE_SIZE, this.map.width, this.map.height);
        state.tx = next.x;
        state.ty = next.y;
        state.currWx = wx;
        state.currWy = wy;
        // Update minimap position
        (npc as any)._minimapPos = { tx: next.x, ty: next.y };
      } else {
        // Pick a random neighbour land tile as next target
        const neighbors = getNeighbors(state.tx, state.ty, this.map);
        if (neighbors.length > 0 && npc.status !== 'sleeping') {
          // Add a low chance to wander so they don't jitter too much if they don't have a task
          if (Math.random() < 0.2) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            const { wx, wy } = tileToWorld(next.x, next.y, TILE_SIZE, this.map.width, this.map.height);
            state.tx = next.x;
            state.ty = next.y;
            state.currWx = wx;
            state.currWy = wy;
            // Update minimap position
            (npc as any)._minimapPos = { tx: next.x, ty: next.y };
          }
        }
      }
    }
  }

  /** Draw all living NPCs; lerpT ∈ [0,1] is position within current tick */
  draw(
    ctx: CanvasRenderingContext2D,
    cam: Camera,
    canvasW: number, canvasH: number,
    lerpT: number,
    selectedId: string | null,
    npcs: NPC[],
    era: CharacterEra = 'stone',
    animationMs = 0,
  ): void {
    for (const npc of npcs) {
      if (!npc.isAlive) continue;
      const state = this.states.get(npc.id);
      if (!state) continue;

      // Smooth interpolation between prev and curr positions
      const wx = state.prevWx + (state.currWx - state.prevWx) * lerpT;
      const wy = state.prevWy + (state.currWy - state.prevWy) * lerpT;
      state.drawnWx=wx;state.drawnWy=wy;

      const { sx, sy } = worldToScreen(wx, wy, cam, canvasW, canvasH);

      // Cull off-screen NPCs for performance
      const r = Math.max(10, 15 * cam.zoom);
      if (sx + r < 0 || sx - r > canvasW || sy + r < 0 || sy - r > canvasH) continue;

      const dx=state.currWx-state.prevWx,dy=state.currWy-state.prevWy,moving=Math.abs(dx)+Math.abs(dy)>.01;
      const direction:CharacterDirection=moving?Math.abs(dx)>Math.abs(dy)?dx>0?'east':'west':dy>0?'south':'north':state.facing??'south';
      state.facing=direction;
      this.drawNPC(ctx, npc, sx, sy, cam.zoom, npc.id === selectedId,era,direction,moving,animationMs);
    }
  }

  private drawNPC(
    ctx: CanvasRenderingContext2D,
    npc: NPC,
    sx: number, sy: number,
    zoom: number,
    selected: boolean,
    era: CharacterEra,
    direction: CharacterDirection,
    moving: boolean,
    animationMs: number,
  ): void {
    const r = Math.max(2, 5 * zoom);

    if(npc.guardDuty)drawGameIcon(ctx,'shield',sx-9*zoom,sy-14*zoom,Math.max(10,12*zoom));
    if(npc.divineState==='blessed'){ctx.beginPath();ctx.arc(sx,sy,r+5*zoom,0,Math.PI*2);ctx.strokeStyle='#f0cf70';ctx.lineWidth=2*zoom;ctx.stroke();drawGameIcon(ctx,'spark',sx,sy-14*zoom,Math.max(10,12*zoom));}
    if(npc.divineState==='exhausted')drawGameIcon(ctx,'exhaustion',sx+8*zoom,sy-14*zoom,Math.max(10,12*zoom));
    // ── Selection ring ──────────────────────────────────────
    if (selected) {
      ctx.beginPath();
      ctx.arc(sx, sy, r + 3 * zoom, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,220,50,0.8)';
      ctx.lineWidth   = 2 * zoom;
      ctx.stroke();
    }

    // ── Hunger danger glow ──────────────────────────────────
    if (npc.needs.hunger > 75) {
      const alpha = (npc.needs.hunger - 75) / 25;
      ctx.beginPath();
      ctx.arc(sx, sy, r + 4 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,80,0,${alpha * 0.35})`;
      ctx.fill();
    }

    drawCharacter(ctx,npc,sx,sy,zoom,era,direction,characterPose(npc,moving),Math.floor(animationMs/300));

    // ── Sleeping ZZZ fill ───────────────────────────────────
    if (npc.status === 'sleeping') {
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100,160,255,0.35)';
      ctx.fill();
    }

    // ── Hunger indicator (red arc on outer ring) ─────────────
    if (npc.needs.hunger > 40 && zoom > 0.8) {
      const fraction = npc.needs.hunger / 100;
      ctx.beginPath();
      ctx.arc(sx, sy, r + 2 * zoom, -Math.PI / 2, -Math.PI / 2 + fraction * Math.PI * 2);
      ctx.strokeStyle = `rgba(255,80,0,${0.4 + fraction * 0.6})`;
      ctx.lineWidth   = Math.max(1, zoom * 0.7);
      ctx.stroke();
    }

    // ── Status emoji (only when zoomed in enough) ────────────
    const emoji = STATUS_EMOJI[npc.status] ?? '';
    if (zoom > 1.2 && emoji) {
      ctx.font      = `${Math.round(9 * zoom)}px serif`;
      ctx.textAlign = 'center';
      drawSymbolIcon(ctx, emoji, sx, sy - 21 * zoom, 12 * zoom);
    }

    // ── Name tag (only when zoomed in a lot) ─────────────────
    if (zoom > 2.5) {
      const shortName = npc.name.split('#')[0];
      ctx.font         = `${Math.round(6 * zoom)}px "Courier New", monospace`;
      ctx.fillStyle    = 'rgba(255,255,255,0.85)';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(shortName, sx, sy - (emoji ? 29 : 19) * zoom);
      ctx.textBaseline = 'alphabetic';
    }
  }

  getStateAt(npcId: string): NPCRenderState | undefined {
    return this.states.get(npcId);
  }
}

// Re-export helper used externally
export { tileToWorld };
