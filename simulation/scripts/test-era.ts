import assert from 'node:assert/strict';
import { createIsland } from '../src/core/factory';
import { enableSettlement } from '../src/core/settlement';
import { SimulationSession, type PlayerCommand } from '../src/core/SimulationSession';
import { createCivilization, bronzeRequirements, buildingLock, goodsCapacity } from '../src/core/civilization';
import { encodeSave, decodeSave, migrateLegacy } from '../src/core/SaveSystem';
import { TECH_TREE } from '../src/core/research';
import type { WorldMap } from '../src/renderer/WorldMap';
import { spawnResources } from '../src/renderer/ResourceSpawner';
import { generateWorldMap } from '../src/renderer/WorldMap';
import { mkdirSync, writeFileSync } from 'node:fs';

const map: WorldMap = {width:20,height:20,tiles:Array.from({length:20},()=>Array(20).fill('grass')),landTiles:[]};
for(let y=0;y<20;y++)for(let x=0;x<20;x++)map.landTiles.push({x,y});
const island=createIsland('Đảo kiểm thử Đồ Đồng',12);
island.civilization=createCivilization();island.wood=0;island.stone=0;island.sharedFood=60;
if(process.env.DAILY_LIFE_TEST==='1') island.dailyLife={campfire:{tileX:3,tileY:4}};
if(process.env.SETTLEMENT_TEST==='1')enableSettlement(island);
for(let i=0;i<12;i++) { const n=island.npcs[i]; n.age=25;n.occupation='gatherer';n.position={tileX:3+i%4,tileY:4+Math.floor(i/4)};n.laborRole=i<9?'food':i<11?'wood':'stone';n.privateFood=0; }
for(let y=1;y<=10;y++)for(let x=1;x<=10;x++)island.resources.set(`${x},${y}`,{type:'herb_patch',amount:100,maxAmount:100,regenRate:2});
island.resources.set('8,5',{type:'wood_tree',amount:10000,maxAmount:10000,regenRate:1});
island.resources.set('8,6',{type:'wood_tree',amount:10000,maxAmount:10000,regenRate:1});
island.resources.set('8,7',{type:'stone_deposit',amount:10000,maxAmount:10000,regenRate:0});
island.resources.set('11,8',{type:'copper_vein',amount:500,maxAmount:500,regenRate:0});
let session=new SimulationSession(island,map),sequence=0;
const submit=(command:PlayerCommand)=>session.submit({playerId:'test',sequence:++sequence,command});
const until=(condition:()=>boolean,max=5000)=>{for(let i=0;i<max&&!condition();i++){session.advanceTicks(1);if(island.npcs.filter(n=>n.isAlive).length!==12) console.error(JSON.stringify({tick:island.tick,food:island.sharedFood,research:island.civilization!.research,npcs:island.npcs.map(n=>({id:n.id,alive:n.isAlive,role:n.laborRole,researching:n.researching,need:n.needs.hunger,rest:n.needs.rest,retry:n.laborRetryAt,status:n.status,target:n.actionTarget,message:n.laborMessage})),events:island.chronicle.slice(-3)}));assert.equal(island.npcs.filter(n=>n.isAlive).length,12,'No settler should starve during the playable path');}assert(condition(),'Condition was not reachable');};
assert(!submit({type:'develop_era'}).accepted);
assert(!submit({type:'build',buildingType:'copper_mine',tileX:12,tileY:8}).accepted);
if(island.dailyLife?.settlementVersion===1){
 until(()=>island.wood>=6&&island.stone>=2);
 const result=submit({type:'build',buildingType:'study_table',tileX:14,tileY:3});assert(result.accepted,JSON.stringify(result));
 const table=island.buildings.find(b=>b.type==='study_table')!;
 assert(submit({type:'assign_worker',buildingId:table.id,npcId:island.npcs[0].id}).accepted);
 until(()=>table.complete);
}
for(const id of ['fire','stone_tools','research_table','woodcutting','basic_agriculture','mineral_survey']){
 const tech=TECH_TREE.find(t=>t.id===id)!;
 until(()=>island.wood>=tech.costWood&&island.stone>=tech.costStone&&island.sharedFood>=tech.costFood);
 const envelope={playerId:'test',sequence:++sequence,command:{type:'start_research' as const,techId:id}};
 assert(session.submit(envelope).accepted,id);
 if (id==='fire') {
   const progress=island.civilization!.research!;
   const restoredProgress=decodeSave(encodeSave(island,map,{seed:321,shape:'circle',size:'small',startPop:12,mode:'local'}));
   assert.equal(restoredProgress.island.civilization!.research!.researcherId,progress.researcherId);
   const first=island.npcs.find(n=>n.id===progress.researcherId)!;
   first.isAlive=false;session.advanceTicks(1);assert.equal(progress.workTicks,0,'Dead researcher must pause progress');first.isAlive=true;
   assert(submit({type:'assign_researcher',npcId:island.npcs[1].id}).accepted);
   assert.equal(first.researching,false);
   const researcher=island.npcs[1];submit({type:'manual_action',npcId:researcher.id,action:'rest'});session.advanceTicks(1);assert.equal(progress.workTicks,0,'Direct rest pauses research');
 }
 const paid=island.wood;assert(session.submit(envelope).duplicate);assert.equal(island.wood,paid);
 until(()=>island.civilization!.unlocks.includes(id));
 assert(!submit({type:'start_research',techId:id}).accepted,'Completed research must not charge again');
}
const sites=[['farm',4,12],['house',5,12],['storehouse',6,12],['lumbercamp',8,9]] as const;
for(const [type,x,y] of sites){
 until(()=>island.wood>=40&&island.stone>=30&&island.sharedFood>=60);
 assert(submit({type:'build',buildingType:type,tileX:x,tileY:y}).accepted,type);
 const b=island.buildings.at(-1)!;
 const worker=island.npcs[10];assert(submit({type:'assign_worker',buildingId:b.id,npcId:worker.id}).accepted);
 until(()=>b.complete);
 if(type==='farm'){assert(submit({type:'assign_worker',buildingId:b.id,npcId:island.npcs[8].id}).accepted);submit({type:'remove_worker',buildingId:b.id,npcId:worker.id});}
 if(type==='lumbercamp')until(()=> (b.productionBatches??0)>=5);
}
until(()=>bronzeRequirements(island).every(r=>r.met)&&island.wood>=40&&island.stone>=20);
assert.equal(island.civilization!.era,'stone','No automatic advance');
mkdirSync('artifacts',{recursive:true});
const config={seed:321,shape:'circle',size:'small',startPop:12,mode:'local'} as const;
writeFileSync('artifacts/stone-ready-save.json',encodeSave(island,map,config));
const envelope={playerId:'test',sequence:++sequence,command:{type:'develop_era' as const}};
const before={wood:island.wood,stone:island.stone};assert(session.submit(envelope).accepted);assert.equal(island.wood,before.wood-40);assert.equal(island.stone,before.stone-20);
assert(session.submit(envelope).duplicate);assert.equal(island.wood,before.wood-40);
assert(!submit({type:'develop_era'}).accepted);
session.advanceTicks(5);
const restored=decodeSave(encodeSave(island,map,config));
assert.equal(restored.island.civilization!.transition!.workTicks,5);
assert(restored.island.npcs[0].attackCooldowns instanceof Map);for(const [key,node] of island.resources)assert.deepEqual(restored.island.resources.get(key),node,'Migration must preserve existing resource nodes');
Object.assign(island,restored.island);session=new SimulationSession(island,restored.map);sequence=0;
until(()=>island.civilization!.era==='bronze');
assert(!submit({type:'develop_era'}).accepted,'Unimplemented Iron must not charge');
until(()=>island.wood>=25&&island.stone>=20&&island.sharedFood>=20);
assert(submit({type:'start_research',techId:'copper_smelting'}).accepted);until(()=>island.civilization!.unlocks.includes('copper_smelting'));
for(const [type,x,y] of [['copper_mine',12,8],['smelter',12,11],['sawmill',12,12]] as const){
 until(()=>island.wood>=35&&island.stone>=35&&island.sharedFood>=30);
 assert(submit({type:'build',buildingType:type,tileX:x,tileY:y}).accepted);
 const b=island.buildings.at(-1)!;assert(submit({type:'assign_worker',buildingId:b.id,npcId:island.npcs[9].id}).accepted);until(()=>b.complete);
 if(type!=='sawmill')submit({type:'remove_worker',buildingId:b.id,npcId:island.npcs[9].id});
}
const copperMine=island.buildings.find(b=>b.type==='copper_mine')!,smelter=island.buildings.find(b=>b.type==='smelter')!,sawmill=island.buildings.find(b=>b.type==='sawmill')!;
submit({type:'assign_worker',buildingId:copperMine.id,npcId:island.npcs[7].id});
submit({type:'assign_worker',buildingId:smelter.id,npcId:island.npcs[9].id});
submit({type:'assign_worker',buildingId:sawmill.id,npcId:island.npcs[6].id});
until(()=>island.civilization!.inventory.copper>=6&&island.civilization!.inventory.lumber>=12);
assert(island.resources.get('11,8')!.amount<500);
assert.equal(buildingLock(island,'house',2),'Cần nghiên cứu Kiến trúc Đồ Đồng.');
until(()=>island.wood>=20&&island.stone>=15&&island.sharedFood>=10);
assert(submit({type:'start_research',techId:'bronze_construction'}).accepted);until(()=>island.civilization!.unlocks.includes('bronze_construction'));
until(()=>island.civilization!.inventory.copper>=5&&island.civilization!.inventory.lumber>=10&&island.wood>=40&&island.stone>=20&&island.sharedFood>=30);
writeFileSync('artifacts/bronze-before-upgrade-save.json',encodeSave(island,map,config));
const house=island.buildings.find(b=>b.type==='house')!;assert(submit({type:'upgrade_building',buildingId:house.id}).accepted);assert(!submit({type:'upgrade_building',buildingId:house.id}).accepted);submit({type:'assign_worker',buildingId:house.id,npcId:island.npcs[5].id});until(()=>house.level===2);
assert.equal(house.technology,'bronze');assert(buildingLock(island,'house',3));
writeFileSync('artifacts/bronze-playable-save.json',encodeSave(island,map,config));

