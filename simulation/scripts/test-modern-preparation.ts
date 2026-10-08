import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createIsland,reserveEntityIds,createAnimal} from '../src/core/factory';
import {createCivilization} from '../src/core/civilization';
import {modernRequirements,modernFoodDemand,MODERN_FEE} from '../src/core/ModernPreparation';
import {initializePower} from '../src/core/PowerManager';
import {initializeLogistics} from '../src/core/logistics';
import {initializeRaids} from '../src/core/RaidManager';
import {initializeFaith} from '../src/core/FaithManager';
import {initializeWorkforce} from '../src/core/workforce';
import {shelterBeds} from '../src/core/settlement';
import {SimulationSession,type PlayerCommand} from '../src/core/SimulationSession';
import {decodeSave,encodeSave} from '../src/core/SaveSystem';
import {BUILD_COSTS,canAfford,foodCapacity} from '../src/renderer/BuildingManager';
import {canInviteSettler} from '../src/core/settlers';
import {findPath} from '../src/core/pathfinding';
import type {BuildingType} from '../src/core/types';
const fixture=createIsland('Điều kiện thử',50);fixture.civilization=createCivilization();fixture.civilization.era='iron';for(const n of fixture.npcs){n.age=25;n.position={tileX:2,tileY:2};n.occupation='gatherer';n.privateFood=0;}
assert(modernRequirements(fixture)[0].met);assert(!modernRequirements(fixture)[1].met,'15 starter places are not real beds');fixture.sharedFood=modernFoodDemand(fixture)*7;fixture.civilization.inventory.wheat=5000;assert(!modernRequirements(fixture)[8].met,'Storage must actually hold seven days');fixture.sharedFood=0;assert(!modernRequirements(fixture)[9].met,'Raw wheat is not food');const plain=modernFoodDemand(fixture),cow=createAnimal('cattle',2,2);cow.status='domesticated';fixture.animals.push(cow);assert.equal(modernFoodDemand(fixture),plain+30,'Livestock adds actual daily cost');console.log('PASS conditions: 50 placed, real beds, physical storage, unprocessed wheat excluded, standard food/animal demand.');
// Earn the 50-person town by extending the previously played Iron industry village.
const data=decodeSave(readFileSync('artifacts/industry-upgraded-save.json','utf8')),s=data.island,c=s.civilization!,map=data.map;reserveEntityIds(s);initializePower(s);initializeLogistics(s);initializeFaith(s);initializeRaids(s);initializeWorkforce(s);const start=s.tick;let seq=0,sim=new SimulationSession(s,map);const send=(command:PlayerCommand)=>{const r=sim.submit({playerId:'modern-preparation',sequence:++seq,command});assert(r.accepted,JSON.stringify({command,r}));};let invited=0;
const until=(ok:()=>boolean,max=5000)=>{for(let i=0;i<max&&!ok();i++){sim.advanceTicks(1);if(s.npcs.some(n=>!n.isAlive)){writeFileSync('artifacts/modern-preparation-failed-save.json',encodeSave(s,map,data.config));throw new Error('A settler died during expansion: '+JSON.stringify({tick:s.tick,food:s.sharedFood,dead:s.npcs.filter(n=>!n.isAlive).map(n=>[n.id,n.needs.hunger,n.health]),work:s.buildings.map(b=>[b.type,b.workers,b.workMessage])}));}}if(!ok())writeFileSync('artifacts/modern-preparation-waiting-save.json',encodeSave(s,map,data.config));assert(ok(),JSON.stringify({tick:s.tick,food:s.sharedFood,wood:s.wood,stone:s.stone,goods:c.inventory,requirements:modernRequirements(s),work:s.buildings.map(b=>[b.type,b.workMessage,b.workers])}));};
const gen=s.buildings.find(b=>b.type==='steam_generator')!,proto=s.buildings.find(b=>b.type==='prototype_workshop')!;send({type:'set_power',buildingId:gen.id,enabled:false,priority:1});send({type:'set_power',buildingId:proto.id,enabled:false,priority:1});
const builders=s.npcs.slice(14,17);function release(n:typeof s.npcs[number]){for(const b of s.buildings)if(b.workers.includes(n.id))send({type:'remove_worker',buildingId:b.id,npcId:n.id});send({type:'assign_labor',npcId:n.id,role:'idle'});}
for(const n of builders)release(n);release(s.npcs[2]);release(s.npcs[23]);for(const n of s.npcs.slice(0,2))send({type:'set_guard',npcId:n.id,enabled:true});
const wood=s.npcs[19],stone=s.npcs[20];release(wood);release(stone);send({type:'assign_labor',npcId:wood.id,role:'wood'});send({type:'assign_labor',npcId:stone.id,role:'stone'});
function site(){const p=builders[0].position!;return map.landTiles.find(t=>t.x>=4&&t.x<=20&&t.y>=9&&t.y<=20&&['grass','sand'].includes(map.tiles[t.y][t.x])&&!s.buildings.some(b=>b.tileX===t.x&&b.tileY===t.y)&&!s.npcs.some(n=>n.isAlive&&n.position?.tileX===t.x&&n.position?.tileY===t.y)&&!s.animals.some(a=>a.isAlive&&a.tileX===t.x&&a.tileY===t.y)&&findPath(map,p.tileX,p.tileY,t.x,t.y)!==null)!;}
function build(type:BuildingType){until(()=>canAfford(s,BUILD_COSTS[type])&&s.sharedFood>200);const t=site();assert(t);send({type:'build',buildingType:type,tileX:t.x,tileY:t.y});const b=s.buildings.at(-1)!;for(const n of builders)send({type:'assign_worker',buildingId:b.id,npcId:n.id});until(()=>b.complete);for(const n of builders)if(b.workers.includes(n.id))send({type:'remove_worker',buildingId:b.id,npcId:n.id});return b;}
// Cheap real houses reach 50 beds; no legacy 15-place allowance is counted.
while(s.buildings.reduce((v,b)=>v+shelterBeds(b),0)<50)build('house');while(foodCapacity(s)<Math.ceil(7*50*20*8/35))build('storehouse');
const grain=[s.buildings.find(b=>b.type==='wheat_field')!],farms=[build('farm'),build('farm')],ovens=[s.buildings.find(b=>b.type==='bakery')!,build('bakery'),build('bakery')];
const free=s.npcs.filter(n=>n.isAlive&&n.age>=18&&!n.guardDuty&&n.laborRole!=='haul'&&!s.buildings.some(b=>b.workers.includes(n.id))&&!builders.some(b=>b.id===n.id)&&![wood.id,stone.id].includes(n.id));let next=0;
for(const b of [...grain,...farms,...ovens])while(b.workers.length<2){const n=free[next++];assert(n);release(n);send({type:'assign_worker',buildingId:b.id,npcId:n.id});}
for(const n of [...builders,wood,stone])send({type:'assign_labor',npcId:n.id,role:'haul'});
while(s.npcs.filter(n=>n.isAlive).length<50){until(()=>canInviteSettler(s)===null&&s.sharedFood>=modernFoodDemand(s)*5+60);const t=site();send({type:'invite_settler',tileX:t.x,tileY:t.y});invited++;const n=s.npcs.at(-1)!;send({type:'set_labor_mode',npcId:n.id,mode:'manual'});send({type:'assign_labor',npcId:n.id,role:invited<=3?'haul':'food'});}
writeFileSync('artifacts/modern-50-expanded-save.json',encodeSave(s,map,data.config));console.log(`PASS earned expansion: ${invited} paid invitations /50 alive, ${s.buildings.reduce((v,b)=>v+shelterBeds(b),0)} beds, food cap ${foodCapacity(s)}, Food ${s.sharedFood.toFixed(1)}, ${s.tick-start} steps, physical trips ${s.logistics!.completedTrips}`);
until(()=>s.sharedFood>=modernFoodDemand(s)*7);const food=s.sharedFood;for(let i=0;i<300;i++){sim.advanceTicks(1);assert.equal(s.npcs.filter(n=>n.isAlive).length,50);assert(s.sharedFood>0);}assert.equal(c.era,'iron');assert(!sim.submit({playerId:'modern-preparation',sequence:++seq,command:{type:'develop_era'}}).accepted);const saved=encodeSave(s,map,data.config);assert.deepEqual(decodeSave(saved).island.logistics,s.logistics);writeFileSync('artifacts/modern-50-stable-save.json',saved);console.log(`PASS 50 economy /30 days: 50 alive, Food ${s.sharedFood.toFixed(1)} (7-day proof ${food.toFixed(1)}), trips ${s.logistics!.completedTrips}, Modern still locked. Remaining: fee ${JSON.stringify(MODERN_FEE)} / power proof and complete Modern chain.`);
