import type {Island} from './types';
import type {WorldMap} from '../renderer/WorldMap';
import {findPath} from './pathfinding';
import {movementSteps} from './dailyLife';
import {addEntry} from './chronicle';
export const SURVEY_LABELS={hightech:'Tín hiệu công nghệ',mystic:'Mạch linh khí',eldritch:'Vùng nhiễu quỷ dị'};
export function initializeSurveys(s:Island,map:WorldMap):void{
 if(s.surveys||!s.civilization?.unlocks.includes('field_surveys'))return;
 const home=s.buildings.find(b=>b.type==='study_table'&&b.complete);if(!home)return;
 const chosen:{x:number;y:number}[]=[];
 for(const kind of ['hightech','mystic','eldritch'] as const){
  const candidates=map.landTiles.filter(t=>['grass','sand','forest'].includes(map.tiles[t.y]?.[t.x])&&!s.buildings.some(b=>b.tileX===t.x&&b.tileY===t.y)&&Math.abs(t.x-home.tileX)+Math.abs(t.y-home.tileY)>=5&&!chosen.some(p=>Math.abs(p.x-t.x)+Math.abs(p.y-t.y)<4)).sort((a,b)=>Math.abs(b.x-home.tileX)+Math.abs(b.y-home.tileY)-Math.abs(a.x-home.tileX)-Math.abs(a.y-home.tileY)||a.y-b.y||a.x-b.x);
  const point=candidates.find(t=>findPath(map,home.tileX,home.tileY,t.x,t.y)!==null);if(point)chosen.push(point);
 }
 if(chosen.length!==3)return;
 s.surveys={version:1,sites:chosen.map((t,i)=>({id:`site-${i+1}`,kind:(['hightech','mystic','eldritch'] as const)[i],x:t.x,y:t.y,surveyed:false})),message:'Ba điểm cần khảo sát sơ bộ. Hồ sơ chỉ được ghi nhận khi cư dân quay về bàn nghiên cứu.'};
}
export function startSurvey(s:Island,map:WorldMap|undefined,siteId:string,npcId:string):string|null{
 if(!map||s.civilization?.era!=='modern'||!s.civilization.unlocks.includes('field_surveys'))return 'Cần Hiện Đại và nghiên cứu Khảo sát thực địa.';
 initializeSurveys(s,map);const state=s.surveys,site=state?.sites.find(p=>p.id===siteId),n=s.npcs.find(n=>n.id===npcId&&n.isAlive&&n.position&&n.age>=18&&n.occupation!=='child'),home=s.buildings.find(b=>b.type==='study_table'&&b.complete);
 if(!state||!site||site.surveyed||state.active||!home)return 'Điểm đã khảo sát, đang có đội đi hoặc chưa có bàn nghiên cứu.';
 if(!n||s.adaptationProcess?.npcId===n.id||n.clinicalCare||n.treatment||n.defenseChoice||s.defense?.order?.npcId===n.id||n.researching||n.guardDuty||n.cargo||n.freight||n.haulTask||n.actionTarget||n.laborTask||(n.buildingWork?.ticks??0)>0||s.equipment?.order?.workerId===n.id||s.buildings.some(b=>b.workers.includes(n.id)))return 'Chọn người trưởng thành rảnh đã giao xong hàng.';
 if(findPath(map,n.position!.tileX,n.position!.tileY,site.x,site.y)===null||findPath(map,site.x,site.y,home.tileX,home.tileY)===null)return 'Chưa có đường đi và trở về.';
 const c=s.civilization;if(c.inventory.components<2||c.inventory.cloth<2)return 'Mỗi chuyến cần 2 linh kiện +2 vải trong kho.';
 c.inventory.components-=2;c.inventory.cloth-=2;n.researching=true;n.path=undefined;n.laborTask=undefined;n.buildingWork=undefined;
 state.active={siteId,npcId,homeId:home.id,stage:'outbound',workTicks:0};state.message='Đã trả 2 linh kiện +2 vải; đội đang tới điểm lạ.';addEntry(s,`Khởi hành khảo sát ${SURVEY_LABELS[site.kind]}; hồ sơ chỉ ghi nhận khi trở về.`, 'medium');return null;
}
export function cancelSurvey(s:Island):string|null{
 const state=s.surveys,a=state?.active;if(!state||!a||!s.civilization)return 'Không có chuyến khảo sát.';
 s.civilization.inventory.components+=2;s.civilization.inventory.cloth+=2;const n=s.npcs.find(n=>n.id===a.npcId);if(n){n.researching=false;n.path=undefined;n.laborRetryAt=0;}
 state.active=undefined;state.message='Đã hủy và hoàn 2 linh kiện +2 vải. Hồ sơ chưa được ghi nhận; cư dân ở vị trí hiện tại.';return null;
}
export function tickSurveys(s:Island,map:WorldMap):void{
 initializeSurveys(s,map);const state=s.surveys,a=state?.active;if(!state||!a)return;
 const site=state.sites.find(p=>p.id===a.siteId)!,n=s.npcs.find(n=>n.id===a.npcId&&n.isAlive&&n.position),home=s.buildings.find(b=>b.id===a.homeId&&b.complete);
 if(!n||!home){cancelSurvey(s);return;}
 if(n.survivalBlocked||n.actionTarget||n.status==='sleeping'||n.status==='eating'||n.needs.hunger>=80||n.needs.rest>=85){state.message='Đội tạm nghỉ để ăn/ngủ hoặc tránh nguy hiểm; giữ tiến độ.';return;}
 const dest=a.stage==='returning'?{x:home.tileX,y:home.tileY}:site;
 if(!['grass','sand','forest'].includes(map.tiles[dest.y]?.[dest.x])){state.message='Điểm khảo sát hoặc nơi trở về bị chặn; khôi phục đất hoặc hủy để hoàn vật tư.';return;}
 const path=findPath(map,n.position!.tileX,n.position!.tileY,dest.x,dest.y);
 if(path===null){state.message='Đường bị chặn; mở lại đường hoặc hủy để hoàn vật tư.';return;}
 n.path=undefined;n.status='working';n.laborMessage=a.stage==='returning'?'Mang hồ sơ khảo sát về bàn':'Đang khảo sát thực địa';
 if(path.length){const next=path[Math.min(movementSteps(n,s),path.length)-1];n.position={tileX:next.x,tileY:next.y};state.message=`${n.laborMessage} · còn ${path.length-1} ô`;return;}
 if(a.stage==='outbound')a.stage='observing';
 if(a.stage==='observing'){a.workTicks++;state.message=`Quan sát tại điểm · ${a.workTicks}/10 nhịp`;if(a.workTicks>=10)a.stage='returning';return;}
 site.surveyed=true;n.researching=false;n.laborRetryAt=0;state.active=undefined;state.message=`Đã mang hồ sơ ${SURVEY_LABELS[site.kind]} về bàn. Phân tích bằng cơ sở đo đạc là bước tiếp theo; chưa có biến thể.`;addEntry(s,state.message,'high');
}
