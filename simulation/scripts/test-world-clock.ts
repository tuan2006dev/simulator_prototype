import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {WORLD_DAY_MS,WORLD_STEP_MS,TIME_SCALE,effectDuration} from '../src/core/WorldClock';
import {worldMinutes,dayPhase} from '../src/core/dailyLife';
import {decodeSave,encodeSave} from '../src/core/SaveSystem';
import {SimulationSession} from '../src/core/SimulationSession';
import {lowTide} from '../src/core/TidalManager';
assert.equal(WORLD_DAY_MS,120000);assert.equal(WORLD_STEP_MS,12000);assert.equal(TIME_SCALE,20);
const time=(ms:number)=>worldMinutes(Math.floor(ms/WORLD_STEP_MS),ms%WORLD_STEP_MS);
assert.equal(time(0),360);assert.equal(time(5000),420);assert.equal(time(15000),540);assert.equal(time(45000),900);assert.equal(time(60000),1080);assert.equal(time(70000),1200);assert.equal(time(120000),360);
assert.equal(dayPhase(5,0),'Bữa tối');assert.equal(dayPhase(5,9999),'Bữa tối');assert.equal(dayPhase(5,10000),'Nghỉ ngơi');assert.equal(lowTide(1,3000),true);assert.equal(lowTide(3,9000),false);
let d=decodeSave(readFileSync('artifacts/three-islands-ready-save.json','utf8'));let sim=new SimulationSession(d.island,d.map);const start=d.island.tick;sim.advanceTime(5000);assert.equal(d.island.tick,start);assert.equal(d.island.clock!.progressMs,5000);
const partial=encodeSave(d.island,d.map,d.config);writeFileSync('artifacts/world-clock-ready-save.json',partial);const loaded=decodeSave(partial);assert.equal(loaded.island.clock!.progressMs,5000);assert.deepEqual(loaded.island.npcs,d.island.npcs);d=loaded;sim=new SimulationSession(d.island,d.map);sim.advanceTime(7000);assert.equal(d.island.tick,start+1);assert.equal(d.island.clock!.progressMs,0);sim.advanceTime(108000);assert.equal(d.island.tick,start+10);assert.equal(d.island.clock!.progressMs,0);assert.equal(d.island.npcs.filter(n=>n.isAlive).length,8);assert(d.island.sharedFood>0);
const bad=JSON.parse(partial);bad.island.clock.progressMs=12000;assert.throws(()=>decodeSave(JSON.stringify(bad)));bad.island.clock.progressMs=-1;assert.throws(()=>decodeSave(JSON.stringify(bad)));assert.throws(()=>sim.advanceTime(-1));assert.throws(()=>sim.advanceTime(Infinity));
assert.equal(effectDuration(30000),'10 phút');assert.equal(effectDuration(20000),'6 phút 40 giây');
// Old earned checkpoints retain exact tick, work state and deadlines; only a zero fraction is added on use.
for(const file of ['augmentation-played-save.json','mystic-adaptation-played-save.json','eldritch-adaptation-played-save.json']){const old=decodeSave(readFileSync('artifacts/'+file,'utf8')),before=JSON.stringify({tick:old.island.tick,faith:old.island.faith,buildings:old.island.buildings,npcs:old.island.npcs});new SimulationSession(old.island,old.map);assert.equal(old.island.clock!.progressMs,0);assert.equal(JSON.stringify({tick:old.island.tick,faith:old.island.faith,buildings:old.island.buildings,npcs:old.island.npcs}),before);decodeSave(encodeSave(old.island,old.map,old.config));}
writeFileSync('artifacts/world-clock-core-result.json',JSON.stringify({dayMs:120000,hourMs:5000,phases:{workMs:60000,dinnerMs:10000,restMs:50000},tide:{openAtMs:15000,closeAtMs:45000},partialReload:true,oldCheckpointsPreserved:3,alive:8,food:d.island.sharedFood,invalidClockRejected:true},null,2));console.log('PASS world clock120s/day5s/hour, phase/tide boundaries, partial save, 8alive, three old variants unchanged, duration labels.');
