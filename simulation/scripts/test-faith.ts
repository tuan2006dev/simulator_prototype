import assert from 'node:assert/strict';
import {createIsland} from '../src/core/factory';
import {createCivilization} from '../src/core/civilization';
import {initializeFaith,faithRate,tickFaith,castBlessing,blessingCost,workMultiplier,FAITH_CAP} from '../src/core/FaithManager';
import {SimulationSession} from '../src/core/SimulationSession';
import {encodeSave,decodeSave} from '../src/core/SaveSystem';
import {tickBuildings} from '../src/renderer/BuildingManager';
import {initializeEquipment,startToolCraft,tickToolCraft} from '../src/core/equipment';
import type {WorldMap} from '../src/renderer/WorldMap';
const map:WorldMap={width:18,height:12,tiles:Array.from({length:12},()=>Array(18).fill('grass')),landTiles:[]};for(let y=0;y<12;y++)for(let x=0;x<18;x++)map.landTiles.push({x,y});
const config={mode:'local' as const,seed:321,size:'small' as const,width:18,height:12,population:3};
function world(){const s=createIsland('Niềm tin',3);s.civilization=createCivilization();s.sharedFood=0;s.wood=20;s.stone=20;for(const n of s.npcs){n.age=25;n.occupation='gatherer';n.laborRole='idle';n.position=null;n.privateFood=0;n.needs={hunger:0,rest:0,safety:0,social:0};}s.npcs[0].position={tileX:2,tileY:2};initializeFaith(s);return s;}
const s=world(),n=s.npcs[0];assert.equal(s.faith!.amount,0);assert.equal(faithRate(s),.2);n.needs={hunger:50,rest:50,safety:50,social:50};assert(Math.abs(faithRate(s)-.1125)<1e-8);s.buildings.push({id:'temple',type:'temple',tileX:3,tileY:3,complete:true,progress:100,level:2,workers:[]});assert(Math.abs(faithRate(s)-.5125)<1e-8);s.buildings=[];n.needs={hunger:0,rest:0,safety:0,social:0};
for(let i=0;i<100;i++)tickFaith(s);assert(Math.abs(s.faith!.amount-12)<1e-8);s.faith!.amount=FAITH_CAP;tickFaith(s);assert.equal(s.faith!.amount,FAITH_CAP);
const empty=world();empty.npcs[0].position=null;tickFaith(empty);assert.equal(empty.faith!.amount,0);assert(castBlessing(empty));
s.faith!.amount=49;const session=new SimulationSession(s,map),before=JSON.stringify(s.faith);assert(!session.submit({playerId:'faith',sequence:1,command:{type:'cast_blessing'}}).accepted);assert.equal(JSON.stringify(s.faith),before);
s.faith!.amount=200;const envelope={playerId:'faith',sequence:2,command:{type:'cast_blessing' as const}};assert(session.submit(envelope).accepted);assert.equal(s.faith!.amount,150);assert(session.submit(envelope).duplicate);assert.equal(s.faith!.amount,150);assert(!session.submit({playerId:'faith',sequence:3,command:{type:'cast_blessing'}}).accepted);assert.equal(workMultiplier(s,n),1.5);assert.equal(n.divineState,'blessed');
const midway=decodeSave(encodeSave(s,map,config));assert.deepEqual(midway.island.faith,s.faith);initializeFaith(midway.island);assert.equal(midway.island.npcs[0].divineState,'blessed');
const frozen=JSON.stringify(s.faith);session.snapshot();assert.equal(JSON.stringify(s.faith),frozen,'No wall-clock regen');
for(let i=0;i<50;i++)tickFaith(s);assert.equal(workMultiplier(s,n),.5);assert.equal(n.needs.safety,10);assert.equal(n.divineState,'exhausted');assert(castBlessing(s));tickFaith(s);assert.equal(n.needs.safety,10,'Backlash only once');assert.deepEqual(decodeSave(encodeSave(s,map,config)).island.faith,s.faith);
for(let i=0;i<99;i++)tickFaith(s);assert.equal(workMultiplier(s,n),1);assert.equal(blessingCost(s),100);s.faith!.amount=200;assert.equal(castBlessing(s),null);assert.equal(s.faith!.amount,100);assert.equal(blessingCost(s),150);for(let i=0;i<200;i++)tickFaith(s);assert.equal(blessingCost(s),50);
const bad=JSON.parse(encodeSave(s,map,config));bad.island.faith.amount=301;assert.throws(()=>decodeSave(JSON.stringify(bad)),/Niềm tin/);bad.island.faith.amount=20;bad.island.faith.clockMs=-1;assert.throws(()=>decodeSave(JSON.stringify(bad)),/Niềm tin/);
// Compare actual production over the same 90 simulation seconds.
function benchmark(blessed:boolean){const w=world();w.buildings=[{id:'farm',type:'farm',tileX:2,tileY:2,complete:true,progress:100,workers:[w.npcs[0].id]}];w.faith!.amount=200;if(blessed)assert.equal(castBlessing(w),null);let effort=0,early=0;for(let t=0;t<150;t++){effort+=workMultiplier(w,w.npcs[0]);tickBuildings(w,w.resources,map);tickFaith(w);if(t===49)early=(w.buildings[0].productionBatches??0)+(w.npcs[0].buildingWork!.ticks/10);}return {effort,early,food:w.sharedFood,batches:w.buildings[0].productionBatches};}
const normal=benchmark(false),blessed=benchmark(true);assert.equal(normal.effort,150);assert.equal(blessed.effort,125);assert.equal(blessed.early,normal.early*1.5);assert(blessed.food<normal.food);console.log('PASS: actual production comparison',JSON.stringify({normal,blessed}));
// Gathering speeds work progress, never boosts yields or credits stock remotely.
const gathering=world(),g=gathering.npcs[0];g.laborRole='wood';g.actionTarget={type:'chop_wood',x:2,y:2};g.laborTask={workTicks:5,totalTicks:5};g.path=[];g.status='working';gathering.resources.set('2,2',{type:'wood_tree',amount:100,maxAmount:100,regenRate:0});gathering.faith!.amount=100;castBlessing(gathering);const gs=new SimulationSession(gathering,map);gs.advanceTicks(1);assert.equal(g.laborTask!.workTicks,3.5);for(let i=0;i<3;i++)gs.advanceTicks(1);assert.equal(gathering.resources.get('2,2')!.amount,97);assert.equal(gathering.wood,23);
// Fractional tool-crafting progress survives save/load.
const craft=world();craft.dailyLife={campfire:{tileX:2,tileY:2}};craft.civilization!.unlocks=['stone_tools'];initializeEquipment(craft);craft.faith!.amount=100;castBlessing(craft);assert.equal(startToolCraft(craft,'axe'),null);tickToolCraft(craft,map);assert.equal(craft.equipment!.order!.workTicks,1.5);decodeSave(encodeSave(craft,map,config));
console.log('PASS: regen/morale/temple/cap, zero initial/offline gain, paid idempotent commands, duration/exhaustion/fear once, escalation/reset, save validation, physical work and fractional crafting.');

// Onsite construction and research receive speed; walking and material costs do not.
const build=world();build.buildings=[{id:'tent',type:'tent',tileX:2,tileY:2,complete:false,progress:0,workers:[build.npcs[0].id]}];build.faith!.amount=100;castBlessing(build);const woodBefore=build.wood;tickBuildings(build,build.resources,map);assert.equal(build.buildings[0].progress,7.5);assert.equal(build.wood,woodBefore);
const research=world(),researcher=research.npcs[0];research.civilization!.research={techId:'fire',startDay:0,daysNeeded:10,assignedElderId:null,researcherId:researcher.id,workTicks:0};researcher.researching=true;research.faith!.amount=100;castBlessing(research);new SimulationSession(research,map).advanceTicks(1);assert.equal(research.civilization!.research!.workTicks,1.5);
const malformed=JSON.parse(encodeSave(research,map,config));malformed.island.faith.blessing.exhaustUntilMs++;assert.throws(()=>decodeSave(JSON.stringify(malformed)),/Ban Phước/);
console.log('PASS: onsite construction/research speed without material gifts, invalid effect deadlines rejected.');
