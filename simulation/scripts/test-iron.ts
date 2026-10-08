import assert from 'node:assert/strict';
import { readFileSync,writeFileSync } from 'node:fs';
import { decodeSave,encodeSave } from '../src/core/SaveSystem';
import { reserveEntityIds } from '../src/core/factory';
import { SimulationSession,type PlayerCommand } from '../src/core/SimulationSession';
import { ironRequirements,goodsCapacity,buildingLock } from '../src/core/civilization';
import { BUILD_COSTS,canAfford,upgradeCost,tickBuildings,assignWorker } from '../src/renderer/BuildingManager';
import { tickTrades } from '../src/core/trade';
import { TECH_TREE } from '../src/core/research';
import { ensureIronDeposits,spawnResources } from '../src/renderer/ResourceSpawner';
import { generateWorldMap } from '../src/renderer/WorldMap';
import type { BuildingType } from '../src/core/types';

const data=decodeSave(readFileSync('artifacts/bronze-expanded-save.json','utf8'));
const {island,map,config}=data,c=island.civilization!;
reserveEntityIds(island);let session=new SimulationSession(island,map),sequence=0;
const submit=(command:PlayerCommand)=>session.submit({playerId:'iron-test',sequence:++sequence,command});
const until=(condition:()=>boolean,max=10000)=>{
 for(let i=0;i<max&&!condition();i++){session.advanceTicks(1);if(!island.npcs.every(n=>n.isAlive))console.error(JSON.stringify({tick:island.tick,food:island.sharedFood,wood:island.wood,stone:island.stone,npcs:island.npcs.map(n=>({id:n.id,alive:n.isAlive,role:n.laborRole,hunger:n.needs.hunger,cargo:n.cargo,message:n.laborMessage})),buildings:island.buildings.map(b=>({type:b.type,workers:b.workers,message:b.workMessage}))}));assert(island.npcs.every(n=>n.isAlive),'No settler should die along the Iron path');}
 assert(condition(),`Unreachable at ${island.tick}: ${JSON.stringify({pop:island.npcs.length,food:island.sharedFood,wood:island.wood,stone:island.stone,goods:c.inventory,research:c.research,requirements:ironRequirements(island),work:island.buildings.map(b=>[b.type,b.workMessage])})}`);
};
for(const b of island.buildings)b.workers=[];
for(const [i,n] of island.npcs.entries()){n.buildingWork=undefined;n.path=undefined;n.laborTask=undefined;n.laborRetryAt=0;n.laborRole=i===10?'stone':i===11?'wood':'food';}
const assign=(type:BuildingType,index:number)=>{const b=island.buildings.find(b=>b.type===type)!;assert(submit({type:'assign_worker',buildingId:b.id,npcId:island.npcs[index].id}).accepted);return b;};
assign('farm',8);assign('lumbercamp',9);
assert(!submit({type:'develop_era'}).accepted);assert(buildingLock(island,'iron_mine'));assert(!submit({type:'start_research',techId:'iron_smelting'}).accepted);
// Immigration pays real food/wood. Find an empty place again after every harvest movement.
while(island.npcs.length<25){
 until(()=>island.sharedFood>=60&&island.wood>=20);
 const site=map.landTiles.find(t=>t.x>=1&&t.x<=17&&t.y>=11&&t.y<=15&&!island.buildings.some(b=>b.tileX===t.x&&b.tileY===t.y)&&!island.npcs.some(n=>n.position?.tileX===t.x&&n.position?.tileY===t.y))!;
 assert(submit({type:'invite_settler',tileX:site.x,tileY:site.y}).accepted);
}
assert.equal(new Set(island.npcs.map(n=>n.id)).size,25);
const study=(id:string)=>{
 const t=TECH_TREE.find(t=>t.id===id)!;
 until(()=>island.wood>=t.costWood&&island.stone>=t.costStone&&island.sharedFood>=t.costFood&&Object.entries(t.costGoods??{}).every(([k,a])=>c.inventory[k as keyof typeof c.inventory]>=a));
 assert(submit({type:'start_research',techId:id}).accepted,id);until(()=>c.unlocks.includes(id));
};
study('writing');study('iron_survey');
assign('copper_mine',7);assign('smelter',6);assign('sawmill',5);assign('clay_pit',4);assign('brick_kiln',3);
until(()=>c.produced.copper>=50&&c.produced.lumber>=30&&c.inventory.copper>=20&&c.inventory.lumber>=30&&c.inventory.bricks>=20);
until(()=>ironRequirements(island).every(r=>r.met));
assert.equal(c.era,'bronze','Meeting conditions must never advance automatically');
writeFileSync('artifacts/iron-ready-save.json',encodeSave(island,map,config));
const envelope={playerId:'iron-test',sequence:++sequence,command:{type:'develop_era' as const}},before={...c.inventory};
assert(session.submit(envelope).accepted);assert.equal(c.inventory.lumber,before.lumber-30);assert.equal(c.inventory.copper,before.copper-20);assert.equal(c.inventory.bricks,before.bricks-20);
assert(session.submit(envelope).duplicate);assert.equal(c.inventory.copper,before.copper-20);assert(!submit({type:'develop_era'}).accepted);
session.advanceTicks(7);const restored=decodeSave(encodeSave(island,map,config));assert.equal(restored.island.civilization!.transition!.workTicks,7);
Object.assign(island,restored.island);session=new SimulationSession(island,restored.map);sequence=0;
// Keep the captured civilization reference in this test stable when restoring its enclosing island.
Object.assign(c,island.civilization);island.civilization=c;
until(()=>c.era==='iron');assert(!submit({type:'develop_era'}).accepted,'Modern must stay unavailable');
study('iron_smelting');study('textiles');
const build=(type:BuildingType,x:number,y:number)=>{
 until(()=>canAfford(island,BUILD_COSTS[type]));assert(submit({type:'build',buildingType:type,tileX:x,tileY:y}).accepted,type);
 const b=island.buildings.at(-1)!;assert(submit({type:'assign_worker',buildingId:b.id,npcId:island.npcs[12].id}).accepted);until(()=>b.complete);return b;
};
// Actual deposits were added to free grass tiles during save migration.
const ironKey=[...island.resources].find(([,n])=>n.type==='iron_vein')![0].split(',').map(Number),coalKey=[...island.resources].find(([,n])=>n.type==='coal_deposit')![0].split(',').map(Number);
const mine=build('iron_mine',ironKey[0],ironKey[1]);until(()=>c.inventory.ironOre>=80);submit({type:'remove_worker',buildingId:mine.id,npcId:island.npcs[12].id});
const coal=build('coal_mine',coalKey[0],coalKey[1]);until(()=>c.inventory.coal>=30);submit({type:'remove_worker',buildingId:coal.id,npcId:island.npcs[12].id});
const furnace=build('iron_smelter',13,13);until(()=>c.inventory.iron>=25);submit({type:'remove_worker',buildingId:furnace.id,npcId:island.npcs[12].id});
const flax=build('flax_field',14,13);until(()=>c.inventory.fiber>=60);submit({type:'remove_worker',buildingId:flax.id,npcId:island.npcs[12].id});
const loom=build('weaver',15,13);until(()=>c.inventory.cloth>=15);submit({type:'remove_worker',buildingId:loom.id,npcId:island.npcs[12].id});
study('trade_routes');study('iron_construction');
const post=build('tradepost',16,13);
const house=island.buildings.find(b=>b.type==='house')!,cost=upgradeCost(house,island);
until(()=>canAfford(island,cost));const ironBefore=c.inventory.iron;
writeFileSync('artifacts/iron-before-upgrade-save.json',encodeSave(island,map,config));
assert(submit({type:'upgrade_building',buildingId:house.id}).accepted);assert.equal(c.inventory.iron,ironBefore-10);assert(!submit({type:'upgrade_building',buildingId:house.id}).accepted);
submit({type:'assign_worker',buildingId:house.id,npcId:island.npcs[13].id});session.advanceTicks(5);
const upgradeResume=decodeSave(encodeSave(island,map,config)),resumedHouse=upgradeResume.island.buildings.find(b=>b.id===house.id)!;
assert.deepEqual(resumedHouse.upgrade,house.upgrade);assert.equal(upgradeResume.island.civilization!.inventory.iron,c.inventory.iron);
new SimulationSession(upgradeResume.island,upgradeResume.map).advanceTicks(1);assert(resumedHouse.upgrade!.progress>=house.upgrade!.progress,'Saved level-3 construction can continue without charging again');
until(()=>house.level===3);assert.equal(house.technology,'iron');assert.equal(buildingLock(island,'house',3),null);
const copperBefore=c.inventory.copper,coalBefore=c.inventory.coal,producedCoal=c.produced.coal;
const trade={playerId:'iron-test',sequence:++sequence,command:{type:'start_trade' as const,buildingId:post.id,offerId:'copper_for_coal'}};
assert(session.submit(trade).accepted);assert(session.submit(trade).duplicate);assert.equal(c.inventory.copper,copperBefore-8);assert.equal(c.inventory.coal,coalBefore);assert(!submit({type:'start_trade',buildingId:post.id,offerId:'copper_for_coal'}).accepted);
const carrier=island.npcs.find(n=>n.id===post.shipment!.workerId)!;const position={...carrier.position!};until(()=>carrier.position!.tileX!==position.tileX||carrier.position!.tileY!==position.tileY,100);assert(Math.max(Math.abs(carrier.position!.tileX-position.tileX),Math.abs(carrier.position!.tileY-position.tileY))<=(island.dailyLife?6:1),'Carrier movement stays within the authoritative per-tick walking limit');
writeFileSync('artifacts/iron-trade-in-progress-save.json',encodeSave(island,map,config));
const travel=decodeSave(encodeSave(island,map,config));assert.deepEqual(travel.island.buildings.find(b=>b.id===post.id)!.shipment,post.shipment);
until(()=>!post.shipment);assert.equal(c.inventory.coal,coalBefore+10);assert.equal(c.produced.coal,producedCoal,'Imports must not inflate production achievements');assert.equal(c.completedTrades,1);
writeFileSync('artifacts/iron-playable-save.json',encodeSave(island,map,config));

