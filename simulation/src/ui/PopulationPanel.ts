import {logisticsHTML} from './LogisticsPanel';
import {characterPortrait} from '../renderer/CharacterTextures';
// ============================================================
// PopulationPanel.ts — Sprint 4: Labor assignment UI
// ============================================================

import type { Island, NPC, LaborRole } from '../core/types';
import { BUILD_LABELS, assignWorker, removeWorker, maxBuildingWorkers, buildingLevel } from '../renderer/BuildingManager';
import { estimateDailyFoodDemand } from '../core/labor';
import type { PlayerCommand } from '../core/SimulationSession';
import { STARTER_OUTPUT } from '../core/settlement';
import {attributes,workforceSummary} from '../core/workforce';
import {TOOLS} from '../core/equipment';
import {inventoryHTML} from './NpcInventory';

export class PopulationPanel {
  private equipmentNotice='';
  
  renderHTML(island: Island, serverMode = false): string {
    const alive = island.npcs.filter(n => n.isAlive);
    const occupations:Record<string,string>={farmer:'Nông dân',gatherer:'Hái lượm',warrior:'Chiến binh',elder:'Trưởng lão',craftsman:'Thợ',child:'Trẻ nhỏ'};
    
    // Group buildings by type for the dropdowns
    const availableBuildings = island.buildings.filter(b => maxBuildingWorkers(b) > 0);
    const assignedToBuilding = new Set(island.buildings.flatMap(building => building.workers));
    const countRole = (role: LaborRole) => alive.filter(npc => npc.laborRole === role && npc.age >= 18 && !assignedToBuilding.has(npc.id)).length;
    const foodDemand = estimateDailyFoodDemand(alive);
    const output=island.dailyLife?.settlementVersion===1?STARTER_OUTPUT:{food:10,wood:3,stone:2};
    const laborOptions = [
      ['food', '🍖 Thực phẩm'],
      ['wood', '🪵 Gỗ'],
      ['stone', '🪨 Đá'],
      ...(island.logistics?[['haul','Vận chuyển'] as [LaborRole,string]]:[]),
      ['idle', '⏸ Nghỉ'],
    ] as const;

    let html = `
      ${!serverMode&&island.workforce?`<div class="workforce-controls"><label><input type="checkbox" id="auto-claim-toggle" ${island.workforce.enabled?'checked':''}> Tự nhận việc khi rảnh</label><p id="workforce-summary">${workforceSummary(island)}</p><p>Chọn nghề bằng tay sẽ khóa nghề đó. Chọn “Tự động” để giao lại quyền phân công. Công trình sản xuất hoàn thành có thể tự nhận người; không lấy người bạn đã chỉ định hoặc đang xây, nghiên cứu hay vận chuyển; lệnh trực tiếp luôn được giữ.</p></div>`:''}
      ${!serverMode&&island.logistics?`<section class="equipment-controls" id="logistics-overview">${logisticsHTML(island)}</section>`:''}${!serverMode&&island.equipment?`<section class="equipment-controls"><h3>Kho công cụ</h3><p>Nghiên cứu Công cụ đá, dành một người trưởng thành rảnh để chế tạo tại kho/lửa trong 5 bước làm việc. Công cụ không hao mòn trong phiên bản này.</p><div class="tool-recipes">${Object.entries(TOOLS).map(([kind,tool])=>`<div><strong>${tool.name}</strong><span>Trong kho: <b data-tool-stock="${kind}">${island.equipment!.stock[kind as keyof typeof TOOLS]}</b></span><small>${tool.wood} gỗ · ${tool.stone} đá</small><button data-craft-tool="${kind}" ${!island.civilization?.unlocks.includes('stone_tools')||island.equipment!.order||island.wood<tool.wood||island.stone<tool.stone?'disabled':''}>Chế tạo</button></div>`).join('')}</div><p id="tool-craft-status">${island.equipment.order?`Đang chế tạo ${TOOLS[island.equipment.order.kind].name} · ${island.equipment.order.workTicks}/5`:'Chưa có đơn chế tạo'}</p>${island.equipment.order?`<label>Người chế tạo <select id="tool-craft-worker">${alive.filter(n=>n.position&&n.age>=18&&n.occupation!=='child').map(n=>`<option value="${n.id}" ${n.id===island.equipment!.order!.workerId?'selected':''}>${n.name.split('#')[0]}</option>`).join('')}</select></label><button id="cancel-tool-craft">Hủy và hoàn gỗ/đá</button>`:''}<p>Rìu/cuốc: hiệu quả 1,75 lần, thay bonus nghiên cứu 1,5 lần. Cần câu: +20% cá. Chỉ có tác dụng khi dùng đúng việc.</p></section>`:''}
      <div style="margin-bottom: 10px; font-size: 13px; color: var(--t-mid); line-height:1.5;">
        ${serverMode
          ? 'Chọn ưu tiên để cư dân tự đi tìm tài nguyên và thu hoạch. Công trình chưa hỗ trợ trong chế độ trực tuyến.'
          : island.dailyLife ? 'Dân làm việc ban ngày, về ăn tối và nghỉ ban đêm. Mỗi lượt thu hoạch cần 5 bước lao động tại nguồn; ăn/ngủ giữ nguyên tiến độ. Ưu tiên thực phẩm để tạo dự trữ trước khi đón thêm dân.' : 'Chọn ưu tiên để cư dân tự đi tìm tài nguyên và thu hoạch. Mỗi lượt cần đi đến nơi rồi làm việc trong 1 ngày; sản lượng phụ thuộc đường đi và lượng tài nguyên còn lại. Lệnh trực tiếp được ưu tiên trước.'}
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;padding:10px;background:rgba(0,0,0,.18);border-radius:8px;font-size:12px;">
        <span>🍖 ${countRole('food')} người · ${output.food} thức ăn/lượt</span>
        <span>🪵 ${countRole('wood')} người · ${output.wood} gỗ/lượt</span>
        <span>🪨 ${countRole('stone')} người · ${output.stone} đá/lượt</span>
        <strong>Tiêu thụ ước tính ${foodDemand.toFixed(1)} thức ăn/ngày</strong>
      </div>
      <div class="pop-table" style="display: flex; flex-direction: column; gap: 8px;">
    `;

    if (alive.length === 0) {
      return html + `<div style="color:var(--c-red);">Không còn ai sống sót.</div></div>`;
    }

    // Header
    html += `
      <div class="pop-header" style="display:grid;grid-template-columns:30px minmax(60px,1fr) 42px 72px minmax(105px,1fr) minmax(95px,.9fr);gap:5px;padding-bottom:8px;border-bottom:1px solid var(--c-border);color:var(--t-lo);font-size:11px;font-weight:bold;">
        <div style="text-align:center;">👤</div><div>Tên</div><div>Tuổi</div><div>Nghề</div><div>Ưu tiên</div><div>Công trình</div>
      </div>
    `;

    for (const npc of alive) {
      // Find where this NPC is currently working
      const currentBuilding = island.buildings.find(b => b.workers.includes(npc.id));
      const currentBuildingId = currentBuilding ? currentBuilding.id : '';

      // Build options for select
      let optionsHtml = `<option value="">-- Tự do --</option>`;
      for (const b of availableBuildings) {
        const isSelected = b.id === currentBuildingId ? 'selected' : '';
        // If not selected, check if building is full
        let disabled = '';
        if (!isSelected && b.workers.length >= maxBuildingWorkers(b)) {
          disabled = 'disabled';
        }
        
        const label = `${BUILD_LABELS[b.type]} C${buildingLevel(b)} ${!b.complete ? '· đang xây' : b.upgrade ? '· nâng cấp' : ''} [${b.workers.length}/${maxBuildingWorkers(b)}]`;
        optionsHtml += `<option value="${b.id}" ${isSelected} ${disabled}>${label}</option>`;
      }

      const avatar = characterPortrait(npc,island.civilization?.era??'stone');
      html += `
        <div class="pop-row" style="display:grid;grid-template-columns:30px minmax(60px,1fr) 42px 72px minmax(105px,1fr) minmax(95px,.9fr);gap:5px;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:12px;">
          <div style="text-align:center;font-size:17px;">${avatar}</div>
          <div style="color:var(--t-hi);overflow:hidden;text-overflow:ellipsis;"><strong>${npc.name.split('#')[0]}</strong><small class="labor-status" data-labor-status="${npc.id}" style="display:block;font-size:10px;color:var(--t-mid);white-space:normal;">${npc.laborMessage ?? (npc.position ? 'Đang tìm nơi làm việc' : 'Chưa được đặt lên đảo')}</small><small class="auto-reason" data-auto-reason="${npc.id}">${npc.laborMode==='auto'?npc.autoReason??'Tự nhận việc khi rảnh':'Nghề do bạn chọn'}</small><small class="npc-attributes" title="Sức mạnh: gỗ/đá · Khéo léo: thực phẩm/câu cá · Trí tuệ: nghiên cứu. Bonus tối đa 20%.">STR ${attributes(npc).str} · DEX ${attributes(npc).dex} · INT ${attributes(npc).int}</small></div>
          <div style="color:var(--t-mid);">${Math.floor(npc.age)}</div>
          <div style="color:var(--t-mid);overflow:hidden;text-overflow:ellipsis;">${occupations[npc.occupation]??npc.occupation}</div>
          <div>
            ${!serverMode&&island.workforce&&npc.age>=18&&npc.occupation!=='child'?`<select class="labor-mode-select" data-npc="${npc.id}" aria-label="Chế độ làm việc ${npc.name.split('#')[0]}"><option value="auto" ${npc.laborMode==='auto'?'selected':''}>Tự động</option><option value="manual" ${npc.laborMode!=='auto'?'selected':''}>Bạn chọn nghề</option></select>`:''}
            ${npc.occupation === 'child' || npc.age < 18 
              ? `<span style="color:var(--t-lo)">Chưa đến tuổi lao động</span>` 
              : `
              <select class="labor-role-select" data-npc="${npc.id}" style="width:100%;padding:5px 2px;background:rgba(0,0,0,.3);border:1px solid var(--c-border);color:var(--t-hi);border-radius:4px;outline:none;font-size:11px;">
                ${laborOptions.map(([value, label]) => `<option value="${value}" ${npc.laborRole === value ? 'selected' : ''}>${label}</option>`).join('')}
              </select>`}
          </div>
          <div>
            ${npc.occupation === 'child' || npc.age < 18
              ? `<span style="color:var(--t-lo)">—</span>`
              : `
              <select class="building-select" data-npc="${npc.id}" style="width:100%;padding:5px 2px;background:rgba(0,0,0,.3);border:1px solid var(--c-border);color:var(--t-hi);border-radius:4px;outline:none;font-size:11px;">
                ${optionsHtml}
              </select>
            `}
          </div>
        </div>
      `;
    }

    html += `</div>${!serverMode&&island.equipment?`<section class="equipment-people"><h3>Túi và trang bị</h3><p>Túi mang nguyên liệu và hàng chế biến, tổng 30 đơn vị; khẩu phần riêng và ô công cụ tách riêng. Công cụ được lấy/trả tại kho khi rảnh.</p>${alive.map(n=>`<article class="equipment-person"><strong>${n.name.split('#')[0]}</strong><div data-inventory="${n.id}">${inventoryHTML(n)}</div><p data-divine="${n.id}">${n.divineState==='blessed'?'Ban Phước · làm việc +50%':n.divineState==='exhausted'?'Kiệt sức · làm việc −50%':''}</p><p data-equipped="${n.id}">${n.equippedTool?TOOLS[n.equippedTool].name:'Chưa có công cụ'} · ${n.equipmentMessage??'Chờ lấy công cụ khi có trong kho'}</p>${n.age>=18&&n.occupation!=='child'?`<label>Công cụ <select class="tool-choice" data-npc="${n.id}"><option value="auto" ${n.toolChoice==='auto'||!n.toolChoice?'selected':''}>Tự lấy theo nghề</option><option value="none" ${n.toolChoice==='none'?'selected':''}>Không dùng · trả vào kho</option>${Object.entries(TOOLS).map(([kind,tool])=>`<option value="${kind}" ${n.toolChoice===kind?'selected':''}>${tool.name} · bạn chọn</option>`).join('')}</select></label>`:'Trẻ nhỏ chưa dùng công cụ'}</article>`).join('')}</section>`:''}`;
    return html;
  }

