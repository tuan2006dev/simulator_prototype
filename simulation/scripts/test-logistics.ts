import {tickDailyLife} from '../src/core/dailyLife';
import {initializeWorkforce,planWorkforce} from '../src/core/workforce';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createIsland} from '../src/core/factory';
import {createCivilization,goodsCapacity} from '../src/core/civilization';
import {initializeLogistics,tickLogistics,RECIPES,processLocalRecipe,WAREHOUSE,BUFFER_CAPACITY,sumStock} from '../src/core/logistics';
import {tickBuildings} from '../src/renderer/BuildingManager';
import {decodeSave,encodeSave} from '../src/core/SaveSystem';
import {SimulationSession} from '../src/core/SimulationSession';
import type {WorldMap} from '../src/renderer/WorldMap';
import type {Building,BuildingType,LogisticsGood} from '../src/core/types';
const map:WorldMap={width:24,height:10,tiles:Array.from({length:10},()=>Array(24).fill('grass')),landTiles:[]};
for(let y=0;y<10;y++)for(let x=0;x<24;x++)map.landTiles.push({x,y});
const island=createIsland('Hậu cần',4);island.civilization=createCivilization();island.dailyLife={campfire:{tileX:2,tileY:2}};
for(const n of island.npcs){n.age=25;n.occupation='gatherer';n.position={tileX:2,tileY:2};n.laborRole='idle';n.needs.hunger=0;n.needs.rest=0;}
const worker=island.npcs[0],carrier=island.npcs[1];carrier.laborRole='haul';
const mill:Building={id:'mill',type:'sawmill',tileX:20,tileY:2,complete:true,progress:100,workers:[worker.id]};island.buildings=[mill];initializeLogistics(island);island.wood=40;
const cfg={mode:'local' as const,seed:321,size:'small' as const,width:24,height:10,population:4};
const step=()=>{for(const n of island.npcs)n.survivalBlocked=false;tickLogistics(island,map);};
step();assert.equal(island.wood,22);assert.equal(carrier.freight!.amount,18);assert.equal(mill.buffer!.input.wood??0,0,'No remote credit');
carrier.survivalBlocked=true;tickLogistics(island,map);assert.equal(carrier.position!.tileX,2,'Rest interrupts freight without movement');
const loaded=decodeSave(encodeSave(island,map,cfg));assert.deepEqual(loaded.island.npcs[1].freight,carrier.freight);
for(let i=0;i<20&&carrier.freight;i++)step();assert.equal(mill.buffer!.input.wood,18);assert.equal(carrier.freight,undefined);
worker.position={tileX:20,tileY:2};worker.survivalBlocked=false;for(let i=0;i<5;i++)tickBuildings(island,island.resources,map);
assert.equal(mill.buffer!.input.wood,12);assert.equal(mill.buffer!.output.lumber,4);assert.equal(island.civilization.inventory.lumber,0);assert.equal(island.civilization.produced.lumber,4);
mill.workers=[];step();assert.equal(carrier.freight!.good,'lumber');assert.equal(mill.buffer!.output.lumber,0);
const session=new SimulationSession(island,map);assert(session.submit({playerId:'test',sequence:1,command:{type:'assign_labor',npcId:carrier.id,role:'food'}}).accepted);assert.equal(carrier.freight!.amount,4);
assert(!session.submit({playerId:'test',sequence:2,command:{type:'manual_action',npcId:carrier.id,action:'gather_food'}}).accepted);
for(let y=0;y<10;y++)map.tiles[y][8]='deep_water';step();assert.equal(carrier.freight!.amount,4);assert.match(carrier.laborMessage!,/không có đường/);assert.equal(island.civilization.inventory.lumber,0);
for(let y=0;y<10;y++)map.tiles[y][8]='grass';island.civilization.inventory.lumber=goodsCapacity(island);
for(let i=0;i<8;i++)step();assert.equal(carrier.freight!.amount,4);assert.match(carrier.laborMessage!,/đầy/);
island.civilization.inventory.lumber=0;step();assert.equal(carrier.freight,undefined);assert.equal(island.civilization.inventory.lumber,4);assert.equal(island.civilization.produced.lumber,4,'Delivery is not a second production');
// Every factory consumes its own inputs exactly once; a full output buffer consumes nothing.
for(const [type,r] of Object.entries(RECIPES)){
 const b:Building={id:'recipe',type:type as BuildingType,tileX:3,tileY:3,complete:true,progress:100,workers:[],buffer:{input:{...r!.inputs},output:{}}};
 if(['prototype_workshop','component_factory'].includes(b.type))island.power={version:1,clockTicks:0,supply:2,demand:2,supplied:[b.id],steadyTicks:0};
 processLocalRecipe(island,b);assert.equal(sumStock(b.buffer!.input),0);assert.equal(b.buffer!.output[r!.output],r!.yield);
 b.buffer!.input={...r!.inputs};b.buffer!.output={[r!.output]:BUFFER_CAPACITY};const before=JSON.stringify(b.buffer.input);processLocalRecipe(island,b);assert.equal(JSON.stringify(b.buffer.input),before);
}
island.power=undefined;
// Two couriers cannot duplicate one output or overfill the destination.
carrier.laborRole='haul';island.npcs[2].laborRole='haul';for(const n of [carrier,island.npcs[2]])n.position={tileX:20,tileY:2};mill.buffer!.output={lumber:40};island.civilization.inventory.lumber=90;
step();assert.equal(mill.buffer!.output.lumber,30);assert.equal(island.npcs.filter(n=>n.freight).length,1);assert.equal(carrier.freight!.amount,10);
const bad=JSON.parse(encodeSave(island,map,cfg));bad.island.npcs[1].freight.amount=31;assert.throws(()=>decodeSave(JSON.stringify(bad)),/hậu cần/);
const badBuffer=JSON.parse(encodeSave(island,map,cfg));badBuffer.island.buildings[0].buffer.input.wood=61;assert.throws(()=>decodeSave(JSON.stringify(badBuffer)),/xưởng/);
// Raw extraction debits the map, then waits in the local buffer rather than teleporting.
const rawCamp:Building={id:'raw-camp',type:'lumbercamp',tileX:4,tileY:4,complete:true,progress:100,workers:[worker.id]};island.buildings.push(rawCamp);initializeLogistics(island);worker.position={tileX:4,tileY:4};worker.survivalBlocked=false;worker.status='working';island.resources.set('4,4',{type:'wood_tree',amount:100,maxAmount:100,regenRate:0});const storedWood=island.wood;
for(let t=0;t<5;t++)tickBuildings(island,island.resources,map);assert.equal(island.resources.get('4,4')!.amount,94);assert.equal(rawCamp.buffer!.output.wood,6);assert.equal(island.wood,storedWood);
rawCamp.buffer!.output.wood=60;for(let t=0;t<5;t++)tickBuildings(island,island.resources,map);assert.equal(island.resources.get('4,4')!.amount,94);rawCamp.workers=[];
// An urgent meal may consume actual carried Food, never create Food or deadlock delivery.
const hungry=island.npcs[3];hungry.freight={good:'food',amount:10,target:WAREHOUSE};hungry.needs.hunger=90;hungry.privateFood=0;island.sharedFood=0;island.tick=1;tickDailyLife(island,map);assert.equal(hungry.freight,undefined);assert(hungry.needs.hunger<90);assert.equal(island.sharedFood,0);hungry.needs.hunger=0;
// Auto claiming protects manual jobs and chooses a hauler only after food coverage.
initializeWorkforce(island,true);island.workforce!.enabled=true;island.sharedFood=200;for(const n of island.npcs){n.survivalBlocked=false;n.freight=undefined;n.haulTask=undefined;n.laborMode='manual';n.laborRole='food';}carrier.laborMode='auto';carrier.laborRole='idle';mill.buffer!.output={lumber:4};island.civilization.inventory.lumber=0;planWorkforce(island,map);assert.equal(carrier.laborRole,'haul');
console.log('PASS: physical pickup/delivery, 30-unit freight, rest/role-change/blocked/full-store preservation, all factory recipes including steel, cut stone and powered machinery, no double production, concurrent carriers and save validation.');
// Continue an actual played Bronze economy, without granting materials or technology.
const played=decodeSave(readFileSync('artifacts/bronze-playable-save.json','utf8'));initializeLogistics(played.island);
const free=played.island.npcs.filter(n=>!played.island.buildings.some(b=>b.workers.includes(n.id)));
const actual=new SimulationSession(played.island,played.map);let seq=0;for(const [i,n] of free.entries())actual.submit({playerId:'played',sequence:++seq,command:{type:'assign_labor',npcId:n.id,role:i<2?'haul':'food'}});
const beforeLumber=played.island.civilization!.produced.lumber,beforeCopper=played.island.civilization!.produced.copper;
for(let t=0;t<400;t++)actual.advanceTicks(1);
assert.equal(played.island.npcs.filter(n=>n.isAlive).length,12);assert(played.island.sharedFood>0);assert(played.island.civilization!.produced.lumber>beforeLumber);assert(played.island.civilization!.produced.copper>beforeCopper);
assert(played.island.civilization!.inventory.copper>12||played.island.civilization!.inventory.lumber>26,'Products actually delivered to village stock');
decodeSave(encodeSave(played.island,played.map,played.config));writeFileSync('artifacts/logistics-played-save.json',encodeSave(played.island,played.map,played.config));
console.log(`PASS: actual played Bronze economy continued 40 days, 12 residents alive, Food ${played.island.sharedFood.toFixed(1)}, copper +${played.island.civilization!.produced.copper-beforeCopper}, lumber +${played.island.civilization!.produced.lumber-beforeLumber}.`);

