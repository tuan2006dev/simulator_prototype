import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { decodeSave, encodeSave } from '../src/core/SaveSystem';
import { SimulationSession, type PlayerCommand } from '../src/core/SimulationSession';
import { ensureClayDeposits, spawnResources } from '../src/renderer/ResourceSpawner';
import { generateWorldMap } from '../src/renderer/WorldMap';
import { BUILD_COSTS, canAfford, tickBuildings, assignWorker, foodCapacity } from '../src/renderer/BuildingManager';
import { buildingLock, goodsCapacity } from '../src/core/civilization';
import { TECH_TREE } from '../src/core/research';
import type { BuildingType } from '../src/core/types';

// Continue a real Stone→Bronze playthrough. No stock or research grants for the economic path.
const save = decodeSave(readFileSync('artifacts/bronze-playable-save.json','utf8'));
const {island,map,config}=save, c=island.civilization!;
map.tiles[19].fill('shallow_water');map.landTiles=map.landTiles.filter(t=>t.y<19);
assert(ensureClayDeposits(map,island.resources)>0);
const clayBefore=[...island.resources].filter(([,n])=>n.type==='clay_deposit').reduce((s,[,n])=>s+n.amount,0);
for(const b of island.buildings)b.workers=[];
for(const [i,n] of island.npcs.entries()){n.buildingWork=undefined;n.path=undefined;n.laborTask=undefined;n.laborRetryAt=0;n.laborRole=i<8?'food':i<10?'wood':'stone';}
let sequence=0;
const session=new SimulationSession(island,map);
const submit=(command:PlayerCommand)=>session.submit({playerId:'bronze-economy',sequence:++sequence,command});
const until=(condition:()=>boolean,limit=5000)=>{
 for(let i=0;i<limit&&!condition();i++)session.advanceTicks(1);
 assert(condition(),`Unreachable condition at tick ${island.tick}: ${JSON.stringify({wood:island.wood,stone:island.stone,food:island.sharedFood,goods:c.inventory,research:c.research,buildings:island.buildings.map(b=>[b.type,b.workMessage])})}`);
 assert.equal(island.npcs.filter(n=>n.isAlive).length,12,'Economic path must sustain residents');
};
const farm=island.buildings.find(b=>b.type==='farm')!,camp=island.buildings.find(b=>b.type==='lumbercamp')!;
assert(submit({type:'assign_worker',buildingId:farm.id,npcId:island.npcs[8].id}).accepted);
assert(submit({type:'assign_worker',buildingId:camp.id,npcId:island.npcs[9].id}).accepted);
const mill=island.buildings.find(b=>b.type==='sawmill')!;
assert(submit({type:'assign_worker',buildingId:mill.id,npcId:island.npcs[2].id}).accepted);
until(()=>c.inventory.lumber>=4);
submit({type:'remove_worker',buildingId:mill.id,npcId:island.npcs[2].id});
writeFileSync('artifacts/bronze-expansion-start-save.json',encodeSave(island,map,config));
assert.match(buildingLock(island,'clay_pit')!,/Gạch và đồ gốm/);
for(const id of ['ceramics','grain_processing']){
 const tech=TECH_TREE.find(t=>t.id===id)!;
 until(()=>island.wood>=tech.costWood&&island.stone>=tech.costStone&&island.sharedFood>=tech.costFood);
 const command={playerId:'bronze-economy',sequence:++sequence,command:{type:'start_research' as const,techId:id}};
 assert(session.submit(command).accepted);const wood=island.wood;assert(session.submit(command).duplicate);assert.equal(island.wood,wood);
 until(()=>c.unlocks.includes(id));
}
const stock=island.wood;assert(!submit({type:'build',buildingType:'clay_pit',tileX:0,tileY:0}).accepted);assert.equal(island.wood,stock,'No clay nearby must reject before charging');
const build= (type:BuildingType,x:number,y:number)=>{
 until(()=>canAfford(island,BUILD_COSTS[type]));
 const goods={...c.inventory},cost=BUILD_COSTS[type];
 const command={playerId:'bronze-economy',sequence:++sequence,command:{type:'build' as const,buildingType:type,tileX:x,tileY:y}};
 assert(session.submit(command).accepted,type);
 assert(session.submit(command).duplicate);
 for(const [kind,amount] of Object.entries(cost.goods??{}))assert.equal(c.inventory[kind as keyof typeof c.inventory],goods[kind as keyof typeof goods]-amount,'Construction goods charged once');
 const b=island.buildings.at(-1)!;
 assert(submit({type:'assign_worker',buildingId:b.id,npcId:island.npcs[10].id}).accepted);
 session.advanceTicks(1);
 const resumed=decodeSave(encodeSave(island,map,config));assert.equal(resumed.island.buildings.at(-1)!.progress,b.progress);
 until(()=>b.complete);return b;
};
const pit=build('clay_pit',4,16);until(()=>c.inventory.clay>=40);submit({type:'remove_worker',buildingId:pit.id,npcId:island.npcs[10].id});
assert([...island.resources].filter(([,n])=>n.type==='clay_deposit').reduce((s,[,n])=>s+n.amount,0)<clayBefore);
const kiln=build('brick_kiln',7,16);until(()=>c.inventory.bricks>=8);submit({type:'remove_worker',buildingId:kiln.id,npcId:island.npcs[10].id});
const pottery=build('pottery_workshop',10,16);const oldCapacity=goodsCapacity(island);until(()=>c.inventory.pottery>=4);assert(goodsCapacity(island)>oldCapacity);submit({type:'remove_worker',buildingId:pottery.id,npcId:island.npcs[10].id});
const field=build('wheat_field',13,16);until(()=>c.inventory.wheat>=24);submit({type:'remove_worker',buildingId:field.id,npcId:island.npcs[10].id});
const oven=build('bakery',16,16);
// Manage the surplus through player commands: a full food store must block bread.
// Pause competing food sources rather than granting storage or deleting food.
const farmWorkers=[...farm.workers];
for(const id of farmWorkers) submit({type:'remove_worker',buildingId:farm.id,npcId:id});
const foodWorkers=island.npcs.filter(n=>n.laborRole==='food'&&!island.buildings.some(b=>b.workers.includes(n.id))).map(n=>n.id);
for(const id of foodWorkers) submit({type:'assign_labor',npcId:id,role:'idle'});
until(()=>(oven.productionBatches??0)>0);assert.match(oven.workMessage!,/40 thức ăn/);
for(const id of foodWorkers) submit({type:'assign_labor',npcId:id,role:'food'});
for(const id of farmWorkers) submit({type:'assign_worker',buildingId:farm.id,npcId:id});
for(const [i,b] of [pit,kiln,pottery,field,oven].entries())assert(submit({type:'assign_worker',buildingId:b.id,npcId:island.npcs[i+3].id}).accepted);
for(let i=0;i<100;i++)session.advanceTicks(1);
assert.equal(island.npcs.filter(n=>n.isAlive).length,12);
writeFileSync('artifacts/bronze-expanded-save.json',encodeSave(island,map,config));
const restored=decodeSave(encodeSave(island,map,config));assert.deepEqual(restored.island.civilization!.inventory,c.inventory);assert.equal(restored.island.buildings.filter(b=>['clay_pit','brick_kiln','pottery_workshop','wheat_field','bakery'].includes(b.type)&&b.complete).length,5);

