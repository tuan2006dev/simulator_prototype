import type { Island, AnimalSpecies } from '../core/types';
import { ANIMAL_CONFIG } from '../core/types';
import type { GameState } from '../game/GameState';
import { canInviteSettler, settlerCapacity } from '../core/settlers';

export class CreaturesPanel {
  renderHTML(island: Island, gs: GameState, serverMode: boolean): string {
    const waiting = island.npcs.filter(n => n.isAlive && !n.position);
    const reason = canInviteSettler(island);
    return `<div class="creatures-guide">Chọn sinh vật rồi click vào ô cỏ, cát hoặc rừng để đặt. Cư dân mới cần lương thực; hãy mở rộng sản xuất trước khi tăng dân số.</div>
      <section class="creature-group"><h3>👥 Cư dân</h3>
      <p>${island.npcs.filter(n => n.isAlive).length} / ${settlerCapacity(island)} chỗ · Còn ${Math.max(0, settlerCapacity(island) - island.npcs.filter(n => n.isAlive).length)} chỗ trống. Nhà ở thêm 5 chỗ mỗi cấp.</p>
      <div class="creature-grid"><article class="creature-card"><h4>👤 Nhóm khai lập</h4><p>Còn ${waiting.length} cư dân chưa đặt. Nhóm này đã được chuẩn bị khi tạo đảo và không tốn thêm tài nguyên.</p>
      <button data-creature="founder" ${waiting.length ? '' : 'disabled'}>${waiting.length ? 'Đặt cư dân khởi đầu' : 'Đã đặt đủ cư dân'}</button></article>
      <article class="creature-card"><h4>🧳 Đón cư dân mới</h4><p>60 thức ăn · 20 gỗ / người. Người mới bắt đầu làm thực phẩm.</p><p class="creature-reason">${reason ?? 'Có thể đón thêm người vào đảo.'}</p><button data-creature="settler" ${reason ? 'disabled' : ''}>Chọn vị trí đón dân</button></article></div></section>
      <section class="creature-group"><h3>🐾 Động vật</h3><p>Mở nghiên cứu thuần hóa từng loài, đặt động vật hoang dã rồi cho ăn để tạo lòng tin.</p><div class="creature-grid">
      ${(['cattle', 'chicken', 'dog'] as AnimalSpecies[]).map(species => {
        const cfg = ANIMAL_CONFIG[species];
        const unlocked = gs.unlocks.has(`domesticate_${species}`);
        const count = island.animals.filter(a => a.isAlive && a.species === species).length;
        const locked = serverMode || !unlocked || count >= cfg.maxHerd;
        return `<article class="creature-card"><h4>${cfg.icon} ${cfg.name} <small>${count}/${cfg.maxHerd}</small></h4><p>${species === 'dog' ? 'Giúp cư dân cảm thấy an toàn.' : `Sản xuất ${cfg.produceName.toLowerCase()}, cần thức ăn để duy trì.`}</p><p class="creature-reason">${serverMode ? 'Động vật chưa hỗ trợ trên server thử nghiệm.' : !unlocked ? `Cần nghiên cứu ${species === 'chicken' ? 'Nuôi Gà' : `Thuần Hóa ${cfg.name}`}.` : count >= cfg.maxHerd ? 'Đã đạt giới hạn đàn.' : 'Đặt một con hoang dã miễn phí; cho ăn tốn 10 thức ăn/lần.'}</p><button data-creature="${species}" ${locked ? 'disabled' : ''}>Đặt ${cfg.name.toLowerCase()}</button></article>`;
      }).join('')}</div>
      ${island.animals.filter(a => a.isAlive && (a.status === 'wild' || a.status === 'taming')).map(a => `<div class="creature-feed-row"><span>${ANIMAL_CONFIG[a.species].icon} ${ANIMAL_CONFIG[a.species].name} · Lòng tin ${Math.min(100, Math.round(a.trust / ANIMAL_CONFIG[a.species].trustNeeded * 100))}%</span><button data-feed="${a.id}" ${island.sharedFood < 10 || serverMode ? 'disabled' : ''}>Cho ăn · 10 thức ăn</button></div>`).join('')}</section>`;
  }
}
