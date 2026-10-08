import type {Island,NPC} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {findPath,isWalkable} from './pathfinding';
import {movementSteps,worldMinutes} from './dailyLife';
import {storageSites} from './settlement';
import {materialCapacity} from '../renderer/BuildingManager';
import {addEntry} from './chronicle';
import {initializeWildlife,tickWildlife,unsafeWildlifePath,encounterWildlife} from './WildlifeManager';

const key=(x:number,y:number)=>`${x},${y}`;
const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
export const isNight=(s:Island)=>worldMinutes(s.tick)>=1080||worldMinutes(s.tick)<360;
export const discoveryName=(kind:string)=>kind==='monolith'?'Bia đá cổ':kind==='food_cache'?'Bụi quả dại':'Vạt thảo dược';
export function ensureDiscoveries(s:Island,map:WorldMap):void{
 const e=s.exploration,fire=s.dailyLife?.campfire;if(!e||e.points||!fire)return;
 const home={x:fire.tileX,y:fire.tileY};e.points=[];
 const candidates=[...s.resources].filter(([k,r])=>{const [x,y]=k.split(',').map(Number);return r.type==='herb_patch'&&r.amount>0&&distance(home,{x,y})>=6&&distance(home,{x,y})<=14&&findPath(map,home.x,home.y,x,y)!==null;}).sort(([a],[b])=>{const [ax,ay]=a.split(',').map(Number),[bx,by]=b.split(',').map(Number);return distance(home,{x:ax,y:ay})-distance(home,{x:bx,y:by})||a.localeCompare(b);});
 for(const [i,[k]] of candidates.slice(0,2).entries()){const [x,y]=k.split(',').map(Number);e.points.push({id:`discovery-${i}`,kind:i===0?'food_cache':'herb_cache',x,y,sourceKey:k,claimed:false,exhausted:false,workTicks:0,collected:0});}
 const stone=map.landTiles.filter(p=>['grass','forest','sand'].includes(map.tiles[p.y][p.x])&&distance(home,p)>=7&&distance(home,p)<=10&&!s.resources.has(key(p.x,p.y))&&!s.buildings.some(b=>b.tileX===p.x&&b.tileY===p.y)).map(p=>({p,path:findPath(map,home.x,home.y,p.x,p.y)})).filter(v=>v.path&&v.path.length<=12).sort((a,b)=>a.path!.length-b.path!.length||a.p.y-b.p.y||a.p.x-b.p.x)[0];
 if(stone)e.points.push({id:'discovery-stone',kind:'monolith',...stone.p,claimed:false,exhausted:false,workTicks:0,collected:0});
}
export function setPatrol(s:Island,map:WorldMap|undefined,npcId:string,enabled:boolean):string|null{
 if(!map||typeof enabled!=='boolean')return 'Chọn chế độ tuần tra hợp lệ.';
 const e=s.exploration,n=s.npcs.find(n=>n.id===npcId);if(!e||!n)return 'Chọn cư dân đã định cư.';
 if(!enabled){if(e.patrol?.npcId!==npcId)return 'Người này không tuần tra.';e.patrol.enabled=false;if(e.active?.npcId===npcId)recallExplorer(s);else n.exploring=e.torchOrder?.npcId===npcId;e.message='Đã dừng tuần tra; người đang đi sẽ về làng trước khi làm việc cũ.';return null;}
 if(e.active||e.torchOrder||e.patrol?.enabled)return 'Dừng chuyến hoặc đơn đang có trước.';const lock=explorationLock(s,n);if(lock)return lock;
 ensureDiscoveries(s,map);e.patrol={npcId,enabled:true,nextTick:s.tick,trips:0};n.exploring=true;e.message='Tuần tra: ưu tiên điểm đã thấy, sau đó rìa sương mù; tối đa một chuyến mỗi ngày.';return null;
}
export function visitDiscovery(s:Island,map:WorldMap|undefined,npcId:string,pointId:string):string|null{
 if(!map)return 'Chưa có bản đồ.';ensureDiscoveries(s,map);const p=s.exploration?.points?.find(p=>p.id===pointId);
 if(!p||!knownTile(s,p.x,p.y)||p.claimed||p.exhausted)return 'Điểm chưa được thấy hoặc đã xử lý.';
 if(s.exploration?.patrol?.enabled)return 'Dừng tuần tra trước khi chọn chuyến tay.';
 const error=startExploration(s,map,npcId,p.x,p.y);if(!error)s.exploration!.active!.pointId=p.id;return error;
}
function planPatrol(s:Island,map:WorldMap,n:NPC):void{
 const e=s.exploration!,patrol=e.patrol!;if(s.tick<patrol.nextTick||isNight(s)||worldMinutes(s.tick)>720||n.survivalBlocked||explorationLock(s,n))return;
 const home=s.dailyLife?.campfire;if(!home)return;
 const points=(e.points??[]).filter(p=>!p.claimed&&!p.exhausted&&knownTile(s,p.x,p.y));
 const frontier=map.landTiles.filter(p=>distance({x:home.tileX,y:home.tileY},p)>=6&&!knownTile(s,p.x,p.y)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>knownTile(s,p.x+dx,p.y+dy))).sort((a,b)=>distance({x:home.tileX,y:home.tileY},a)-distance({x:home.tileX,y:home.tileY},b)).slice(0,60);
 const target=[...points,...frontier].find(p=>{const out=findPath(map,n.position!.tileX,n.position!.tileY,p.x,p.y),back=findPath(map,p.x,p.y,home.tileX,home.tileY);return out!==null&&back!==null&&out.length<=12&&back.length<=12&&!unsafeWildlifePath(s,n,out)&&!unsafeWildlifePath(s,n,back);});
 if(!target){patrol.nextTick=s.tick+10;e.message='Chưa có lối gần an toàn; xem thú đã phát hiện, chuẩn bị đuốc/giáo hoặc đặt mốc tay.';return;}
 const error=startExploration(s,map,n.id,target.x,target.y,true);if(!error){e.active!.automatic=true;if('id' in target&&typeof target.id==='string')e.active!.pointId=target.id;}else e.message=error;
}
function collectDiscovery(s:Island,n:NPC):boolean{
 const e=s.exploration!,a=e.active!,p=e.points?.find(p=>p.id===a.pointId);if(!p||p.claimed||p.exhausted)return true;
 p.workTicks++;if(p.kind==='monolith'){
  if(p.workTicks<2){a.reason='Đang đọc bia đá';return false;}
  n.attributes??={str:5,dex:5,int:5};const before=n.attributes.int;n.attributes.int=Math.min(10,before+1);p.collected=n.attributes.int-before;p.claimed=true;a.reason=`Đã đọc bia đá · +${p.collected} trí tuệ`;addEntry(s,`${n.name} đọc bia đá cổ, tăng ${p.collected} trí tuệ (tối đa 10).`,'medium');return true;
 }
 const source=s.resources.get(p.sourceKey!),amount=Math.min(p.kind==='food_cache'?8:2,source?.amount??0);if(amount<=0){p.exhausted=true;a.reason='Nguồn đã cạn, không thu vật tư';return true;}
 source!.amount-=amount;n.cargo={food:p.kind==='food_cache'?amount:0,herbs:p.kind==='herb_cache'?amount:0,wood:0,stone:0};p.collected=amount;p.claimed=true;a.foundFood||=p.kind==='food_cache';a.reason=`Đã thu ${amount} ${p.kind==='food_cache'?'thức ăn':'thảo dược'} · mang về kho`;return true;
}
export function knownTile(s:Island,x:number,y:number):boolean{return !s.exploration||s.exploration.discovered.has(key(x,y));}
export function sightRadius(s:Island,n:NPC):number{return (n.torch?.fuel??0)>0?6:isNight(s)?2:4;}
export function initializeExploration(s:Island,map:WorldMap,legacy=false):void{
 if(s.exploration)return;
 const discovered=new Set<string>();if(legacy)for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)discovered.add(key(x,y));
 s.exploration={version:1,discovered,visible:new Set(),legacy,message:legacy?'Bản đồ cũ giữ các vùng đã biết. Có thể cử người đi khảo sát nguồn thức ăn.':'Chọn người trưởng thành và đặt mốc ở rìa sương mù.',mission:{region:false,food:false,returned:false},torchStock:[],torchCrafted:0,completed:0};
 refreshVisibility(s,map);
}
export function explorationLock(s:Island,n:NPC):string|null{
 if(s.tides?.active?.npcId===n.id)return 'Đang đi qua bãi cạn; chờ về làng.';
 if(!n.isAlive||!n.position||n.age<18||n.occupation==='child')return 'Chọn người trưởng thành đã định cư.';
 if(n.cargo||n.freight||n.haulTask)return 'Chờ giao xong hàng trước khi khám phá.';
 if(n.researching||n.guardDuty||n.clinicalCare||n.treatment||n.defenseChoice||s.adaptationProcess?.npcId===n.id||s.equipment?.order?.workerId===n.id||s.defense?.order?.npcId===n.id||s.buildings.some(b=>b.workers.includes(n.id)))return 'Chọn người không trực công trình, bảo vệ hoặc đang chăm sóc/chế tạo.';
 if((n.health??100)<40||n.needs.hunger>=80||n.needs.rest>=80)return 'Cần ăn, nghỉ hoặc hồi sức trước khi lên đường.';
 return null;
}
export function startExploration(s:Island,map:WorldMap|undefined,npcId:string,x:number,y:number,automatic=false):string|null{
 if(!map)return 'Chưa có bản đồ.';const n=s.npcs.find(n=>n.id===npcId);if(!n)return 'Cư dân không tồn tại.';
 if(s.exploration?.patrol?.enabled&&!automatic)return 'Dừng tuần tra trước khi chọn chuyến tay.';
 if(s.exploration?.active||s.exploration?.torchOrder)return 'Hoàn thành chuyến hoặc đơn đuốc đang có trước.';
 const lock=explorationLock(s,n);if(lock)return lock;if(isNight(s))return 'Chờ bình minh để khởi hành; đuốc hỗ trợ đường về lúc tối.';
 if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y)||!['grass','forest','sand'].includes(map.tiles[y]?.[x]))return 'Đặt mốc trên đất có thể đi tới.';
 const home=s.dailyLife?.campfire?{x:s.dailyLife.campfire.tileX,y:s.dailyLife.campfire.tileY}:storageSites(s)[0];if(!home)return 'Cần lửa trại hoặc nơi chứa để trở về.';
 if(distance(home,{x,y})<6)return 'Chọn một vùng xa lửa trại hơn (ít nhất 6 ô).';
 if(findPath(map,n.position!.tileX,n.position!.tileY,x,y)===null||findPath(map,x,y,home.x,home.y)===null)return 'Không có đường đi và quay về mốc này.';
 initializeExploration(s,map,true);const e=s.exploration!;e.active={npcId,target:{x,y},home:{x:home.x,y:home.y},stage:'outbound',reached:false,newLand:0,foundFood:false,reason:''};n.path=undefined;n.exploring=true;e.message=`${n.name} lên đường; tự về khi trời tối, đói, mệt hoặc bị thương.`;return null;
}
export function recallExplorer(s:Island):string|null{const a=s.exploration?.active;if(!a)return 'Không có chuyến khám phá.';a.stage='returning';a.reason='Được gọi về';s.exploration!.message='Đã gọi về; cư dân đi bộ về lửa trại, giữ vùng đã khám phá.';return null;}
export function refreshVisibility(s:Island,map:WorldMap):void{
 const e=s.exploration;if(!e)return;ensureDiscoveries(s,map);initializeWildlife(s,map);e.visible=new Set();
 const reveal=(x:number,y:number,r:number,actor?:NPC)=>{for(let yy=Math.max(0,y-r);yy<=Math.min(map.height-1,y+r);yy++)for(let xx=Math.max(0,x-r);xx<=Math.min(map.width-1,x+r);xx++){
  if((xx-x)**2+(yy-y)**2>r*r)continue;const k=key(xx,yy),fresh=!e.discovered.has(k);e.visible.add(k);e.discovered.add(k);
  if(actor&&e.active?.npcId===actor.id&&distance(e.active.home,{x:xx,y:yy})>=6){if(fresh&&['grass','sand','forest'].includes(map.tiles[yy][xx]))e.active.newLand++;const resource=s.resources.get(k);if(resource&&resource.amount>0&&['herb_patch','fish_spot'].includes(resource.type))e.active.foundFood=true;}
 }};
 for(const n of s.npcs)if(n.isAlive&&n.position)reveal(n.position.tileX,n.position.tileY,sightRadius(s,n),n);
 const fire=s.dailyLife?.campfire;if(fire&&fire.lit!==false)reveal(fire.tileX,fire.tileY,4);
 for(const t of s.wilderness?.territories??[])if(e.visible.has(key(t.animalX,t.animalY)))t.seen=true;
}
export function tickExploration(s:Island,map:WorldMap):void{
 const e=s.exploration;if(!e)return;ensureDiscoveries(s,map);for(const n of s.npcs)n.exploring=s.tides?.active?.npcId===n.id||e.active?.npcId===n.id||e.torchOrder?.npcId===n.id||!!e.patrol?.enabled&&e.patrol.npcId===n.id;
 for(const n of s.npcs)if(n.isAlive&&n.torch&&n.torch.fuel>0&&isNight(s))n.torch.fuel--;
 tickWildlife(s,map);
 if(!e.active&&e.patrol?.enabled){const scout=s.npcs.find(n=>n.id===e.patrol!.npcId&&n.isAlive&&n.position);if(!scout){e.patrol.enabled=false;e.message='Tuần tra dừng vì cư dân không còn ở trên đảo.';}else{planPatrol(s,map,scout);if(!e.active&&!scout.cargo&&!scout.survivalBlocked){scout.survivalBlocked=true;scout.status='idle';e.message=isNight(s)?'Tuần tra nghỉ ban đêm; chờ ăn/ngủ và bình minh.':e.message;}}}
 const a=e.active;if(!a){e.warning='';refreshVisibility(s,map);return;}const n=s.npcs.find(n=>n.id===a.npcId&&n.isAlive&&n.position);
 if(!n){e.active=undefined;e.message='Chuyến dừng vì cư dân không còn ở trên đảo; không nhận hoàn thành.';refreshVisibility(s,map);return;}
 const back=findPath(map,n.position!.tileX,n.position!.tileY,a.home.x,a.home.y),returnTicks=back===null?Infinity:Math.ceil(back.length/movementSteps(n,s)),dayTicks=Math.max(0,Math.floor((1080-worldMinutes(s.tick))/144));
 e.warning=back===null?'Không có lối về; cần mở lại đường.':isNight(s)?`Đang về trong đêm · còn khoảng ${returnTicks} nhịp đi bộ.`:returnTicks>=dayTicks&&returnTicks>0?`Cần ${returnTicks} nhịp để về · sắp hết giờ sáng, quay về ngay.`:'';
 if(n.torch&&n.torch.fuel<=5)e.warning+=(e.warning?' ':'')+`Đuốc còn ${n.torch.fuel}/30; dừng tuần tra để tiếp đuốc tại kho.`;
 const danger=encounterWildlife(s,map,n);if(danger){a.stage='returning';a.reason=danger;e.warning+=(e.warning?' ':'')+danger;}
 if(a.stage==='outbound'&&returnTicks>0&&returnTicks>=dayTicks){a.stage='returning';a.reason='Về trước khi tối';}
 if(a.stage==='outbound'&&(isNight(s)||n.needs.hunger>=80||n.needs.rest>=80||(n.health??100)<40||n.survivalBlocked||s.raids?.phase==='active')){a.stage='returning';a.reason=isNight(s)?'Trời tối':n.needs.hunger>=80?'Cần ăn':n.needs.rest>=80?'Cần nghỉ':(n.health??100)<40?'Bị thương':'Ưu tiên an toàn/sinh hoạt';}
 if(a.stage==='returning'&&distance({x:n.position!.tileX,y:n.position!.tileY},a.home)<=1){
  e.mission.region||=a.newLand>0||e.legacy&&a.reached;e.mission.food||=a.foundFood;e.mission.returned=true;e.completed++;if(a.automatic&&e.patrol){e.patrol.trips++;e.patrol.nextTick=(Math.floor(s.tick/10)+1)*10;}e.active=undefined;e.warning='';n.exploring=!!e.patrol?.enabled;n.path=undefined;e.message=`${n.name} đã về: mở ${a.newLand} ô đất mới${a.foundFood?', tìm thấy nguồn thức ăn':''}${a.reason?' · '+a.reason:''}.`;addEntry(s,e.message,'medium');refreshVisibility(s,map);return;
 }
 if(n.survivalBlocked){e.message=`${a.reason||'Ăn/ngủ'} · đang trở về, giữ vùng đã mở`;refreshVisibility(s,map);return;}
 if(a.stage==='outbound'&&!isWalkable(map.tiles[a.target.y]?.[a.target.x],map,a.target.x,a.target.y)){a.stage='returning';a.reason='Đường bị chặn';}
 n.survivalBlocked=true;n.status='working';const target=a.stage==='outbound'?a.target:a.home,path=findPath(map,n.position!.tileX,n.position!.tileY,target.x,target.y);
 if(path===null){a.stage='returning';a.reason='Đường bị chặn';e.message='Đường bị chặn · giữ chuyến. Mở lại đường hoặc lối về; không dịch chuyển cư dân.';n.laborMessage=e.message;refreshVisibility(s,map);return;}
 if(path.length){const steps=Math.min(movementSteps(n,s),path.length);for(const p of path.slice(0,steps)){n.position={tileX:p.x,tileY:p.y};refreshVisibility(s,map);const danger=encounterWildlife(s,map,n);if(danger){a.stage='returning';a.reason=danger;e.warning+=(e.warning?' ':'')+danger;break;}}n.path=undefined;}
 if(a.stage==='outbound'&&distance({x:n.position!.tileX,y:n.position!.tileY},target)===0){a.reached=true;if(!a.pointId||collectDiscovery(s,n)){a.stage='returning';if(!a.pointId)a.reason='Đã tới mốc';}}
 e.message=`${n.name} · ${a.stage==='outbound'?'đang khám phá':'đang về lửa trại'}${a.reason?' · '+a.reason:''}`;n.laborMessage=e.message;refreshVisibility(s,map);
}
export function craftTorch(s:Island,map:WorldMap|undefined,npcId:string):string|null{
 if(!map)return 'Chưa có bản đồ.';const n=s.npcs.find(n=>n.id===npcId);if(!n)return 'Chọn cư dân.';const lock=explorationLock(s,n);if(lock)return lock;
 if(s.exploration?.active||s.exploration?.torchOrder||s.exploration?.patrol?.enabled)return 'Dừng tuần tra và hoàn thành chuyến/đơn đuốc đang có.';if(s.wood<1)return 'Cần 1 gỗ đã giao về kho.';
 if(!stockPath(s,map,n))return 'Không có đường tới kho/lửa trại.';initializeExploration(s,map,true);s.wood--;s.exploration!.torchOrder={npcId,workTicks:0};n.exploring=true;s.exploration!.message='Đã giữ 1 gỗ; chế đuốc trong 2 nhịp làm tại kho/lửa trại.';return null;
}
export function cancelTorch(s:Island):string|null{if(!s.exploration?.torchOrder)return 'Không có đơn đuốc.';if(s.wood+1>materialCapacity(s))return 'Kho gỗ đầy; giữ đơn tới khi có chỗ hoàn.';const n=s.npcs.find(n=>n.id===s.exploration!.torchOrder!.npcId);if(n)n.exploring=false;s.wood++;s.exploration.torchOrder=undefined;s.exploration.message='Đã hủy, hoàn đúng 1 gỗ.';return null;}
function stockPath(s:Island,map:WorldMap,n:NPC){return storageSites(s).flatMap(p=>{const path=findPath(map,n.position!.tileX,n.position!.tileY,p.x,p.y);return path===null?[]:[path];}).sort((a,b)=>a.length-b.length)[0];}
export function chooseTorch(s:Island,npcId:string,equip:boolean,refill=false):string|null{
 const n=s.npcs.find(n=>n.id===npcId);if(!n||typeof equip!=='boolean'||typeof refill!=='boolean')return 'Chọn cư dân hợp lệ.';const lock=explorationLock(s,n);if(lock)return lock;if(s.exploration?.active||s.exploration?.torchOrder||s.exploration?.patrol?.enabled)return 'Dừng tuần tra và hoàn thành chuyến/đơn trước khi lấy, trả hoặc tiếp đuốc.';
 if(equip&&!n.torch&&!s.exploration?.torchStock.length)return 'Chế một đuốc trước khi tới kho lấy.';
 if(refill&&(!n.torch||n.torch.fuel>0||s.wood<1))return 'Tiếp đuốc đã cạn cần 1 gỗ trong kho.';n.torchChoice=equip;n.torchRefill=refill;if(s.exploration)s.exploration.message=refill?'Đã yêu cầu tiếp đuốc tại kho, cần 1 gỗ.':equip?'Cư dân sẽ tới kho lấy đuốc khi đã ăn/nghỉ.':'Cư dân sẽ tới kho trả đuốc, giữ nhiên liệu còn lại.';return null;
}
export function tickTorches(s:Island,map:WorldMap):void{
 const e=s.exploration;if(!e)return;
 const order=e.torchOrder;if(order){const n=s.npcs.find(n=>n.id===order.npcId&&n.isAlive&&n.position);if(n&&!n.survivalBlocked){const path=stockPath(s,map,n);if(path){n.survivalBlocked=true;n.path=undefined;n.status='working';if(path.length){const p=path[Math.min(movementSteps(n,s),path.length)-1];n.position={tileX:p.x,tileY:p.y};}else if(++order.workTicks>=2){e.torchStock.push(30);e.torchCrafted++;e.torchOrder=undefined;n.exploring=false;e.message='Đuốc đã chế xong và nhập kho. Chọn Lấy đuốc để cư dân tới nhận.';}n.laborMessage='Đang chế đuốc tại kho/lửa trại';}}}
 for(const n of s.npcs){if(!n.isAlive||!n.position||n.survivalBlocked||e.active?.npcId===n.id||e.torchOrder?.npcId===n.id||e.patrol?.enabled&&e.patrol.npcId===n.id||explorationLock(s,n))continue;
  const taking=n.torchChoice===true&&!n.torch,returning=n.torchChoice===false&&!!n.torch,refill=!!n.torchRefill;if(!taking&&!returning&&!refill)continue;if(taking&&e.torchStock.length===0){n.equipmentMessage='Chờ đuốc trong kho';continue;}if(refill&&s.wood<1){n.equipmentMessage='Chờ 1 gỗ để tiếp đuốc';continue;}
  const path=stockPath(s,map,n);if(!path){n.equipmentMessage='Không có đường tới kho lấy/trả đuốc';continue;}n.survivalBlocked=true;n.path=undefined;n.status='working';n.laborMessage='Đến kho lấy/trả/tiếp đuốc';if(path.length){const p=path[Math.min(movementSteps(n,s),path.length)-1];n.position={tileX:p.x,tileY:p.y};continue;}
  if(taking){n.torch={fuel:e.torchStock.shift()!};}else if(returning){e.torchStock.push(n.torch!.fuel);n.torch=undefined;}else if(refill&&n.torch&&n.torch.fuel===0&&s.wood>=1){s.wood--;n.torch.fuel=30;}n.torchRefill=false;
 }
}
