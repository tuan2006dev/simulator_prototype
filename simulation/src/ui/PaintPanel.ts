// ============================================================
// PaintPanel.ts — Enhanced Map Painting UI
// Brush size, Resource brush, Undo/Redo, Tile info, Map stats
// ============================================================

import type { TileType } from '../renderer/WorldMap';
import type { ResourceType } from '../core/types';

export type PaintMode = 'terrain' | 'resource' | 'erase';
export type BrushSize = 1 | 3 | 5 | 7;

export interface PaintSnapshot {
  tileX: number;
  tileY: number;
  oldTile: TileType;
  newTile: TileType;
}

export interface ResourceSnapshot {
  tileX: number;
  tileY: number;
  action: 'add' | 'remove';
  resourceType?: ResourceType;
}

export class PaintPanel {
  private el: HTMLElement;
  private statsEl: HTMLElement;
  private coordEl: HTMLElement;

  public selectedBrush: TileType = 'grass';
  public selectedResource: ResourceType = 'wood_tree';
  public brushSize: BrushSize = 3;
  public mode: PaintMode = 'terrain';
  public active: boolean = false;
  public showGrid: boolean = true;
  public showDistanceRuler: boolean = false;
  public rulerStart: { tx: number; ty: number } | null = null;

  // Undo/Redo stacks — arrays of batch snapshots
  private undoStack: PaintSnapshot[][] = [];
  private redoStack: PaintSnapshot[][] = [];
  private currentBatch: PaintSnapshot[] = [];

  private onDoneCallback: (() => void) | null = null;
  private onUndoCallback: ((batch: PaintSnapshot[]) => void) | null = null;
  private onRedoCallback: ((batch: PaintSnapshot[]) => void) | null = null;

