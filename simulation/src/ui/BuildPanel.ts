// ============================================================
// BuildPanel.ts — Phase 3: Building placement UI panel
// ============================================================

import type { Island } from '../core/types';
import type { BuildingType } from '../core/types';
import {
  BUILD_COSTS, BUILD_LABELS, BUILD_DESC, BUILD_TERRAIN,
  placeBuilding, getBuildingAt, buildingLevel, buildingBenefit, foodCapacity, materialCapacity,
  canAfford,
} from '../renderer/BuildingManager';
import { buildingTextureURL } from '../renderer/BuildingTextures';
import { settlerCapacity } from '../core/settlers';
import type { WorldMap } from '../renderer/WorldMap';
import { buildingLock, COMMODITIES, goodsCapacity } from '../core/civilization';
import { openingMilestones } from '../core/settlement';

// Building catalogue for display
const BUILD_CATALOGUE: BuildingType[] = [
  'tent','stockpile','fishing_dock','study_table',
  'farm', 'lumbercamp', 'mine', 'house', 'storehouse', 'temple', 'bridge',
  'copper_mine', 'smelter', 'sawmill',
  'clay_pit', 'brick_kiln', 'pottery_workshop', 'wheat_field', 'bakery',
  'iron_mine','coal_mine','iron_smelter','flax_field','weaver','tradepost','steelworks','stonecutter','steam_generator','prototype_workshop','component_factory','measurement_lab','microchip_factory','control_center','spirit_extractor','spirit_refinery','resonance_tower','apothecary','clinic','relic_extractor','biomatter_workshop','quarantine',
];

export class BuildPanel {
  private selectedType: BuildingType | null = null;
  private isActive = false;
  private onPlaceCallback: ((type: BuildingType) => void) | null = null;
  private placeCommand?: (type: BuildingType, x: number, y: number) => boolean;
  onPlace(cb: (type: BuildingType, x: number, y: number) => boolean): void { this.placeCommand = cb; }

  // ── Toggle build mode ───────────────────────────────────────────────────────
  activate(): void   { this.isActive = true; }
  deactivate(): void { this.isActive = false; this.selectedType = null; }
  get active(): boolean { return this.isActive; }
  get selected(): BuildingType | null { return this.selectedType; }

  // ── Register a callback for when user picks a building type ─────────────────
  onSelect(cb: (type: BuildingType) => void): void {
    this.onPlaceCallback = cb;
  }

