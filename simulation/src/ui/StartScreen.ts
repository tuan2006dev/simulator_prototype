// ============================================================
// StartScreen.ts — Phase 3: World creation flow
// State: MENU → WORLD_CREATE → ENTITY_PLACE → PLAYING
// ============================================================

import type { WorldMap,WorldShape } from '../renderer/WorldMap';
import { generateWorldMap } from '../renderer/WorldMap';
import type { GamePhase } from '../game/GameState';

export interface WorldConfig {
  seed:    number;
  shape:   WorldShape;
  size:    'small' | 'medium' | 'large';
  startPop: number;
  mode: 'local' | 'server-dev';
}

const SIZE_MAP = {
  small:  { w: 50,  h: 35 },
  medium: { w: 80,  h: 50 },
  large:  { w: 120, h: 80 },
};

const SHAPE_LABELS = {
  circle:      '🔵 Đảo Tròn',
  elongated:   '📏 Đảo Dài',
  archipelago: '🏝️ Cụm Đảo',
  crescent:    '🌙 Lưỡi Liềm',
  'three-islands':'🧭 Ba đảo',
};

export class StartScreen {
  private overlay: HTMLElement;
  private config: WorldConfig = {
    seed:     Math.floor(Math.random() * 99999) + 1,
    shape:    'circle',
    size:     'medium',
    startPop: 8,
    mode:     'local',
  };
  private onStartCallback: ((map: WorldMap, config: WorldConfig) => void) | null = null;
  private onJoinCallback: ((islandId: string) => void) | null = null;
  private onPaintCallback: (() => void) | null = null;
  private hasBoundOverlay = false;
  private onResumeCallback?: () => void;
  onResume(cb: () => void): void { this.onResumeCallback = cb; }

  constructor() {
    this.overlay = document.getElementById('start-overlay')!;
    this.render();
    this.bindEvents();
  }

  onStart(cb: (map: WorldMap, config: WorldConfig) => void): void {
    this.onStartCallback = cb;
  }

  onJoin(cb: (islandId: string) => void): void {
    this.onJoinCallback = cb;
  }
  
  onPaint(cb: () => void): void {
    this.onPaintCallback = cb;
  }

