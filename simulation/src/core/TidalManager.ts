import type {Island,NPC} from './types';
import type {WorldMap,TilePos} from '../renderer/WorldMap';
import {regionAt} from '../renderer/WorldMap';
import {findPath} from './pathfinding';
import {worldMinutes} from './dailyLife';
import {foodCapacity,materialCapacity} from '../renderer/BuildingManager';
import {explorationLock,refreshVisibility} from './ExplorationManager';
import {addEntry} from './chronicle';
import {encounterWildlife} from './WildlifeManager';

const key=(p:TilePos)=>`${p.x},${p.y}`;
const land=(map:WorldMap,p:TilePos)=>['grass','forest','sand'].includes(map.tiles[p.y]?.[p.x]);
export const lowTide=(tick:number,progressMs=0)=>worldMinutes(tick,progressMs)>=540&&worldMinutes(tick,progressMs)<900;
export function tideLabel(tick:number,progressMs=0):string{
 const minutes=worldMinutes(tick,progressMs),low=lowTide(tick,progressMs),left=low?900-minutes:(540-minutes+1440)%1440;
 const rounded=Math.ceil(left);
 return `${low?'Nước rút · đường đang lộ':'Nước lên · đường đã đóng'} · ${low?'đóng sau':'mở sau'} ${Math.floor(rounded/60)} giờ ${rounded%60} phút`;
}
/** Geography only. Ordinary jobs never receive a walkable sea route. */
export function ensureCauseway(map:WorldMap):void{
 if(!map.archipelago||map.causeway)return;
 const coast=(id:string)=>map.landTiles.filter(p=>regionAt(map,p.x,p.y)?.id===id&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>['deep_water','shallow_water'].includes(map.tiles[p.y+dy]?.[p.x+dx])));
 const fangCoast=coast('rang-nanh'),pairs=coast('thien-nguyen').flatMap(main=>fangCoast.map(fang=>({main,fang,d:Math.hypot(main.x-fang.x,main.y-fang.y)}))).sort((a,b)=>a.d-b.d);
 for(const {main,fang} of pairs){const length=Math.max(Math.abs(main.x-fang.x),Math.abs(main.y-fang.y)),tiles=Array.from({length:length-1},(_,i)=>({x:Math.round(main.x+(fang.x-main.x)*(i+1)/length),y:Math.round(main.y+(fang.y-main.y)*(i+1)/length)}));
  if(length<=12&&tiles.every(p=>['deep_water','shallow_water'].includes(map.tiles[p.y]?.[p.x]))){map.causeway={version:1,main,fang,tiles};return;}
 }
}
export function tidalWalkMap(map:WorldMap,tick:number):WorldMap{
 return {...map,bridges:new Set([...(map.bridges??[]),...(lowTide(tick)?map.causeway?.tiles.filter(p=>['deep_water','shallow_water'].includes(map.tiles[p.y]?.[p.x])).map(key)??[]:[])])};
}
export function tidalSource(s:Island,map:WorldMap):string|undefined{
 const bank=map.causeway?.fang;if(!bank)return;
 return [...s.resources].flatMap(([k,r])=>{const [x,y]=k.split(',').map(Number);if(r.type!=='stone_deposit'||r.amount<=0||regionAt(map,x,y)?.id!=='rang-nanh')return [];const path=findPath(map,bank.x,bank.y,x,y);return path&&path.length<=6?[{k,length:path.length}]:[];}).sort((a,b)=>a.length-b.length||a.k.localeCompare(b.k))[0]?.k;
}
export function startTidalScout(s:Island,map:WorldMap|undefined,npcId:string):string|null{
 if(!map)return 'Chưa có bản đồ.';ensureCauseway(map);const c=map.causeway,n=s.npcs.find(n=>n.id===npcId),fire=s.dailyLife?.campfire;
 if(!c||!fire||!n)return 'Cần thế giới Ba đảo và lửa trại.';
 if(s.tides?.active||s.exploration?.active||s.exploration?.torchOrder||s.exploration?.patrol?.enabled)return 'Hoàn thành chuyến hoặc dừng tuần tra trước.';
 const lock=explorationLock(s,n);if(lock)return lock;
 if(regionAt(map,n.position!.tileX,n.position!.tileY)?.id!=='thien-nguyen')return 'Khởi hành từ Thiên Nguyên.';
 if(s.sharedFood<20)return 'Cần 20 thức ăn đã giao về kho để mang theo; phần còn lại sẽ trả khi về.';
 const home={x:fire.tileX,y:fire.tileY},sourceKey=tidalSource(s,map);
 if(!sourceKey||findPath(map,home.x,home.y,c.main.x,c.main.y)===null||findPath(map,n.position!.tileX,n.position!.tileY,home.x,home.y)===null)return 'Chưa có đường tới bãi cạn hoặc nguồn đá gần bờ Răng Nanh.';
 s.tides??={version:1,completed:0,message:''};s.sharedFood-=20;s.tides.active={npcId,home,phase:'provision',rations:20,sourceKey,collected:0,recall:false,startedTick:s.tick};n.exploring=true;n.path=undefined;
 s.tides.message='Đã giữ 20 thức ăn. Đến lửa trại lấy hành trang, chờ nước rút, khảo sát bờ Răng Nanh và mang tối đa 3 đá về. Chuyến cần hai đợt nước rút.';return null;
}
export function recallTidalScout(s:Island):string|null{
 if(!s.tides?.active)return 'Không có chuyến qua bãi cạn.';
 s.tides.active.recall=true;s.tides.message='Đã gọi về. Người đang qua bãi đi hết tới bờ an toàn; chờ nước rút nếu cần, giữ hàng và hành trang.';return null;
}
export function tickTides(s:Island,map:WorldMap):void{
 const t=s.tides,a=t?.active,c=map.causeway;if(!t||!a||!c)return;
 const n=s.npcs.find(n=>n.id===a.npcId&&n.isAlive&&n.position);if(!n){t.message='Chuyến dừng; không ghi nhận trở về hoặc nhận hàng.';t.active=undefined;return;}
 n.exploring=true;n.survivalBlocked=true;n.path=undefined;n.status='working';
 const pos=()=>({x:n.position!.tileX,y:n.position!.tileY});
 const onSea=()=>c.tiles.some(p=>key(p)===key(pos()));
 t.message='';
 // Meals come from the reserved, physically carried pack, never a remote warehouse.
 if(a.phase!=='provision'&&n.needs.hunger>=35&&a.rations>0){const consumed=Math.min(a.rations,n.needs.hunger/1.75);a.rations-=consumed;n.needs.hunger=Math.max(0,n.needs.hunger-consumed*1.75);}
 if(n.needs.hunger>=75||(n.health??100)<40||s.raids?.phase==='active')a.recall=true;
 if(a.recall&&['provision','approach'].includes(a.phase))a.phase='home';
 if(a.recall&&a.phase==='survey')a.phase='inward';
 if(a.recall&&a.phase==='outward'&&!onSea())a.phase='home';
 const move=(target:TilePos,walkMap=map):boolean=>{
  const path=findPath(walkMap,pos().x,pos().y,target.x,target.y);
  if(path===null){t.message='Lối đi bị sửa hoặc chặn. Giữ người, hàng và chuyến; mở lại đường để tiếp tục.';return false;}
  for(const p of path.slice(0,6)){n.position={tileX:p.x,tileY:p.y};refreshVisibility(s,map);if(land(map,p)&&encounterWildlife(s,map,n)){a.recall=true;break;}}return path.length<=6&&Math.max(Math.abs(pos().x-target.x),Math.abs(pos().y-target.y))<=1;
 };
 if(a.phase==='provision'){if(move(a.home))a.phase='approach';}
 else if(a.phase==='approach'){if(move(c.main))a.phase='outward';}
 else if(a.phase==='outward'||a.phase==='inward'){
  const outward=a.phase==='outward',target=outward?c.fang:c.main,bank=outward?c.main:c.fang;
  if(!onSea()&&key(pos())!==key(bank)){move(bank);}
  else {
   const walk=tidalWalkMap(map,s.tick),path=findPath(walk,pos().x,pos().y,target.x,target.y),slots=lowTide(s.tick)?Math.ceil((900-worldMinutes(s.tick))/144):0;
   if(!lowTide(s.tick)||path===null||Math.ceil(path.length/6)>slots){
    t.message=`${n.name} chờ trên bờ · chưa đủ thời gian vượt bãi trước 15:00. ${tideLabel(s.tick)}. Mang hàng về ở đợt nước rút kế tiếp.`;
    n.status='sleeping';n.needs.rest=Math.max(0,n.needs.rest-12);
   }else if(move(target,walk)){a.phase=outward?(a.recall?'inward':'survey'):'home';}
  }
 }
 else if(a.phase==='survey'){
  const [x,y]=a.sourceKey.split(',').map(Number);if(move({x,y})){
   if(a.recall){a.phase='inward';t.message='Dừng thu đá vì đường bộ có nguy hiểm; trở về bờ và giữ chuyến.';n.laborMessage=t.message;return;}
   const node=s.resources.get(a.sourceKey),amount=Math.min(3,node?.type==='stone_deposit'?node.amount:0);
   if(node)node.amount-=amount;a.collected=amount;a.phase='inward';
   addEntry(s,`${n.name} khảo sát bờ Răng Nanh, thu ${amount} đá từ mỏ thật; giữ hàng tới khi về làng.`,'medium');
  }
 }
 else if(a.phase==='home'&&move(a.home)){
  const food=Math.min(a.rations,Math.max(0,foodCapacity(s)-s.sharedFood)),stone=Math.min(a.collected,Math.max(0,materialCapacity(s)-s.stone));s.sharedFood+=food;a.rations-=food;s.stone+=stone;a.collected-=stone;
  if(a.rations>1e-8||a.collected>1e-8){t.message='Đã về lửa trại; kho đầy, giữ hành trang/hàng tới khi có chỗ giao.';return;}
  t.completed++;t.active=undefined;n.exploring=false;n.status='idle';t.message=`${n.name} đã đi bộ về Thiên Nguyên và giao hàng, trả phần thức ăn còn lại. Công việc cũ được giữ.`;addEntry(s,t.message,'medium');return;
 }
 if(!t.message.includes('chờ trên bờ')&&!t.message.includes('chặn'))t.message=`${n.name} · ${a.phase==='provision'?'lấy hành trang':a.phase==='approach'?'đến bờ Thiên Nguyên':a.phase==='outward'?'qua bãi về Răng Nanh':a.phase==='survey'?'khảo sát mỏ đá gần bờ':a.phase==='inward'?'chờ / vượt bãi về Thiên Nguyên':'mang hàng về lửa trại'}`;
 n.laborMessage=t.message;
}
