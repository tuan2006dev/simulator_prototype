// ============================================================
// AnimalPanel.ts — Phase 4: Animal management + Inspector UI
// Panel shows herd counts, production, individual animal info
// ============================================================

import type { Animal, Island } from '../core/types';
import { ANIMAL_CONFIG } from '../core/types';

export class AnimalPanel {
  private panel: HTMLElement;
  private visible = false;
  private selectedAnimalId: string | null = null;

  private onFeedCallback: ((animalId: string, amount: number) => void) | null = null;
  private onSpawnCallback: ((species: 'cattle' | 'chicken' | 'dog') => void) | null = null;

  constructor() {
    this.panel = document.createElement('div');
    this.panel.id = 'animal-panel';
    Object.assign(this.panel.style, {
      position: 'fixed',
      top: '60px',
      left: '-340px', // hidden off-screen
      width: '320px',
      maxHeight: 'calc(100vh - 80px)',
      overflowY: 'auto',
      background: 'rgba(10,18,30,0.97)',
      border: '1px solid rgba(0,200,150,0.3)',
      borderRadius: '0 14px 14px 0',
      padding: '16px',
      zIndex: '400',
      backdropFilter: 'blur(20px)',
      boxShadow: '4px 0 30px rgba(0,0,0,0.7)',
      transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      color: 'var(--t-hi, #e0e0e0)',
      fontFamily: "'Inter', sans-serif",
      fontSize: '13px',
    });
    document.body.appendChild(this.panel);
  }

  onFeed(cb: (animalId: string, amount: number) => void): void { this.onFeedCallback = cb; }
  onSpawn(cb: (species: 'cattle' | 'chicken' | 'dog') => void): void { this.onSpawnCallback = cb; }

  selectAnimal(id: string | null): void { this.selectedAnimalId = id; }
  isVisible(): boolean { return this.visible; }

  show(island: Island): void {
    this.visible = true;
    this.panel.style.left = '0px';
    this.render(island);
  }

  hide(): void {
    this.visible = false;
    this.panel.style.left = '-340px';
  }

  refresh(island: Island): void {
    if (this.visible) this.render(island);
  }