  private render(): void {
    this.overlay.innerHTML = `
      <div class="start-root">
        <div class="start-logo">🏝️</div>
        <h1 class="start-title">Đảo Thiên Nguyên</h1>
        <p class="start-sub">Đồ Đá → Đồ Đồng → Đồ Sắt → Hiện Đại → Dị Tượng</p>
        ${localStorage.getItem('dao_thien_nguyen_v2') || localStorage.getItem('dao_thien_nguyen_v1') ? '<button id="btn-resume-game" class="start-btn-main">Tiếp tục bản đã lưu</button>' : ''}

        <div class="start-panel">
          <div class="start-section-title">Chế độ mô phỏng</div>
          <div class="start-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 15px;">
            <div class="start-choice ${this.config.mode === 'local' ? 'selected' : ''}" data-mode="local">
              <span class="icon">🖥️</span>
              <span>Chơi cục bộ</span>
            </div>
            <div class="start-choice ${this.config.mode === 'server-dev' ? 'selected' : ''}" data-mode="server-dev">
              <span class="icon">☁️</span>
              <span>Server thử nghiệm</span>
            </div>
          </div>
          <p style="font-size:11px;color:var(--t-lo);margin:-8px 0 14px;">Server thử nghiệm cần API localhost:3001 đang chạy. Tạo đảo sẽ sinh mã tham gia để mở cùng đảo ở cửa sổ khác; đảo chỉ tồn tại trong bộ nhớ khi server đang chạy.</p>
          ${this.config.mode === 'server-dev' ? `
            <div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin:-4px 0 16px;">
              <input id="join-island-id" class="start-input" style="width:100%;box-sizing:border-box;" placeholder="Dán mã đảo để tham gia" autocomplete="off" />
              <button id="btn-join-island" class="start-random-btn" type="button">↪ Tham gia</button>
            </div>` : ''}

          <div class="start-section-title">Cách tạo thế giới</div>
          <div class="start-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 15px;">
            <div class="start-choice selected">
              <span class="icon">🎲</span>
              <span>Đảo ngẫu nhiên</span>
            </div>
            <div id="btn-paint-map" class="start-choice">
              <span class="icon">🖊️</span>
              <span>Tự vẽ Map</span>
            </div>
          </div>

          <div class="start-section-title">Hình dạng đảo</div>
          <div class="start-grid">
            ${Object.entries(SHAPE_LABELS).filter(([k])=>k!=='three-islands'||this.config.mode==='local').map(([k, v]) => {
              const icon = v.substring(0, 2).trim();
              const text = v.substring(3).trim();
              return `<div class="start-choice ${k === this.config.shape ? 'selected' : ''}" data-shape="${k}">
                <span class="icon">${icon}</span>
                <span>${text}</span>
              </div>`
            }).join('')}
          </div>

          ${this.config.shape==='three-islands'?'<p id="archipelago-start-note">Thiên Nguyên ở giữa · Thần Ngư phía Đông Nam · Răng Nanh phía Tây Bắc. Kích thước dưới đây là đảo chính; khung biển mở rộng cho ba đảo. Dân bắt đầu trên Thiên Nguyên. Bãi cạn Răng Nanh mở 09:00–15:00; cử trinh sát trong Nhiệm vụ. Chưa có thuyền hoặc bộ tộc láng giềng.</p>':''}<div class="start-section-title">Kích thước</div>
          <div class="start-grid" style="grid-template-columns: repeat(3, 1fr);">
            ${(['small','medium','large'] as const).map(s =>
              `<div class="start-choice ${s === this.config.size ? 'selected' : ''}" data-size="${s}">
                <span class="icon">${s === 'small' ? '🏡' : s === 'medium' ? '🏝️' : '🌍'}</span>
                <span>${s === 'small' ? 'Nhỏ' : s === 'medium' ? 'Vừa' : 'Lớn'}</span>
              </div>`
            ).join('')}
          </div>

          <p id="world-clock-note">Một ngày = 120 giây ở tốc độ 1×. Lao động 06–18h, bữa tối 18–20h, nghỉ đêm 20–06h.</p><div class="start-section-title">Dân số khởi đầu</div>
          <div class="start-row">
            <label>Số người:</label>
            <input type="range" id="start-pop-slider" min="3" max="15"
              value="${this.config.startPop}" class="start-slider" />
            <span id="start-pop-val" class="start-slider-val">${this.config.startPop}</span>
          </div>

          <div class="start-section-title">Seed bản đồ</div>
          <div class="start-row">
            <label>Mã bản đồ:</label>
            <input type="number" id="start-seed" value="${this.config.seed}"
              class="start-input" min="1" max="999999" />
            <button id="start-seed-random" class="start-random-btn" title="Random seed">🎲 Ngẫu nhiên</button>
          </div>

          <div class="start-section-title">Preview bản đồ</div>
          <canvas id="start-preview" width="510" height="${this.config.shape==='three-islands'?220:120}" class="start-preview-canvas"></canvas>

          <div class="start-actions">
            <button id="btn-paint-map-bottom" class="start-btn-paint">🖊️ Tự vẽ Map</button>
            <button id="btn-start-game" class="start-btn-create">${this.config.mode === 'server-dev' ? '☁️ Tạo đảo trên server' : '⚔️ Bắt đầu khám phá'}</button>
          </div>
        </div>
      </div>
    `;
    this.renderPreview();
  }

