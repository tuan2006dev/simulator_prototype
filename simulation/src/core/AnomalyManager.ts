import type {Island} from './types';
import {hasPower} from './PowerManager';
import {addEntry} from './chronicle';
export const branchName=(branch:string)=>branch==='eldritch'?'Quỷ Dị':branch==='mystic'?'Linh Mạch':'Công Nghệ Cao';
export function anomalyRequirements(s:Island,labId?:string,branch:'hightech'|'mystic'|'eldritch'='hightech'):{label:string;met:boolean}[]{
 const c=s.civilization,mystic=branch==='mystic',lab=s.buildings.find(b=>b.id===labId&&b.type==='measurement_lab'&&b.complete&&!b.upgrade),staff=!!lab?.workers.some(id=>s.npcs.some(n=>n.id===id&&n.isAlive&&n.age>=18&&n.position));
 return [{label:'Ba hồ sơ đã phân tích tại cơ sở',met:(s.surveys?.sites.filter(p=>p.analyzed).length??0)>=3},
 {label:`Nền tảng ${branchName(branch)} đã hoàn tất`,met:!!s.surveys?.sites.some(p=>p.kind===branch&&p.foundationComplete&&p.decision==='research')},
 {label:'Cùng viện có thợ và 5 ngày điện liên tiếp',met:!!lab&&staff&&lab.powerEnabled!==false&&hasPower(s,lab)&&(lab.labPoweredTicks??0)>=50},
 ...(branch==='eldritch'?[{label:'Đã thu20xương10huyết thạch, chế9sinh chất và nghiên cứu kiểm soát',met:(c?.produced.relicBone??0)>=20&&(c?.produced.bloodstone??0)>=10&&(c?.produced.biomatter??0)>=9&&!!c?.unlocks.includes('bio_containment')&&s.buildings.some(b=>b.type==='relic_extractor'&&b.complete)&&s.buildings.some(b=>b.type==='biomatter_workshop'&&b.complete&&(b.productionBatches??0)>=9)},
 {label:'Khu cách ly đã kiểm soát20nhịp, nhiễm nguồn dưới40, không cư dân chạm30phơi nhiễm',met:s.buildings.some(b=>b.type==='quarantine'&&b.complete&&(b.quarantineCareTicks??0)>=20)&&!!s.eldritchSource&&s.eldritchSource.contamination<40&&!s.npcs.some(n=>n.isAlive&&(n.exposure??0)>=30)}]:mystic?[{label:'Đã khai thác 12 linh thạch, tinh luyện 9 tinh chất và nghiên cứu chăm sóc',met:(c?.produced.spiritStone??0)>=12&&(c?.produced.spiritEssence??0)>=9&&!!c?.unlocks.includes('resonance_care')&&s.buildings.some(b=>b.type==='spirit_extractor'&&b.complete)&&s.buildings.some(b=>b.type==='spirit_refinery'&&b.complete&&(b.productionBatches??0)>=9)},
 {label:'Tháp đã chăm sóc 20 nhịp, nguồn ổn định ít nhất 40',met:s.buildings.some(b=>b.type==='resonance_tower'&&b.complete&&(b.resonanceCareTicks??0)>=20)&&(s.spiritVein?.stability??0)>=40}]:[{label:'Đã chế tạo 6 vi mạch, nghiên cứu và xây điều khiển',met:(c?.produced.microchips??0)>=6&&!!c?.unlocks.includes('industrial_control')&&s.buildings.some(b=>b.type==='microchip_factory'&&b.complete&&(b.productionBatches??0)>=6)&&s.buildings.some(b=>b.type==='control_center'&&b.complete&&b.workers.some(id=>s.npcs.some(n=>n.id===id&&n.isAlive&&n.position&&n.age>=18)))}]),
 {label:'Kho đủ 50 linh kiện và 20 thép',met:(c?.inventory.components??0)>=50&&(c?.inventory.steel??0)>=20}];
}
export function startBranchDevelopment(s:Island,branch:string,labId:string):string|null{
 const c=s.civilization;if(branch!=='hightech'&&branch!=='mystic'&&branch!=='eldritch')return 'Dự án chuyển hướng này chưa được mở; không thu vật tư.';
 if(!c||c.era!=='modern'||c.anomalyBranch||c.branchDevelopment||c.transition||c.research||s.analysis?.active||s.analysis?.foundation)return 'Cần Hiện Đại và không có dự án hoặc nghiên cứu khác đang chạy.';
 const missing=anomalyRequirements(s,labId,branch).find(r=>!r.met);if(missing)return `Chưa đủ: ${missing.label}.`;
 c.inventory.components-=50;c.inventory.steel-=20;c.branchDevelopment={branch,labId,workTicks:0};c.branchMessage=`Đã trả 50 linh kiện +20 thép. Cần 50 nhịp làm tại viện (5 ngày công); nghỉ/mất điện giữ tiến độ. Hoàn tất chốt ${branchName(branch)}; không tự biến đổi cư dân.`;addEntry(s,c.branchMessage,'high');return null;
}
export function cancelBranchDevelopment(s:Island):string|null{
 const c=s.civilization;if(!c?.branchDevelopment)return 'Không có dự án chuyển nhánh đang chạy.';
 c.inventory.components+=50;c.inventory.steel+=20;c.branchDevelopment=undefined;c.branchMessage='Đã hủy dự án chưa hoàn thành, xóa tiến độ và hoàn phí một lần.';return null;
}
export function tickBranchDevelopment(s:Island):void{
 const c=s.civilization,a=c?.branchDevelopment;if(!c||!a)return;const lab=s.buildings.find(b=>b.id===a.labId&&b.type==='measurement_lab'&&b.complete&&!b.upgrade);
 if(!lab){cancelBranchDevelopment(s);return;}
 if(lab.powerEnabled===false||!hasPower(s,lab)||(lab.labPoweredTicks??0)<50){c.branchMessage='Chờ viện có điện liên tiếp đủ 5 ngày; giữ tiến độ chuyển nhánh.';return;}
 const onsite=lab.workers.some(id=>s.npcs.some(n=>n.id===id&&n.isAlive&&n.position&&!n.survivalBlocked&&!n.cargo&&!n.freight&&!n.actionTarget&&n.status==='working'&&n.age>=18&&n.laborMessage==='Làm tại cơ sở đo đạc'&&Math.max(Math.abs(n.position.tileX-lab.tileX),Math.abs(n.position.tileY-lab.tileY))<=1));
 if(!onsite){c.branchMessage='Thợ chưa làm tại viện hoặc đang nghỉ · giữ tiến độ.';return;}
 a.workTicks++;c.branchMessage=`Dự án ${branchName(a.branch)} · ${a.workTicks}/50 nhịp tại viện`;
 if(a.workTicks>=50){c.era='anomaly';c.anomalyBranch=a.branch;c.branchDevelopment=undefined;c.branchMessage=a.branch==='eldritch'?'Đã bước vào Dị Tượng · Quỷ Dị. Trạm có thể lọc mẫu bằng1 sinh chất / 5 mẻ để giảm nhiễm nguồn và phơi nhiễm thợ. Cần nguồn, sinh chất, kiểm soát và vận chuyển; không tự biến đổi dân.':a.branch==='mystic'?'Đã bước vào Dị Tượng · Linh Mạch. Duy trì ổn định nguồn và cung ứng tinh chất cho tháp; vẫn cần thợ, điện và vận chuyển. Không tự biến đổi cư dân.':'Đã bước vào Dị Tượng · Công Nghệ Cao. Trung tâm có thể lập định mức tự dừng xưởng sau số mẻ đã chế tạo; vẫn cần vật tư, điện và vận chuyển. Chưa có biến thể dân cư hoặc hạt nhân.';addEntry(s,c.branchMessage,'high');}
}
