import {estimateFoodDays} from './labor';
import {hasPower,synchronizePower} from './PowerManager';
import type {Island,NPC,Building,BuildingType,LogisticsGood,Commodity} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {findPath} from './pathfinding';
import {storageSites} from './settlement';
import {movementSteps} from './dailyLife';
import {foodCapacity,materialCapacity} from '../renderer/BuildingManager';
import {goodsCapacity} from './civilization';
import {COMMODITIES} from './commodities';

export const BUFFER_CAPACITY=60;
export const WAREHOUSE='@warehouse';
export const RECIPES:Partial<Record<BuildingType,{inputs:Partial<Record<LogisticsGood,number>>;output:LogisticsGood;yield:number}>>={
 biomatter_workshop:{inputs:{relicBone:2,bloodstone:1,herbs:1},output:'biomatter',yield:1},
 apothecary:{inputs:{herbs:2,cloth:1},output:'medicine',yield:1},
 spirit_refinery:{inputs:{spiritStone:2,herbs:1},output:'spiritEssence',yield:1},
 microchip_factory:{inputs:{components:2,copper:1},output:'microchips',yield:1},
 component_factory:{inputs:{steel:2,copper:2},output:'components',yield:3},
 smelter:{inputs:{copperOre:4,wood:2},output:'copper',yield:2},
 sawmill:{inputs:{wood:6},output:'lumber',yield:4},
 brick_kiln:{inputs:{clay:4,wood:2},output:'bricks',yield:4},
 pottery_workshop:{inputs:{clay:3,wood:1},output:'pottery',yield:2},
 bakery:{inputs:{wheat:8,wood:2},output:'food',yield:40},
 iron_smelter:{inputs:{ironOre:4,coal:2},output:'iron',yield:2},
 steelworks:{inputs:{iron:4,coal:2},output:'steel',yield:2},
 stonecutter:{inputs:{stone:4},output:'cutStone',yield:3},
 prototype_workshop:{inputs:{steel:2,lumber:2},output:'machineParts',yield:2},
 weaver:{inputs:{fiber:6},output:'cloth',yield:3},
};
export function inputsOf(b:Building):Partial<Record<LogisticsGood,number>>{return b.type==='relic_extractor'?{biomatter:1}:b.type==='quarantine'?{biomatter:1}:b.type==='clinic'?{medicine:1}:b.type==='resonance_tower'?{spiritEssence:1}:b.type==='steam_generator'?{coal:3}:RECIPES[b.type]?.inputs??{};}
export const OUTPUTS:Partial<Record<BuildingType,LogisticsGood>>={lumbercamp:'wood',mine:'stone',farm:'food',copper_mine:'copperOre',clay_pit:'clay',iron_mine:'ironOre',coal_mine:'coal',wheat_field:'wheat',flax_field:'fiber',relic_extractor:'relicBone',spirit_extractor:'spiritStone'};
export const GOOD_LABELS:Record<LogisticsGood,string>={food:'Thức ăn',wood:'Gỗ',stone:'Đá',herbs:'Thảo dược',...COMMODITIES};
export function sumStock(stock:Partial<Record<LogisticsGood,number>>):number{return Object.values(stock).reduce((s,n)=>s+(n??0),0);}
export function initializeLogistics(island:Island):void {island.logistics??={version:1};for(const b of island.buildings)if(RECIPES[b.type]||OUTPUTS[b.type]||b.type==='steam_generator'||b.type==='resonance_tower'||b.type==='quarantine'||b.type==='clinic')b.buffer??={input:{},output:{}};}
export function outputRoom(island:Island,b:Building):number {if(!island.logistics)return Infinity;b.buffer??={input:{},output:{}};return Math.max(0,BUFFER_CAPACITY-sumStock(b.buffer.output));}
export function addOutput(island:Island,b:Building,good:LogisticsGood,amount:number):number {
 const gain=Math.min(Math.max(0,amount),outputRoom(island,b));b.buffer!.output[good]=(b.buffer!.output[good]??0)+gain;
 if(good==='stone'&&island.civilization)island.civilization.harvestedStone+=gain;
 if(good in COMMODITIES&&island.civilization)island.civilization.produced[good as Commodity]+=gain;
 return gain;
}
export function processLocalRecipe(island:Island,b:Building):void {
 if(b.productionQuota===0){b.workMessage='Đã đủ định mức · giữ nguyên vật tư';return;}
 if(!hasPower(island,b)){b.workMessage='Thiếu điện · giữ nguyên đầu vào và tiến độ';return;}
 const r=RECIPES[b.type]!;b.buffer??={input:{},output:{}};
 if(outputRoom(island,b)<r.yield){b.workMessage='Kho thành phẩm xưởng đầy · cần người vận chuyển';return;}
 for(const [good,amount] of Object.entries(r.inputs))if((b.buffer.input[good as LogisticsGood]??0)<amount!){b.workMessage=`Chờ giao ${GOOD_LABELS[good as LogisticsGood]} đến xưởng`;return;}
 for(const [good,amount] of Object.entries(r.inputs))b.buffer.input[good as LogisticsGood]!-=amount!;
 addOutput(island,b,r.output,r.yield);b.productionBatches=(b.productionBatches??0)+1;b.workMessage='Đã chế biến · thành phẩm chờ vận chuyển';
 if(b.productionQuota!==undefined){b.productionQuota--;if(b.productionQuota===0){if(b.type!=='steelworks')b.powerEnabled=false;b.workMessage='Đã đủ định mức · tự dừng sau mẻ cuối, hàng vẫn chờ vận chuyển';synchronizePower(island);}}
}
export function warehouseAmount(island:Island,good:LogisticsGood):number {return good==='food'?island.sharedFood:good==='wood'||good==='stone'||good==='herbs'?island[good]:island.civilization?.inventory[good]??0;}
function changeWarehouse(island:Island,good:LogisticsGood,amount:number):void {if(good==='food')island.sharedFood+=amount;else if(good==='wood'||good==='stone'||good==='herbs')island[good]+=amount;else island.civilization!.inventory[good]+=amount;}
function warehouseRoom(island:Island,good:LogisticsGood):number {return Math.max(0,(good==='food'?foodCapacity(island):['wood','stone','herbs'].includes(good)?materialCapacity(island):goodsCapacity(island))-warehouseAmount(island,good));}
function reserved(island:Island,target:string,good?:LogisticsGood):number{return island.npcs.filter(n=>n.isAlive&&n.freight?.target===target&&(!good||n.freight.good===good)).reduce((s,n)=>s+n.freight!.amount,0);}
function inputDemand(island:Island,b:Building,good:LogisticsGood):number {
 const batch=inputsOf(b)[good]??0;if(!batch||b.type==='relic_extractor'&&!b.relicSafety||b.productionQuota===0||!b.complete||b.upgrade||(b.type==='steam_generator'?b.powerEnabled===false:!b.workers.length||['prototype_workshop','component_factory','microchip_factory','spirit_refinery','resonance_tower','apothecary','clinic','biomatter_workshop','quarantine'].includes(b.type)&&b.powerEnabled===false))return 0;
 return Math.max(0,Math.min(batch*(b.type==='microchip_factory'?1:3)-(b.buffer?.input[good]??0)-reserved(island,b.id,good),BUFFER_CAPACITY-sumStock(b.buffer?.input??{})-reserved(island,b.id)));
}
function destinationRoom(island:Island,target:string,good:LogisticsGood):number {
 if(target===WAREHOUSE){const field=good as 'food'|'wood'|'stone'|'herbs';const cargo=['food','wood','stone','herbs'].includes(good)?island.npcs.filter(n=>n.isAlive).reduce((s,n)=>s+(n.cargo?.[field]??0),0):0;return Math.max(0,warehouseRoom(island,good)-reserved(island,target,good)-cargo);}
 const b=island.buildings.find(b=>b.id===target);return b?inputDemand(island,b,good):0;
}
function routes(island:Island,map:WorldMap,npc:NPC,site:string){const b=island.buildings.find(b=>b.id===site);const points=site===WAREHOUSE?storageSites(island):b&&b.complete?[{x:b.tileX,y:b.tileY}]:[];return points.flatMap(p=>{const path=findPath(map,npc.position!.tileX,npc.position!.tileY,p.x,p.y);return path===null?[]:[path];}).sort((a,b)=>a.length-b.length);}
export function haulJobs(island:Island):NonNullable<NPC['haulTask']>[] {
 if(!island.logistics)return [];const jobs:NonNullable<NPC['haulTask']>[]=[];
 const factories=island.buildings.filter(b=>b.complete&&RECIPES[b.type]);
 const generators=island.buildings.filter(b=>b.type==='steam_generator'&&b.complete);
 const fuelFirst=estimateFoodDays(island.npcs.filter(n=>n.position),island.sharedFood)>=2;
 // With two days of food already stored, replenish generator fuel before another food round trip.
 if(fuelFirst)for(const target of generators){if(inputDemand(island,target,'coal')<=0)continue;for(const source of island.buildings.filter(b=>b.id!==target.id&&b.complete&&(b.buffer?.output.coal??0)>0))jobs.push({source:source.id,target:target.id,good:'coal'});if(warehouseAmount(island,'coal')>0)jobs.push({source:WAREHOUSE,target:target.id,good:'coal'});}

 // Bring food back first; then supply a few batches, avoiding warehouse round trips.
 for(const source of island.buildings.filter(b=>b.complete&&b.buffer))for(const [key,amount] of Object.entries(source.buffer!.output)){
  const good=key as LogisticsGood;if(!amount)continue;
  if(good==='food'&&destinationRoom(island,WAREHOUSE,good)>0)jobs.push({source:source.id,target:WAREHOUSE,good});
 }
 // When food reserves are low, bakery inputs precede clearing surplus industrial/grain output.
 // Otherwise a full wheat field can keep every carrier busy while the ovens wait for wood.
 if(!fuelFirst)for(const target of factories.filter(b=>b.type==='bakery'))for(const key of Object.keys(inputsOf(target))){
  const good=key as LogisticsGood;if(inputDemand(island,target,good)<=0)continue;
  for(const source of island.buildings.filter(b=>b.id!==target.id&&b.complete&&(b.buffer?.output[good]??0)>0))jobs.push({source:source.id,target:target.id,good});
  if(warehouseAmount(island,good)>0)jobs.push({source:WAREHOUSE,target:target.id,good});
 }
 // Clear nearly-full finished goods before replenishing already stocked factories.
 for(const source of factories){const good=RECIPES[source.type]!.output,amount=source.buffer?.output[good]??0;if(good!=='food'&&(amount>=30||outputRoom(island,source)<RECIPES[source.type]!.yield)&&destinationRoom(island,WAREHOUSE,good)>0)jobs.push({source:source.id,target:WAREHOUSE,good});}
 for(const target of [...(fuelFirst?[]:generators),...factories.filter(b=>fuelFirst||b.type!=='bakery'),...island.buildings.filter(b=>(b.type==='relic_extractor'||b.type==='resonance_tower'||b.type==='quarantine'||b.type==='clinic')&&b.complete)])for(const key of Object.keys(inputsOf(target))){
  const good=key as LogisticsGood;if(inputDemand(island,target,good)<=0)continue;
  const sources=island.buildings.filter(b=>b.id!==target.id&&b.complete&&(b.buffer?.output[good]??0)>0);
  for(const source of sources)jobs.push({source:source.id,target:target.id,good});
  if(warehouseAmount(island,good)>0)jobs.push({source:WAREHOUSE,target:target.id,good});
 }
 for(const source of island.buildings.filter(b=>b.complete&&b.buffer))for(const [key,amount] of Object.entries(source.buffer!.output)){
  const good=key as LogisticsGood;if(amount!>0&&good!=='food'&&destinationRoom(island,WAREHOUSE,good)>0)jobs.push({source:source.id,target:WAREHOUSE,good});
 }
 return jobs;
}
/** Reserve pickup space while a carrier walks, so a small batch does not attract the whole crew. */
function availablePickup(island:Island,job:NonNullable<NPC['haulTask']>):number {
 const stock=job.source===WAREHOUSE?warehouseAmount(island,job.good):island.buildings.find(b=>b.id===job.source)?.buffer?.output[job.good]??0;
 const pending=island.npcs.filter(n=>n.isAlive&&!n.freight&&n.haulTask?.source===job.source&&n.haulTask.good===job.good).length;
 return Math.max(0,stock-pending*30);
}
export function hasHaulWork(island:Island,map:WorldMap,npc:NPC):boolean {return haulJobs(island).some(j=>routes(island,map,npc,j.source).length&&routes(island,map,npc,j.target).length);}
/** Pick up and deliver on separate steps; interruption or reassignment never erases loaded goods. */
export function tickLogistics(island:Island,map:WorldMap):void {
 if(!island.logistics)return;initializeLogistics(island);
 for(const n of island.npcs){
  if(!n.isAlive||!n.position||n.survivalBlocked||n.cargo)continue;
  if(!n.freight&&(n.laborRole!=='haul'||n.age<18||n.occupation==='child'||n.actionTarget||n.researching||island.equipment?.order?.workerId===n.id||island.buildings.some(b=>b.workers.includes(n.id)))){n.haulTask=undefined;continue;}
  n.survivalBlocked=true;n.path=undefined;
  if(!n.freight&&!n.haulTask)n.haulTask=haulJobs(island).find(j=>availablePickup(island,j)>1e-8&&routes(island,map,n,j.source).length&&routes(island,map,n,j.target).length);
  const task=n.haulTask,load=n.freight;
  if(!load&&!task){n.laborMessage='Vận chuyển · chưa có chuyến khả dụng';n.status='idle';continue;}
  let target=load?.target??task!.source;
  if(load&&target!==WAREHOUSE&&!island.buildings.some(b=>b.id===target&&b.complete)){load.target=WAREHOUSE;target=WAREHOUSE;}
  const path=routes(island,map,n,target)[0];
  if(!path){n.laborMessage='Vận chuyển · không có đường đi · giữ hàng';n.status='idle';if(!load)n.haulTask=undefined;continue;}
  if(path.length){const next=path[Math.min(movementSteps(n,island),path.length)-1];n.position={tileX:next.x,tileY:next.y};n.laborMessage=load?`Đang giao ${GOOD_LABELS[load.good]} · ${load.amount.toFixed(1)}/30`:'Đang đến lấy hàng';n.status='working';continue;}
  if(load){
   const b=island.buildings.find(b=>b.id===load.target);
   const room=load.target===WAREHOUSE?warehouseRoom(island,load.good):b?BUFFER_CAPACITY-sumStock(b.buffer?.input??{}):0;
   const amount=Math.min(load.amount,Math.max(0,room));
   if(amount){if(load.target===WAREHOUSE)changeWarehouse(island,load.good,amount);else{b!.buffer??={input:{},output:{}};b!.buffer.input[load.good]=(b!.buffer.input[load.good]??0)+amount;}load.amount-=amount;}
   if(load.amount<=1e-8){if(amount>0)island.logistics.completedTrips=(island.logistics.completedTrips??0)+1;n.freight=undefined;n.haulTask=undefined;n.laborMessage='Đã giao hàng · chờ chuyến tiếp theo';}
   else n.laborMessage='Kho đích đầy · giữ hàng và chờ';
  }else{
   const source=island.buildings.find(b=>b.id===task!.source);
   const stock=task!.source===WAREHOUSE?warehouseAmount(island,task!.good):source?.buffer?.output[task!.good]??0;
   const amount=Math.min(30,stock,destinationRoom(island,task!.target,task!.good));
   if(amount>1e-8){if(task!.source===WAREHOUSE)changeWarehouse(island,task!.good,-amount);else source!.buffer!.output[task!.good]=stock-amount;n.freight={good:task!.good,amount,target:task!.target};n.laborMessage=`Đã lấy ${amount.toFixed(1)} ${GOOD_LABELS[task!.good]} · chờ giao`;}
   else{n.haulTask=undefined;n.laborMessage='Chuyến đã hết hàng hoặc kho đích đầy · tìm chuyến khác';}
  }
  n.status='working';
 }
}