  private renderPreview(): void {
    const canvas = document.getElementById('start-preview') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const map = this.previewMap();
    const scale=Math.min(canvas.width/map.width,canvas.height/map.height);
    const pw=this.config.shape==='three-islands'?scale:canvas.width/map.width,ph=this.config.shape==='three-islands'?scale:canvas.height/map.height;
    const ox=(canvas.width-map.width*pw)/2,oy=(canvas.height-map.height*ph)/2;ctx.fillStyle='#0d2137';ctx.fillRect(0,0,canvas.width,canvas.height);

    const COLOR: Record<string, string> = {
      deep_water:    '#0d2137',
      shallow_water: '#1a4a7a',
      sand:          '#c8a96e',
      grass:         '#4a8c3f',
      forest:        '#2d6b2a',
      mountain:      '#8b7355',
    };

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        ctx.fillStyle = COLOR[map.tiles[y][x]] ?? '#000';
        ctx.fillRect(ox+x * pw, oy+y * ph, Math.ceil(pw), Math.ceil(ph));
      }
    }

    if(map.archipelago){ctx.save();ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.strokeStyle='#203c36';ctx.lineWidth=3;ctx.fillStyle='#f8e4b8';for(const r of map.archipelago.islands){const x=ox+(r.center.x+.5)*pw,y=oy+(r.center.y+.5)*ph;ctx.strokeText(r.name,x,y);ctx.fillText(r.name,x,y);}ctx.restore();}
    // Overlay seed text
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, canvas.height - 18, canvas.width, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText(`seed: ${this.config.seed}`, 6, canvas.height - 5);
  }

  private previewMap(): WorldMap {
    const { w, h } = SIZE_MAP[this.config.size];
    return generateWorldMap(w, h, this.config.seed, this.config.shape);
  }

  private bindEvents(): void {
    if (!this.hasBoundOverlay) {
      this.overlay.addEventListener('click', (e) => {
        const t = e.target as HTMLElement;
        if (t.closest('#btn-resume-game')) { this.onResumeCallback?.(); return; }

      // Shape buttons
      const modeBtn = t.closest('[data-mode]') as HTMLElement | null;
      if (modeBtn) {
        this.config.mode = modeBtn.dataset.mode as WorldConfig['mode'];
        if(this.config.mode==='server-dev'&&this.config.shape==='three-islands')this.config.shape='circle';
        this.render(); this.bindEvents(); return;
      }

      const shapeBtn = t.closest('[data-shape]') as HTMLElement | null;
      if (shapeBtn) {
        this.config.shape = shapeBtn.dataset.shape as WorldConfig['shape'];
        this.render(); this.bindEvents(); return;
      }

      // Size buttons
      const sizeBtn = t.closest('[data-size]') as HTMLElement | null;
      if (sizeBtn) {
        this.config.size = sizeBtn.dataset.size as WorldConfig['size'];
        this.render(); this.bindEvents(); return;
      }

      // Random seed
      if (t.id === 'start-seed-random') {
        this.config.seed = Math.floor(Math.random() * 99999) + 1;
        (document.getElementById('start-seed') as HTMLInputElement).value = String(this.config.seed);
        this.renderPreview(); return;
      }

      // Start game
      if (t.id === 'btn-start-game' || t.closest('#btn-start-game')) {
        this.startGame();
      }

      if (t.id === 'btn-join-island' || t.closest('#btn-join-island')) {
        const code = (document.getElementById('join-island-id') as HTMLInputElement | null)?.value.trim();
        if (code) {
          this.hide();
          this.onJoinCallback?.(code);
        }
      }

      // Paint map
      if (t.id === 'btn-paint-map' || t.id === 'btn-paint-map-bottom' || t.closest('#btn-paint-map') || t.closest('#btn-paint-map-bottom')) {
        this.hide();
        this.onPaintCallback?.();
      }
      });
      this.hasBoundOverlay = true;
    }

    // Seed input change
    const seedInput = document.getElementById('start-seed') as HTMLInputElement;
    seedInput?.addEventListener('input', () => {
      this.config.seed = parseInt(seedInput.value) || 1;
      this.renderPreview();
    });

    // Pop slider
    const popSlider = document.getElementById('start-pop-slider') as HTMLInputElement;
    const popVal    = document.getElementById('start-pop-val');
    popSlider?.addEventListener('input', () => {
      this.config.startPop = parseInt(popSlider.value);
      if (popVal) popVal.textContent = `${this.config.startPop} người`;
    });
  }

  private startGame(): void {
    const { w, h } = SIZE_MAP[this.config.size];
    const map = generateWorldMap(w, h, this.config.seed, this.config.shape);
    this.hide();
    this.onStartCallback?.(map, this.config);
  }

  show(): void { this.overlay.style.opacity = '1'; this.overlay.style.display = 'flex'; }
  hide(): void { this.overlay.style.opacity = '0'; setTimeout(() => { this.overlay.style.display = 'none'; }, 400); }
}
