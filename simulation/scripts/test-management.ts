import {setReserveTargets,updateReserveRequests,needsReserve,reserveTarget,reserveStock} from '../src/core/reserves';
import {managementWarnings} from '../src/ui/ManagementPanel';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createIsland} from '../src/core/factory';
import {createCivilization} from '../src/core/civilization';
import {enableSettlement} from '../src/core/settlement';
import {initializeWorkforce,planWorkforce,attributeBonus} from '../src/core/workforce';
import {SimulationSession,type PlayerCommand} from '../src/core/SimulationSession';
import {encodeSave,decodeSave} from '../src/core/SaveSystem';
import {initializeLogistics} from '../src/core/logistics';
import {productionAlert,releaseAutoStaff,haulTarget} from '../src/core/productionWorkforce';
import {assignWorker} from '../src/renderer/BuildingManager';
import type {WorldMap} from '../src/renderer/WorldMap';
function fixture(pop=5){
 const map:WorldMap={width:16,height:12,tiles:Array.from({length:12},()=>Array(16).fill('grass')),landTiles:[]};
 for(let y=0;y<12;y++)for(let x=0;x<16;x++)map.landTiles.push({x,y});
 const island=createIsland('Tự nhận việc',pop);island.civilization=createCivilization();enableSettlement(island);initializeWorkforce(island,true);
 island.dailyLife!.campfire={tileX:3,tileY:5,fuel:12,graceUntil:30,lit:true};island.wood=0;island.stone=0;island.sharedFood=pop*5;
 island.npcs.forEach(n=>{n.age=25;n.occupation='gatherer';n.position={tileX:3,tileY:5};n.privateFood=0;n.needs={hunger:0,rest:0,safety:0,social:0};});
 for(let y=2;y<10;y++)for(let x=1;x<12;x++)island.resources.set(`${x},${y}`,{type:'herb_patch',amount:100,maxAmount:100,regenRate:2});
 island.resources.set('5,5',{type:'wood_tree',amount:10000,maxAmount:10000,regenRate:1});island.resources.set('6,5',{type:'stone_deposit',amount:10000,maxAmount:10000,regenRate:0});
 const session=new SimulationSession(island,map);let seq=0;return {island,map,session,submit:(command:PlayerCommand)=>session.submit({playerId:'test',sequence:++seq,command})};
}

function shops(pop:number){const f=fixture(pop),s=f.island;initializeLogistics(s);s.wood=200;s.stone=100;s.sharedFood=pop*12;s.civilization!.era='bronze';
 const specs=[['farm',2,5],['lumbercamp',5,5],['mine',6,5],['copper_mine',8,5],['smelter',9,5],['sawmill',10,5],['wheat_field',3,7],['bakery',4,7]] as const;
 for(const [type,tileX,tileY] of specs)s.buildings.push({id:type,type,tileX,tileY,complete:true,progress:100,workers:[],level:1});s.resources.set('8,6',{type:'copper_vein',amount:10000,maxAmount:10000,regenRate:0});initializeLogistics(s);return f;}

