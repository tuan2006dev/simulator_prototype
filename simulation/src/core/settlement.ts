import type { Island, NPC, Building } from './types';
import type { WorldMap } from '../renderer/WorldMap';
import { findPath } from './pathfinding';
import { foodCapacity, materialCapacity } from '../renderer/BuildingManager';
import { worldMinutes } from './dailyLife';
import { addEntry } from './chronicle';

export const CARGO_LIMIT = 30;
export const STARTER_OUTPUT = { food: 16, wood: 10, stone: 4 };
/** Khởi nguyên is a checklist within Stone, not a separate era or paid unlock. */
export function openingMilestones(island: Island): {label:string;met:boolean}[] {
  const residents=island.npcs.filter(n=>n.isAlive&&n.position);
  return [
    {label:'Đủ chỗ ngủ',met:residents.length>0&&island.buildings.reduce((s,b)=>s+shelterBeds(b),0)>=residents.length},
    {label:'Bãi chứa hoàn thành',met:island.buildings.some(b=>b.complete&&['stockpile','storehouse'].includes(b.type))},
    {label:'Củi cho một đêm',met:(island.dailyLife?.campfire?.fuel??0)>=4},
    {label:'Dự trữ một ngày ăn',met:island.sharedFood>=residents.length*5&&residents.length>0},
    {label:'Bến câu đã có mẻ cá',met:island.buildings.some(b=>b.complete&&b.type==='fishing_dock'&&(b.productionBatches??0)>0)},
    {label:'Bàn nghiên cứu và Lửa',met:island.buildings.some(b=>b.complete&&b.type==='study_table')&&Boolean(island.civilization?.unlocks.includes('fire'))},
  ];
}
export function enableSettlement(island: Island): void {
  island.dailyLife ??= {campfire:null};
  island.dailyLife.settlementVersion=1;
  const fire=island.dailyLife.campfire;
  if(fire){fire.fuel??=0;fire.graceUntil??=island.tick+30;fire.lit??=true;}
}
export function shelterBeds(building: Building): number {
  return !building.complete ? 0 : building.type==='tent' ? 3 : building.type==='house' ? Math.max(1,Math.min(3,building.level??1))*5 : 0;
}
export function sleepingAssignments(island: Island,map: WorldMap): Map<string,Building> {
  const beds=island.buildings.filter(b=>shelterBeds(b)>0), remaining=new Map(beds.map(b=>[b.id,shelterBeds(b)]));
  const result=new Map<string,Building>();
  const residents=island.npcs.filter(n=>n.isAlive&&n.position).sort((a,b)=>(a.age<18?0:1)-(b.age<18?0:1)||a.id.localeCompare(b.id));
  for(const npc of residents){
    const choices=beds.filter(b=>remaining.get(b.id)!>0).flatMap(b=>{
      const path=findPath(map,npc.position!.tileX,npc.position!.tileY,b.tileX,b.tileY);
      return path===null?[]:[{b,distance:path.length}];
    }).sort((a,b)=>a.distance-b.distance||a.b.id.localeCompare(b.b.id));
    if(choices[0]){result.set(npc.id,choices[0].b);remaining.set(choices[0].b.id,remaining.get(choices[0].b.id)!-1);}
  }
  return result;
}
export function storageSites(island: Island): {x:number;y:number}[] {
  const sites=island.buildings.filter(b=>b.complete&&['stockpile','storehouse'].includes(b.type)).map(b=>({x:b.tileX,y:b.tileY}));
  const fire=island.dailyLife?.campfire;
  if(fire)sites.push({x:fire.tileX,y:fire.tileY});
  return sites;
}
/** Carrying survives role changes, meal interrupts and load; only arrival credits stock. */
export function tickCargo(island: Island,map: WorldMap): void {
  for(const npc of island.npcs){
    if(!npc.isAlive||!npc.position||!npc.cargo||npc.survivalBlocked)continue;
    npc.survivalBlocked=true;
    const routes=storageSites(island).flatMap(dest=>{
      const path=findPath(map,npc.position!.tileX,npc.position!.tileY,dest.x,dest.y);
      return path===null?[]:[{dest,path}];
    }).sort((a,b)=>a.path.length-b.path.length);
    const route=routes[0];
    if(!route){npc.laborMessage='Hàng đang mang · không có đường về kho';npc.status='idle';continue;}
    if(route.path.length){
      const next=route.path[Math.min(6,route.path.length)-1];npc.position={tileX:next.x,tileY:next.y};npc.path=undefined;
      npc.status='working';npc.laborMessage='Đang mang hàng về kho';continue;
    }
    const cargo=npc.cargo,food=Math.min(cargo.food,Math.max(0,foodCapacity(island)-island.sharedFood));
    island.sharedFood+=food;cargo.food-=food;
    for(const kind of ['wood','stone','herbs'] as const){
      const moved=Math.min(cargo[kind],Math.max(0,materialCapacity(island)-island[kind]));
      island[kind]+=moved;cargo[kind]-=moved;
      if(kind==='stone'&&island.civilization)island.civilization.harvestedStone+=moved;
    }
    npc.status='idle';
    if(Object.values(cargo).some(n=>n>1e-8))npc.laborMessage='Kho đã đầy · giữ hàng và chờ chỗ trống';
    else{npc.cargo=undefined;npc.laborMessage='Đã giao hàng vào kho · tiếp tục công việc';}
  }
}
/** Wood is paid once, at the fire, by a free adult. Builders, researchers and carriers are never reassigned. */
export function tickCampfire(island: Island,map: WorldMap): string|undefined {
  const fire=island.dailyLife?.campfire;
  if(island.dailyLife?.settlementVersion!==1||!fire)return;
  fire.fuel??=0;fire.graceUntil??=island.tick+30;
  const hour=worldMinutes(island.tick)/60,night=hour>=20||hour<6;
  const grace=island.tick<fire.graceUntil;
  const before=fire.lit??true;
  if(grace)fire.lit=true;
  else if(night&&fire.lastBurnTick!==island.tick){const paid=Math.min(1,fire.fuel);fire.fuel-=paid;fire.lastBurnTick=island.tick;fire.lit=paid===1;}
  else if(!night)fire.lit=fire.fuel>0;
  if(before&&!fire.lit)addEntry(island,'⚠ Lửa trại đã tắt. Phân công người kiếm gỗ; người rảnh sẽ tiếp củi khi đến lửa.','high');
  if(fire.fuel>4||island.wood<=0||night)return;
  const candidates=island.npcs.filter(n=>n.isAlive&&n.position&&n.age>=18&&n.occupation!=='child'&&n.needs.hunger<70&&n.needs.rest<80&&(n.health??100)>=40&&!n.cargo&&!n.freight&&!n.haulTask&&!n.exploring&&!n.actionTarget&&!n.researching&&island.equipment?.order?.workerId!==n.id&&!island.buildings.some(b=>b.workers.includes(n.id)));
  const choices=candidates.flatMap(n=>{
    const path=findPath(map,n.position!.tileX,n.position!.tileY,fire.tileX,fire.tileY);
    return path===null?[]:[{n,path}];
  }).sort((a,b)=>(a.n.laborRole==='wood'?0:1)-(b.n.laborRole==='wood'?0:1)||a.path.length-b.path.length);
  const keeper=choices[0];if(!keeper)return;
  if(keeper.path.length){const next=keeper.path[Math.min(6,keeper.path.length)-1];keeper.n.position={tileX:next.x,tileY:next.y};keeper.n.path=undefined;keeper.n.status='working';keeper.n.laborMessage='Đang về lửa trại tiếp củi';}
  if(keeper.path.length<=6){const wood=Math.min(12-fire.fuel,island.wood);island.wood-=wood;fire.fuel+=wood;fire.lit=grace||fire.fuel>0;keeper.n.laborMessage=`Đã tiếp ${wood.toFixed(1)} gỗ vào lửa trại`;keeper.n.status='working';}
  return keeper.n.id;
}
export function campfireSummary(island: Island): string {
  const fire=island.dailyLife?.campfire;
  if(!fire)return 'Đặt cư dân để nhóm lửa';
  if(island.dailyLife?.settlementVersion!==1)return 'Lửa trại trung tâm';
  if(island.tick<(fire.graceUntil??0))return `Lửa an toàn · còn ${Math.ceil(((fire.graceUntil??0)-island.tick)/10)} ngày · ${Math.floor(fire.fuel??0)} củi`;
  return `${fire.lit?'Lửa đang cháy':'Lửa đã tắt'} · ${Math.floor(fire.fuel??0)}/12 củi · 4 củi/đêm${(fire.fuel??0)<=4?' · cần tiếp củi':''}`;
}