// Empty input and full output storage must preserve both raw materials and nodes.
for(const n of island.npcs){n.laborRole='idle';n.needs.hunger=0;n.needs.rest=0;}
for(const b of island.buildings)b.workers=[];
submit({type:'assign_worker',buildingId:smelter.id,npcId:island.npcs[9].id});
island.civilization!.inventory.copperOre=0;const copper=island.civilization!.inventory.copper;
for(let i=0;i<30;i++)session.advanceTicks(1);assert.equal(island.civilization!.inventory.copper,copper);assert.match(smelter.workMessage!,/Thiếu 4 quặng/);
island.civilization!.inventory.copper=goodsCapacity(island);island.civilization!.inventory.copperOre=50;island.wood=100;
const woodLedger=()=>island.wood+(island.dailyLife?.campfire?.fuel??0)+island.npcs.reduce((sum,n)=>sum+(n.cargo?.wood??0),0);const woodBeforeFullTest=woodLedger();for(let i=0;i<20;i++)session.advanceTicks(1);assert.equal(island.civilization!.inventory.copperOre,50);assert.equal(woodLedger(),woodBeforeFullTest-(island.dailyLife?.settlementVersion===1?8:0));assert.match(smelter.workMessage!,/đầy/);
assert.throws(()=>decodeSave('{"version":99}'));
const legacy=migrateLegacy(JSON.stringify({version:4,island:{...island},unlocks:['fire','copper_smelting'],worldSeed:321,worldShape:'circle',worldSize:'small',era:4}));
assert.equal(legacy.island.civilization!.era,'stone');assert.equal(legacy.island.buildings.find(b=>b.id===house.id)!.level,2);assert(!legacy.island.civilization!.unlocks.includes('copper_smelting'));
for(const seed of [1,42,321,999])assert([...spawnResources(generateWorldMap(50,35,seed),seed).values()].some(n=>n.type==='copper_vein'));
console.log(`PASS: complete Stone→Bronze path without grants/elders, research and replay, real construction/batches, transition/save/resume, ore/smelting/lumber, upgrade materials, storage/input failures, legacy migration, seeded copper. Day ${Math.floor(island.tick/10)+1}.`);
