import {effectDuration} from './WorldClock';
import {incited} from './FaithManager';
import type {Island,NPC} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {findPath,isWalkable} from './pathfinding';
import {storageSites,shelterBeds} from './settlement';
import {estimateDailyFoodDemand} from './labor';
import {addEntry} from './chronicle';
export function initializeRaids(s:Island):void{s.raids??={version:1,clockMs:0,phase:'peace',untilMs:180000,count:0,target:null,enemies:[],stolen:0,budget:0,shieldUntilMs:0,shieldCooldownUntilMs:0,result:'Chưa có đột kích.'};}
export function shieldLock(s:Island):string|null{const r=s.raids;if(!r||!s.faith)return 'Thần lực chưa hoạt động.';if(!storageSites(s).length)return 'Cần lửa trại hoặc kho hoàn thành.';if(r.clockMs<r.shieldCooldownUntilMs)return 'Khiên Thần đang hồi chiêu.';if(s.faith.amount<70)return 'Chưa đủ 70 Niềm tin.';return null;}
export function castShield(s:Island):string|null{const lock=shieldLock(s);if(lock)return lock;const r=s.raids!;s.faith!.amount-=70;r.shieldUntilMs=r.clockMs+30000;r.shieldCooldownUntilMs=r.clockMs+90000;addEntry(s,'Khiên Thần: 70 Niềm tin, bảo vệ kho thức ăn 10 phút.','high');return null;}
const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const point=(n:NPC)=>({x:n.position!.tileX,y:n.position!.tileY});
function move(n:NPC,to:{x:number;y:number},map:WorldMap):boolean{const path=findPath(map,n.position!.tileX,n.position!.tileY,to.x,to.y);if(path===null)return false;const next=path[0];if(next)n.position={tileX:next.x,tileY:next.y};n.path=undefined;return true;}
export function raidSummary(s:Island):string{const r=s.raids;if(!r)return 'Phòng vệ chưa hoạt động.';return r.phase==='warning'?`Báo động: 2 kẻ đột kích sẽ đến sau ${effectDuration(r.untilMs-r.clockMs)}`:r.phase==='active'?`Đang đột kích: ${r.enemies.length} kẻ còn lại · mất ${r.stolen.toFixed(1)} thức ăn`:r.result;}
function finish(s:Island):void{const r=s.raids!;r.result=r.stolen>0?`Đột kích kết thúc · mất ${r.stolen.toFixed(1)} thức ăn.`:'Đã bảo vệ kho · không mất thức ăn.';addEntry(s,r.result,'high');r.phase='peace';r.enemies=[];r.untilMs=r.clockMs+180000;}
// Runs after survival trips and before every work system. Work targets, cargo and partial progress remain intact.
export function respondToRaid(s:Island,map:WorldMap):void{const r=s.raids;for(const n of s.npcs){if(n.raidResponse&&!n.survivalBlocked&&['fighting','fleeing'].includes(n.status))n.status='idle';n.raidResponse=undefined;}if(!r||r.phase!=='active')return;
 for(const n of s.npcs){if(!n.isAlive||!n.position||n.survivalBlocked)continue;const here=point(n),enemy=r.enemies.slice().sort((a,b)=>distance(here,a)-distance(here,b))[0];if(!enemy)break;
  if(n.guardDuty&&n.age>=18&&n.occupation!=='child'&&(n.health??100)>25){if(distance(here,enemy)>1&&!move(n,enemy,map))continue;n.survivalBlocked=true;n.raidResponse='guarding';n.laborMessage='Đang bảo vệ làng';n.status='fighting';if(distance(point(n),enemy)<=1){enemy.health-=(n.weapon==='spear'?8:6)*(incited(s,n)?1.2:1)*(1+Math.max(0,Math.min(.2,((n.attributes?.str??5)-5)*.04)));n.health=Math.max(20,(n.health??100)-(n.armor==='padded_vest'?2:3));if(enemy.health<=0)r.enemies=r.enemies.filter(e=>e.id!==enemy.id);}}
  else if(distance(here,enemy)<=5){const safety=(p:{x:number;y:number})=>Math.min(...r.enemies.map(e=>distance(p,e))),current=safety(here);const candidates=s.buildings.filter(b=>shelterBeds(b)>0).map(b=>({x:b.tileX,y:b.tileY})).concat(map.landTiles.filter(t=>distance(here,t)<=6)).filter(t=>isWalkable(map.tiles[t.y]?.[t.x],map,t.x,t.y)&&safety(t)>current).sort((a,b)=>safety(b)-safety(a));const safe=candidates.find(t=>{const path=findPath(map,here.x,here.y,t.x,t.y);return path!==null&&path.length>0&&safety(path[0])>=current;});if(safe&&move(n,safe,map)){n.survivalBlocked=true;n.raidResponse='fleeing';n.laborMessage='Tránh kẻ đột kích';n.status='fleeing';}}
 }
 if(!r.enemies.length)finish(s);
}
export function tickRaids(s:Island,map:WorldMap):void{const r=s.raids;if(!r)return;r.clockMs+=600;
 if(r.phase==='active'){for(const e of [...r.enemies]){const target=r.target;if(!target)continue;const path=findPath(map,e.x,e.y,target.x,target.y);if(path===null){r.enemies=r.enemies.filter(a=>a.id!==e.id);continue;}if(distance(e,target)>1){const next=path[0];if(next){e.x=next.x;e.y=next.y;}}else{if(r.clockMs>=r.shieldUntilMs){const amount=Math.max(0,Math.min(20,r.budget-r.stolen,s.sharedFood-estimateDailyFoodDemand(s.npcs)));s.sharedFood-=amount;r.stolen+=amount;}r.enemies=r.enemies.filter(a=>a.id!==e.id);}}
  if(!r.enemies.length||r.clockMs>=r.untilMs)finish(s);return;
 }
 if(r.clockMs<r.untilMs)return;
 const people=s.npcs.filter(n=>n.isAlive&&n.position),target=storageSites(s)[0];
 if(r.phase==='peace'){if(!target||people.length<5||s.buildings.reduce((a,b)=>a+shelterBeds(b),0)<people.length||s.sharedFood<3*estimateDailyFoodDemand(people)){r.untilMs=r.clockMs+30000;return;}r.target=target;r.phase='warning';r.untilMs=r.clockMs+20000;r.budget=Math.min(40,s.sharedFood*.2);r.stolen=0;addEntry(s,'Báo động: hai kẻ đột kích đang tới. Chỉ định người bảo vệ hoặc dùng Khiên Thần.','high');return;}
 const dest=r.target!;const sites=map.landTiles.filter(t=>distance(t,dest)>=8&&distance(t,dest)<=24&&isWalkable(map.tiles[t.y]?.[t.x],map,t.x,t.y)&&findPath(map,t.x,t.y,dest.x,dest.y)!==null).sort((a,b)=>distance(b,dest)-distance(a,dest));if(sites.length<2){r.phase='peace';r.result='Đột kích bỏ cuộc: không có đường vào kho.';r.untilMs=r.clockMs+180000;return;}
 r.count++;r.enemies=sites.slice(0,2).map((t,i)=>({id:`raid-${r.count}-${i}`,x:t.x,y:t.y,health:36}));r.phase='active';r.untilMs=r.clockMs+30000;addEntry(s,'Hai kẻ đột kích đã xuất hiện. Dân tránh nguy hiểm, người bảo vệ chống đỡ.','high');
}