// Isolate recipes to verify exact input/output, including full storage and absent fuel.
// Production-only fixture: transport was verified in the played path above.
island.npcs[11].cargo=undefined;
for(const b of island.buildings)b.workers=[];
const worker=island.npcs[11];worker.position={tileX:oven.tileX,tileY:oven.tileY};worker.status='idle';worker.survivalBlocked=false;worker.needs.hunger=0;worker.actionTarget=undefined;worker.path=undefined;
for(const [building,clayInput,woodInput,kind,output] of [[kiln,4,2,'bricks',4],[pottery,3,1,'pottery',2]] as const){
 worker.position={tileX:building.tileX,tileY:building.tileY};assignWorker(island,building.id,worker.id);worker.buildingWork={buildingId:building.id,ticks:9};
 c.inventory.clay=clayInput;island.wood=woodInput;c.inventory[kind]=0;
 tickBuildings(island,island.resources,map);assert.equal(c.inventory.clay,0);assert.equal(island.wood,0);assert.equal(c.inventory[kind],output);
 for(const b of island.buildings)b.workers=[];
}
worker.position={tileX:field.tileX,tileY:field.tileY};assignWorker(island,field.id,worker.id);worker.buildingWork={buildingId:field.id,ticks:9};
island.resources.set('13,17',{type:'fertile_soil',amount:1,maxAmount:1,regenRate:0});c.inventory.wheat=0;island.sharedFood=0;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.wheat,15);assert.equal(island.sharedFood,0,'Raw wheat must not double-count as edible food');
for(const b of island.buildings)b.workers=[];
worker.position={tileX:oven.tileX,tileY:oven.tileY};
assignWorker(island,oven.id,worker.id);worker.buildingWork={buildingId:oven.id,ticks:9};
c.inventory.wheat=8;island.wood=2;island.sharedFood=foodCapacity(island)-40;
tickBuildings(island,island.resources,map);assert.equal(island.sharedFood,foodCapacity(island));assert.equal(c.inventory.wheat,0);assert.equal(island.wood,0);
c.inventory.wheat=8;island.wood=2;worker.buildingWork!.ticks=9;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.wheat,8);assert.equal(island.wood,2);assert.match(oven.workMessage!,/đầy/);
island.sharedFood=0;island.wood=1;worker.buildingWork!.ticks=9;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.wheat,8);assert.equal(island.sharedFood,0);assert.match(oven.workMessage!,/Thiếu 2 gỗ/);
for(const b of island.buildings)b.workers=[];
worker.position={tileX:kiln.tileX,tileY:kiln.tileY};assignWorker(island,kiln.id,worker.id);worker.buildingWork={buildingId:kiln.id,ticks:9};c.inventory.bricks=goodsCapacity(island);c.inventory.clay=10;island.wood=10;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.clay,10);assert.equal(island.wood,10);
for(const b of island.buildings)b.workers=[];
for(const node of island.resources.values())if(node.type==='clay_deposit')node.amount=0;
worker.position={tileX:pit.tileX,tileY:pit.tileY};assignWorker(island,pit.id,worker.id);worker.buildingWork={buildingId:pit.id,ticks:9};const clay=c.inventory.clay;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.clay,clay);assert.match(pit.workMessage!,/Hết đất sét/);assert.equal(ensureClayDeposits(map,island.resources),0,'Loading must never replenish exhausted clay');

const old=JSON.parse(readFileSync('artifacts/bronze-playable-save.json','utf8'));
for(const kind of ['clay','bricks','pottery','wheat']){delete old.island.civilization.inventory[kind];delete old.island.civilization.produced[kind];}
assert.equal(decodeSave(JSON.stringify(old)).island.civilization!.inventory.clay,0,'Existing version 5 must migrate new keys');
old.island.civilization.inventory.clay=-1;assert.throws(()=>decodeSave(JSON.stringify(old)),/Kho hàng/);
for(const seed of [1,42,321,999]){
 const world=generateWorldMap(50,35,seed),nodes=spawnResources(world,seed);
 assert([...nodes.values()].some(n=>n.type==='clay_deposit'),`Seed ${seed} needs obtainable clay`);
 assert.equal(ensureClayDeposits(world,nodes),0);
}
console.log('PASS: real Bronze research→clay→bricks/pottery→wheat/bread, construction goods/replay, onsite production, pottery capacity, save compatibility, full storage/no fuel/depleted source and shoreline generation.');
