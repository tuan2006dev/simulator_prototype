import {updateReserveRequests,needsReserve} from './reserves';
import {releaseAutoStaff,refreshProductionAlerts,foodBuildings,claimBuilding,staffProduction,haulTarget} from './productionWorkforce';
import {hasHaulWork} from './logistics';
import type {Island,NPC,LaborRole} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {findPath} from './pathfinding';
import {estimateDailyFoodDemand,estimateFoodDays} from './labor';
import {materialRoom,foodCapacity} from '../renderer/BuildingManager';

export function attributes(npc:NPC): {str:number;dex:number;int:number} {
  return npc.attributes??{str:5,dex:5,int:5};
}
/** Attributes never penalize survival; the largest bonus is 20%. */
export function attributeBonus(npc:NPC,axis:'str'|'dex'|'int'):number {
  return 1+Math.max(0,Math.min(.2,(attributes(npc)[axis]-5)*.04));
}
export function initializeWorkforce(island:Island,fresh=false):void {
  const migrating=!island.workforce&&!fresh;
  island.workforce??={version:1,enabled:fresh};
  for(const npc of island.npcs){
    npc.laborMode??=!migrating&&island.workforce.enabled?'auto':'manual';
    if(!npc.attributes){
      let hash=2166136261;for(const c of npc.id)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
      npc.attributes=!migrating?{str:4+hash%7,dex:4+(hash>>>8)%7,int:4+(hash>>>16)%7}:{str:5,dex:5,int:5};
    }
  }
}
export function workforceSummary(island:Island):string {
  const auto=island.npcs.filter(n=>n.isAlive&&n.position&&n.age>=18&&n.laborMode==='auto').length;
  return `${island.workforce?.enabled?'Tự nhận việc bật':'Tự nhận việc tắt'} · ${auto} người tự động · dự trữ ${estimateFoodDays(island.npcs.filter(n=>n.position),island.sharedFood).toFixed(1)} ngày ăn`;
}
/** Only claim free adults at a task boundary. Manual jobs and interrupted work are owned by the player. */
export function planWorkforce(island:Island,map:WorldMap):void {
  updateReserveRequests(island);
  refreshProductionAlerts(island,map);
  if(!island.workforce?.enabled)return;
  releaseAutoStaff(island,map);
  initializeWorkforce(island);
  const living=island.npcs.filter(n=>n.isAlive&&n.position),workers=new Set(island.buildings.flatMap(b=>b.workers));
  const available=living.filter(n=>n.age>=18&&n.occupation!=='child'&&!workers.has(n.id)&&!n.exploring&&!n.researching&&island.civilization?.research?.researcherId!==n.id&&island.equipment?.order?.workerId!==n.id);
  const crew=available.filter(n=>n.laborMode==='auto'&&!n.cargo&&!n.freight&&!n.haulTask&&!n.actionTarget&&!n.survivalBlocked&&(n.laborRetryAt??0)<=island.tick);
  const locked=available.filter(n=>!crew.includes(n));
  const foodAtBuildings=island.buildings.filter(b=>b.complete&&['farm','fishing_dock'].includes(b.type)).reduce((s,b)=>s+b.workers.filter(id=>living.some(n=>n.id===id)).length,0);
  const days=estimateFoodDays(living,island.sharedFood),demand=estimateDailyFoodDemand(living);
  const foodWanted=days<1.5||island.reserves?.targets.food===undefined||needsReserve(island,'food');
  const foodTarget=foodWanted?Math.max(1,Math.ceil((demand/(20*8/35))*(days<1.5?.8:.6))):0;
  const woodReserve=island.civilization?.era==='iron'?180:island.civilization?.era==='bronze'?100:60;
  const stoneReserve=island.civilization?.era==='iron'?100:island.civilization?.era==='bronze'?60:40;
  const woodTarget=(island.reserves?.targets.wood!==undefined?needsReserve(island,'wood'):island.wood<woodReserve)?Math.max(1,Math.ceil(living.length/10)):0;
  const stoneTarget=(island.reserves?.targets.stone!==undefined?needsReserve(island,'stone'):island.stone<stoneReserve)?1:0;
  const countAt=(type:string)=>island.buildings.filter(b=>b.complete&&b.type===type).reduce((s,b)=>s+b.workers.filter(id=>living.some(n=>n.id===id)).length,0);
  const counts:Record<LaborRole,number>={food:foodAtBuildings,wood:countAt('lumbercamp'),stone:countAt('mine'),haul:0,idle:0};
  for(const n of locked)counts[n.laborRole]++;
  const targets:Record<LaborRole,number>={food:foodTarget,wood:woodTarget,stone:stoneTarget,haul:1,idle:0};
  const resourceType={food:['herb_patch','fish_spot'],wood:['wood_tree'],stone:['stone_deposit'],idle:[]} as const;
  const remaining=new Set(crew);
  for(const role of ['food','haul','wood','stone'] as const){
    if(role==='haul'){while(counts.haul<haulTarget(island,living.length)){const n=[...remaining].find(n=>hasHaulWork(island,map,n));if(!n)break;n.laborRole='haul';n.autoReason='Giao thức ăn và nguyên liệu cho xưởng';remaining.delete(n);counts.haul++;}continue;}
    if(role==='food'&&island.sharedFood<foodCapacity(island)){for(const b of foodBuildings(island)){while(counts.food<targets.food){const n=[...remaining].find(n=>claimBuilding(island,map,n,b));if(!n)break;remaining.delete(n);counts.food++;}}}
    if(role==='wood'||role==='stone'){for(const b of island.buildings.filter(b=>b.type===(role==='wood'?'lumbercamp':'mine'))){while(counts[role]<targets[role]){const n=[...remaining].find(n=>claimBuilding(island,map,n,b));if(!n)break;remaining.delete(n);counts[role]++;}}}
    const nodes=[...island.resources].filter(([,node])=>node.amount>0&&(resourceType[role] as readonly string[]).includes(node.type));
    if((role==='wood'||role==='stone')&&materialRoom(island,role)<=0)continue;
    if(role==='food'&&island.sharedFood>=foodCapacity(island))continue;
    while(counts[role]<targets[role]){
      const choices=[...remaining].filter(n=>nodes.some(([key])=>{const [x,y]=key.split(',').map(Number);return findPath(map,n.position!.tileX,n.position!.tileY,x,y)!==null;})).sort((a,b)=>(a.laborRole===role?-100:0)-(b.laborRole===role?-100:0)+attributes(b)[role==='food'?'dex':'str']-attributes(a)[role==='food'?'dex':'str']||a.id.localeCompare(b.id));
      const npc=choices[0];if(!npc)break;
      npc.laborRole=role;npc.autoReason=role==='food'?(days<1.5?'Ưu tiên thức ăn · dự trữ dưới 1,5 ngày':'Duy trì nguồn thức ăn'):role==='wood'?'Kiếm gỗ xây dựng và tiếp củi':'Dự trữ đá xây dựng';
      remaining.delete(npc);counts[role]++;
    }
  }
  if(days>=1.5)staffProduction(island,map,remaining);
  refreshProductionAlerts(island,map);
  for(const npc of remaining){
    npc.laborRole='idle';npc.autoReason='Chờ việc · dự trữ đủ hoặc nguồn không có đường đi';
  }
}
