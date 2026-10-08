import type {Island} from './types';
import {hasPower} from './PowerManager';
import {addEntry} from './chronicle';
export function startAnalysis(s:Island,siteId:string,labId:string):string|null{
 const c=s.civilization,site=s.surveys?.sites.find(p=>p.id===siteId),lab=s.buildings.find(b=>b.id===labId&&b.type==='measurement_lab'&&b.complete&&!b.upgrade);
 if(s.adaptationProcess||c?.era!=='modern'||!c.unlocks.includes('measurement_science')||c.branchDevelopment||!site?.surveyed||site.analyzed||!lab||(s.analysis?.active||s.analysis?.foundation))return 'Cần hồ sơ đã về, cơ sở đo đạc hoàn thành và không có dự án đang chạy.';
 if(!lab.workers.some(id=>s.npcs.some(n=>n.id===id&&n.isAlive&&n.position&&n.age>=18)))return 'Phân công người trưởng thành tới cơ sở đo đạc.';
 if(c.inventory.components<2)return 'Mỗi phân tích cần 2 linh kiện trong kho.';
 c.inventory.components-=2;s.analysis??={version:1,message:''};s.analysis.active={siteId,labId,workTicks:0};s.analysis.message='Đã trả 2 linh kiện; phân tích cần 40 nhịp tại chỗ và 2 công suất.';lab.workMessage=s.analysis.message;return null;
}
export function cancelAnalysis(s:Island):string|null{
 if(!s.analysis?.active||!s.civilization)return 'Không có phân tích đang chạy.';
 s.civilization.inventory.components+=2;s.analysis.active=undefined;s.analysis.message='Đã hủy phân tích chưa hoàn thành và hoàn 2 linh kiện.';return null;
}
export function tickAnalysis(s:Island):void{
 const state=s.analysis,a=state?.active??state?.foundation,isFoundation=!!state?.foundation;if(!state||!a)return;
 const lab=s.buildings.find(b=>b.id===a.labId&&b.type==='measurement_lab'&&b.complete&&!b.upgrade),site=s.surveys?.sites.find(p=>p.id===a.siteId);
 if(!lab||!site){if(isFoundation)cancelFoundation(s);else cancelAnalysis(s);return;}
 if(lab.powerEnabled===false||!hasPower(s,lab)){state.message=lab.workMessage=`Thiếu điện hoặc đã tắt cơ sở · giữ tiến độ ${isFoundation?'dự án nền tảng':'phân tích'}.`;return;}
 const onsite=lab.workers.some(id=>s.npcs.some(n=>n.id===id&&n.isAlive&&n.position&&!n.survivalBlocked&&!n.cargo&&!n.freight&&!n.actionTarget&&n.status!=='sleeping'&&n.status!=='eating'&&n.needs.hunger<95&&n.laborMessage==='Làm tại cơ sở đo đạc'&&Math.max(Math.abs(n.position.tileX-lab.tileX),Math.abs(n.position.tileY-lab.tileY))<=1));
 if(!onsite){state.message=lab.workMessage='Đợi thợ tới cơ sở hoặc nghỉ ăn/ngủ · giữ tiến độ.';return;}
 const needed=isFoundation?60:40;
 a.workTicks++;state.message=lab.workMessage=`${isFoundation?'Dự án nền tảng':'Đang phân tích hồ sơ'} · ${a.workTicks}/${needed} nhịp tại chỗ`;
 if(isFoundation&&a.workTicks>=needed){site.foundationComplete=true;state.foundation=undefined;state.message=lab.workMessage='Đã hoàn tất hồ sơ nền tảng. Chưa chọn nhánh chủ đạo; cần chuỗi khai thác và nơi dùng sản phẩm trước khi tiến cấp.';addEntry(s,state.message,'high');return;}
 if(!isFoundation&&a.workTicks>=40){site.analyzed=true;lab.productionBatches=(lab.productionBatches??0)+1;state.active=undefined;state.message=lab.workMessage='Đã phân tích hồ sơ. Lựa chọn nghiên cứu/phong tỏa/bỏ qua là bước tiếp theo; chưa có biến thể.';addEntry(s,state.message,'high');}
}

export type SiteDecision='research'|'contain'|'ignore';
export const FOUNDATION_LABELS={hightech:'Giải mã cấu trúc',mystic:'Đo cộng hưởng linh mạch',eldritch:'Kiểm soát mẫu sinh khối'};
export function decideSite(s:Island,siteId:string,decision:SiteDecision,labId?:string):string|null{
 const c=s.civilization,site=s.surveys?.sites.find(p=>p.id===siteId);
 if(s.adaptationProcess||c?.era!=='modern'||!c.unlocks.includes('measurement_science')||!site?.analyzed||!['research','contain','ignore'].includes(decision))return 'Cần hồ sơ đã phân tích trong Hiện Đại.';
 if(site.decision===decision||site.decision&&site.decision!=='ignore')return 'Điểm này đã có quyết định; không thu phí lần nữa.';
 if(decision==='research'){
  const lab=s.buildings.find(b=>b.id===labId&&b.type==='measurement_lab'&&b.complete&&!b.upgrade);
  if(!lab||c.branchDevelopment||s.analysis?.active||s.analysis?.foundation||!lab.workers.some(id=>s.npcs.some(n=>n.id===id&&n.isAlive&&n.age>=18&&n.position)))return 'Chọn cơ sở có thợ và hoàn tất hoặc hủy dự án đang chạy.';
  if(c.inventory.components<4)return 'Dự án nền tảng cần 4 linh kiện trong kho.';
  c.inventory.components-=4;s.analysis??={version:1,message:''};s.analysis.foundation={siteId,labId:lab.id,workTicks:0};s.analysis.message='Đã trả 4 linh kiện. Dự án cần 60 nhịp làm tại chỗ và 2 công suất; mất điện giữ tiến độ. Không chuyển kỷ nguyên hoặc biến đổi dân.';
 }else if(decision==='contain'){
  if(c.inventory.cloth<4||c.inventory.cutStone<2)return 'Phong tỏa cần 4 vải và 2 đá xây.';
  c.inventory.cloth-=4;c.inventory.cutStone-=2;
 }
 site.decision=decision;addEntry(s,decision==='contain'?'Đã phong tỏa điểm lạ: khép nghiên cứu tại điểm này, không khai thác hoặc mở nhánh.':decision==='ignore'?'Tạm bỏ qua điểm lạ: giữ kinh tế hiện tại, có thể quay lại quyết định sau.':'Bắt đầu dự án nền tảng đã trả vật tư.','high');return null;
}
export function cancelFoundation(s:Island):string|null{
 const a=s.analysis?.foundation;if(!a||!s.civilization)return 'Không có dự án nền tảng đang chạy.';
 s.civilization.inventory.components+=4;const site=s.surveys?.sites.find(p=>p.id===a.siteId);if(site)site.decision=undefined;
 s.analysis!.foundation=undefined;s.analysis!.message='Đã hủy dự án nền tảng, xóa tiến độ và hoàn 4 linh kiện một lần.';return null;
}
