import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createIsland} from '../src/core/factory';
import {createCivilization} from '../src/core/civilization';
import {enableSettlement} from '../src/core/settlement';
import {initializeWorkforce} from '../src/core/workforce';
import {initializeFaith} from '../src/core/FaithManager';
import {initializeRaids} from '../src/core/RaidManager';
import {SimulationSession} from '../src/core/SimulationSession';
import {encodeSave,decodeSave} from '../src/core/SaveSystem';
import type {WorldMap} from '../src/renderer/WorldMap';
mkdirSync('artifacts',{recursive:true});
// Established settlement fixtures, deliberately separate from earned playthroughs.
for(const pop of [5,15,25]){
 const map:WorldMap={width:20,height:16,tiles:Array.from({length:16},()=>Array(20).fill('grass')),landTiles:[]};for(let y=0;y<16;y++)for(let x=0;x<20;x++)map.landTiles.push({x,y});
 let s=createIsland('Đột kích thử sức',pop);s.civilization=createCivilization();enableSettlement(s);initializeWorkforce(s,true);initializeFaith(s);initializeRaids(s);s.sharedFood=pop*20;s.wood=200;s.stone=100;s.dailyLife!.campfire={tileX:4,tileY:7,fuel:12,graceUntil:30,lit:true};
 s.buildings=[{id:'store',type:'storehouse',tileX:4,tileY:6,complete:true,progress:100,level:3,workers:[]}];for(let i=0;i<Math.ceil(pop/15);i++)s.buildings.push({id:'home-'+i,type:'house',tileX:3+i,tileY:4,complete:true,progress:100,level:3,workers:[]});
 for(let y=3;y<12;y++)for(let x=3;x<12;x++)s.resources.set(`${x},${y}`,{type:'herb_patch',amount:10000,maxAmount:10000,regenRate:1});s.resources.set('6,7',{type:'wood_tree',amount:10000,maxAmount:10000,regenRate:1});s.resources.set('7,7',{type:'stone_deposit',amount:10000,maxAmount:10000,regenRate:0});
 s.npcs.forEach((n,i)=>{n.age=25;n.occupation='gatherer';n.position={tileX:4,tileY:7};n.privateFood=0;n.health=100;n.needs={hunger:0,rest:0,safety:0,social:0};n.guardDuty=i<2;});
 const config={mode:'local' as const,seed:42,size:'small' as const,shape:'circle' as const,startPop:pop};let sim=new SimulationSession(s,map),flee=0,defense=0,warning=0,active=0,reloads=0;let lastPhase=s.raids!.phase;
 for(let t=0;t<1500;t++){sim.advanceTicks(1);assert(s.raids!.stolen<=40);assert(s.npcs.filter(n=>n.isAlive).length===pop);flee+=s.npcs.filter(n=>n.raidResponse==='fleeing').length;defense+=s.npcs.filter(n=>n.raidResponse==='guarding').length;
  const raw=encodeSave(s,map,config),loaded=decodeSave(raw);assert.deepEqual(loaded.island.raids,s.raids);if(s.raids!.phase!==lastPhase){if(s.raids!.phase==='warning')warning++;if(s.raids!.phase==='active')active++;s=loaded.island;sim=new SimulationSession(s,map);reloads++;lastPhase=s.raids!.phase;}
 }
 assert(s.raids!.count>=2,'Must include multiple actual scheduled raids');assert(warning>=2&&active>=2);assert(defense>0);assert(s.sharedFood>0);writeFileSync(`artifacts/raid-stability-${pop}-save.json`,encodeSave(s,map,config));console.log(`PASS fixture ${pop}: 150 days, ${s.raids!.count} scheduled raids, ${pop} alive, Food ${s.sharedFood.toFixed(1)}, ${defense} defense/${flee} refuge steps, ${reloads} phase reloads, every save valid.`);
}
