// ============================================================
// ActionMenu.ts — Phase 3: Manual control action menu
// Click NPC → action radial/dropdown menu appears
// ============================================================

import type { NPC }    from '../core/types';
import type { WorldMap } from '../renderer/WorldMap';
import { COMMAND_LABELS, COMMAND_TERRAIN, COMMAND_YIELD, type NPCCommandType } from '../game/GameState';

interface PendingCommand {
  npcId: string;
  type:  NPCCommandType;
}

export class ActionMenu {
  private menuEl:   HTMLElement;
  private visible = false;
  private targetNpcId: string | null = null;
  private onCommandCallback: ((npcId: string, cmd: NPCCommandType) => void) | null = null;
  private justOpened = false; // guard: prevent doc-click from closing immediately

  constructor() {
    this.menuEl = document.getElementById('action-menu')!;
    this.menuEl.addEventListener('click', e => this.handleClick(e));
    // Close on outside click — but ignore the very next click after opening
    document.addEventListener('click', e => {
      if (this.justOpened) { this.justOpened = false; return; }
      if (!this.menuEl.contains(e.target as Node)) this.hide();
    });
  }

  onCommand(cb: (npcId: string, cmd: NPCCommandType) => void): void {
    this.onCommandCallback = cb;
  }

  /** Show action menu near a clicked NPC (screen coords) */
  showAt(npc: NPC, screenX: number, screenY: number, worldMap: WorldMap, tileX: number, tileY: number): void {
    this.targetNpcId = npc.id;
    this.visible     = true;

    const radius = 4;
    const availableTerrains = new Set<string>();
    availableTerrains.add('grass'); // always allow resting/talking

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = tileX + dx;
        const ny = tileY + dy;
        if (nx >= 0 && ny >= 0 && nx < worldMap.width && ny < worldMap.height) {
          availableTerrains.add(worldMap.tiles[ny][nx]);
        }
      }
    }

    // Build available commands based on terrain
    const available = (Object.keys(COMMAND_LABELS) as NPCCommandType[]).filter(cmd => {
      const terrains = COMMAND_TERRAIN[cmd];
      return terrains.some(t => availableTerrains.has(t)) || cmd === 'rest' || cmd === 'talk';
    });

    const effectLabel = (cmd: NPCCommandType): string => {
      const reward = COMMAND_YIELD[cmd];
      if (reward.food) return `+${reward.food} thức ăn${reward.herbs ? ` · +${reward.herbs} thảo dược` : ''}`;
      if (reward.wood) return `+${reward.wood} gỗ`;
      if (reward.stone) return `+${reward.stone} đá`;
      if (reward.herbs) return `+${reward.herbs} thảo dược`;
      if (cmd === 'rest') return 'giảm mệt mỏi 30';
      if (cmd === 'talk') return 'cô đơn −30 · quan hệ +5';
      return '';
    };

    this.menuEl.innerHTML = `
      <div class="am-header">
        <span class="am-name">${npc.name.split('#')[0]}</span>
        <span class="am-occ">Tìm địa hình trong ${radius} ô</span>
      </div>
      ${available.map(cmd => `
        <button class="am-btn" data-cmd="${cmd}">
          ${COMMAND_LABELS[cmd]} <span class="am-effect">${effectLabel(cmd)}</span>
        </button>`).join('')}
      <div class="am-note">Lệnh thu thập hoàn tất khi cư dân đến địa hình phù hợp.</div>
      <button class="am-btn am-cancel" data-cmd="cancel">❌ Huỷ</button>
    `;

    // Position near NPC (avoid edge overflow)
    const menuW = 160, menuH = available.length * 36 + 56;
    const x = Math.min(screenX + 12, window.innerWidth  - menuW - 8);
    const y = Math.min(screenY - 20, window.innerHeight - menuH - 8);

    this.menuEl.style.left    = `${x}px`;
    this.menuEl.style.top     = `${y}px`;
    this.menuEl.style.display = 'block';
    this.justOpened = true; // block the next document-click from closing immediately

    // Animation
    this.menuEl.style.opacity   = '0';
    this.menuEl.style.transform = 'scale(0.88)';
    requestAnimationFrame(() => {
      this.menuEl.style.opacity   = '1';
      this.menuEl.style.transform = 'scale(1)';
    });
  }

  private handleClick(e: MouseEvent): void {
    const btn = (e.target as HTMLElement).closest('[data-cmd]') as HTMLElement | null;
    if (!btn) return;
    e.stopPropagation();
    const cmd = btn.dataset.cmd as NPCCommandType | 'cancel';
    if (cmd !== 'cancel' && this.targetNpcId) {
      this.onCommandCallback?.(this.targetNpcId, cmd);
    }
    this.hide();
  }

  hide(): void {
    this.visible = false;
    this.menuEl.style.display = 'none';
  }

  isVisible(): boolean { return this.visible; }
}
