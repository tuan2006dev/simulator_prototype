import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {decodeSave,encodeSave} from '../src/core/SaveSystem';
import {reserveEntityIds} from '../src/core/factory';
import {SimulationSession} from '../src/core/SimulationSession';
const results=[];
for(const [branch,kind,charge] of [['hightech','hightech',100],['mystic','mystic',100],['eldritch','eldritch',100],['eldritch-filtered','eldritch',95]] as const){
 let d=decodeSave(readFileSync(`artifacts/variants-${branch}-30day-save.json`,'utf8'));reserveEntityIds(d.island);let sim=new SimulationSession(d.island,d.map);const startFood=d.island.sharedFood,initialProduced=structuredClone(d.island.civilization!.produced);let minFood=startFood;
 for(let i=0;i<1200;i++){sim.advanceTicks(1);minFood=Math.min(minFood,d.island.sharedFood);assert.equal(d.island.npcs.filter(n=>n.isAlive).length,50,`${branch} tick ${i}`);assert.equal(d.island.civilization!.anomalyBranch,kind);assert.equal(d.island.npcs.find(n=>n.adaptation)!.adaptation!.charge,charge);assert(!d.island.adaptationProcess);if(i===599){d=decodeSave(encodeSave(d.island,d.map,d.config));reserveEntityIds(d.island);sim=new SimulationSession(d.island,d.map);}}
 assert.equal(d.island.civilization!.produced.components,initialProduced.components);assert.equal(d.island.civilization!.produced.biomatter,initialProduced.biomatter);if(branch==='eldritch-filtered')assert.equal(d.island.civilization!.produced.relicBone,initialProduced.relicBone);
 writeFileSync(`artifacts/variants-${branch}-150day-save.json`,encodeSave(d.island,d.map,d.config));results.push({branch,totalDays:150,additionalTicks:1200,alive:50,foodStart:startFood,foodMin:minFood,foodEnd:d.island.sharedFood,charge,reloadedAtAdditionalDay60:true,continuousIndustrialProduction:false});
}
writeFileSync('artifacts/variants-150day-result.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));console.log('PASS four earned continuations150days total:50alive, midrun save/reload, branch/charge intact, industrial standby not continuous production.');