{
 const {island,map,session,submit}=shops(15);const initial=JSON.stringify(island.reserves);assert(!submit({type:'set_reserve_targets',targets:{wood:-1}}).accepted);assert.equal(JSON.stringify(island.reserves),initial);assert(!submit({type:'set_reserve_targets',targets:{wood:1.5}}).accepted);assert(!submit({type:'set_reserve_targets',targets:{unknown:2} as any}).accepted);
 const env={playerId:'goal',sequence:1,command:{type:'set_reserve_targets' as const,targets:{wood:250,stone:150,copper:40,food:100}}};assert(session.submit(env).accepted);const money=island.wood;assert(session.submit(env).duplicate);assert.equal(island.wood,money);assert(needsReserve(island,'wood'));
 island.wood=250;assert(!needsReserve(island,'wood'),'Fresh stock at target must report enough before the next planner tick');updateReserveRequests(island);assert(!needsReserve(island,'wood'));for(const amount of [249,230,201]){island.wood=amount;updateReserveRequests(island);assert(!needsReserve(island,'wood'),'No restart in the 80–100% band');}island.wood=200;updateReserveRequests(island);assert(needsReserve(island,'wood'));island.wood=225;updateReserveRequests(island);assert(needsReserve(island,'wood'));setReserveTargets(island,{wood:250,stone:150,copper:40,food:100});assert(needsReserve(island,'wood'),'Unchanged apply preserves hysteresis state');
 const stable=fixture(5);stable.island.sharedFood=100;stable.island.wood=250;setReserveTargets(stable.island,{wood:250});stable.island.wood=230;updateReserveRequests(stable.island);planWorkforce(stable.island,stable.map);const roles=stable.island.npcs.map(n=>n.laborRole);for(let i=0;i<50;i++){planWorkforce(stable.island,stable.map);assert.deepEqual(stable.island.npcs.map(n=>n.laborRole),roles,'Repeated plans inside the hysteresis band must not alternate roles');}
 assert.deepEqual(decodeSave(encodeSave(island,map,{seed:42,shape:'circle',size:'small',startPop:15,mode:'local'})).island.reserves,island.reserves);
 const bad=JSON.parse(encodeSave(island,map,{seed:42,shape:'circle',size:'small',startPop:15,mode:'local'}));bad.island.reserves.requests.copper='true';assert.throws(()=>decodeSave(JSON.stringify(bad)),/Mục tiêu/);
 setReserveTargets(island,{food:0,wood:0,copper:40,copperOre:0});assert(reserveTarget(island,'food')>=Math.ceil(15*20*8/35*1.5));assert(reserveTarget(island,'wood')>=16);assert(reserveTarget(island,'copperOre')>=12);
 const manual=island.npcs[0],b=island.buildings.find(b=>b.type==='smelter')!;assignWorker(island,b.id,manual.id);island.civilization!.inventory.copper=100;setReserveTargets(island,{copper:0,wood:100});planWorkforce(island,map);assert(b.workers.includes(manual.id));assert.equal(manual.laborMode,'manual');assert(submit({type:'reset_reserve_targets'}).accepted);assert.equal(island.reserves,undefined);
 b.workers=[];b.autoWorkers=[];island.resources.get('8,6')!.amount=0;planWorkforce(island,map);assert(managementWarnings(island).some(w=>w.reason.includes('đã cạn')));const buildingCount=island.buildings.length;managementWarnings(island);assert.equal(island.buildings.length,buildingCount);
 console.log('PASS: atomic/valid/idempotent target edits, 80% hysteresis, unchanged apply, exact saved requests, food/fuel/input floors, manual staff, reset and actionable alerts.');
}
for(const pop of [5,15,25]){
 const {island,map,session}=shops(pop);setReserveTargets(island,{food:pop*10,wood:100,stone:60,copper:20,lumber:20,wheat:30});let ownershipChanges=0;const owners=new Map<string,string>();for(let i=0;i<600;i++){if(i===200)setReserveTargets(island,{food:0,wood:0,stone:0,copper:0,lumber:0,wheat:0});if(i===400)setReserveTargets(island,{food:pop*15,wood:150,stone:100,copper:50,lumber:40,wheat:50});session.advanceTicks(1);for(const n of island.npcs){const owner=island.buildings.find(b=>b.autoWorkers?.includes(n.id))?.id??n.laborRole;if(owners.has(n.id)&&owners.get(n.id)!==owner)ownershipChanges++;owners.set(n.id,owner);}}
 assert.equal(island.npcs.filter(n=>n.isAlive).length,pop);assert(island.sharedFood>0);decodeSave(encodeSave(island,map,{seed:42,shape:'circle',size:'small',startPop:pop,mode:'local'}));writeFileSync(`artifacts/management-${pop}-save.json`,encodeSave(island,map,{seed:42,shape:'circle',size:'small',startPop:pop,mode:'local'}));console.log(`PASS: ${pop} people, 60 days, low/zero/high target changes, ${pop} alive, Food ${island.sharedFood.toFixed(1)}, ${ownershipChanges} real boundary assignments.`);
}

for(const file of ['artifacts/production-browser-save.json','artifacts/logistics-iron-save.json']){
 const saved=decodeSave(readFileSync(file,'utf8')),s=saved.island;initializeWorkforce(s);initializeLogistics(s);const session=new SimulationSession(s,saved.map);let sequence=0;session.submit({playerId:'targets',sequence:++sequence,command:{type:'set_auto_claim',enabled:true}});const manual=s.buildings.flatMap(b=>b.workers.filter(id=>s.npcs.find(n=>n.id===id)?.laborMode==='manual').map(id=>({id,b:b.id})));for(const n of s.npcs.filter(n=>n.isAlive&&n.position&&n.age>=18&&n.laborMode!=='manual'))session.submit({playerId:'targets',sequence:++sequence,command:{type:'set_labor_mode',npcId:n.id,mode:'auto'}});const alive=s.npcs.filter(n=>n.isAlive).length;setReserveTargets(s,{food:alive*10,wood:80,stone:40,copper:20,iron:20,cloth:20});for(let i=0;i<600;i++){if(i===300)setReserveTargets(s,{food:alive*15,wood:180,stone:100,copper:60,iron:50,cloth:50});session.advanceTicks(1);}assert.equal(s.npcs.filter(n=>n.isAlive).length,alive);assert(s.sharedFood>0);for(const pair of manual)assert(s.buildings.find(b=>b.id===pair.b)!.workers.includes(pair.id));decodeSave(encodeSave(s,saved.map,saved.config));console.log(`PASS: actual ${s.civilization!.era} save, low then high targets / 60 days, ${alive} alive, Food ${s.sharedFood.toFixed(1)}, existing manual staff preserved.`);
}
