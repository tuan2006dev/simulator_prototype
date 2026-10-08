import type {Island,NPC} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {findPath,isWalkable} from './pathfinding';
import {addEntry} from './chronicle';
const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
export const wildlifeName=(species:string)=>species==='wolf'?'Sói hoang':'Lợn rừng';
export function initializeWildlife(s:Island,map:WorldMap):void{
 const fire=s.dailyLife?.campfire;if(s.wilderness||!s.exploration||!fire)return;
 const home={x:fire.tileX,y:fire.tileY},sites=map.landTiles.filter(p=>map.tiles[p.y][p.x]==='forest'&&distance(home,p)>=9&&distance(home,p)<=18&&!s.buildings.some(b=>b.tileX===p.x&&b.tileY===p.y)).map(p=>({p,path:findPath(map,home.x,home.y,p.x,p.y)})).filter(v=>v.path&&v.path.length<=20).sort((a,b)=>a.path!.length-b.path!.length||a.p.y-b.p.y||a.p.x-b.p.x);
 const wolf=sites[0]?.p,boar=sites.find(v=>wolf&&distance(v.p,wolf)>=8)?.p;
 s.wilderness={version:1,territories:[wolf,boar].flatMap((p,i)=>p?[{id:`wild-${i}`,species:i===0?'wolf' as const:'boar' as const,...p,animalX:p.x,animalY:p.y,seen:false,retreatUntil:0,cooldownUntil:0}]:[]),encounters:0,injuries:0,repelled:0,message:'Chưa ghi nhận thú hoang; đi chậm khi xa làng.'};
}
/** Animals roam one actual step inside a small territory; they never pursue a villager. */
export function tickWildlife(s:Island,map:WorldMap):void{
 initializeWildlife(s,map);const w=s.wilderness;if(!w)return;
 for(const t of w.territories){
  if(s.tick%2===0&&s.tick>=t.retreatUntil){const choices=map.landTiles.filter(p=>distance(p,t)<=2&&['forest','grass','sand'].includes(map.tiles[p.y][p.x])).sort((a,b)=>a.y-b.y||a.x-b.x);const target=choices[(Math.floor(s.tick/2)+(t.species==='wolf'?0:3))%choices.length];if(target){const path=findPath(map,t.animalX,t.animalY,target.x,target.y);const next=path?.[0];if(next&&distance(next,t)<=2){t.animalX=next.x;t.animalY=next.y;}}}
  if(s.exploration?.visible.has(`${t.animalX},${t.animalY}`))t.seen=true;
 }
}
/** Automatic scouting avoids known territories. A torch opens a wolf route, not a boar route. */
export function unsafeWildlifePath(s:Island,n:NPC,path:{x:number;y:number}[]):boolean{
 return !!s.wilderness?.territories.some(t=>t.seen&&s.tick>=t.retreatUntil&&!(t.species==='wolf'&&(n.torch?.fuel??0)>0)&&path.some(p=>distance(p,t)<=4));
}
export function encounterWildlife(s:Island,map:WorldMap,n:NPC):string|null{
 const w=s.wilderness;if(!w||!n.isAlive||!n.position)return null;
 const here={x:n.position.tileX,y:n.position.tileY},fire=s.dailyLife?.campfire;
 if(fire&&distance(here,{x:fire.tileX,y:fire.tileY})<=4)return null;
 for(const t of w.territories){
  if(s.tick<t.retreatUntil||distance(here,{x:t.animalX,y:t.animalY})>3)continue;
  const path=findPath(map,here.x,here.y,t.animalX,t.animalY);if(path===null||path.length>3)continue;
  t.seen=true;
  const litTorch=t.species==='wolf'&&(n.torch?.fuel??0)>0;
  let kind:'warning'|'injury'|'repelled'='warning',damage=0,note=`${wildlifeName(t.species)} ở gần · rút về làng, chưa thu điểm.`;
  if(litTorch){kind='repelled';t.retreatUntil=s.tick+10;note='Đuốc đang cháy xua sói; sói lùi trong lãnh địa.';}
  else if(path.length<=1&&s.tick>=t.cooldownUntil){
   const base=t.species==='wolf'?12:16,mitigation=(n.weapon==='spear'?8:0)+(n.armor==='padded_vest'?4:0),before=n.health??100;
   damage=Math.max(0,Math.min(base-mitigation,before-20));n.health=before-damage;t.cooldownUntil=s.tick+5;kind=damage>0?'injury':'warning';
   note=`${wildlifeName(t.species)} áp sát · ${n.weapon==='spear'?'giáo chống đỡ · ':''}${damage>0?`mất ${damage} sức khỏe`:'đã chống đỡ'} · về làng.`;
   if(n.weapon==='spear'){t.retreatUntil=s.tick+10;note+=' Thú lùi khi gặp giáo.';}
   if(s.exploration?.patrol?.npcId===n.id)s.exploration.patrol.enabled=false;
  }
  const previous=w.lastEncounter,repeat=damage===0&&previous?.npcId===n.id&&previous.territoryId===t.id&&s.tick-previous.tick<5;
  if(repeat&&previous?.kind==='injury'&&!litTorch)note=`${wildlifeName(t.species)} gây thương tích · đang rút về chữa thương.`;
  if(!repeat){w.encounters++;if(kind==='injury')w.injuries++;if(kind==='repelled')w.repelled++;w.lastEncounter={npcId:n.id,territoryId:t.id,tick:s.tick,kind,damage};w.message=`${n.name} · ${note}`;addEntry(s,w.message,kind==='injury'?'high':'medium');n.needs.safety=Math.min(100,n.needs.safety+(kind==='injury'?10:kind==='warning'?5:0));}
  if(litTorch){const choices=map.landTiles.filter(p=>distance(p,t)<=2&&distance(p,here)>distance({x:t.animalX,y:t.animalY},here)&&isWalkable(map.tiles[p.y][p.x],map,p.x,p.y)).sort((a,b)=>distance(b,here)-distance(a,here));const target=choices[0];if(target){const step=findPath(map,t.animalX,t.animalY,target.x,target.y)?.[0];if(step&&distance(step,t)<=2){t.animalX=step.x;t.animalY=step.y;}}continue;}
  return note;
 }
 return null;
}