  private render(island: Island): void {
    const alive = island.animals.filter(a => a.isAlive);

    // Group by species
    const bySpecies = {
      cattle:  alive.filter(a => a.species === 'cattle'),
      chicken: alive.filter(a => a.species === 'chicken'),
      dog:     alive.filter(a => a.species === 'dog'),
    };

    // Food consumption and production summary
    let totalFoodCost = 0;
    let totalFoodProd = 0;
    for (const [sp, animals] of Object.entries(bySpecies)) {
      const cfg = ANIMAL_CONFIG[sp as keyof typeof bySpecies];
      const domesticated = animals.filter(a => a.status !== 'wild');
      totalFoodCost += domesticated.length * cfg.foodCostPerTick;
      if (cfg.produceInterval > 0) {
        totalFoodProd += domesticated.length * (cfg.produceFood / cfg.produceInterval);
      }
    }

    const netFoodPerTick = (totalFoodProd - totalFoodCost).toFixed(1);
    const netColor = parseFloat(netFoodPerTick) >= 0 ? '#7fff9a' : '#ff7070';

    // Selected animal info
    const selected = this.selectedAnimalId
      ? alive.find(a => a.id === this.selectedAnimalId) ?? null
      : null;

    this.panel.innerHTML = `
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <div style="font-size:16px;font-weight:bold;color:#00c896;">🐾 Đàn Gia Súc</div>
        <button id="ap-close" style="background:none;border:none;color:var(--t-lo,#888);font-size:18px;cursor:pointer;padding:0 4px;">✕</button>
      </div>

      <!-- Economy summary -->
      <div style="background:rgba(0,200,150,0.07);border:1px solid rgba(0,200,150,0.2);border-radius:8px;padding:10px;margin-bottom:14px;font-size:11px;">
        <div style="color:#aaa;margin-bottom:4px;">Kinh tế gia súc / tick</div>
        <div style="display:flex;gap:12px;">
          <div>🔴 Tiêu thụ: <b>${totalFoodCost.toFixed(1)}</b> thức ăn</div>
          <div>🟢 Sản xuất: <b>${totalFoodProd.toFixed(1)}</b></div>
          <div>📊 Ròng: <b style="color:${netColor}">${parseFloat(netFoodPerTick) >= 0 ? '+' : ''}${netFoodPerTick}</b></div>
        </div>
      </div>

      <!-- Species cards -->
      ${(['cattle', 'chicken', 'dog'] as const).map(sp => {
        const cfg = ANIMAL_CONFIG[sp];
        const animals = bySpecies[sp];
        const domestic = animals.filter(a => a.status !== 'wild').length;
        const wild = animals.filter(a => a.status === 'wild').length;
        return `
          <div style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <div style="font-size:18px;">${cfg.icon} <b>${cfg.name}</b></div>
              <div style="font-size:11px;color:#aaa;">
                🏠 ${domestic} thuần · 🌿 ${wild} hoang
              </div>
            </div>
            <div style="font-size:10px;color:#888;display:flex;gap:8px;flex-wrap:wrap;">
              ${cfg.produceInterval > 0 ? `<span>📦 ${cfg.produceName} mỗi ${cfg.produceInterval} tick</span>` : ''}
              ${cfg.guardBonus > 0 ? `<span>🛡 +${cfg.guardBonus} phòng thủ</span>` : ''}
              <span>🍽 ${cfg.foodCostPerTick}/tick chi phí</span>
              <span>Max: ${cfg.maxHerd} con</span>
            </div>
            ${island.animals.filter(a => a.isAlive && a.species === sp).length < cfg.maxHerd ? `
              <button class="ap-spawn-btn" data-species="${sp}"
                style="margin-top:6px;padding:4px 10px;background:rgba(0,200,150,0.15);border:1px solid rgba(0,200,150,0.3);
                border-radius:6px;color:#00c896;font-size:10px;cursor:pointer;">
                + Thêm hoang dã vào đảo
              </button>
            ` : `<div style="font-size:10px;color:#555;margin-top:4px;">Đã đạt tối đa ${cfg.maxHerd} con</div>`}
          </div>
        `;
      }).join('')}

      <!-- Individual animal list -->
      ${alive.length > 0 ? `
        <div style="margin-top:10px;font-size:11px;color:#888;margin-bottom:6px;">Danh sách cá thể (${alive.length})</div>
        <div style="max-height:200px;overflow-y:auto;">
          ${alive.slice(0, 30).map(a => {
            const cfg = ANIMAL_CONFIG[a.species];
            const statusLabel: Record<string, string> = {
              wild: '🌿 Hoang', taming: '🤝 Đang thuần', domesticated: '🏠 Thuần',
              breeding: '🐣 Sinh sản', guarding: '🛡 Tuần tra',
            };
            const trustPct = Math.round(a.trust / cfg.trustNeeded * 100);
            const isSelected = a.id === this.selectedAnimalId;
            return `
              <div class="ap-animal-row" data-id="${a.id}"
                style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;
                margin-bottom:2px;background:${isSelected ? 'rgba(0,200,150,0.15)' : 'rgba(255,255,255,0.03)'};
                border:1px solid ${isSelected ? 'rgba(0,200,150,0.4)' : 'transparent'};">
                <span style="font-size:14px;">${cfg.icon}</span>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:11px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${statusLabel[a.status] ?? a.status}
                  </div>
                  <div style="font-size:9px;color:#888;">Tuổi: ${Math.floor(a.age / 10)}d · Tin tưởng: ${Math.min(100, trustPct)}%</div>
                </div>
                ${a.status === 'wild' || a.status === 'taming' ? `
                  <button class="ap-feed-btn" data-id="${a.id}"
                    style="padding:3px 8px;background:rgba(0,200,150,0.2);border:1px solid rgba(0,200,150,0.4);
                    border-radius:5px;color:#00c896;font-size:10px;cursor:pointer;">
                    🍖 Cho ăn
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
          ${alive.length > 30 ? `<div style="font-size:10px;color:#555;padding:4px 8px;">...và ${alive.length - 30} con khác</div>` : ''}
        </div>
      ` : `
        <div style="text-align:center;color:#555;font-size:12px;padding:20px 0;">
          Chưa có gia súc trên đảo.<br>Nghiên cứu Thuần Hóa để bắt đầu.
        </div>
      `}

      <!-- Selected animal detail -->
      ${selected ? this.renderAnimalDetail(selected) : ''}
    `;

    this.bindEvents();
  }

  private renderAnimalDetail(animal: Animal): string {
    const cfg = ANIMAL_CONFIG[animal.species];
    const trustPct = Math.round(animal.trust / cfg.trustNeeded * 100);
    const barW = (w: number) => `
      <div style="background:rgba(255,255,255,0.1);border-radius:3px;height:6px;flex:1;overflow:hidden;">
        <div style="height:100%;width:${Math.min(100, w)}%;background:#00c896;border-radius:3px;"></div>
      </div>
    `;

    return `
      <div style="margin-top:12px;border:1px solid rgba(0,200,150,0.3);border-radius:10px;padding:12px;">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;color:#00c896;">
          ${cfg.icon} Chi tiết cá thể
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:10px;color:#888;width:70px;">Trạng thái</span>
          <span>${{ wild: '🌿 Hoang dã', taming: '🤝 Đang thuần hóa', domesticated: '🏠 Đã thuần', breeding: '🐣 Sinh sản', guarding: '🛡 Tuần tra' }[animal.status]}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:10px;color:#888;width:70px;">Tin tưởng</span>
          ${barW(trustPct)}
          <span style="font-size:10px;color:#aaa;width:30px;">${trustPct}%</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:10px;color:#888;width:70px;">Tuổi</span>
          <span>${Math.floor(animal.age / 10)} ngày game</span>
        </div>
        ${cfg.produceInterval > 0 ? `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="font-size:10px;color:#888;width:70px;">Sản xuất</span>
            ${barW(animal.produceTick / cfg.produceInterval * 100)}
            <span style="font-size:10px;color:#aaa;width:50px;">${animal.produceTick}/${cfg.produceInterval}</span>
          </div>
        ` : ''}
        ${(animal.status === 'wild' || animal.status === 'taming') ? `
          <button id="ap-feed-selected"
            style="width:100%;margin-top:8px;padding:8px;background:linear-gradient(135deg,#00c896,#00a87c);
            color:#000;border:none;border-radius:8px;font-weight:bold;cursor:pointer;font-size:12px;">
            🍖 Cho ăn (tiêu thụ 10 thức ăn)
          </button>
        ` : ''}
      </div>
    `;
  }

  private bindEvents(): void {
    this.panel.querySelector('#ap-close')?.addEventListener('click', () => this.hide());

    // Spawn buttons
    this.panel.querySelectorAll<HTMLElement>('.ap-spawn-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sp = btn.dataset.species as 'cattle' | 'chicken' | 'dog';
        this.onSpawnCallback?.(sp);
      });
    });

    // Animal row click → select
    this.panel.querySelectorAll<HTMLElement>('.ap-animal-row').forEach(row => {
      row.addEventListener('click', () => {
        this.selectedAnimalId = row.dataset.id ?? null;
        // Re-render to show detail
        const island = (globalThis as any).__currentIsland as Island | undefined;
        if (island) this.render(island);
      });
    });

    // Feed buttons in list
    this.panel.querySelectorAll<HTMLElement>('.ap-feed-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onFeedCallback?.(btn.dataset.id!, 10);
      });
    });

    // Feed selected
    this.panel.querySelector('#ap-feed-selected')?.addEventListener('click', () => {
      if (this.selectedAnimalId) {
        this.onFeedCallback?.(this.selectedAnimalId, 10);
      }
    });
  }
}
