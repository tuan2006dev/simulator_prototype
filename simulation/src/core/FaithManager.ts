import type {Island,NPC} from './types';
import {addEntry} from './chronicle';
import {EFFECT_STEP_MS} from './WorldClock';
export const SIMULATION_STEP_MS=EFFECT_STEP_MS;
export const FAITH_CAP=300;
const residents=(island:Island)=>island.npcs.filter(n=>n.isAlive&&n.position);
export function faithMorale(island:Island):{happiness:number;fear:number}{
 const people=residents(island);if(!people.length)return {happiness:50,fear:0};
 return {happiness:Math.max(0,Math.min(100,people.reduce((s,n)=>s+100-(n.needs.hunger+n.needs.rest+n.needs.safety+n.needs.social)/4,0)/people.length)),fear:Math.max(0,Math.min(100,people.reduce((s,n)=>s+n.needs.safety*.6+n.needs.hunger*.4,0)/people.length))};
}
export function faithRate(island:Island):number{
 const population=residents(island).length;if(!population)return 0;
 const {happiness,fear}=faithMorale(island),temples=island.buildings.filter(b=>b.complete&&b.type==='temple').reduce((s,b)=>s+.2*(b.level??1),0);
 return population*.1*(1+happiness/100)*(1-fear/200)+temples;
}
export function initializeFaith(island:Island):void{island.faith??={version:1,amount:0,clockMs:0,cooldownUntilMs:0,casts:[]};syncDivineState(island);}
export function divinePhase(island:Island):'blessed'|'exhausted'|undefined{const f=island.faith,b=f?.blessing;return !f||!b?undefined:f.clockMs<b.untilMs?'blessed':f.clockMs<b.exhaustUntilMs?'exhausted':undefined;}
function syncDivineState(island:Island):void{const phase=divinePhase(island);for(const n of island.npcs)n.divineState=n.isAlive&&n.position&&n.age>=18&&n.occupation!=='child'?phase:undefined;}
export function workMultiplier(island:Island,npc:NPC):number{if(!npc.isAlive||!npc.position||npc.age<18||npc.occupation==='child')return 1;return divinePhase(island)==='blessed'?1.5:divinePhase(island)==='exhausted'?.5:1;}
export function blessingCost(island:Island):number{const f=island.faith;return 50*(1+(f?.casts.filter(t=>f.clockMs-t<120000).length??0));}
export function blessingLock(island:Island):string|null{
 const f=island.faith;if(!f)return 'Thần lực chưa hoạt động ở thế giới này.';
 if(!residents(island).some(n=>n.age>=18&&n.occupation!=='child'))return 'Cần cư dân trưởng thành đã định cư.';
 const phase=divinePhase(island);if(phase==='blessed')return 'Ban Phước đang có hiệu lực.';if(phase==='exhausted')return 'Dân đang kiệt sức · chờ hồi phục.';
 if(f.clockMs<f.cooldownUntilMs)return 'Phép đang hồi chiêu.';
 if(f.amount<blessingCost(island))return 'Chưa đủ Niềm tin.';
 return null;
}
export function castBlessing(island:Island):string|null{
 const lock=blessingLock(island);if(lock)return lock;const f=island.faith!,cost=blessingCost(island);
 f.amount-=cost;f.casts=f.casts.filter(t=>f.clockMs-t<120000);f.casts.push(f.clockMs);f.cooldownUntilMs=f.clockMs+45000;
 f.blessing={untilMs:f.clockMs+30000,exhaustUntilMs:f.clockMs+90000,exhaustApplied:false};syncDivineState(island);
 addEntry(island,`Ban Phước: trả ${cost} Niềm tin, lao động +50% trong 10 phút; sau đó −50% trong 20 phút.`, 'high');return null;
}
export function tickFaith(island:Island):void{
 const f=island.faith;if(!f)return;f.clockMs+=SIMULATION_STEP_MS;
 f.amount=Math.min(FAITH_CAP,f.amount+faithRate(island)*SIMULATION_STEP_MS/1000);f.casts=f.casts.filter(t=>f.clockMs-t<120000);
 const b=f.blessing;if(b&&f.clockMs>=b.untilMs&&!b.exhaustApplied){b.exhaustApplied=true;for(const n of residents(island).filter(n=>n.age>=18&&n.occupation!=='child'))n.needs.safety=Math.min(100,n.needs.safety+10);addEntry(island,'Ban Phước kết thúc: lao động −50% trong 20 phút, căng thẳng +10. Chờ dân hồi phục trước khi dùng lại.','high');}
 if(b&&f.clockMs>=b.exhaustUntilMs){f.blessing=undefined;addEntry(island,'Dân đã hồi phục sau Ban Phước.','medium');}
 syncDivineState(island);
}

export function inciteCost(s:Island):number{const f=s.faith;return 30*(1+(f?.inciteCasts?.filter(t=>f.clockMs-t<120000).length??0));}
export function inciteLock(s:Island):string|null{const f=s.faith;return !f?'Niềm tin chưa hoạt động.':!s.npcs.some(n=>n.isAlive&&n.position&&n.age>=18&&n.guardDuty)?'Cần chỉ định người bảo vệ.':f.clockMs<(f.inciteCooldownUntilMs??0)?'Khích Lệ đang hồi chiêu.':f.amount<inciteCost(s)?'Chưa đủ Niềm tin.':null;}
export function incited(s:Island,n:NPC):boolean{return !!s.faith?.incite&&s.faith.clockMs<s.faith.incite.untilMs&&s.faith.incite.targets.includes(n.id);}
export function castIncite(s:Island):string|null{const lock=inciteLock(s);if(lock)return lock;const f=s.faith!,targets=s.npcs.filter(n=>n.isAlive&&n.position&&n.age>=18&&n.guardDuty);f.amount-=inciteCost(s);f.inciteCasts=(f.inciteCasts??[]).filter(t=>f.clockMs-t<120000);f.inciteCasts.push(f.clockMs);f.inciteCooldownUntilMs=f.clockMs+30000;f.incite={untilMs:f.clockMs+20000,targets:targets.map(n=>n.id)};for(const n of targets)n.needs.safety=Math.max(0,n.needs.safety-20);addEntry(s,'Khích Lệ: người bảo vệ hiện tại giảm20 sợ hãi và tăng20% sát thương trong6 phút 40 giây; vẫn cần ăn/nghỉ/trang bị.','high');return null;}