  // ── Render the building catalogue HTML (injected into panel-body) ────────────
  renderHTML(island: Island): string {
    return `
      <div class="settlement-overview"><strong>Ngôi làng của bạn</strong><span>👥 ${island.npcs.filter(n => n.isAlive).length}/${settlerCapacity(island)} chỗ ở</span><span>🍖 ${Math.floor(island.sharedFood)}/${foodCapacity(island)} sức chứa</span></div>
      ${island.dailyLife?.settlementVersion===1&&island.civilization?.era==='stone'?`<section class="opening-checklist"><h3>Chặng Khởi nguyên · ${openingMilestones(island).filter(m=>m.met).length}/6</h3>${openingMilestones(island).map(m=>`<p>${m.met?'✓':'○'} ${m.label}</p>`).join('')}<p>Hoàn tất các mốc rồi tiếp tục Công cụ đá và Nông nghiệp trong Đồ Đá.</p></section>`:''}
      ${island.dailyLife?.settlementVersion===1?`<div class="goods-overview">Gỗ ${Math.floor(island.wood)}/${materialCapacity(island)} · Đá ${Math.floor(island.stone)}/${materialCapacity(island)} · Thảo dược ${Math.floor(island.herbs)}/${materialCapacity(island)}. Giới hạn áp dụng riêng cho mỗi loại; hàng chờ giao vẫn nằm ở người mang.</div>`:''}
      ${island.civilization ? `<div class="goods-overview">${Object.entries(COMMODITIES).map(([id,name])=>`${name}: <strong data-goods="${id}">${Math.floor(island.civilization!.inventory[id as keyof typeof COMMODITIES])}/${goodsCapacity(island)}</strong>`).join(' · ')}</div>` : ''}
      ${island.buildings.length ? `<section class="owned-buildings"><h3>Công trình đã đặt</h3>${island.buildings.map(b => `<button class="owned-building" data-inspect-building="${b.id}"><img src="${buildingTextureURL(b.type, buildingLevel(b), b.technology)}" alt=""><span><strong>${BUILD_LABELS[b.type]} · Cấp ${buildingLevel(b)}</strong><small>${!b.complete ? `Đang xây ${Math.floor(b.progress)}%` : b.upgrade ? `Nâng cấp ${Math.floor(b.upgrade.progress)}%` : b.workMessage ?? 'Hoàn thành'}</small></span><span>Xem →</span></button>`).join('')}</section>` : ''}
      <h3>Xây công trình mới</h3><div class="building-catalogue">
        ${BUILD_CATALOGUE.map(type => {
          const cost = BUILD_COSTS[type];
          const lock = buildingLock(island, type);
          const affordable = canAfford(island, cost);
          const isSelected = this.selectedType === type;

          return `
            <div
              class="build-card ${isSelected ? 'selected' : ''} ${affordable && !lock ? '' : 'unaffordable'}"
              data-build="${type}"
              title="${BUILD_DESC[type]}"
            >
              <div class="build-card-header">
                <img class="build-texture" src="${buildingTextureURL(type, 1, island.civilization?.era === 'iron' ? 'iron' : island.civilization?.era === 'bronze' ? 'bronze' : 'stone')}" alt="${BUILD_LABELS[type]} cấp 1">
                <span class="build-name">${BUILD_LABELS[type]}</span>
                ${isSelected ? '<span class="build-badge">Đang chọn</span>' : ''}
              </div>
              <div class="build-desc">${BUILD_DESC[type]}</div>
              ${lock ? `<p class="tc-reason">🔒 ${lock}</p>` : ''}
              <p class="build-benefit">${buildingBenefit({ type, level: 1 } as import('../core/types').Building)}</p>
              <div class="build-cost">
                ${cost.wood  > 0 ? `<span class="${island.wood  >= cost.wood  ? 'ok' : 'no'}">🪵 ${cost.wood}</span>`  : ''}
                ${cost.stone > 0 ? `<span class="${island.stone >= cost.stone ? 'ok' : 'no'}">🪨 ${cost.stone}</span>` : ''}
                <span class="${island.sharedFood >= cost.food ? 'ok' : 'no'}">🍖 ${cost.food}</span>
                ${Object.entries(cost.goods ?? {}).map(([kind, amount])=>`<span class="${(island.civilization?.inventory[kind as keyof typeof COMMODITIES] ?? 0) >= amount ? 'ok':'no'}">${COMMODITIES[kind as keyof typeof COMMODITIES]} ${amount}</span>`).join('')}
                <span class="build-terrain">📍 ${BUILD_TERRAIN[type].map(t => ({ grass: 'Đồng cỏ', forest: 'Rừng', mountain: 'Núi', sand: 'Cát', shallow_water: 'Nước nông', river: 'Sông' } as Record<string, string>)[t] ?? t).join(' / ')}</span>
              </div>
            </div>`;
        }).join('')}
      </div>
      <p style="margin-top:12px;font-size:11px;color:var(--t-mid);text-align:center;">
        Chọn công trình → Đặt vào đất phù hợp → Phân công thợ để xây. Click công trình để xem và nâng cấp.
      </p>
    `;
  }

  // ── Handle click on panel build card ────────────────────────────────────────
  handlePanelClick(e: MouseEvent): boolean {
    const card = (e.target as HTMLElement).closest('[data-build]') as HTMLElement | null;
    if (!card) return false;
    if (card.classList.contains('unaffordable')) return false;
    const type = card.dataset.build as BuildingType;
    this.selectedType = type;
    this.isActive = true;
    this.onPlaceCallback?.(type);
    return true;
  }

  // ── Try to place building at tileX, tileY ───────────────────────────────────
  tryPlace(
    island: Island,
    worldMap: WorldMap,
    tileX: number,
    tileY: number,
  ): boolean {
    if (!this.selectedType) return false;
    if (tileX < 0 || tileY < 0 || tileX >= worldMap.width || tileY >= worldMap.height) return false;

    const terrain = worldMap.tiles[tileY][tileX];

    // Check terrain compatibility
    if (!BUILD_TERRAIN[this.selectedType].includes(terrain)) {
      return false;
    }

    // Check tile not already occupied
    if (getBuildingAt(island, tileX, tileY)) {
      return false;
    }
    if (island.npcs.some(n => n.isAlive && n.position?.tileX === tileX && n.position?.tileY === tileY) || island.animals.some(a => a.isAlive && a.tileX === tileX && a.tileY === tileY)) return false;

    const result = this.placeCommand ? this.placeCommand(this.selectedType, tileX, tileY) : placeBuilding(island, this.selectedType, tileX, tileY);
    if (result) {
      // Deselect after placing (or keep selected for rapid building)
      return true;
    }
    return false;
  }
}
