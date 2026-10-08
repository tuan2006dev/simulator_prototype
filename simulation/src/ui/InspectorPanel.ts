// ============================================================
// InspectorPanel.ts — NPC detail panel (right sidebar)
// ============================================================

import type { NPC, Island } from '../core/types';
import { getRelationship }  from '../core/utils';
import { COMMAND_LABELS, type NPCCommandType } from '../game/GameState';
import {attributes} from '../core/workforce';
import {inventoryHTML} from './NpcInventory';
import {characterPortrait} from '../renderer/CharacterTextures';

const OCC_LABEL: Record<string, string> = {
  farmer:   '🌾 Nông dân',
  gatherer: '🍄 Thợ hái lượm',
  warrior:  '⚔️ Chiến binh',
  elder:    '📜 Trưởng lão',
  craftsman:'🔨 Thợ thủ công',
  child:    '👶 Trẻ em',
};

const STATUS_LABEL: Record<string, string> = {
  idle:     '💤 Rảnh rỗi',
  eating:   '🍖 Đang ăn',
  sleeping: '😴 Đang ngủ',
  working:  '⛏️ Đang làm việc',
  chatting: '💬 Đang trò chuyện',
  courting: '💕 Đang tán tỉnh',
  stealing: '🤫 Đang trộm',
  fighting: '⚔️ Đang chiến đấu',
  fleeing:  '💨 Đang bỏ chạy',
  praying:  '🙏 Đang cầu nguyện',
};

function needBar(value: number, cls: string): string {
  const pct = Math.round(value);
  return `
    <div class="need-track">
      <div class="need-fill ${cls}" style="width:${pct}%"></div>
    </div>
    <span class="need-pct">${pct}%</span>`;
}

function traitBar(value: number): string {
  // value: -100 to +100
  const norm   = (value + 100) / 200; // 0 to 1
  const pct    = Math.round(Math.abs(value));
  const isPos  = value >= 0;
  const color  = isPos ? 'var(--c-teal)' : 'var(--c-red)';
  const left   = isPos ? '50%' : `${norm * 100}%`;
  const width  = `${Math.abs(norm - 0.5) * 100}%`;
  const valStr = `${value > 0 ? '+' : ''}${value}`;
  return `
    <div class="trait-track">
      <div class="trait-fill" style="left:${left};width:${width};background:${color}"></div>
    </div>
    <span class="trait-val" style="color:${color}">${valStr}</span>`;
}

export class InspectorPanel {
  private panel: HTMLElement;
  private emptyState: HTMLElement;
  private npcState: HTMLElement;
  private visible = false;
  private selectedId: string | null = null;
  private onCommandCallback: ((id: string, command: NPCCommandType) => void) | null = null;
  private lastMarkup = '';