  bindEvents(
    container: HTMLElement,
    island: Island,
    onRefresh: () => void,
    submitLaborRole: (npcId: string, role: LaborRole) => boolean | Promise<boolean>,
    serverMode = false,
    submitBuilding?: (command: PlayerCommand) => boolean,
  ): void {
    container.querySelectorAll<HTMLButtonElement>('[data-craft-tool]').forEach(button=>button.addEventListener('click',()=>{const ok=submitBuilding?.({type:'craft_tool',kind:button.dataset.craftTool as keyof typeof TOOLS});this.equipmentNotice=ok?'':'Chưa thể chế tạo. Kiểm tra vật liệu và dành một người rảnh đã giao xong hàng.';onRefresh();this.updateStatuses(container,island);}));
    container.querySelector('#cancel-tool-craft')?.addEventListener('click',()=>{this.equipmentNotice=submitBuilding?.({type:'cancel_tool_craft'})?'Đã hủy đơn và hoàn gỗ/đá.':'Kho cần chỗ trống để hoàn vật liệu.';onRefresh();this.updateStatuses(container,island);});
    container.querySelector<HTMLSelectElement>('#tool-craft-worker')?.addEventListener('change',event=>{submitBuilding?.({type:'assign_tool_crafter',npcId:(event.target as HTMLSelectElement).value});onRefresh();});
    container.querySelectorAll<HTMLSelectElement>('.tool-choice').forEach(select=>select.addEventListener('change',()=>{submitBuilding?.({type:'choose_tool',npcId:select.dataset.npc!,choice:select.value as 'auto'|'none'|keyof typeof TOOLS});onRefresh();}));
    container.querySelector<HTMLInputElement>('#auto-claim-toggle')?.addEventListener('change',event=>{
      submitBuilding?.({type:'set_auto_claim',enabled:(event.target as HTMLInputElement).checked});onRefresh();
    });
    container.querySelectorAll<HTMLSelectElement>('.labor-mode-select').forEach(select=>select.addEventListener('change',()=>{
      submitBuilding?.({type:'set_labor_mode',npcId:select.dataset.npc!,mode:select.value as 'auto'|'manual'});onRefresh();
    }));
    const roleSelects = container.querySelectorAll<HTMLSelectElement>('.labor-role-select');
    roleSelects.forEach(select => {
      select.addEventListener('change', () => {
        const npc = island.npcs.find(item => item.id === select.dataset.npc);
        if (!npc) return;
        const role = select.value as LaborRole;
        select.disabled = true;
        void Promise.resolve(submitLaborRole(npc.id, role)).then(accepted => {
          if (!accepted) select.value = npc.laborRole;
          else onRefresh();
        }).catch(error => {
          select.value = npc.laborRole;
          console.error('[population] labor command failed:', error);
        }).finally(() => { select.disabled = false; });
      });
    });

    const selects = container.querySelectorAll<HTMLSelectElement>('.building-select');
    selects.forEach(select => {
      if (serverMode) {
        select.disabled = true;
        select.title = 'Phân công công trình sẽ được kết nối trong sprint server tiếp theo.';
        return;
      }
      select.addEventListener('change', (e) => {
        const npcId = select.dataset.npc!;
        const newBuildingId = select.value;

        if (newBuildingId) { if (submitBuilding) submitBuilding({type:'assign_worker',buildingId:newBuildingId,npcId}); else assignWorker(island,newBuildingId,npcId); }
        else for (const b of island.buildings) { if (b.workers.includes(npcId) && submitBuilding) submitBuilding({type:'remove_worker',buildingId:b.id,npcId}); else removeWorker(island,b.id,npcId); }

        // Re-render UI to update capacities
        onRefresh();
      });
    });
  }

