import {GOOD_LABELS} from '../core/logistics';
import type {NPC} from '../core/types';
import {cargoUsed, TOOLS} from '../core/equipment';
import {iconHTML} from './GameIcons';

const GOODS = [
  ['wood', 'Gỗ'], ['stone', 'Đá'], ['food', 'Thức ăn'], ['herbs', 'Thảo dược'],
] as const;
const number = (value:number) => Number(value.toFixed(1)).toString();

/** Show only items actually owned by this resident, never the shared stock. */
export function inventoryHTML(npc:NPC):string {
  const tool = npc.equippedTool;
  const toolIcon = tool === 'pickaxe' ? 'pickaxe' : tool === 'fishing_rod' ? 'fishing-rod' : 'axe';
  return `<div class="npc-inventory">
    <div class="inventory-heading">Trang bị <small>Công cụ · vũ khí · áo</small></div>
    <div class="inventory-equipment"><div class="inventory-item">
      <div class="inventory-slot ${tool?'':'is-empty'}" aria-label="${tool?TOOLS[tool].name:'Ô công cụ trống'}">${tool?iconHTML(toolIcon):'<span class="inventory-empty">＋</span>'}</div>
      <span>${tool?TOOLS[tool].name:'Công cụ trống'}</span>
    </div><div class="inventory-item"><div class="inventory-slot ${npc.weapon?'':'is-empty'}">${npc.weapon?iconHTML('spear'):'＋'}</div><span>${npc.weapon?'Giáo đá':'Vũ khí trống'}</span></div><div class="inventory-item"><div class="inventory-slot ${npc.armor?'':'is-empty'}">${npc.armor?iconHTML('padded-vest'):'＋'}</div><span>${npc.armor?'Áo phòng vệ':'Áo trống'}</span></div></div>
    ${npc.torch?`<p class="inventory-ration">${iconHTML('torch')} Đuốc: ${npc.torch.fuel}/30 nhiên liệu · lấy/trả/tiếp trong Nhiệm vụ</p>`:''}
    <div class="inventory-heading">Túi đồ <small>${number(cargoUsed(npc))}/30</small></div>
    <div class="inventory-grid">${GOODS.map(([kind,label])=>{
      const quantity=(npc.cargo?.[kind]??0)+(npc.freight?.good===kind?npc.freight.amount:0);
      return `<div class="inventory-item"><div class="inventory-slot ${quantity>0?'':'is-empty'}" data-cargo-kind="${kind}" data-quantity="${quantity}" aria-label="${label}: ${number(quantity)}">${iconHTML(kind)}<b class="inventory-quantity">${number(quantity)}</b></div><span>${label}</span></div>`;
    }).join('')}${npc.freight&&!GOODS.some(([kind])=>kind===npc.freight!.good)?`<div class="inventory-item"><div class="inventory-slot" aria-label="${GOOD_LABELS[npc.freight.good]}: ${number(npc.freight.amount)}">${iconHTML(({copperOre:'copper-ore',ironOre:'iron-ore'} as Record<string,string>)[npc.freight.good]??npc.freight.good)}<b class="inventory-quantity">${number(npc.freight.amount)}</b></div><span>${GOOD_LABELS[npc.freight.good]}</span></div>`:''}</div>
    <p class="inventory-ration">Khẩu phần riêng: ${number(npc.privateFood)} thức ăn</p>
  </div>`;
}
