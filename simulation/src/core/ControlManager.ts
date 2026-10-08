import type {Island,Building} from './types';
import {hasPower} from './PowerManager';
/** One onsite operator controls nearby machinery. Effects never stack. */
export function controlOperating(s:Island,b:Building):boolean{
 return b.type==='control_center'&&b.complete&&!b.upgrade&&b.powerEnabled!==false&&hasPower(s,b)&&b.workers.some(id=>s.npcs.some(n=>n.id===id&&n.isAlive&&n.age>=18&&n.position&&n.status==='working'&&!n.survivalBlocked&&!n.cargo&&!n.freight&&!n.actionTarget&&n.needs.hunger<95&&n.laborMessage==='Điều phối tại trung tâm'&&Math.max(Math.abs(n.position.tileX-b.tileX),Math.abs(n.position.tileY-b.tileY))<=1));
}
export function controlMultiplier(s:Island,target:Building):number{
 return ['component_factory','microchip_factory','prototype_workshop','steelworks'].includes(target.type)&&s.buildings.some(b=>b.id!==target.id&&controlOperating(s,b)&&Math.max(Math.abs(target.tileX-b.tileX),Math.abs(target.tileY-b.tileY))<=6)?1.25:1;
}

export function setProductionQuota(s:Island,id:string,batches:number|null):string|null{
 const b=s.buildings.find(b=>b.id===id&&b.complete&&!b.upgrade&&['component_factory','microchip_factory','prototype_workshop','steelworks'].includes(b.type));
 if(!b||s.civilization?.era!=='anomaly'||s.civilization.anomalyBranch!=='hightech'||batches!==null&&(!Number.isSafeInteger(batches)||batches<1||batches>100))return 'Định mức chỉ có trong Công Nghệ Cao, từ 1 đến100 mẻ tại xưởng công nghiệp hoàn thành.';
 if(batches!==null&&controlMultiplier(s,b)<=1)return 'Cần trung tâm có điện/người làm tại chỗ trong6ô để lập định mức.';
 b.productionQuota=batches??undefined;if(batches!==null&&b.type!=='steelworks')b.powerEnabled=true;b.workMessage=batches===null?'Đã bỏ định mức; bật xưởng khi muốn chạy tiếp.':`Đã lập định mức ${batches} mẻ mới. Đếm cả hàng còn tại xưởng/đang vận chuyển, không chờ kho.`;return null;
}
