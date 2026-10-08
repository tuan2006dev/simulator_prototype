import {isPowerBuilding,powerStatus} from '../core/PowerManager';
import {productionAlert} from '../core/productionWorkforce';
import {BUILD_LABELS} from '../renderer/BuildingManager';
import type {Island,Building,LogisticsGood} from '../core/types';
import {BUFFER_CAPACITY,RECIPES,GOOD_LABELS,sumStock,WAREHOUSE} from '../core/logistics';
export function stockHTML(stock:Partial<Record<LogisticsGood,number>>):string {
 return Object.entries(stock).filter(([,n])=>n!>0).map(([g,n])=>`${GOOD_LABELS[g as LogisticsGood]}: ${Number(n!.toFixed(1))}`).join(' · ')||'Trống';
}
export function buildingLogisticsHTML(island:Island,b:Building):string {
 if(!island.logistics||!b.buffer)return '';
 const incoming=island.npcs.filter(n=>n.isAlive&&n.freight?.target===b.id);
 return `<h4>Hậu cần xưởng</h4><p class="production-alert" role="status">${isPowerBuilding(b)?powerStatus(island,b):b.productionAlert??productionAlert(island,b)}</p><p>${b.autoWorkers?.length??0} người tự nhận việc · ${b.workers.length-(b.autoWorkers?.length??0)} người bạn phân công</p><p class="logistics-input">Đầu vào ${sumStock(b.buffer.input).toFixed(1)}/${BUFFER_CAPACITY} · ${stockHTML(b.buffer.input)}</p><p class="logistics-output">Thành phẩm ${sumStock(b.buffer.output).toFixed(1)}/${BUFFER_CAPACITY} · ${stockHTML(b.buffer.output)}</p>${RECIPES[b.type]?`<p>Mỗi mẻ cần ${stockHTML(RECIPES[b.type]!.inputs)}.</p>`:''}<p>${incoming.length?incoming.map(n=>`${n.name.split('#')[0]} đang giao ${n.freight!.amount.toFixed(1)} ${GOOD_LABELS[n.freight!.good]}`).join('<br>'):'Chưa có hàng đang giao tới'}</p>`;
}
export function logisticsHTML(island:Island):string {
 if(!island.logistics)return '';
 const carriers=island.npcs.filter(n=>n.isAlive&&(n.laborRole==='haul'||n.freight));
 const name=(id:string)=>id===WAREHOUSE?'Kho làng':island.buildings.find(b=>b.id===id)?`${BUILD_LABELS[island.buildings.find(b=>b.id===id)!.type]} (${island.buildings.find(b=>b.id===id)!.tileX}, ${island.buildings.find(b=>b.id===id)!.tileY})`:'Kho làng';
 return `<h3>Hậu cần</h3><p>Người vận chuyển mang tối đa 30 đơn vị/chuyến. Ưu tiên đưa thức ăn về kho, sau đó giao nguyên liệu cho xưởng. Tự nhận việc ưu tiên thức ăn, vận chuyển và dự trữ vật liệu trước xưởng; chỉ dùng người tự động rảnh, công trình hoàn thành. Người bạn phân công được giữ nguyên; bạn có thể chọn nghề Vận chuyển.</p><p>${carriers.length} người vận chuyển · ${carriers.filter(n=>n.freight).length} chuyến đang mang hàng</p>${carriers.map(n=>`<p><strong>${n.name.split('#')[0]}</strong> · ${n.freight?`${GOOD_LABELS[n.freight.good]} ${n.freight.amount.toFixed(1)}/30 → ${name(n.freight.target)}`:n.laborMessage??'Chờ chuyến'}</p>`).join('')}${island.buildings.filter(b=>b.complete&&b.buffer).map(b=>`<article class="logistics-building" data-logistics-id="${b.id}"><strong>${BUILD_LABELS[b.type]} (${b.tileX}, ${b.tileY})</strong>${buildingLogisticsHTML(island,b)}</article>`).join('')||'<p>Chưa có xưởng sản xuất. Bến câu vẫn dùng thợ tự mang cá về kho.</p>'}`;
}