  constructor() {
    // Stats bar (top-right)
    this.statsEl = document.createElement('div');
    this.statsEl.id = 'paint-stats';
    Object.assign(this.statsEl.style, {
      display: 'none',
      position: 'fixed',
      top: '60px',
      right: '16px',
      background: 'rgba(10,18,30,0.92)',
      border: '1px solid rgba(0,200,150,0.3)',
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '11px',
      color: 'var(--t-hi, #e0e0e0)',
      zIndex: '500',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      lineHeight: '1.8',
      minWidth: '180px',
    });
    document.body.appendChild(this.statsEl);

    // Coordinate display (bottom-left of canvas area)
    this.coordEl = document.createElement('div');
    this.coordEl.id = 'paint-coord';
    Object.assign(this.coordEl.style, {
      display: 'none',
      position: 'fixed',
      bottom: '110px',
      left: '16px',
      background: 'rgba(10,18,30,0.88)',
      border: '1px solid rgba(0,200,150,0.25)',
      borderRadius: '8px',
      padding: '6px 12px',
      fontSize: '11px',
      color: 'var(--t-hi, #e0e0e0)',
      zIndex: '500',
      fontFamily: 'monospace',
      backdropFilter: 'blur(12px)',
    });
    document.body.appendChild(this.coordEl);

    // Main panel
    this.el = document.createElement('div');
    this.el.id = 'paint-panel';
    Object.assign(this.el.style, {
      display: 'none',
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(10,18,30,0.95)',
      border: '1px solid rgba(0,200,150,0.35)',
      borderRadius: '14px',
      padding: '12px 14px',
      gap: '10px',
      zIndex: '500',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.85)',
      flexDirection: 'column',
      minWidth: '520px',
      userSelect: 'none',
    });
    document.body.appendChild(this.el);
    this.render();
    this.bindEvents();
    this.bindKeyboard();
  }

  // ── Public API ────────────────────────────────────────────────────────────────

  onDone(cb: () => void): void { this.onDoneCallback = cb; }
  onUndo(cb: (batch: PaintSnapshot[]) => void): void { this.onUndoCallback = cb; }
  onRedo(cb: (batch: PaintSnapshot[]) => void): void { this.onRedoCallback = cb; }

  /** Called from main.ts before applying a paint stroke — records old tile for undo */
  beginBatch(): void {
    this.currentBatch = [];
  }
  recordTile(tx: number, ty: number, oldTile: TileType, newTile: TileType): void {
    if (oldTile === newTile) return;
    this.currentBatch.push({ tileX: tx, tileY: ty, oldTile, newTile });
  }
  commitBatch(): void {
    if (this.currentBatch.length === 0) return;
    this.undoStack.push([...this.currentBatch]);
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
    this.currentBatch = [];
    this.updateUndoButtons();
  }

  undo(): void {
    const batch = this.undoStack.pop();
    if (!batch) return;
    this.redoStack.push(batch);
    this.onUndoCallback?.(batch);
    this.updateUndoButtons();
  }

  redo(): void {
    const batch = this.redoStack.pop();
    if (!batch) return;
    this.undoStack.push(batch);
    this.onRedoCallback?.(batch);
    this.updateUndoButtons();
  }

  /** Update coordinate + distance display */
  updateCursor(tx: number, ty: number, tile: TileType): void {
    if (!this.active) return;
    let distText = '';
    if (this.rulerStart) {
      const dx = tx - this.rulerStart.tx;
      const dy = ty - this.rulerStart.ty;
      const dist = Math.round(Math.sqrt(dx * dx + dy * dy));
      const manhattan = Math.abs(dx) + Math.abs(dy);
      distText = ` · 📏 ${dist}t (chéo) / ${manhattan}t (đường)`;
    }
    const tileNames: Record<TileType, string> = {
      grass: '🟩 Đất cỏ', sand: '🟨 Cát', forest: '🌲 Rừng',
      mountain: '⛰️ Núi', shallow_water: '🔷 Nước nông', deep_water: '🌊 Nước sâu',
    };
    this.coordEl.textContent = `📍 (${tx}, ${ty}) ${tileNames[tile] ?? tile}${distText}`;
  }

  /** Update map stats panel */
  updateStats(tileCounts: Record<TileType, number>, totalTiles: number): void {
    if (!this.active) return;
    const land = (tileCounts.grass ?? 0) + (tileCounts.sand ?? 0) +
                 (tileCounts.forest ?? 0) + (tileCounts.mountain ?? 0);
    const landPct = totalTiles > 0 ? Math.round(land / totalTiles * 100) : 0;
    const forestPct = land > 0 ? Math.round((tileCounts.forest ?? 0) / land * 100) : 0;

    // Balance indicators
    const landOk  = land >= 800 && land <= 1800;
    const forestOk = forestPct >= 20 && forestPct <= 45;

    this.statsEl.innerHTML = `
      <div style="font-weight:bold;color:#00c896;margin-bottom:6px;font-size:12px;">📊 Thống số Map</div>
      <div style="color:${landOk ? '#7fff9a' : '#ff7070'}">
        🗺 Đất liền: <b>${land}</b> tile (${landPct}%) ${landOk ? '✓' : '⚠ (cần 800-1800)'}
      </div>
      <div style="color:${forestOk ? '#7fff9a' : '#ffa040'}">
        🌲 Rừng/Đất: <b>${forestPct}%</b> ${forestOk ? '✓' : '⚠ (nên 20-45%)'}
      </div>
      <div>🟩 Cỏ: <b>${tileCounts.grass ?? 0}</b></div>
      <div>🟨 Cát: <b>${tileCounts.sand ?? 0}</b></div>
      <div>🌲 Rừng: <b>${tileCounts.forest ?? 0}</b></div>
      <div>⛰️ Núi: <b>${tileCounts.mountain ?? 0}</b></div>
      <div style="margin-top:4px;color:var(--t-lo,#888);font-size:10px;">
        Undo: ${this.undoStack.length}/30 · Redo: ${this.redoStack.length}
      </div>
    `;
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  private render(): void {
    const terrainBrushes: { type: TileType; icon: string; name: string }[] = [
      { type: 'grass',         icon: '🟩', name: 'Cỏ' },
      { type: 'sand',          icon: '🟨', name: 'Cát' },
      { type: 'forest',        icon: '🌲', name: 'Rừng' },
      { type: 'mountain',      icon: '⛰️',  name: 'Núi' },
      { type: 'shallow_water', icon: '🔷', name: 'Nước nông' },
      { type: 'deep_water',    icon: '🌊', name: 'Xóa (Biển)' },
    ];
    const resourceBrushes: { type: ResourceType; icon: string; name: string }[] = [
      { type: 'wood_tree',    icon: '🌲', name: 'Cây gỗ' },
      { type: 'stone_deposit',icon: '🪨', name: 'Mỏ đá' },
      { type: 'herb_patch',   icon: '🌿', name: 'Thảo dược' },
      { type: 'fish_spot',    icon: '🐟', name: 'Cá' },
      { type: 'copper_vein',  icon: '🔶', name: 'Đồng' },
      { type: 'clay_deposit', icon: '🟤', name: 'Đất sét' },
      { type:'iron_vein',icon:'⛏️',name:'Quặng sắt' },{type:'coal_deposit',icon:'⚫',name:'Than đá'},
      { type: 'fertile_soil', icon: '🌾', name: 'Đất màu' },
    ];
    const brushSizes: BrushSize[] = [1, 3, 5, 7];

    const btnBase = 'display:inline-flex;flex-direction:column;align-items:center;padding:5px 8px;background:rgba(255,255,255,0.05);border:1px solid transparent;border-radius:8px;cursor:pointer;min-width:52px;transition:all 0.15s;';
    const activeBtnExtra = 'border-color:#00c896;background:rgba(0,200,150,0.12);box-shadow:0 0 8px rgba(0,200,150,0.25);';
    const sizeBase = 'display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:rgba(255,255,255,0.05);border:1px solid transparent;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;color:var(--t-hi,#e0e0e0);transition:all 0.15s;';
    const activeSizeExtra = 'border-color:#00c896;background:rgba(0,200,150,0.15);';

    this.el.innerHTML = `
      <!-- Row 1: Mode tabs -->
      <div style="display:flex;gap:6px;align-items:center;">
        <span style="font-size:11px;font-weight:bold;color:#00c896;margin-right:6px;white-space:nowrap;">🖊️ VẼ MAP</span>
        <button id="pb-mode-terrain" style="${btnBase}${this.mode === 'terrain' ? activeBtnExtra : ''}color:var(--t-hi,#e0e0e0);font-size:12px;">
          🏔️ <span style="font-size:9px;margin-top:2px;">Địa hình</span>
        </button>
        <button id="pb-mode-resource" style="${btnBase}${this.mode === 'resource' ? activeBtnExtra : ''}color:var(--t-hi,#e0e0e0);font-size:12px;">
          🌿 <span style="font-size:9px;margin-top:2px;">Tài nguyên</span>
        </button>
        <button id="pb-mode-erase" style="${btnBase}${this.mode === 'erase' ? activeBtnExtra : ''}color:var(--t-hi,#e0e0e0);font-size:12px;">
          🗑️ <span style="font-size:9px;margin-top:2px;">Xóa</span>
        </button>
        <div style="width:1px;height:28px;background:rgba(255,255,255,0.12);margin:0 6px;"></div>
        <!-- Brush sizes -->
        <span style="font-size:10px;color:var(--t-lo,#888);">Bút:</span>
        ${brushSizes.map(s => `
          <button class="pb-size" data-size="${s}" style="${sizeBase}${this.brushSize === s ? activeSizeExtra : ''}">${s}×${s}</button>
        `).join('')}
        <div style="width:1px;height:28px;background:rgba(255,255,255,0.12);margin:0 6px;"></div>
        <!-- Grid + Ruler toggles -->
        <button id="pb-grid" style="${sizeBase}${this.showGrid ? activeSizeExtra : ''}font-size:14px;" title="Hiện lưới (G)">⊞</button>
        <button id="pb-ruler" style="${sizeBase}${this.showDistanceRuler ? activeSizeExtra : ''}font-size:14px;" title="Thước khoảng cách (R) — Click đặt điểm đầu">📏</button>
        <div style="width:1px;height:28px;background:rgba(255,255,255,0.12);margin:0 6px;"></div>
        <!-- Undo/Redo -->
        <button id="pb-undo" style="${sizeBase}font-size:14px;opacity:${this.undoStack.length ? 1 : 0.35};" title="Undo (Ctrl+Z)">↩</button>
        <button id="pb-redo" style="${sizeBase}font-size:14px;opacity:${this.redoStack.length ? 1 : 0.35};" title="Redo (Ctrl+Y)">↪</button>
        <div style="width:1px;height:28px;background:rgba(255,255,255,0.12);margin:0 6px;"></div>
        <button id="btn-paint-done" style="padding:8px 16px;background:linear-gradient(135deg,#00c896,#00a87c);color:#000;border:none;border-radius:8px;font-weight:bold;cursor:pointer;font-size:12px;white-space:nowrap;">
          ✅ Bắt đầu chơi
        </button>
      </div>

      <!-- Row 2: Brush palette -->
      <div id="pb-palette" style="display:flex;gap:5px;flex-wrap:wrap;padding-top:4px;border-top:1px solid rgba(255,255,255,0.08);">
        ${this.mode === 'terrain' ? terrainBrushes.map(b => `
          <button class="pb-brush" data-type="${b.type}" style="${btnBase}${this.selectedBrush === b.type && this.mode === 'terrain' ? activeBtnExtra : ''}color:var(--t-hi,#e0e0e0);">
            <span style="font-size:18px;">${b.icon}</span>
            <span style="font-size:9px;margin-top:3px;">${b.name}</span>
          </button>
        `).join('') : this.mode === 'resource' ? resourceBrushes.map(b => `
          <button class="pb-res" data-type="${b.type}" style="${btnBase}${this.selectedResource === b.type ? activeBtnExtra : ''}color:var(--t-hi,#e0e0e0);">
            <span style="font-size:18px;">${b.icon}</span>
            <span style="font-size:9px;margin-top:3px;">${b.name}</span>
          </button>
        `).join('') : `
          <div style="display:flex;align-items:center;gap:8px;padding:4px 8px;color:var(--t-lo,#888);font-size:11px;">
            🗑️ Click/kéo để xóa tài nguyên · Địa hình → Nước sâu
          </div>
        `}
      </div>

      <!-- Keyboard shortcuts hint -->
      <div style="font-size:9px;color:rgba(255,255,255,0.3);padding-top:2px;">
        Phím tắt: <kbd>T</kbd> Địa hình · <kbd>V</kbd> Tài nguyên · <kbd>E</kbd> Xóa · <kbd>G</kbd> Lưới · <kbd>R</kbd> Thước · <kbd>Ctrl+Z</kbd> Undo · <kbd>Ctrl+Y</kbd> Redo · <kbd>[</kbd><kbd>]</kbd> Đổi kích bút
      </div>
    `;

    // Style kbd elements
    this.el.querySelectorAll('kbd').forEach(k => {
      (k as HTMLElement).style.cssText = 'background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:3px;padding:0 3px;font-size:9px;';
    });
  }

  private bindEvents(): void {
    this.el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const btn = t.closest('button') as HTMLButtonElement | null;
      if (!btn) return;

      const id = btn.id;

      if (id === 'pb-mode-terrain') { this.mode = 'terrain'; this.render(); return; }
      if (id === 'pb-mode-resource') { this.mode = 'resource'; this.render(); return; }
      if (id === 'pb-mode-erase') { this.mode = 'erase'; this.render(); return; }

      if (id === 'pb-grid') { this.showGrid = !this.showGrid; this.render(); return; }
      if (id === 'pb-ruler') {
        this.showDistanceRuler = !this.showDistanceRuler;
        if (!this.showDistanceRuler) this.rulerStart = null;
        this.render();
        return;
      }

      if (id === 'pb-undo') { this.undo(); return; }
      if (id === 'pb-redo') { this.redo(); return; }

      if (id === 'btn-paint-done') {
        this.hide();
        this.onDoneCallback?.();
        return;
      }

      // Brush size buttons
      const sizeBtn = t.closest('.pb-size') as HTMLElement | null;
      if (sizeBtn) {
        this.brushSize = Number(sizeBtn.dataset.size) as BrushSize;
        this.render();
        return;
      }

      // Terrain brush
      const brushBtn = t.closest('.pb-brush') as HTMLElement | null;
      if (brushBtn) {
        this.selectedBrush = brushBtn.dataset.type as TileType;
        this.mode = 'terrain';
        this.render();
        return;
      }

      // Resource brush
      const resBtn = t.closest('.pb-res') as HTMLElement | null;
      if (resBtn) {
        this.selectedResource = resBtn.dataset.type as ResourceType;
        this.mode = 'resource';
        this.render();
        return;
      }
    });
  }

  private bindKeyboard(): void {
    window.addEventListener('keydown', (e) => {
      if (!this.active) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); this.undo(); return; }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); this.redo(); return; }

      switch (e.key.toLowerCase()) {
        case 't': this.mode = 'terrain';  this.render(); break;
        case 'v': this.mode = 'resource'; this.render(); break;
        case 'e': this.mode = 'erase';    this.render(); break;
        case 'g': this.showGrid = !this.showGrid; this.render(); break;
        case 'r':
          if (!e.ctrlKey) {
            this.showDistanceRuler = !this.showDistanceRuler;
            if (!this.showDistanceRuler) this.rulerStart = null;
            this.render();
          }
          break;
        case '[': {
          const sizes: BrushSize[] = [1, 3, 5, 7];
          const i = sizes.indexOf(this.brushSize);
          if (i > 0) { this.brushSize = sizes[i - 1]; this.render(); }
          break;
        }
        case ']': {
          const sizes: BrushSize[] = [1, 3, 5, 7];
          const i = sizes.indexOf(this.brushSize);
          if (i < sizes.length - 1) { this.brushSize = sizes[i + 1]; this.render(); }
          break;
        }
      }
    });
  }

  private updateUndoButtons(): void {
    const undoBtn = this.el.querySelector('#pb-undo') as HTMLElement | null;
    const redoBtn = this.el.querySelector('#pb-redo') as HTMLElement | null;
    if (undoBtn) undoBtn.style.opacity = this.undoStack.length ? '1' : '0.35';
    if (redoBtn) redoBtn.style.opacity = this.redoStack.length ? '1' : '0.35';
  }

  show(): void {
    this.active = true;
    this.el.style.display = 'flex';
    this.statsEl.style.display = 'block';
    this.coordEl.style.display = 'block';
  }

  hide(): void {
    this.active = false;
    this.el.style.display = 'none';
    this.statsEl.style.display = 'none';
    this.coordEl.style.display = 'none';
    this.rulerStart = null;
    this.showDistanceRuler = false;
  }
}