// Exact recipes, shortage/full-store atomicity and depleted mine behavior.
island.npcs[24].cargo=undefined;
for(const b of island.buildings)b.workers=[];
const tester=island.npcs[24];tester.status='idle';tester.survivalBlocked=false;tester.needs.hunger=0;tester.actionTarget=undefined;tester.path=undefined;
tester.position={tileX:furnace.tileX,tileY:furnace.tileY};assignWorker(island,furnace.id,tester.id);tester.buildingWork={buildingId:furnace.id,ticks:9};
c.inventory.ironOre=4;c.inventory.coal=2;c.inventory.iron=0;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.ironOre,0);assert.equal(c.inventory.coal,0);assert.equal(c.inventory.iron,2);
c.inventory.ironOre=4;c.inventory.coal=1;tester.buildingWork!.ticks=9;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.ironOre,4);assert.equal(c.inventory.coal,1);assert.match(furnace.workMessage!,/Thiếu 2 than/);
c.inventory.coal=2;c.inventory.iron=goodsCapacity(island);tester.buildingWork!.ticks=9;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.ironOre,4);assert.equal(c.inventory.coal,2);
for(const b of island.buildings)b.workers=[];
tester.position={tileX:loom.tileX,tileY:loom.tileY};assignWorker(island,loom.id,tester.id);tester.buildingWork={buildingId:loom.id,ticks:9};c.inventory.fiber=6;c.inventory.cloth=0;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.fiber,0);assert.equal(c.inventory.cloth,3);
for(const b of island.buildings)b.workers=[];
for(const node of island.resources.values())if(node.type==='iron_vein')node.amount=0;
tester.position={tileX:mine.tileX,tileY:mine.tileY};assignWorker(island,mine.id,tester.id);tester.buildingWork={buildingId:mine.id,ticks:9};const ore=c.inventory.ironOre;
tickBuildings(island,island.resources,map);assert.equal(c.inventory.ironOre,ore);assert.match(mine.workMessage!,/Hết quặng sắt/);

