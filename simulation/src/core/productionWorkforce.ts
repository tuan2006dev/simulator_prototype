import {powerStatus} from './PowerManager';
import {needsReserve} from './reserves';
import {storageSites} from './settlement';
import type {Island,Building,NPC,LogisticsGood} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {findPath} from './pathfinding';
import {RECIPES,OUTPUTS,GOOD_LABELS,outputRoom,warehouseAmount,sumStock} from './logistics';
import {assignWorker,removeWorker,maxBuildingWorkers} from '../renderer/BuildingManager';
import {estimateFoodDays} from './labor';
const SOURCES:Partial<Record<Building['type'],string>>={lumbercamp:'wood_tree',mine:'stone_deposit',copper_mine:'copper_vein',clay_pit:'clay_deposit',iron_mine:'iron_vein',coal_mine:'coal_deposit',fishing_dock:'fish_spot'};
export const productive=(b:Building)=>!!(RECIPES[b.type]||OUTPUTS[b.type]||b.type==='fishing_dock');
const reachable=(map:WorldMap,n:NPC,b:Building)=>!!n.position&&findPath(map,n.position.tileX,n.position.tileY,b.tileX,b.tileY)!==null;
function sourceAlive(island:Island,b:Building):boolean{const type=SOURCES[b.type];return !type||[...island.resources].some(([key,n])=>{const [x,y]=key.split(',').map(Number);return n.type===type&&n.amount>0&&Math.max(Math.abs(x-b.tileX),Math.abs(y-b.tileY))<=3;});}
function supplied(island:Island,good:LogisticsGood):boolean{return warehouseAmount(island,good)>0||island.buildings.some(b=>(b.buffer?.output[good]??0)>0)||island.npcs.some(n=>n.isAlive&&n.freight?.good===good);}
function supplyRoute(island:Island,map:WorldMap,b:Building,good:LogisticsGood):boolean{return warehouseAmount(island,good)>0&&storageSites(island).some(p=>findPath(map,b.tileX,b.tileY,p.x,p.y)!==null)||island.buildings.some(source=>(source.buffer?.output[good]??0)>0&&findPath(map,b.tileX,b.tileY,source.tileX,source.tileY)!==null)||island.npcs.some(n=>n.isAlive&&n.position&&n.freight?.good===good&&n.freight.target===b.id&&findPath(map,n.position.tileX,n.position.tileY,b.tileX,b.tileY)!==null);}
function canRun(island:Island,b:Building,map?:WorldMap):boolean{const r=RECIPES[b.type];return b.productionQuota!==0&&(b.type!=='relic_extractor'||b.relicEnabled!==false&&(island.eldritchSource?.contamination??100)<60&&(island.eldritchSource?.charge??0)>=1)&&(b.type!=='spirit_extractor'||b.spiritEnabled!==false&&(island.spiritVein?.stability??0)>=30&&(island.spiritVein?.charge??0)>=2)&&sourceAlive(island,b)&&outputRoom(island,b)>=(r?.yield??1)&&(!r||Object.keys(r.inputs).every(k=>(b.buffer?.input[k as LogisticsGood]??0)>=(r.inputs[k as LogisticsGood]??0)||(map?supplyRoute(island,map,b,k as LogisticsGood):supplied(island,k as LogisticsGood))));}
export function productionAlert(island:Island,b:Building,map?:WorldMap):string{
 if(!b.complete||b.upgrade)return b.workers.length?'Thợ đang xây/nâng cấp · chưa sản xuất':'Cần bạn phân công thợ xây/nâng cấp';
 if(b.type==='steam_generator')return powerStatus(island,b);
 if(!productive(b))return '';
 if(b.type==='relic_extractor'&&b.relicEnabled!==false&&b.relicSafety&&(b.relicSafetyBatches??0)<=0&&(b.buffer?.input.biomatter??0)<1)return 'Thiếu sinh chất tại trạm · chờ giao để lọc mẫu';
 if(b.type==='relic_extractor'&&(b.relicEnabled===false||(island.eldritchSource?.contamination??100)>=60||(island.eldritchSource?.charge??0)<1))return b.relicEnabled===false?'Di tích nghỉ · giữ mẫu':'Nhiễm cao/nguồn cạn · kiểm soát hoặc cho nghỉ';
 if(b.type==='spirit_extractor'&&(b.spiritEnabled===false||(island.spiritVein?.stability??0)<30||(island.spiritVein?.charge??0)<2))return b.spiritEnabled===false?'Cho mạch nghỉ · hồi tự nhiên':'Mạch yếu/cạn · chờ hồi ổn định và trữ lượng';
 if(b.productionQuota===0)return 'Đã đủ định mức · tự dừng, thành phẩm vẫn cần vận chuyển';
 if(['prototype_workshop','component_factory','microchip_factory','control_center','spirit_refinery','resonance_tower','biomatter_workshop','quarantine','apothecary','clinic'].includes(b.type)&&(!island.power?.supplied.includes(b.id)||b.powerEnabled===false))return powerStatus(island,b);
 const output=RECIPES[b.type]?.output??OUTPUTS[b.type]??(b.type==='fishing_dock'?'food':undefined);if(output&&island.reserves?.targets[output]!==undefined&&!needsReserve(island,output)&&!b.workers.length)return 'Đã đủ mục tiêu dự trữ · chờ xuống 80%';
 const adults=island.npcs.filter(n=>n.isAlive&&n.age>=18&&n.position);
 if(map&&adults.length&&!adults.some(n=>reachable(map,n,b)))return 'Không có đường đến công trình';
 if(!sourceAlive(island,b))return 'Nguồn khai thác gần công trình đã cạn';
 if(map&&sumStock(b.buffer?.output??{})>0&&!storageSites(island).some(p=>findPath(map,b.tileX,b.tileY,p.x,p.y)!==null)&&!island.buildings.some(t=>t.id!==b.id&&t.complete&&t.workers.length&&Object.keys(RECIPES[t.type]?.inputs??{}).some(g=>(b.buffer?.output[g as LogisticsGood]??0)>0)&&findPath(map,b.tileX,b.tileY,t.tileX,t.tileY)!==null))return 'Không có đường vận chuyển từ công trình đến kho/xưởng đích';
 const r=RECIPES[b.type];if(outputRoom(island,b)<(r?.yield??1))return 'Kho thành phẩm đầy · cần vận chuyển hoặc chỗ trống ở kho đích';
 const missing=r?Object.keys(r.inputs).filter(k=>(b.buffer?.input[k as LogisticsGood]??0)<r.inputs[k as LogisticsGood]!):[];
 if(map&&missing.some(k=>supplied(island,k as LogisticsGood)&&!supplyRoute(island,map,b,k as LogisticsGood)))return 'Có nguyên liệu nhưng không có đường vận chuyển đến xưởng';
 if(missing.length)return `Thiếu đầu vào: ${missing.map(k=>GOOD_LABELS[k as LogisticsGood]).join(', ')}${missing.every(k=>supplied(island,k as LogisticsGood))?' · chờ người vận chuyển':' · cần bổ sung nguồn/nguyên liệu'}`;
 if(!b.workers.some(id=>adults.some(n=>n.id===id)))return 'Thiếu công nhân · đang chờ người rảnh';
 if(map&&!b.workers.some(id=>adults.some(n=>n.id===id&&reachable(map,n,b))))return 'Công nhân được phân không có đường đến công trình';
 return 'Sẵn sàng sản xuất · thợ vẫn ăn/ngủ và đi tới nơi làm';
}
export function refreshProductionAlerts(island:Island,map:WorldMap):void{for(const b of island.buildings)b.productionAlert=productionAlert(island,b,map);}
export function releaseAutoStaff(island:Island,map:WorldMap):void{
 const critical=estimateFoodDays(island.npcs.filter(n=>n.position),island.sharedFood)<1.5;
 for(const b of island.buildings){b.autoWorkers=b.autoWorkers?.filter(id=>b.workers.includes(id)&&island.npcs.some(n=>n.id===id&&n.isAlive));for(const id of [...b.autoWorkers??[]]){
  const n=island.npcs.find(n=>n.id===id)!;if(n.laborMode!=='auto'){b.autoWorkers=b.autoWorkers!.filter(v=>v!==id);continue;}
  if(!b.complete||b.upgrade||n.cargo||n.freight||n.haulTask||n.actionTarget||n.survivalBlocked||n.path?.length||(n.buildingWork?.ticks??0)>0&&!n.buildingWork?.cycleBoundary)continue;
  const good=RECIPES[b.type]?.output??OUTPUTS[b.type]??(b.type==='fishing_dock'?'food':undefined);
  if(b.autoStaff===false||good&&!(critical&&good==='food')&&island.reserves?.targets[good]!==undefined&&!needsReserve(island,good)||!canRun(island,b,map)||!reachable(map,n,b)||critical&&!['farm','fishing_dock','bakery'].includes(b.type)){if((n.buildingWork?.ticks??0)>0){n.autoWorkProgress??={};n.autoWorkProgress[b.id]=n.buildingWork!.ticks;}removeWorker(island,b.id,id,false);n.autoReason='Rời xưởng đang chờ · ưu tiên nhu cầu của làng';}
 }}
}
export function claimBuilding(island:Island,map:WorldMap,n:NPC,b:Building):boolean{
 if(!b.complete||b.upgrade||b.autoStaff===false||!productive(b)||b.workers.length>=maxBuildingWorkers(b)||!reachable(map,n,b)||!canRun(island,b,map))return false;
 if(!assignWorker(island,b.id,n.id,true))return false;const good=RECIPES[b.type]?.output??OUTPUTS[b.type];n.laborRole=good==='food'||b.type==='fishing_dock'?'food':good==='wood'?'wood':good==='stone'?'stone':'idle';n.autoReason='Tự nhận việc tại công trình';return true;
}
export function foodBuildings(island:Island):Building[]{return island.buildings.filter(b=>b.complete&&!b.upgrade&&['farm','fishing_dock'].includes(b.type)).sort((a,b)=>a.workers.length-b.workers.length||a.id.localeCompare(b.id));}
/** At least one operator per useful workshop before filling another slot. Never starts construction or trade. */
export function staffProduction(island:Island,map:WorldMap,crew:Set<NPC>):void{
 const stock=(good:LogisticsGood)=>warehouseAmount(island,good)+island.buildings.reduce((s,b)=>s+(b.buffer?.output[good]??0),0);
 const target=(good:LogisticsGood)=>good==='food'?80:good==='wood'?100:good==='stone'?60:30;
 const candidates=island.buildings.filter(b=>productive(b)&&!['farm','fishing_dock'].includes(b.type)).filter(b=>{const good=RECIPES[b.type]?.output??OUTPUTS[b.type];return good&&(island.reserves?.targets[good]!==undefined?needsReserve(island,good):stock(good)<target(good));}).sort((a,b)=>{const score=(b:Building)=>b.type==='bakery'?0:RECIPES[b.type]?2:1;return score(a)-score(b)||a.workers.length-b.workers.length||a.id.localeCompare(b.id);});
 for(const b of candidates){if(b.workers.length)continue;const n=[...crew].find(n=>claimBuilding(island,map,n,b));if(n)crew.delete(n);}
}
export function haulTarget(island:Island,population:number):number{const backlog=island.buildings.reduce((s,b)=>s+sumStock(b.buffer?.output??{}),0);return Math.min(6,Math.ceil(population/4),Math.max(Math.ceil(population/8),Math.ceil(backlog/60)));}
