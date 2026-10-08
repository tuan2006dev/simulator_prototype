import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {decodeSave,encodeSave} from '../src/core/SaveSystem';
import {generateWorldMap,regionAt} from '../src/renderer/WorldMap';
import {ensureCauseway,lowTide,tidalWalkMap,tidalSource,tickTides} from '../src/core/TidalManager';
import {foodCapacity,materialCapacity} from '../src/renderer/BuildingManager';
import {findPath} from '../src/core/pathfinding';
import {SimulationSession,type PlayerCommand} from '../src/core/SimulationSession';
import {explorationLock} from '../src/core/ExplorationManager';
let worlds=0;
for(const [w,h] of [[50,35],[80,50],[120,80]])for(const seed of [1,2,3,42,321,20810,999999,10000,17919,25838]){
 const map=generateWorldMap(w,h,seed,'three-islands');ensureCauseway(map);assert(map.causeway,JSON.stringify({w,h,seed}));const c=map.causeway!;
 assert.equal(findPath(map,c.main.x,c.main.y,c.fang.x,c.fang.y),null);
 const path=findPath(tidalWalkMap(map,2),c.main.x,c.main.y,c.fang.x,c.fang.y);assert(path&&path.length<=12);assert(path.some(p=>c.tiles.some(q=>p.x===q.x&&p.y===q.y)));
 assert.equal(findPath(tidalWalkMap(map,4),c.main.x,c.main.y,c.fang.x,c.fang.y),null);worlds++;
}
assert.equal(lowTide(1),false);assert.equal(lowTide(2),true);assert.equal(lowTide(3),true);assert.equal(lowTide(4),false);
let data=decodeSave(readFileSync('artifacts/three-islands-played-save.json','utf8')),s=data.island,map=data.map,sim=new SimulationSession(s,map),seq=0;
const originalTiles=JSON.stringify(map.tiles),n=s.npcs.find(n=>!explorationLock(s,n))!;assert(n);const id=n.id,oldJob=JSON.stringify({role:n.laborRole,actionTarget:n.actionTarget,laborTask:n.laborTask}),source=tidalSource(s,map)!;assert(source);
const send=(command:PlayerCommand)=>{const result=sim.submit({playerId:'tidal-earned',sequence:++seq,command});assert(result.accepted,JSON.stringify({command,result}));};
send({type:'craft_torch',npcId:id});for(let i=0;i<30&&s.exploration!.torchOrder;i++)sim.advanceTicks(1);assert(!s.exploration!.torchOrder);send({type:'choose_torch',npcId:id,equip:true});for(let i=0;i<30&&!n.torch;i++)sim.advanceTicks(1);assert(n.torch);
writeFileSync('artifacts/tides-ready-save.json',encodeSave(s,map,data.config));writeFileSync('artifacts/tides-route.json',JSON.stringify({npcId:id,causeway:map.causeway,sourceKey:source,home:s.dailyLife!.campfire},null,2));
const food=s.sharedFood,startSource=s.resources.get(source)!.amount,packet={playerId:'duplicate',sequence:1,command:{type:'tidal_scout' as const,npcId:id}};
assert(sim.submit(packet).accepted);assert.equal(s.sharedFood,food-20);assert(sim.submit(packet).accepted);assert.equal(s.sharedFood,food-20);
assert(!sim.submit({playerId:'overlap',sequence:1,command:{type:'assign_labor',npcId:id,role:'food'}}).accepted);
let mid=false,foreign=false,waiting=false,steps=0;const positions:any[]=[];
while(s.tides!.active&&steps<100){const prior={...s.npcs.find(n=>n.id===id)!.position!};sim.advanceTicks(1);steps++;const actor=s.npcs.find(n=>n.id===id)!;positions.push({tick:s.tick,position:actor.position,phase:s.tides!.active?.phase,rations:s.tides!.active?.rations});
 assert(Math.max(Math.abs(actor.position!.tileX-prior.tileX),Math.abs(actor.position!.tileY-prior.tileY))<=6,'no teleport');
 const onSea=map.causeway!.tiles.some(p=>p.x===actor.position!.tileX&&p.y===actor.position!.tileY);assert(!onSea||lowTide(s.tick),'no walker on flooded causeway');
 foreign||=regionAt(map,actor.position!.tileX,actor.position!.tileY)?.id==='rang-nanh';waiting||=s.tides!.message.includes('chờ trên bờ');
 if(onSea&&!mid){mid=true;const raw=encodeSave(s,map,data.config);writeFileSync('artifacts/tides-midcrossing-save.json',raw);data=decodeSave(raw);s=data.island;map=data.map;sim=new SimulationSession(s,map);assert.equal(JSON.stringify(map.tiles),originalTiles);}
}
assert(!s.tides!.active);assert(mid&&foreign&&waiting,JSON.stringify({mid,foreign,waiting,wild:s.wilderness?.lastEncounter,message:s.tides!.message}));assert.equal(s.tides!.completed,1);assert.equal(s.npcs.filter(n=>n.isAlive).length,8);assert.equal(s.resources.get(source)!.amount,startSource-3);assert.equal(JSON.stringify({role:s.npcs.find(n=>n.id===id)!.laborRole,actionTarget:s.npcs.find(n=>n.id===id)!.actionTarget,laborTask:s.npcs.find(n=>n.id===id)!.laborTask}),oldJob);assert.equal(JSON.stringify(map.tiles),originalTiles);
writeFileSync('artifacts/tides-played-save.json',encodeSave(s,map,data.config));
// Independent controlled fixtures: no earned source/history is credited here.
let f=decodeSave(readFileSync('artifacts/tides-ready-save.json','utf8'));let fsim=new SimulationSession(f.island,f.map);const c=f.map.causeway!,actor=f.island.npcs.find(n=>n.id===id)!;actor.position={tileX:c.main.x,tileY:c.main.y};f.island.tick=2;
assert(fsim.submit({playerId:'fixture',sequence:1,command:{type:'tidal_scout',npcId:id}}).accepted);const trip=f.island.tides!.active!;trip.phase='outward';trip.rations=20;fsim.advanceTicks(1);assert.deepEqual(actor.position,{tileX:c.main.x,tileY:c.main.y});assert(f.island.tides!.message.includes('chờ trên bờ'),'13:12 too late for two-step crossing');
assert(fsim.submit({playerId:'fixture',sequence:2,command:{type:'recall_tidal_scout'}}).accepted);for(let i=0;i<20&&f.island.tides!.active;i++)fsim.advanceTicks(1);assert(!f.island.tides!.active);assert.equal(f.island.resources.get(source)!.amount,startSource);
const empty=decodeSave(readFileSync('artifacts/tides-ready-save.json','utf8'));empty.island.sharedFood=19;const esim=new SimulationSession(empty.island,empty.map);assert(!esim.submit({playerId:'poor',sequence:1,command:{type:'tidal_scout',npcId:id}}).accepted);assert.equal(empty.island.sharedFood,19);
const full=decodeSave(readFileSync('artifacts/tides-ready-save.json','utf8'));const fullsim=new SimulationSession(full.island,full.map);assert(fullsim.submit({playerId:'full',sequence:1,command:{type:'tidal_scout',npcId:id}}).accepted);const delivery=full.island.tides!.active!,deliverer=full.island.npcs.find(n=>n.id===id)!;delivery.phase='home';delivery.rations=10;delivery.collected=3;deliverer.needs.hunger=0;deliverer.position={tileX:delivery.home.x,tileY:delivery.home.y};full.island.sharedFood=foodCapacity(full.island);full.island.stone=materialCapacity(full.island);tickTides(full.island,full.map);tickTides(full.island,full.map);assert.equal(delivery.rations,10);assert.equal(delivery.collected,3);assert.equal(full.island.tides!.completed,0);full.island.sharedFood-=10;full.island.stone-=3;tickTides(full.island,full.map);assert(!full.island.tides!.active);assert.equal(full.island.tides!.completed,1);assert.equal(full.island.stone,materialCapacity(full.island));tickTides(full.island,full.map);assert.equal(full.island.tides!.completed,1);
// Editing the approach to water blocks a held journey instead of teleporting it.
const blocked=decodeSave(readFileSync('artifacts/tides-ready-save.json','utf8'));const bsim=new SimulationSession(blocked.island,blocked.map);assert(bsim.submit({playerId:'blocked',sequence:1,command:{type:'tidal_scout',npcId:id}}).accepted);const held=blocked.island.tides!.active!,walker=blocked.island.npcs.find(n=>n.id===id)!;held.phase='approach';const position={...walker.position!},tiles=blocked.map.tiles;blocked.map.tiles=tiles.map(row=>row.map(()=> 'deep_water' as const));tickTides(blocked.island,blocked.map);assert.deepEqual(walker.position,position);assert.equal(held.rations,20);assert(blocked.island.tides!.message.includes('chặn'));blocked.map.tiles=tiles;tickTides(blocked.island,blocked.map);assert.notDeepEqual(walker.position,position);
const corrupt=JSON.parse(readFileSync('artifacts/tides-midcrossing-save.json','utf8'));corrupt.island.tides.active.rations=21;assert.throws(()=>decodeSave(JSON.stringify(corrupt)));corrupt.island.tides.active.rations=20;corrupt.map.causeway.tiles[0]={x:0,y:0};assert.throws(()=>decodeSave(JSON.stringify(corrupt)));
writeFileSync('artifacts/tides-core-result.json',JSON.stringify({worlds,earned:{steps,alive:8,food:s.sharedFood,stone:s.stone,realSourceDebit:3,physicalOutAndBack:foreign,midcrossingReload:mid,waitedForTide:waiting,jobPreserved:true},positions,fixtures:{lateStartWaits:true,recall:true,insufficientFoodNoFee:true,invalidSaveRejected:true,fullStockHoldsThenPaysOnce:true,blockedRouteHoldsAndResumes:true}},null,2));
console.log('PASS tides',worlds,'routes / earned out-and-back, source debit, meals, real walks, low-tide-only crossing, load, job / late departure, recall, fee/idempotence, invalid saves.');
