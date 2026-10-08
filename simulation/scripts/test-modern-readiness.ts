import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {reserveEntityIds} from '../src/core/factory';
import {decodeSave,encodeSave} from '../src/core/SaveSystem';
import {SimulationSession,type PlayerCommand} from '../src/core/SimulationSession';
import {initializePower} from '../src/core/PowerManager';
import {modernRequirements,modernFoodDemand,MODERN_FEE} from '../src/core/ModernPreparation';
import type {BuildingType} from '../src/core/types';
const data=decodeSave(readFileSync('artifacts/modern-50-stable-save.json','utf8')),s=data.island,c=s.civilization!;reserveEntityIds(s);initializePower(s);let sim=new SimulationSession(s,data.map),seq=0;const start=s.tick,tradesBefore=c.completedTrades??0,producedBefore=c.produced.steel;
const send=(command:PlayerCommand)=>{const r=sim.submit({playerId:'modern-readiness',sequence:++seq,command});assert(r.accepted,JSON.stringify({command,r}));};
const until=(ok:()=>boolean,max=5000)=>{for(let i=0;i<max&&!ok();i++){sim.advanceTicks(1);assert.equal(s.npcs.filter(n=>n.isAlive).length,50,'Keep all actual settlers alive');}if(!ok())writeFileSync('artifacts/modern-readiness-waiting-save.json',encodeSave(s,data.map,data.config));assert(ok(),JSON.stringify({tick:s.tick,food:s.sharedFood,goods:c.inventory,requirements:modernRequirements(s),work:s.buildings.map(b=>[b.type,b.workers,b.workMessage,b.buffer])}));};
const furnace=s.buildings.find(b=>b.type==='steelworks')!,post=s.buildings.find(b=>b.type==='tradepost')!,gen=s.buildings.find(b=>b.type==='steam_generator')!,shop=s.buildings.find(b=>b.type==='prototype_workshop')!;
const free=s.npcs.filter(n=>n.isAlive&&n.age>=18&&n.occupation!=='child'&&n.laborRole==='food'&&!n.guardDuty&&!s.buildings.some(b=>b.workers.includes(n.id))).slice(-12);assert.equal(free.length,12);
for(const n of free){send({type:'assign_labor',npcId:n.id,role:'idle'});send({type:'set_labor_mode',npcId:n.id,mode:'manual'});}for(const n of free.slice(0,4))send({type:'assign_labor',npcId:n.id,role:'wood'});
let next=4;function staff(type:BuildingType,count:number){const b=s.buildings.find(b=>b.type===type)!;for(let i=0;i<count;i++){const n=free[next++];assert(n);send({type:'assign_worker',buildingId:b.id,npcId:n.id});}return b;}
staff('flax_field',2);staff('weaver',2);staff('iron_smelter',2);staff('steelworks',1);staff('tradepost',1);const trader=free.at(-1)!;
// Real cloth production funds imported ore; copper already produced funds fuel.
function trade(offerId:'cloth_for_ore'|'copper_for_coal'){until(()=>!post.shipment&&!trader.cargo&&!trader.freight&&!trader.haulTask&&!trader.actionTarget&&(offerId==='cloth_for_ore'?c.inventory.cloth>=24:c.inventory.copper>=8));const before={give:offerId==='cloth_for_ore'?c.inventory.cloth:c.inventory.copper,receive:offerId==='cloth_for_ore'?c.inventory.ironOre:c.inventory.coal};send({type:'start_trade',buildingId:post.id,offerId});assert.equal(offerId==='cloth_for_ore'?c.inventory.cloth:c.inventory.copper,before.give-(offerId==='cloth_for_ore'?4:8));assert.equal(offerId==='cloth_for_ore'?c.inventory.ironOre:c.inventory.coal,before.receive,'No imported stock before physical return');until(()=>!post.shipment);}
// 180 ore can produce 90 iron /45 steel; retain at least 30 steel after feeding the powered workshop.
const oreTrips=18,coalTrips=13;for(let i=0;i<oreTrips;i++){trade('cloth_for_ore');if(i<coalTrips)trade('copper_for_coal');if(i%4===3)console.log(`Paid imports ${i+1}/${oreTrips}, steel ${c.inventory.steel}, cloth ${c.inventory.cloth}, 50 alive`);}
until(()=>c.inventory.steel>=44&&c.inventory.cloth>=MODERN_FEE.cloth);
// Reopen the real remaining copper vein, rather than inventing trade currency or fuel.
const textileWorkers=s.buildings.filter(b=>['flax_field','weaver'].includes(b.type)).flatMap(b=>[...b.workers]);assert.equal(textileWorkers.length,4);
for(const [i,id] of textileWorkers.entries()){const old=s.buildings.find(b=>b.workers.includes(id))!;send({type:'remove_worker',buildingId:old.id,npcId:id});const target=s.buildings.find(b=>b.type===(i<2?'copper_mine':'smelter'))!;send({type:'assign_worker',buildingId:target.id,npcId:id});}
trade('copper_for_coal');
// End the temporary textile/metal campaign and restore food labor before the proof window.
for(const b of s.buildings.filter(b=>['flax_field','weaver','copper_mine','smelter','iron_smelter','steelworks'].includes(b.type)))for(const id of [...b.workers]){send({type:'remove_worker',buildingId:b.id,npcId:id});send({type:'assign_labor',npcId:id,role:'food'});}
until(()=>s.sharedFood>=modernFoodDemand(s)*8);
for(const id of [...furnace.workers])send({type:'remove_worker',buildingId:furnace.id,npcId:id});send({type:'remove_worker',buildingId:post.id,npcId:trader.id});send({type:'assign_worker',buildingId:shop.id,npcId:trader.id});send({type:'set_power',buildingId:shop.id,enabled:true,priority:2});send({type:'set_power',buildingId:gen.id,enabled:true,priority:1});
// The prototype already has real historical batches; a living worker and continuous supply are required.
until(()=>modernRequirements(s).every(r=>r.met)&&c.inventory.steel>=MODERN_FEE.steel&&c.inventory.cutStone>=MODERN_FEE.cutStone&&c.inventory.cloth>=MODERN_FEE.cloth);
const ready=encodeSave(s,data.map,data.config);assert.deepEqual(decodeSave(ready).island.civilization,c);writeFileSync('artifacts/modern-ready-save.json',ready);assert.equal(c.era,'iron');assert(sim.submit({playerId:'modern-readiness',sequence:++seq,command:{type:'develop_era'}}).accepted,'Complete verified Modern chain enables paid investment');console.log(`PASS actual Modern readiness: 50 alive /50 beds /Food ${s.sharedFood.toFixed(1)}; all ten requirements, fee stock ${JSON.stringify(MODERN_FEE)}; steel produced +${c.produced.steel-producedBefore}, ${c.completedTrades!-tradesBefore} paid trips, ${s.tick-start} steps, power ${s.power!.supply}/${s.power!.demand}, proof ${shop.poweredTicks}. Public Modern investment now accepted.`);
