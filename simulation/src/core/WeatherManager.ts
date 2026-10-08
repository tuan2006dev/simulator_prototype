import {effectDuration} from './WorldClock';
import type {Island} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {SIMULATION_STEP_MS} from './FaithManager';
import {findPath} from './pathfinding';
import {movementSteps,dayPhase} from './dailyLife';
import {addEntry} from './chronicle';
export const WEATHER_DURATION_MS=60000, FIRE_LIMIT=8;
export function initializeWeather(island:Island,seed=1):void{island.weather??={version:1,clockMs:0,kind:'clear',untilMs:WEATHER_DURATION_MS,seed:seed>>>0,dryFireChecked:false,rainUntilMs:0,rainCooldownUntilMs:0,fires:[],burned:[],incidentCount:0};}
const random=(island:Island)=>{const w=island.weather!;w.seed=(Math.imul(w.seed,1664525)+1013904223)>>>0;return w.seed/4294967296;};
export function isRaining(island:Island):boolean{const w=island.weather;return !!w&&(w.kind==='rain'||w.clockMs<w.rainUntilMs);}
export function agricultureMultiplier(island:Island):number{const w=island.weather;return w&&w.clockMs<w.rainUntilMs?1.3:w?.kind==='drought'?.8:1;}
export function weatherSummary(island:Island):string{const w=island.weather;if(!w)return '';return `${isRaining(island)?'Mưa':w.kind==='drought'?'Khô hạn · ruộng −20%':'Trời quang'} · ${w.fires.length?`${w.fires.length} cây đang cháy`:'rừng an toàn'}${w.clockMs<w.rainUntilMs?` · ruộng +30% (${effectDuration(w.rainUntilMs-w.clockMs)})`:''}`;}
export function rainfallLock(island:Island):string|null{const w=island.weather,f=island.faith;if(!w||!f)return 'Thời tiết và thần lực chưa hoạt động.';if(w.clockMs<w.rainCooldownUntilMs)return 'Cầu Mưa đang hồi chiêu.';if(f.amount<40)return 'Chưa đủ 40 Niềm tin.';return null;}
export function castRainfall(island:Island):string|null{const lock=rainfallLock(island);if(lock)return lock;const w=island.weather!;island.faith!.amount-=40;w.rainUntilMs=w.clockMs+45000;w.rainCooldownUntilMs=w.clockMs+60000;w.fires=[];addEntry(island,'Cầu Mưa: trả 40 Niềm tin, dập cháy; năng suất ruộng +30% trong 15 phút.','high');return null;}
export function igniteForest(island:Island,key:string):boolean{const w=island.weather,node=island.resources.get(key);if(!w||isRaining(island)||w.fires.length||node?.type!=='wood_tree'||node.amount<=0)return false;w.burned=[key];w.fires=[{key,life:20,heat:3}];w.incidentCount++;addEntry(island,'Một cụm cây bốc cháy! Dân rảnh gần đó sẽ dập lửa; Cầu Mưa dập ngay.','high');return true;}
/** Called before labor: one nearby available adult uses this entire step to reach or extinguish a tree. */
export function fightForestFire(island:Island,map:WorldMap):void{const w=island.weather;if(!w?.fires.length||isRaining(island)||island.dailyLife&&dayPhase(island.tick)!=='Lao động')return;
 const fire=w.fires[0],[x,y]=fire.key.split(',').map(Number);
 const routes=island.npcs.filter(n=>n.isAlive&&n.position&&n.age>=18&&n.occupation!=='child'&&!n.survivalBlocked&&!n.cargo&&!n.freight&&!n.haulTask&&!n.actionTarget&&!n.buildingWork&&!n.researching&&island.civilization?.research?.researcherId!==n.id&&island.equipment?.order?.workerId!==n.id&&!island.buildings.some(b=>b.workers.includes(n.id))&&n.needs.hunger<80&&n.needs.rest<90&&n.status!=='sleeping'&&n.status!=='eating').flatMap(n=>{const p=n.position!,path=findPath(map,p.tileX,p.tileY,x,y);return path===null||path.length>12?[]:[{n,path}];}).sort((a,b)=>a.path.length-b.path.length);
 const r=routes[0];if(!r)return;r.n.survivalBlocked=true;r.n.status='working';r.n.laborMessage='Đang dập cháy rừng';
 if(r.path.length>1){const next=r.path[Math.min(movementSteps(r.n,island),r.path.length-1)-1];r.n.position={tileX:next.x,tileY:next.y};return;}
 fire.heat--;if(fire.heat<=0){w.fires=w.fires.filter(f=>f!==fire);addEntry(island,`${r.n.name} đã dập một cây đang cháy.`, 'medium');}
}
/** End of interval: bounded damage and spread, then advance the saved simulation clock. */
export function tickWeather(island:Island):void{const w=island.weather;if(!w)return;
 if(isRaining(island))w.fires=[];
 else for(const f of [...w.fires]){const node=island.resources.get(f.key);if(node)node.amount=Math.max(0,node.amount-2);f.life--;
  if(f.life>0&&f.life%5===0&&w.burned.length<FIRE_LIMIT){const [x,y]=f.key.split(',').map(Number),key=[`${x+1},${y}`,`${x-1},${y}`,`${x},${y+1}`,`${x},${y-1}`].find(k=>!w.burned.includes(k)&&island.resources.get(k)?.type==='wood_tree'&&(island.resources.get(k)?.amount??0)>0&&!island.buildings.some(b=>`${b.tileX},${b.tileY}`===k));if(key){w.burned.push(key);w.fires.push({key,life:20,heat:3});}}
 }
 w.fires=w.fires.filter(f=>f.life>0&&(island.resources.get(f.key)?.amount??0)>0);
 w.clockMs+=SIMULATION_STEP_MS;
 if(w.clockMs>=w.untilMs){const roll=random(island);w.kind=roll<.25?'rain':roll<.5?'drought':'clear';w.untilMs=w.clockMs+WEATHER_DURATION_MS;w.dryFireChecked=false;addEntry(island,`Thời tiết đổi: ${w.kind==='rain'?'mưa':w.kind==='drought'?'khô hạn, ruộng giảm 20%':'trời quang'}.`,'medium');if(isRaining(island))w.fires=[];}
 if(w.kind==='drought'&&!w.dryFireChecked&&w.untilMs-w.clockMs<=40000){w.dryFireChecked=true;if(!isRaining(island)&&random(island)<.25){const keys=[...island.resources].filter(([k,n])=>n.type==='wood_tree'&&n.amount>0&&!island.buildings.some(b=>`${b.tileX},${b.tileY}`===k)).map(([k])=>k);if(keys.length)igniteForest(island,keys[Math.floor(random(island)*keys.length)]);}}
}