  constructor() {
    this.panel = document.getElementById('inspector-panel')!;
    this.emptyState = document.getElementById('inspector-empty')!;
    this.npcState = document.getElementById('inspector-npc')!;
    this.panel.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      if (target.closest('#inspector-close')) { this.hide(); return; }
      const button = target.closest<HTMLButtonElement>('[data-npc-command]');
      if (button && this.selectedId) this.onCommandCallback?.(this.selectedId, button.dataset.npcCommand as NPCCommandType);
    });
  }

  onCommand(callback: (id: string, command: NPCCommandType) => void): void {
    this.onCommandCallback = callback;
  }

  show(npc: NPC, island: Island): void {
    this.panel.classList.add('open');
    this.visible = true;
    this.selectedId = npc.id;
    
    // Switch visibility
    this.emptyState.classList.add('hidden');
    this.npcState.classList.remove('hidden');

    const partner = npc.partnerId ? island.npcs.find(n => n.id === npc.partnerId) : null;
    const relList = island.npcs
      .filter(n => n.isAlive && n.id !== npc.id)
      .map(n => ({ npc: n, score: getRelationship(island, npc.id, n.id).score }))
      .filter(r => Math.abs(r.score) > 10)
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
      .slice(0, 4);

    const relHtml = relList.map(r => {
      const icon  = r.score >= 60 ? '💛' : r.score >= 20 ? '🤝' : r.score <= -60 ? '💢' : '😠';
      const color = r.score > 0 ? 'var(--c-green)' : 'var(--c-red)';
      return `<div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:12px;">
        <span style="color:var(--t-dark)">${icon} ${r.npc.name.split('#')[0]}</span>
        <span style="color:${color}; font-weight:700">${r.score > 0 ? '+' : ''}${Math.round(r.score)}</span>
      </div>`;
    }).join('');

    // Generate inner HTML for #inspector-npc matching the new design
    const markup = `
      <div class="insp-header">
        <div class="insp-avatar-wrap occ-${npc.occupation}">
          ${characterPortrait(npc,island.civilization?.era??'stone')}
        </div>
        <div class="insp-meta">
          <div class="insp-name">${npc.name.split('#')[0]}</div>
          <div class="insp-age">${OCC_LABEL[npc.occupation] ?? npc.occupation} · ${npc.age} tuổi</div>
          <div class="insp-status">
            <span class="status-dot ${npc.status === 'idle' ? 'green' : 'amber'}"></span>
            <span>${STATUS_LABEL[npc.status] ?? npc.status}</span>
          </div>
        </div>
        <button class="insp-close" id="inspector-close">✕</button>
      </div>

      <div class="insp-section">
        ${npc.age>=18?`<button data-open-explorer="${npc.id}">Khám phá / đuốc</button>`:''}
        ${npc.adaptation?`<p class="npc-adaptation-status">${npc.adaptation.kind==='hightech'?'Thiết bị hỗ trợ':npc.adaptation.kind==='mystic'?'Cộng hưởng linh khí':'Thích nghi sinh chất'} · còn ${npc.adaptation.charge}/100 lượt. ${npc.adaptation.charge===0?'Lợi ích tạm ngừng; cần chăm sóc tại viện.':'Hiệu quả có điều kiện theo nghề/vùng.'} Mở Nhiệm vụ hoặc Dân cư để chăm sóc/gỡ.</p>`:''}<p class="npc-attributes">Sức mạnh (STR) ${attributes(npc).str} · Khéo léo (DEX) ${attributes(npc).dex} · Trí tuệ (INT) ${attributes(npc).int}</p>
        <div class="insp-sec-title">Nhu cầu</div>
        <div class="insp-stat-row">
          <span class="stat-emoji">💚</span><span class="stat-name">Sức khỏe</span>
          <div class="stat-track"><div class="stat-fill" style="width:${npc.health ?? 100}%; background:var(--c-green)"></div></div>
          <span class="stat-pct">${Math.round(npc.health ?? 100)}%</span>
        </div>
        <div style="font-size:12px;line-height:1.5;margin:6px 0;color:var(--t-dark)">${npc.laborMessage??'Sinh hoạt tự động'} · Đồ ăn mang theo: ${npc.privateFood.toFixed(1)}${npc.cargo?`<br>Hàng chờ giao: ${npc.cargo.food.toFixed(1)} thức ăn · ${npc.cargo.wood.toFixed(1)} gỗ · ${npc.cargo.stone.toFixed(1)} đá · ${npc.cargo.herbs.toFixed(1)} thảo dược`:''}</div>
        <div class="insp-stat-row">
          <span class="stat-emoji">🍖</span><span class="stat-name">Đói</span>
          <div class="stat-track"><div class="stat-fill hunger-fill" style="width:${npc.needs.hunger}%"></div></div>
          <span class="stat-pct">${Math.round(npc.needs.hunger)}%</span>
        </div>
        <div class="insp-stat-row">
          <span class="stat-emoji">😴</span><span class="stat-name">Mệt mỏi</span>
          <div class="stat-track"><div class="stat-fill rest-fill" style="width:${npc.needs.rest}%"></div></div>
          <span class="stat-pct">${Math.round(npc.needs.rest)}%</span>
        </div>
        <div class="insp-stat-row">
          <span class="stat-emoji">⚠️</span><span class="stat-name">Sợ hãi</span>
          <div class="stat-track"><div class="stat-fill" style="width:${npc.needs.safety}%; background:var(--c-red)"></div></div>
          <span class="stat-pct">${Math.round(npc.needs.safety)}%</span>
        </div>
        <div class="insp-stat-row">
          <span class="stat-emoji">👥</span><span class="stat-name">Cô đơn</span>
          <div class="stat-track"><div class="stat-fill" style="width:${npc.needs.social}%; background:var(--c-blue)"></div></div>
          <span class="stat-pct">${Math.round(npc.needs.social)}%</span>
        </div>
      </div>

      <div class="insp-section">${inventoryHTML(npc)}${npc.divineState?`<p class="divine-npc-status">${npc.divineState==='blessed'?'Ban Phước · tốc độ làm việc +50%':'Kiệt sức thần thánh · tốc độ làm việc −50%'}</p>`:''}</div>

      <div class="insp-section">
        <div class="insp-sec-title">HÀNH ĐỘNG</div>
        <div id="insp-action-grid">${(Object.keys(COMMAND_LABELS) as NPCCommandType[]).map(command => `
          <button class="action-card" data-npc-command="${command}" title="${COMMAND_LABELS[command]}">${COMMAND_LABELS[command]}</button>
        `).join('')}</div>
      </div>
      <details class="insp-details">
      <summary>Thông tin cư dân</summary>
      <div class="insp-section">
        <div class="insp-sec-title">Tính cách</div>
        <div class="trait-row"><span class="trait-name">Can đảm</span>${traitBar(npc.personality.courage)}</div>
        <div class="trait-row"><span class="trait-name">Lòng tham</span>${traitBar(npc.personality.greed)}</div>
        <div class="trait-row"><span class="trait-name">Trung thành</span>${traitBar(npc.personality.loyalty)}</div>
        <div class="trait-row"><span class="trait-name">Sùng đạo</span>${traitBar(npc.personality.piety)}</div>
        <div class="trait-row"><span class="trait-name">Hòa đồng</span>${traitBar(npc.personality.sociability)}</div>
      </div>

      ${partner ? `
      <div class="insp-section">
        <div class="insp-sec-title">Gia đình</div>
        <div style="font-size:12px; color:var(--t-dark);">Bạn đời: <strong>${partner.name.split('#')[0]}</strong>
          ${npc.isPregnant ? ` · 🤰 (còn ${npc.pregnancyDaysLeft}ng)` : ''}
        </div>
        ${npc.motherId ? `<div style="font-size:11px; color:var(--t-lo); margin-top:4px;">Thế hệ sinh ra trong game</div>` : ''}
      </div>` : ''}

      ${relList.length > 0 ? `
      <div class="insp-section">
        <div class="insp-sec-title">Quan hệ nổi bật</div>
        ${relHtml}
      </div>` : ''}

      <div class="insp-section">
        <div class="insp-sec-title">Kho riêng</div>
        <div style="font-size:12px; color:var(--t-dark);">🍞 Lương thực: <strong>${Math.round(npc.privateFood)}</strong></div>
      </div>
      </details>
    `;
    if (markup !== this.lastMarkup) {
      const detailsOpen = this.npcState.querySelector('details')?.open ?? false;
      this.npcState.innerHTML = markup;
      const details = this.npcState.querySelector('details');
      if (details) details.open = detailsOpen;
      this.lastMarkup = markup;
    }
  }

  hide(): void {
    // Keep panel open on desktop (it's part of layout), just show empty state
    this.visible = false;
    this.panel.classList.remove('open');
    this.npcState.classList.add('hidden');
    this.emptyState.classList.remove('hidden');
  }

  isVisible(): boolean { return this.visible; }
}
