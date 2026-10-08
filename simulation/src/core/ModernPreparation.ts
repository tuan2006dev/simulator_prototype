import type {Island} from './types';
import {ANIMAL_CONFIG} from './types';
import {estimateDailyFoodDemand} from './labor';
import {shelterBeds} from './settlement';
import {foodCapacity} from '../renderer/BuildingManager';
import type {EraRequirement} from './civilization';
export const MODERN_FEE={steel:30,cutStone:40,cloth:20} as const;
export function modernFoodDemand(s:Island):number{return estimateDailyFoodDemand(s.npcs.filter(n=>n.position))+s.animals.filter(a=>a.isAlive&&['domesticated','breeding','guarding'].includes(a.status)).reduce((sum,a)=>sum+ANIMAL_CONFIG[a.species].foodCostPerTick*10,0);}
export function modernRequirements(s:Island):EraRequirement[]{
 const c=s.civilization,alive=s.npcs.filter(n=>n.isAlive&&n.position),beds=s.buildings.reduce((v,b)=>v+shelterBeds(b),0),demand=modernFoodDemand(s),days=demand?s.sharedFood/demand:0;
 const tech=(id:string,label:string):EraRequirement=>({label,progress:c?.unlocks.includes(id)?'Hoàn tất':'Chưa học',met:!!c?.unlocks.includes(id),panel:'research'});
 const proof=Math.max(0,...s.buildings.filter(b=>b.type==='prototype_workshop'&&b.complete&&!b.upgrade&&s.power?.supplied.includes(b.id)&&b.workers.some(id=>alive.some(n=>n.id===id))).map(b=>b.poweredTicks??0));
 const carriers=alive.filter(n=>n.age>=18&&(n.freight||n.laborRole==='haul'&&!n.researching&&!s.buildings.some(b=>b.workers.includes(n.id))));
 const connected=!!s.logistics&&!!carriers.length&&s.buildings.some(b=>b.complete&&['storehouse','stockpile'].includes(b.type))&&(s.logistics.completedTrips??0)>0;
 return [{label:'Dân sống đã định cư',progress:`${alive.length}/50`,met:alive.length>=50,panel:'creatures'},
 {label:'Chỗ ngủ thực trong nhà/lều',progress:`${beds}/${alive.length} chỗ`,met:alive.length>0&&beds>=alive.length,panel:'build'},
 tech('mechanics','Cơ giới sơ khai'),tech('steelmaking','Luyện thép'),tech('electricity','Điện học nguyên mẫu'),
 {label:'Thép đã sản xuất',progress:`${Math.floor(c?.produced.steel??0)}/30`,met:(c?.produced.steel??0)>=30,panel:'build'},
 {label:'Một xưởng đủ điện liên tục',progress:`${(Math.min(30,proof)/10).toFixed(1)}/3 ngày`,met:proof>=30,panel:'quests'},
 {label:'Vận chuyển nội bộ đang có người',progress:`${carriers.length} người · ${s.logistics?.completedTrips??0} chuyến đã giao`,met:connected,panel:'resources'},
 {label:'Kho đủ chứa 7 ngày ăn',progress:`${foodCapacity(s)}/${Math.ceil(demand*7)} sức chứa`,met:demand>0&&foodCapacity(s)>=demand*7,panel:'build'},
 {label:'Dự trữ thức ăn dùng được',progress:`${days.toFixed(1)}/7 ngày`,met:days>=7,panel:'resources'}];
}
