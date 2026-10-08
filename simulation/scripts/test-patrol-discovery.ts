import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {decodeSave,encodeSave} from '../src/core/SaveSystem';
import {SimulationSession,type PlayerCommand} from '../src/core/SimulationSession';
import {ensureDiscoveries,tickExploration,visitDiscovery,setPatrol,refreshVisibility,craftTorch,chooseTorch,startExploration} from '../src/core/ExplorationManager';
import {tickCargo} from '../src/core/settlement';
import {reserveEntityIds} from '../src/core/factory';
import {findPath} from '../src/core/pathfinding';
const base=readFileSync('artifacts/exploration-played-save.json','utf8');
const fixture=()=>{const d=decodeSave(base);reserveEntityIds(d.island);ensureDiscoveries(d.island,d.map);return d;};
const d=fixture(),s=d.island,e=s.exploration!,id=s.npcs.find(n=>n.torch)!.id,n=s.npcs.find(n=>n.id===id)!;
assert.equal(e.points!.length,3);let sim=new SimulationSession(s,d.map),seq=0;
const send=(command:PlayerCommand)=>{const r=sim.submit({playerId:'patrol-earned',sequence:++seq,command});assert(r.accepted,JSON.stringify({command,r}));};
const initialInt=n.attributes!.int,initialKnown=e.discovered.size;
writeFileSync('artifacts/patrol-ready-save.json',encodeSave(s,d.map,d.config));
send({type:'set_patrol',npcId:id,enabled:true});
assert(!sim.submit({playerId:'blocked',sequence:1,command:{type:'assign_labor',npcId:id,role:'wood'}}).accepted);
assert(craftTorch(s,d.map,s.npcs.find(v=>v.id!==id&&v.age>=18)!.id),'another actor cannot create a conflicting torch order');
assert(chooseTorch(s,id,false));assert(startExploration(s,d.map,id,e.points![0].x,e.points![0].y));
let steps=0,reloaded=false,sawCargo=false,sawWarning=false,sourceDebit=0,last=e.points!.map(p=>({id:p.id,amount:p.sourceKey?s.resources.get(p.sourceKey)!.amount:0}));
while(!e.points!.every(p=>p.claimed||p.exhausted)&&steps++<160){
 sim.advanceTicks(1);sawCargo||=!!n.cargo;sawWarning||=!!e.warning;
 for(const p of e.points!)if(p.claimed&&p.sourceKey){const entry=last.find(v=>v.id===p.id)!;if(entry.amount){sourceDebit+=p.collected;entry.amount=0;}}
 if(e.active&&!reloaded){const mid=encodeSave(s,d.map,d.config),loaded=decodeSave(mid);assert.deepEqual(loaded.island.exploration!.active,e.active);assert.deepEqual(loaded.island.exploration!.points,e.points);assert(loaded.island.npcs.find(v=>v.id===id)!.exploring);writeFileSync('artifacts/patrol-midtrip-save.json',mid);reloaded=true;}
}
assert(e.points!.every(p=>p.claimed),JSON.stringify({steps,points:e.points,active:e.active,message:e.message,patrol:e.patrol,n}));
assert.equal(n.attributes!.int,Math.min(10,initialInt+1));assert(sawCargo);assert.equal(sourceDebit,10);assert(e.discovered.size>=initialKnown);assert(reloaded);
send({type:'set_patrol',npcId:id,enabled:false});while((e.active||n.cargo)&&steps++<200)sim.advanceTicks(1);
assert(!e.active&&!n.cargo);assert.equal(n.laborRole,'idle');assert.equal(s.npcs.filter(n=>n.isAlive).length,8);
writeFileSync('artifacts/patrol-played-save.json',encodeSave(s,d.map,d.config));
// Controlled boundary cases stay separate from the earned continuation.
for(const kind of ['food_cache','herb_cache','monolith'] as const){const f=fixture(),fs=f.island,p=fs.exploration!.points!.find(p=>p.kind===kind)!,actor=fs.npcs.find(v=>v.id===id)!;fs.tick=(Math.floor(fs.tick/10)+1)*10;actor.position={tileX:p.x,tileY:p.y};actor.survivalBlocked=false;fs.exploration!.discovered.add(`${p.x},${p.y}`);const before=fs.sharedFood,amount=p.sourceKey?fs.resources.get(p.sourceKey)!.amount:0,int=actor.attributes!.int;assert.equal(visitDiscovery(fs,f.map,id,p.id),null);tickExploration(fs,f.map);if(kind==='monolith'){actor.survivalBlocked=false;tickExploration(fs,f.map);assert.equal(actor.attributes!.int,Math.min(10,int+1));}else{assert.equal(fs.sharedFood,before,'no remote stock credit');assert.equal(fs.resources.get(p.sourceKey!)!.amount,amount-p.collected);assert(actor.cargo);}
 assert(p.claimed);const loaded=decodeSave(encodeSave(fs,f.map,f.config));loaded.island.exploration!.active=undefined;assert(visitDiscovery(loaded.island,loaded.map,id,p.id));assert.equal(loaded.island.exploration!.points!.find(v=>v.id===p.id)!.collected,p.collected);
}
{const f=fixture(),fs=f.island,p=fs.exploration!.points!.find(p=>p.kind==='herb_cache')!,actor=fs.npcs.find(v=>v.id===id)!;fs.tick=(Math.floor(fs.tick/10)+1)*10;actor.position={tileX:p.x,tileY:p.y};actor.survivalBlocked=false;fs.resources.get(p.sourceKey!)!.amount=0;fs.exploration!.discovered.add(`${p.x},${p.y}`);assert.equal(visitDiscovery(fs,f.map,id,p.id),null);tickExploration(fs,f.map);assert(p.exhausted&&!p.claimed);assert(!actor.cargo);}
{const f=fixture(),fs=f.island,p=fs.exploration!.points![0];fs.exploration!.discovered.delete(`${p.x},${p.y}`);assert(visitDiscovery(fs,f.map,id,p.id));fs.tick=(Math.floor(fs.tick/10)+1)*10+9;assert.equal(setPatrol(fs,f.map,id,true),null);tickExploration(fs,f.map);assert(!fs.exploration!.active,'no departure at night');assert.equal(setPatrol(fs,f.map,id,false),null);}
{const f=fixture(),fs=f.island,actor=fs.npcs.find(v=>v.id===id)!,p=fs.exploration!.points![0];fs.tick=(Math.floor(fs.tick/10)+1)*10;actor.position={tileX:p.x,tileY:p.y};actor.torch!.fuel=2;actor.survivalBlocked=false;fs.exploration!.discovered.add(`${p.x},${p.y}`);assert.equal(visitDiscovery(fs,f.map,id,p.id),null);fs.tick+=3;writeFileSync('artifacts/patrol-warning-fixture-save.json',encodeSave(fs,f.map,f.config));fs.tick++; tickExploration(fs,f.map);assert.equal(fs.exploration!.active!.stage,'returning');assert.match(fs.exploration!.warning!,/Đuốc còn 2/);assert(!p.claimed,'turn back before collecting if return budget is short');const raw=JSON.parse(encodeSave(fs,f.map,f.config));raw.island.exploration.points.push(raw.island.exploration.points[0]);assert.throws(()=>decodeSave(JSON.stringify(raw)));}
{const f=fixture(),fs=f.island,actor=fs.npcs.find(v=>v.id===id)!;fs.tick=(Math.floor(fs.tick/10)+1)*10;assert.equal(setPatrol(fs,f.map,id,true),null);tickExploration(fs,f.map);assert(fs.exploration!.active);assert.equal(setPatrol(fs,f.map,id,false),null);assert.equal(fs.exploration!.active!.stage,'returning');const before=actor.position;assert.deepEqual(actor.position,before);}
{const f=fixture(),fs=f.island,p=fs.exploration!.points!.find(v=>v.kind==='monolith')!,actor=fs.npcs.find(v=>v.id===id)!;fs.tick=(Math.floor(fs.tick/10)+1)*10;actor.position={tileX:p.x,tileY:p.y};actor.attributes!.int=10;actor.survivalBlocked=false;fs.exploration!.discovered.add(`${p.x},${p.y}`);assert.equal(visitDiscovery(fs,f.map,id,p.id),null);tickExploration(fs,f.map);actor.survivalBlocked=false;tickExploration(fs,f.map);assert.equal(actor.attributes!.int,10);assert.equal(p.collected,0);decodeSave(encodeSave(fs,f.map,f.config));}
{const f=fixture(),fs=f.island,actor=fs.npcs.find(v=>v.id===id)!;fs.tick=(Math.floor(fs.tick/10)+1)*10;assert.equal(setPatrol(fs,f.map,id,true),null);actor.needs.hunger=80;tickExploration(fs,f.map);assert(!fs.exploration!.active,'hungry scout waits instead of departing');actor.needs.hunger=0;actor.survivalBlocked=false;tickExploration(fs,f.map);assert(fs.exploration!.active);const position={...actor.position!};for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]])f.map.tiles[position.tileY+dy][position.tileX+dx]='deep_water';actor.survivalBlocked=false;tickExploration(fs,f.map);assert.equal(fs.exploration!.active!.stage,'returning');assert.deepEqual(actor.position,position);assert.match(fs.exploration!.message,/Đường bị chặn/);}

writeFileSync('artifacts/patrol-core-result.json',JSON.stringify({steps,alive:8,food:s.sharedFood,points:e.points,automaticTrips:e.patrol!.trips,initialInt,finalInt:n.attributes!.int,sawCargo,sawWarning,sourceDebit,reloaded,knownBefore:initialKnown,knownAfter:e.discovered.size},null,2));
console.log('PASS earned patrol continuation: three finite discoveries, real resource debit/cargo delivery, one-time INT, auto return, midtrip save, 8alive; separate depleted/hidden/night/low torch/cancel/corrupt-save fixtures.');