// Full destination, cancellation/reassignment and blocked route preserve exactly one escrow.
for(const b of island.buildings)b.workers=[];
assignWorker(island,post.id,carrier.id);carrier.position={tileX:post.tileX,tileY:post.tileY};carrier.status='idle';carrier.actionTarget=undefined;carrier.needs.hunger=0;
carrier.laborRetryAt=0;
c.inventory.copper=20;c.inventory.coal=0;
assert(submit({type:'start_trade',buildingId:post.id,offerId:'copper_for_coal'}).accepted);assert.equal(c.inventory.copper,12);
const shipment=post.shipment!;shipment.stage='returning';carrier.position={tileX:post.tileX,tileY:post.tileY};c.inventory.coal=goodsCapacity(island);
tickTrades(island,map);assert(post.shipment);assert.match(post.workMessage!,/chờ kho/);assert.equal(c.inventory.copper,12);
assert(submit({type:'cancel_trade',buildingId:post.id}).accepted);assert.equal(c.inventory.copper,20);assert(!submit({type:'cancel_trade',buildingId:post.id}).accepted);assert.equal(c.inventory.copper,20);
c.inventory.coal=0;assert(submit({type:'start_trade',buildingId:post.id,offerId:'copper_for_coal'}).accepted);
const destination=post.shipment!.destination;map.tiles[destination.y][destination.x]='deep_water';
// Make the route impossible with water around the worker, then explicitly cancel.
for(const dy of [-1,0,1])for(const dx of [-1,0,1])if(dx||dy)map.tiles[post.tileY+dy][post.tileX+dx]='deep_water';
tickTrades(island,map);assert(post.shipment);assert.match(post.workMessage!,/chặn đường/);submit({type:'cancel_trade',buildingId:post.id});assert.equal(c.inventory.copper,20);

for(const seed of [1,42,321,999]){
 const world=generateWorldMap(50,35,seed),nodes=spawnResources(world,seed);assert([...nodes.values()].some(n=>n.type==='iron_vein'));assert([...nodes.values()].some(n=>n.type==='coal_deposit'));
 for(const n of nodes.values())if(['iron_vein','coal_deposit'].includes(n.type))n.amount=0;
 assert.equal(ensureIronDeposits(world,nodes),0,'Depleted minerals must never respawn');
}
console.log('PASS: real Bronze→Iron with 25 paid settlers, writing/survey/production/reserve gates, replay/transition/save, iron/coal/fiber/cloth, paid level 3, moving roundtrip trade/escrow/import accounting, full storage/cancel/blocked route and seeded finite minerals.');