  updateStatuses(container: HTMLElement, island: Island): void {
    const logistics=container.querySelector('#logistics-overview');if(logistics){const markup=logisticsHTML(island);if(logistics.innerHTML!==markup)logistics.innerHTML=markup;}
    container.querySelectorAll<HTMLElement>('[data-divine]').forEach(el=>{const n=island.npcs.find(n=>n.id===el.dataset.divine);el.textContent=n?.divineState==='blessed'?'Ban Phước · làm việc +50%':n?.divineState==='exhausted'?'Kiệt sức · làm việc −50%':'';});
    if(island.equipment){
      container.querySelectorAll<HTMLElement>('[data-tool-stock]').forEach(el=>el.textContent=String(island.equipment!.stock[el.dataset.toolStock as keyof typeof TOOLS]));
      const order=island.equipment.order,status=container.querySelector('#tool-craft-status');if(status)status.textContent=order?`${TOOLS[order.kind].name} · ${order.workTicks}/5 · ${island.npcs.find(n=>n.id===order.workerId)?.equipmentMessage?.includes('không có đường')?'Không có đường đến điểm chứa':island.npcs.find(n=>n.id===order.workerId)?.laborMessage??'Chờ người chế tạo'}`:this.equipmentNotice||'Chưa có đơn chế tạo';
      const cancel=container.querySelector<HTMLElement>('#cancel-tool-craft'),worker=container.querySelector<HTMLElement>('#tool-craft-worker');if(cancel)cancel.hidden=!order;if(worker?.parentElement)worker.parentElement.hidden=!order;
      container.querySelectorAll<HTMLElement>('[data-inventory]').forEach(el=>{const n=island.npcs.find(n=>n.id===el.dataset.inventory);if(n){const markup=inventoryHTML(n);if(el.innerHTML!==markup)el.innerHTML=markup;}});
      container.querySelectorAll<HTMLElement>('[data-equipped]').forEach(el=>{const n=island.npcs.find(n=>n.id===el.dataset.equipped);if(n)el.textContent=`${n.equippedTool?TOOLS[n.equippedTool].name:'Chưa có công cụ'} · ${n.equipmentMessage??'Chờ lấy công cụ'}`;});
      container.querySelectorAll<HTMLButtonElement>('[data-craft-tool]').forEach(b=>{const t=TOOLS[b.dataset.craftTool as keyof typeof TOOLS];b.disabled=!!order||!island.civilization?.unlocks.includes('stone_tools')||island.wood<t.wood||island.stone<t.stone;});
    }
    const summary=container.querySelector('#workforce-summary');if(summary)summary.textContent=workforceSummary(island);
    container.querySelectorAll<HTMLElement>('[data-auto-reason]').forEach(el=>{const npc=island.npcs.find(n=>n.id===el.dataset.autoReason);if(npc)el.textContent=npc.laborMode==='auto'?npc.autoReason??'Tự nhận việc khi rảnh':'Nghề do bạn chọn';});
    container.querySelectorAll<HTMLSelectElement>('.labor-role-select').forEach(el=>{const npc=island.npcs.find(n=>n.id===el.dataset.npc);if(npc&&el!==document.activeElement)el.value=npc.laborRole;});
    container.querySelectorAll<HTMLElement>('[data-labor-status]').forEach(el => {
      const npc = island.npcs.find(n => n.id === el.dataset.laborStatus);
      if (npc) el.textContent = npc.laborMessage ?? 'Đang tìm nơi làm việc';
    });
  }
}