// Iron mines, smelting and weaving use the same physical delivery rules.
const iron=decodeSave(readFileSync('artifacts/iron-playable-save.json','utf8'));initializeLogistics(iron.island);const ironSession=new SimulationSession(iron.island,iron.map);let ironSequence=0;
for(const b of iron.island.buildings.filter(b=>!['farm','lumbercamp','tradepost'].includes(b.type)))for(const id of [...b.workers])assert(ironSession.submit({playerId:'iron-logistics',sequence:++ironSequence,command:{type:'remove_worker',buildingId:b.id,npcId:id}}).accepted);
const ironFree=iron.island.npcs.filter(n=>n.isAlive&&n.age>=18&&!iron.island.buildings.some(b=>b.workers.includes(n.id)));
for(const [i,type] of ['iron_mine','coal_mine','iron_smelter','flax_field','weaver'].entries()){
 const b=iron.island.buildings.find(b=>b.type===type)!;assert(ironSession.submit({playerId:'iron-logistics',sequence:++ironSequence,command:{type:'assign_worker',buildingId:b.id,npcId:ironFree[i].id}}).accepted);
}
for(const [i,n] of ironFree.slice(5).entries())assert(ironSession.submit({playerId:'iron-logistics',sequence:++ironSequence,command:{type:'assign_labor',npcId:n.id,role:i<3?'haul':'food'}}).accepted);
const oldIron=iron.island.civilization!.produced.iron,oldCloth=iron.island.civilization!.produced.cloth;
for(let t=0;t<400;t++)ironSession.advanceTicks(1);
assert.equal(iron.island.npcs.filter(n=>n.isAlive).length,25);assert(iron.island.sharedFood>0);assert(iron.island.civilization!.produced.iron>oldIron);assert(iron.island.civilization!.produced.cloth>oldCloth);
decodeSave(encodeSave(iron.island,iron.map,iron.config));writeFileSync('artifacts/logistics-iron-save.json',encodeSave(iron.island,iron.map,iron.config));console.log(`PASS: Iron physical smelting/weaving after 40 days, 25 alive, Food ${iron.island.sharedFood.toFixed(1)}, iron +${iron.island.civilization!.produced.iron-oldIron}, cloth +${iron.island.civilization!.produced.cloth-oldCloth}.`);
