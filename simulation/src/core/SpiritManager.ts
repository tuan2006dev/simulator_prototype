import type {Island,Building} from './types';
import {hasPower} from './PowerManager';
import {addOutput,outputRoom} from './logistics';
export function spiritSite(s:Island){return s.surveys?.sites.find(p=>p.kind==='mystic'&&p.foundationComplete&&p.decision==='research');}
export function initializeSpirit(s:Island):void{const site=spiritSite(s);if(!s.spiritVein&&site&&s.civilization?.unlocks.includes('spirit_channeling'))s.spiritVein={version:1,siteId:site.id,charge:24,stability:100,clockTicks:0};}
export function setSpiritExtraction(s:Island,id:string,enabled:boolean):string|null{const b=s.buildings.find(b=>b.id===id&&b.type==='spirit_extractor'&&b.complete);if(!b||typeof enabled!=='boolean')return 'Trạm dẫn linh không hợp lệ.';b.spiritEnabled=enabled;b.workMessage=enabled?'Đã cho phép khai thác; vẫn cần người tới mạch.':'Cho mạch nghỉ; trữ lượng/ổn định hồi tự nhiên.';return null;}
export function harvestSpirit(s:Island,b:Building):void{
 const v=s.spiritVein,site=spiritSite(s);if(!v||!site||Math.max(Math.abs(site.x-b.tileX),Math.abs(site.y-b.tileY))>2){b.workMessage='Cần mạch đã nghiên cứu trong2ô';return;}
 if(b.spiritEnabled===false){b.workMessage='Cho mạch nghỉ · giữ tài nguyên';return;}
 if(v.stability<30||v.charge<2){b.workMessage='Mạch yếu/cạn · cho nghỉ để hồi trữ lượng và ổn định';return;}
 if(outputRoom(s,b)<2){b.workMessage='Linh thạch tại trạm đầy · cần vận chuyển';return;}
 v.charge-=2;v.stability-=6;addOutput(s,b,'spiritStone',2);b.productionBatches=(b.productionBatches??0)+1;b.workMessage='Thu2linh thạch · giảm6ổn định, chờ vận chuyển';
}
function staffed(s:Island,b:Building):boolean{return b.workers.some(id=>s.npcs.some(n=>n.id===id&&n.isAlive&&n.age>=18&&n.position&&n.status==='working'&&!n.survivalBlocked&&!n.cargo&&!n.freight&&!n.actionTarget&&n.needs.hunger<95&&n.laborMessage==='Chăm sóc cộng hưởng tại tháp'&&Math.max(Math.abs(n.position.tileX-b.tileX),Math.abs(n.position.tileY-b.tileY))<=1));}
export function resonanceOperating(s:Island,b:Building):boolean{return b.type==='resonance_tower'&&b.complete&&!b.upgrade&&b.powerEnabled!==false&&hasPower(s,b)&&(s.spiritVein?.stability??0)>=40&&((b.resonanceFuelTicks??0)>0||(b.buffer?.input.spiritEssence??0)>=1)&&staffed(s,b);}
export function tickSpirit(s:Island):void{
 initializeSpirit(s);const v=s.spiritVein;if(!v)return;v.clockTicks++;if(v.clockTicks%10===0)v.charge=Math.min(24,v.charge+1);if(v.clockTicks%5===0)v.stability=Math.min(100,v.stability+1);
 for(const b of s.buildings){if(!resonanceOperating(s,b))continue;b.buffer??={input:{},output:{}};if((b.resonanceFuelTicks??0)<=0){b.buffer.input.spiritEssence!-=1;b.resonanceFuelTicks=10;}b.resonanceFuelTicks!--;let helped=false;
  for(const n of s.npcs){if(!n.isAlive||!n.position||Math.max(Math.abs(n.position.tileX-b.tileX),Math.abs(n.position.tileY-b.tileY))>4)continue;const h=n.health??100,r=n.needs.rest;n.health=Math.min(100,h+1);n.needs.rest=Math.max(0,r-1);if(n.health>h||n.needs.rest<r)helped=true;}
  if(helped)b.resonanceCareTicks=(b.resonanceCareTicks??0)+1;b.workMessage='Tháp chăm sóc trong4ô · tiêu tinh chất theo nhịp hoạt động';
 }
}
