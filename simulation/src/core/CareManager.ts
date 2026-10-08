import {materialCapacity} from '../renderer/BuildingManager';
import {goodsCapacity} from './civilization';
import type {Island,NPC} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {storageSites} from './settlement';
import {findPath} from './pathfinding';
import {movementSteps} from './dailyLife';
export type DefenseKind='spear'|'padded_vest';
export const DEFENSE={spear:{name:'Giáo đá',wood:6,stone:4,cloth:0},padded_vest:{name:'Áo phòng vệ dệt',wood:0,stone:0,cloth:4}};
const adult=(n:NPC)=>n.isAlive&&n.position&&n.age>=18&&n.occupation!=='child';
export function treatmentLock(s:Island,n:NPC):string|null{return !adult(n)?'Chọn cư dân trưởng thành đã định cư.':!s.civilization?.unlocks.includes('herbalism')?'Cần nghiên cứu Y học thảo dược.':s.adaptationProcess?.npcId===n.id?'Đang được hỗ trợ tại viện.':n.clinicalCare?'Đang có lịch khám.':n.treatment?'Đang có liệu trình.':(n.health??100)>=90?'Sức khỏe từ90 trở lên; chưa cần liệu trình.':s.herbs<2?'Cần 2 thảo dược trong kho.':null;}
export function startTreatment(s:Island,id:string):string|null{const n=s.npcs.find(n=>n.id===id);if(!n)return 'Không tìm thấy cư dân.';const reason=treatmentLock(s,n);if(reason)return reason;n.treatment={paid:false,workTicks:0};return null;}
export function craftDefense(s:Island,kind:DefenseKind):string|null{
 if(!Object.prototype.hasOwnProperty.call(DEFENSE,kind))return 'Trang bị không hợp lệ.';s.defense??={version:1,stock:{spear:0,padded_vest:0},crafted:{spear:0,padded_vest:0}};if(s.defense.order)return 'Hoàn tất đơn phòng vệ trước.';
 if(!s.civilization?.unlocks.includes(kind==='spear'?'stone_tools':'textiles'))return kind==='spear'?'Cần Công cụ đá.':'Cần Trồng lanh và dệt vải.';
 const fee=DEFENSE[kind];if(s.wood<fee.wood||s.stone<fee.stone||(s.civilization.inventory.cloth??0)<fee.cloth)return 'Chưa đủ vật tư chế tạo.';
 const n=s.npcs.find(n=>adult(n)&&!n.exploring&&!n.researching&&!n.treatment&&!n.clinicalCare&&s.adaptationProcess?.npcId!==n.id&&!n.cargo&&!n.freight&&!n.haulTask&&!n.actionTarget&&s.equipment?.order?.workerId!==n.id&&!s.buildings.some(b=>b.workers.includes(n.id)));if(!n)return 'Cần người trưởng thành rảnh, đã giao xong hàng.';
 s.wood-=fee.wood;s.stone-=fee.stone;s.civilization.inventory.cloth-=fee.cloth;s.defense.order={kind,npcId:n.id,workTicks:0};return null;
}
export function chooseDefense(s:Island,id:string,kind:DefenseKind,equip:boolean):string|null{const n=s.npcs.find(n=>n.id===id);if(!n||!adult(n)||!Object.prototype.hasOwnProperty.call(DEFENSE,kind)||typeof equip!=='boolean')return 'Người hoặc trang bị không hợp lệ.';if(n.defenseChoice)return 'Đang tới kho lấy/trả trang bị.';const own=kind==='spear'?n.weapon:n.armor;if(equip&&own||!equip&&!own)return 'Trang bị đã ở trạng thái này.';if(equip&&!(s.defense?.stock[kind]))return 'Chưa có trang bị trong kho.';n.defenseChoice={kind,equip};return null;}
function arrive(s:Island,map:WorldMap,n:NPC,label:string):boolean{const routes=storageSites(s).flatMap(p=>{const path=findPath(map,n.position!.tileX,n.position!.tileY,p.x,p.y);return path===null?[]:[path];}).sort((a,b)=>a.length-b.length);const path=routes[0];n.laborMessage=path?label:'Không có đường tới kho · giữ yêu cầu';n.survivalBlocked=true;n.status='working';if(!path)return false;if(path.length){const p=path[Math.min(movementSteps(n,s),path.length)-1];n.position={tileX:p.x,tileY:p.y};n.path=undefined;return false;}return true;}
export function tickCare(s:Island,map:WorldMap):void{
 const order=s.defense?.order;if(order){const n=s.npcs.find(n=>n.id===order.npcId);if(n&&adult(n)&&!n.survivalBlocked&&!n.exploring&&!n.researching&&!n.treatment&&!n.clinicalCare&&s.adaptationProcess?.npcId!==n.id&&!n.cargo&&!n.freight&&!s.buildings.some(b=>b.workers.includes(n.id))&&arrive(s,map,n,`Chế tạo ${DEFENSE[order.kind].name}`)){order.workTicks++;if(order.workTicks>=5){s.defense!.stock[order.kind]++;s.defense!.crafted[order.kind]++;s.defense!.order=undefined;}}}
 for(const n of s.npcs){if(!adult(n)||n.survivalBlocked)continue;
  if(n.treatment){if((n.health??100)>=100){n.treatment=undefined;continue;}if(n.needs.hunger>=80)continue;if(!arrive(s,map,n,'Đang tới kho chữa bằng thảo dược'))continue;const a=n.treatment;if(!a.paid){if(s.herbs<2){n.laborMessage='Chờ 2 thảo dược';continue;}s.herbs-=2;a.paid=true;n.herbalDoses=(n.herbalDoses??0)+1;}n.health=Math.min(100,(n.health??100)+5);a.workTicks++;n.laborMessage=`Đắp thuốc thảo dược ${a.workTicks}/4 · +5 sức khỏe`;if(a.workTicks>=4)n.treatment=undefined;continue;}
  const choice=n.defenseChoice;if(!choice)continue;if(!arrive(s,map,n,'Đang tới kho lấy/trả phòng vệ'))continue;const gear=s.defense;if(!gear){n.defenseChoice=undefined;continue;}if(choice.equip){if(gear.stock[choice.kind]<=0){n.equipmentMessage='Trang bị đã được người khác lấy; chọn lại.';n.defenseChoice=undefined;continue;}gear.stock[choice.kind]--;if(choice.kind==='spear')n.weapon='spear';else n.armor='padded_vest';}else{if(choice.kind==='spear'){if(n.weapon)gear.stock.spear++;n.weapon=undefined;}else{if(n.armor)gear.stock.padded_vest++;n.armor=undefined;}}n.defenseChoice=undefined;
 }
}

export function cancelDefense(s:Island):string|null{const a=s.defense?.order;if(!a||!s.civilization)return 'Không có đơn phòng vệ.';const fee=DEFENSE[a.kind];if(s.wood+fee.wood>materialCapacity(s)||s.stone+fee.stone>materialCapacity(s)||s.civilization.inventory.cloth+fee.cloth>goodsCapacity(s))return 'Kho đầy; giải phóng chỗ để hoàn vật tư.';s.wood+=fee.wood;s.stone+=fee.stone;s.civilization.inventory.cloth+=fee.cloth;s.defense!.order=undefined;return null;}
