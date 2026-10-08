import {workMultiplier} from './FaithManager';
import type {Island,NPC,ToolKind} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {findPath} from './pathfinding';
import {storageSites,CARGO_LIMIT} from './settlement';
import {movementSteps} from './dailyLife';
import {materialCapacity} from '../renderer/BuildingManager';
export const TOOLS:Record<ToolKind,{name:string;wood:number;stone:number;multiplier:number}>={
 axe:{name:'Rìu đá',wood:4,stone:3,multiplier:1.75},
 pickaxe:{name:'Cuốc đá',wood:4,stone:3,multiplier:1.75},
 fishing_rod:{name:'Cần câu',wood:5,stone:1,multiplier:1.2},
};
export function initializeEquipment(island:Island):void {
 island.equipment??={version:1,stock:{axe:0,pickaxe:0,fishing_rod:0},crafted:{axe:0,pickaxe:0,fishing_rod:0}};
 for(const n of island.npcs)n.toolChoice??='auto';
}
export function cargoUsed(npc:NPC):number {return (npc.cargo?Object.values(npc.cargo).reduce((s,n)=>s+n,0):0)+(npc.freight?.amount??0);}
export function bagSummary(npc:NPC):string {
 const cargo=npc.cargo,items=npc.freight?`${npc.freight.amount.toFixed(1)} ${npc.freight.good}`:cargo?`${cargo.food.toFixed(1)} thức ăn · ${cargo.wood.toFixed(1)} gỗ · ${cargo.stone.toFixed(1)} đá · ${cargo.herbs.toFixed(1)} thảo dược`:'Túi trống';
 return `Túi vận chuyển ${cargoUsed(npc).toFixed(1)}/${CARGO_LIMIT} · ${items}${cargo?` · ${npc.laborMessage??'Chờ giao hàng'}`:''}`;
}
function freeAdult(island:Island,npc:NPC):boolean {
 return island.adaptationProcess?.npcId!==npc.id&&npc.isAlive&&!!npc.position&&npc.age>=18&&npc.occupation!=='child'&&!npc.cargo&&!npc.freight&&!npc.haulTask&&!npc.actionTarget&&!npc.exploring&&!npc.researching&&!island.buildings.some(b=>b.workers.includes(npc.id));
}
export function startToolCraft(island:Island,kind:ToolKind):string|null {
 if(!island.equipment||!Object.prototype.hasOwnProperty.call(TOOLS,kind))return 'Công cụ không hợp lệ.';
 if(island.equipment.order)return 'Hoàn thành đơn chế tạo đang có trước.';
 if(!island.civilization?.unlocks.includes('stone_tools'))return 'Cần nghiên cứu Công cụ đá để chế tạo.';
 const cost=TOOLS[kind];if(island.wood<cost.wood||island.stone<cost.stone)return 'Chưa đủ gỗ/đá để chế tạo.';
 const worker=island.npcs.filter(n=>freeAdult(island,n)).sort((a,b)=>(a.laborRole==='idle'?0:1)-(b.laborRole==='idle'?0:1)||a.id.localeCompare(b.id))[0];
 if(!worker)return 'Cần một người trưởng thành rảnh, đã giao xong hàng.';
 island.wood-=cost.wood;island.stone-=cost.stone;island.equipment.order={kind,workerId:worker.id,workTicks:0};return null;
}
export function cancelToolCraft(island:Island):string|null {
 const order=island.equipment?.order;if(!order)return 'Không có đơn chế tạo.';
 const cost=TOOLS[order.kind];if(island.wood+cost.wood>materialCapacity(island)||island.stone+cost.stone>materialCapacity(island))return 'Kho vật liệu đầy; cần chỗ trống để hoàn gỗ/đá.';
 island.wood+=cost.wood;island.stone+=cost.stone;island.equipment!.order=undefined;return null;
}
function routeToStock(island:Island,map:WorldMap,npc:NPC){
 return storageSites(island).flatMap(d=>{const path=findPath(map,npc.position!.tileX,npc.position!.tileY,d.x,d.y);return path===null?[]:[path];}).sort((a,b)=>a.length-b.length)[0];
}
export function tickToolCraft(island:Island,map:WorldMap):void {
 const gear=island.equipment,order=gear?.order;if(!gear||!order)return;
 const n=island.npcs.find(n=>n.id===order.workerId);if(!n||!freeAdult(island,n)||n.survivalBlocked)return;
 const path=routeToStock(island,map,n);if(!path){n.equipmentMessage='Chế tạo tạm dừng · không có đường đến kho/lửa';return;}
 n.equipmentMessage=undefined;
 n.survivalBlocked=true;n.status='working';
 if(path.length){const next=path[Math.min(movementSteps(n,island),path.length)-1];n.position={tileX:next.x,tileY:next.y};n.laborMessage='Đang đến điểm chứa để chế tạo';return;}
 n.laborMessage=`Chế tạo ${TOOLS[order.kind].name} · ${order.workTicks+1}/5`;
 order.workTicks+=workMultiplier(island,n);
 if(order.workTicks>=5){gear.stock[order.kind]++;gear.crafted[order.kind]++;gear.order=undefined;n.laborMessage='Công cụ đã hoàn thành và nhập kho';}
}
function desiredTool(island:Island,n:NPC):ToolKind|undefined {
 if(n.toolChoice&&n.toolChoice!=='auto')return n.toolChoice==='none'?undefined:n.toolChoice;
 const b=island.buildings.find(b=>b.workers.includes(n.id)&&b.complete&&!b.upgrade);
 return b?.type==='fishing_dock'?'fishing_rod':b?.type==='lumbercamp'?'axe':b?.type==='mine'?'pickaxe':n.laborRole==='wood'?'axe':n.laborRole==='stone'?'pickaxe':n.laborRole==='food'&&n.lastAction==='fish'?'fishing_rod':undefined;
}
export function tickEquipment(island:Island,map:WorldMap):void {
 const gear=island.equipment;if(!gear)return;
 for(const n of island.npcs){
  n.toolChoice??='auto';
  if(!n.isAlive||!n.position||n.age<18||n.occupation==='child'||n.cargo||n.freight||n.haulTask||n.actionTarget||n.researching||n.survivalBlocked||gear.order?.workerId===n.id)continue;
  const b=island.buildings.find(b=>b.workers.includes(n.id));
  if(b&&(!b.complete||b.upgrade||b.shipment||!['lumbercamp','mine','fishing_dock'].includes(b.type)||(n.buildingWork?.ticks??0)%5!==0))continue;
  const desired=desiredTool(island,n);if(desired===n.equippedTool){n.equipmentMessage=desired?`Đang dùng ${TOOLS[desired].name}`:'Không dùng công cụ';continue;}
  const available=desired&&gear.stock[desired]>0;
  if(desired&&!available&&!n.equippedTool){n.equipmentMessage=`Chờ ${TOOLS[desired].name} trong kho · vẫn làm việc`;continue;}
  if(desired&&!available&&n.toolChoice!=='auto'){n.equipmentMessage=`Chờ ${TOOLS[desired].name} · giữ công cụ hiện tại`;continue;}
  const path=routeToStock(island,map,n);if(!path){n.equipmentMessage='Không có đường đến điểm chứa công cụ';continue;}
  n.survivalBlocked=true;n.status='working';n.laborMessage='Đang đến kho lấy/trả công cụ';
  if(path.length){const next=path[Math.min(movementSteps(n,island),path.length)-1];n.position={tileX:next.x,tileY:next.y};n.path=undefined;continue;}
  if(n.equippedTool)gear.stock[n.equippedTool]++;
  n.equippedTool=undefined;
  if(desired&&gear.stock[desired]>0){gear.stock[desired]--;n.equippedTool=desired;}
  n.equipmentMessage=n.equippedTool?`Đã lấy ${TOOLS[n.equippedTool].name}`:'Đã trả công cụ vào kho';
 }
}
/** Research and personal tools overlap; never multiply both bonuses. */
export function harvestToolMultiplier(island:Island,n:NPC,action:string):number {
 const matching=action==='chop_wood'?'axe':action==='gather_stone'?'pickaxe':action==='fish'?'fishing_rod':undefined;
 const research=matching&&matching!=='fishing_rod'&&island.civilization?.unlocks.includes('stone_tools')?1.5:1;
 return Math.max(research,matching&&n.equippedTool===matching?TOOLS[matching].multiplier:1);
}
