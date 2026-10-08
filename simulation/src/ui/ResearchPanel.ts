// ============================================================
// ResearchPanel.ts — Phase 3: Tech tree UI
// ============================================================

import type { Island }           from '../core/types';
import type { GameState, IslandStats } from '../game/GameState';
import { TECH_TREE, canResearch, startResearch, type ResearchProgress } from '../core/research';
import type { TechNode }         from '../core/research';
import { ERAS, COMMODITIES } from '../core/civilization';

const CATEGORY_LABELS = {
  tool:     '⚒️ Công Cụ',
  building: '🏗️ Công Trình',
  nature:   '🌿 Tự Nhiên',
  society:  '📚 Xã Hội',
  military: '⚔️ Quân Sự',
};

export class ResearchPanel {
  private onStartResearch: ((tech: TechNode) => void) | null = null;
  private onAssignResearcher?: (npcId: string) => void;
  onResearcher(cb: (npcId: string) => void): void { this.onAssignResearcher = cb; }

  onResearch(cb: (tech: TechNode) => void): void {
    this.onStartResearch = cb;
  }

  /** Render full tech tree HTML for injection into panel-body */
  renderHTML(island: Island, gs: GameState, stats: IslandStats, active: ResearchProgress | null): string {
    // Group by category
    const groups = new Map<string, TechNode[]>();
    for (const tech of TECH_TREE) {
      const cat = `${tech.needEra}:${tech.category}`;
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(tech);
    }

    let html = `
      <div class="research-guide">
        Chọn công nghệ đang khả dụng để bắt đầu. Tài nguyên được trừ khi nghiên cứu khởi chạy; thời gian tính theo ngày trong game.
        ${island.dailyLife?.settlementVersion===1?' Trước khi dành người nghiên cứu, tích trữ thức ăn; người xây/kiếm đá có thể chuyển sang kiếm thức ăn khi đã đủ vật liệu.':''}
        ${island.civilization ? ' Xây Bàn nghiên cứu sơ khai trong tab Xây dựng. Một cư dân trưởng thành rảnh đến bàn để nghiên cứu; ăn/nghỉ hoặc chuyển việc sẽ tạm dừng tiến độ.' : stats.elderCount >= 1 ? ' Có Trưởng lão nên nghiên cứu hoàn thành nhanh gấp đôi.' : ''}
      </div>`;

    // Active research progress bar
    if (active) {
      const tech    = TECH_TREE.find(t => t.id === active.techId);
      const elapsed = active.workTicks === undefined ? stats.daysPassed - active.startDay : active.workTicks / 10;
      const pct     = Math.min(100, Math.round((elapsed / active.daysNeeded) * 100));
      html += `
        <div class="research-active">
          <div class="ra-label">⏳ Đang nghiên cứu: <strong>${tech?.icon} ${tech?.name}</strong></div>
          <div class="ra-track">
            <div class="ra-fill" style="width:${pct}%"></div>
          </div>
          <div class="ra-info">${elapsed.toFixed(1)}/${active.daysNeeded} ngày · ${pct}%
            ${active.researcherId ? ` · ${island.npcs.find(n=>n.id===active.researcherId)?.name.split('#')[0] ?? 'Chờ người nghiên cứu'}` : ''}
          </div>
        </div>`;
      if (island.civilization) html += `<div class="research-worker"><label for="research-worker">Người nghiên cứu</label><select id="research-worker"><option value="">Chọn người trưởng thành rảnh</option>${island.npcs.filter(n=>n.isAlive&&n.position&&n.age>=18&&!island.buildings.some(b=>b.workers.includes(n.id))).map(n=>`<option value="${n.id}" ${active.researcherId===n.id?'selected':''}>${n.name.split('#')[0]}</option>`).join('')}</select><p>${island.npcs.find(n=>n.id===active.researcherId)?.laborMessage ?? 'Chờ phân công người nghiên cứu'}</p></div>`;
    }

    for (const [cat, techs] of groups) {
      const [era, category] = cat.split(':');
      html += `<section class="tech-group"><h3 class="tech-group-label"><span class="tech-group-name">${ERAS[Number(era)]?.name} · ${CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}</span> <span>${techs.filter(t => gs.unlocks.has(t.unlocksId)).length}/${techs.length}</span></h3>`;
      html += `<div class="tech-grid">`;

      for (const tech of techs) {
        const done      = gs.unlocks.has(tech.unlocksId);
        const inProg    = active?.techId === tech.id;
        const check     = canResearch(tech, island, gs, stats);
        const locked    = !check.ok;

        let cardClass = 'tech-card';
        if (done)    cardClass += ' tc-done';
        else if (inProg)  cardClass += ' tc-active';
        else if (locked)  cardClass += ' tc-locked';

        html += `
          <div class="${cardClass}" data-tech="${tech.id}">
            <div class="tc-icon">${tech.icon}</div>
            <div class="tc-body">
              <div class="tc-name">${tech.name}</div>
              <div class="tc-desc">${tech.description}</div>
              <div class="tc-effect">${tech.effect}</div>
              ${done ? `<div class="tc-done-label">✅ Hoàn thành</div>` : `
              <div class="tc-cost">
                ${tech.costWood  > 0 ? `<span class="${island.wood  >= tech.costWood  ? 'ok':'no'}">🪵${tech.costWood}</span>`  : ''}
                ${tech.costStone > 0 ? `<span class="${island.stone >= tech.costStone ? 'ok':'no'}">🪨${tech.costStone}</span>` : ''}
                ${tech.costFood  > 0 ? `<span class="${island.sharedFood >= tech.costFood ? 'ok':'no'}">🍖${tech.costFood}</span>` : ''}
                ${tech.costHerbs > 0 ? `<span class="${island.herbs >= tech.costHerbs ? 'ok':'no'}">🌿${tech.costHerbs}</span>` : ''}
                ${Object.entries(tech.costGoods ?? {}).map(([id,amount])=>`<span>${amount} ${COMMODITIES[id as keyof typeof COMMODITIES]}</span>`).join('')}
                <span class="tc-time">⏱ ${tech.daysNeeded} ngày</span>
              </div>
              ${locked && !done ? `<div class="tc-reason">🔒 ${check.reason}</div>` : ''}
              ${!locked && !done && !inProg ? `<button class="tc-research-btn" data-tech="${tech.id}" ${active ? 'disabled' : ''}>${active ? 'Chờ nghiên cứu hiện tại' : '📖 Nghiên cứu'}</button>` : ''}
              ${inProg ? `<div class="tc-inprog">⏳ Đang nghiên cứu…</div>` : ''}
              `}
            </div>
          </div>`;
      }
      html += `</div></section>`;
    }

    return html;
  }

  /** Wire click events on the panel body element */
  bindEvents(bodyEl: HTMLElement, island: Island, gs: GameState, stats: IslandStats, active: ResearchProgress | null): void {
    bodyEl.onchange = e => { const select = e.target as HTMLSelectElement; if (select.id === 'research-worker' && select.value) this.onAssignResearcher?.(select.value); };
    bodyEl.onclick = (e) => {
      const btn = (e.target as HTMLElement).closest('[data-tech]') as HTMLElement | null;
      if (!btn) return;
      if (!(e.target as HTMLElement).classList.contains('tc-research-btn')) return;

      const techId = btn.dataset.tech!;
      const tech   = TECH_TREE.find(t => t.id === techId);
      if (!tech) return;

      if (active) {
        alert('Đang nghiên cứu rồi! Chờ hoàn thành trước.');
        return;
      }

      this.onStartResearch?.(tech);
    };
  }
}
