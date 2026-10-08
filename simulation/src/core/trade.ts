import type { Island, Commodity, Building } from './types';
import type { WorldMap } from '../renderer/WorldMap';
import { findPath } from './pathfinding';
import { goodsCapacity, COMMODITIES } from './civilization';
import { addEntry } from './chronicle';
import { movementSteps } from './dailyLife';

export const TRADE_OFFERS: Record<string,{give:Commodity; giveAmount:number; receive:Commodity; receiveAmount:number; requires?:string}>={
  copper_for_coal:{give:'copper',giveAmount:8,receive:'coal',receiveAmount:10},
  cloth_for_ore:{give:'cloth',giveAmount:4,receive:'ironOre',receiveAmount:10},
  bricks_for_fiber:{give:'bricks',giveAmount:10,receive:'fiber',receiveAmount:12},
  cloth_for_coal:{give:'cloth',giveAmount:8,receive:'coal',receiveAmount:10,requires:'industrial_supply'},
  cloth_for_copper:{give:'cloth',giveAmount:12,receive:'copper',receiveAmount:6,requires:'industrial_supply'},
};
export function tradeLabel(id:string):string{
  const o=TRADE_OFFERS[id];return o ? `${o.giveAmount} ${COMMODITIES[o.give]} → ${o.receiveAmount} ${COMMODITIES[o.receive]}` : '';
}
/** Locked contracts never debit escrow; shipments already underway still finish or refund. */
export function tradeOfferLock(island:Island,id:string):string|null{
  const offer=Object.prototype.hasOwnProperty.call(TRADE_OFFERS,id)?TRADE_OFFERS[id]:undefined;
  if(!offer)return 'Gói trao đổi không hợp lệ.';
  if(offer.requires&&(!['modern','anomaly'].includes(island.civilization?.era??'')||!island.civilization?.unlocks.includes(offer.requires)))return 'Cần Hiện Đại và nghiên cứu Hợp đồng cung ứng.';
  return null;
}
export function startTrade(island:Island,map:WorldMap|undefined,buildingId:string,offerId:string):string|null{
  const c=island.civilization,b=island.buildings.find(b=>b.id===buildingId),offer=Object.prototype.hasOwnProperty.call(TRADE_OFFERS,offerId)?TRADE_OFFERS[offerId]:undefined;
  if(!c||!map||['stone','bronze'].includes(c.era)||!c.unlocks.includes('trade_routes'))return 'Cần Đồ Sắt và nghiên cứu Giao thương và vận chuyển.';
  if(!b||b.type!=='tradepost'||!b.complete||b.upgrade||b.shipment)return 'Trạm chưa sẵn sàng hoặc đang có chuyến hàng.';
  const lock=tradeOfferLock(island,offerId);if(lock)return lock;
  if(!offer)return 'Gói trao đổi không hợp lệ.';
  const worker=island.npcs.find(n=>b.workers.includes(n.id)&&n.isAlive&&n.position&&n.age>=18&&!n.researching&&!n.actionTarget&&!n.cargo&&!n.freight&&!n.haulTask);
  if(!worker)return 'Phân công một người trưởng thành cho trạm trước.';
  if(c.inventory[offer.give]<offer.giveAmount)return `Thiếu ${offer.giveAmount} ${COMMODITIES[offer.give]}.`;
  if(goodsCapacity(island)-c.inventory[offer.receive]<offer.receiveAmount)return 'Kho không đủ chỗ nhận toàn bộ chuyến hàng.';
  const coast=map.landTiles.filter(t=>['grass','sand','forest'].includes(map.tiles[t.y]?.[t.x])&&Math.max(Math.abs(t.x-b.tileX),Math.abs(t.y-b.tileY))>=3&&[-1,0,1].some(dy=>[-1,0,1].some(dx=>['deep_water','shallow_water'].includes(map.tiles[t.y+dy]?.[t.x+dx]))));
  coast.sort((a,d)=>Math.abs(a.x-b.tileX)+Math.abs(a.y-b.tileY)-Math.abs(d.x-b.tileX)-Math.abs(d.y-b.tileY));
  const destination=coast.find(t=>findPath(map,worker.position!.tileX,worker.position!.tileY,t.x,t.y)!==null&&findPath(map,t.x,t.y,b.tileX,b.tileY)!==null);
  if(!destination)return 'Chưa có đường tới điểm thương nhân ven nước và quay lại trạm.';
  c.inventory[offer.give]-=offer.giveAmount;
  b.shipment={offerId,workerId:worker.id,destination,stage:'outbound',exchangeTicks:0};
  worker.path=undefined;worker.buildingWork=undefined;worker.laborTask=undefined;
  b.workMessage=`Đang vận chuyển: ${tradeLabel(offerId)}`;
  addEntry(island,`🛒 Khởi hành trao đổi ${tradeLabel(offerId)}. Hàng nhập chỉ vào kho khi người vận chuyển quay về.`, 'medium');
  return null;
}
export function cancelTrade(island:Island,b:Building):string|null{
  const shipment=b.shipment,c=island.civilization;
  if(!shipment||!c)return 'Không có chuyến hàng để hủy.';
  const offer=TRADE_OFFERS[shipment.offerId];
  c.inventory[offer.give]+=offer.giveAmount; // Return escrow, never count it as newly produced goods.
  const worker=island.npcs.find(n=>n.id===shipment.workerId);if(worker){worker.path=undefined;worker.buildingWork=undefined;}
  b.shipment=undefined;b.workMessage='Đã hủy chuyến và hoàn trả hàng trao đổi.';
  addEntry(island,'🛒 Hủy chuyến; hàng đã giữ để trao đổi được hoàn trả.', 'medium');return null;
}
export function tickTrades(island:Island,map?:WorldMap):void{
  if(!map||!island.civilization)return;
  const c=island.civilization;
  for(const b of island.buildings){
    const s=b.shipment;if(!s)continue;
    const npc=island.npcs.find(n=>n.id===s.workerId&&n.isAlive&&n.position);
    if(!npc||!b.workers.includes(s.workerId)){cancelTrade(island,b);continue;}
    if(npc.survivalBlocked||npc.actionTarget||npc.status==='sleeping'||npc.status==='eating'||npc.needs.hunger>=95||(npc.laborRetryAt??0)>island.tick){b.workMessage='Chuyến hàng tạm nghỉ để cư dân ăn/nghỉ.';continue;}
    const dest=s.stage==='outbound'?s.destination:{x:b.tileX,y:b.tileY};
    if(!['grass','sand','forest'].includes(map.tiles[dest.y]?.[dest.x])){b.workMessage='Điểm giao hàng bị chặn đường · khôi phục đất hoặc hủy chuyến.';continue;}
    const path=findPath(map,npc.position!.tileX,npc.position!.tileY,dest.x,dest.y);
    if(path===null){b.workMessage='Chuyến hàng bị chặn đường · mở đường hoặc hủy chuyến để hoàn hàng.';continue;}
    npc.path=undefined;npc.status='working';
    npc.laborMessage=s.stage==='outbound'?'Đang mang hàng đến thương nhân':'Đang mang hàng nhập về trạm';
    if(path.length){const speed=movementSteps(npc,island);const next=path[Math.min(speed,path.length)-1];npc.position={tileX:next.x,tileY:next.y};b.workMessage=`${npc.laborMessage} · còn ${Math.max(0,path.length-speed)} ô`;continue;}
    if(s.stage==='outbound'){
      b.workMessage=`Đang trao đổi với thương nhân · ${s.exchangeTicks+1}/10`;
      if(++s.exchangeTicks>=10)s.stage='returning';continue;
    }
    const offer=TRADE_OFFERS[s.offerId];
    if(goodsCapacity(island)-c.inventory[offer.receive]<offer.receiveAmount){b.workMessage='Đã về trạm · chờ kho đủ chỗ nhận toàn bộ hàng nhập';continue;}
    c.inventory[offer.receive]+=offer.receiveAmount; // Imports are not production achievements.
    c.completedTrades=(c.completedTrades??0)+1;b.shipment=undefined;npc.buildingWork=undefined;
    b.workMessage=`Đã giao về kho: ${tradeLabel(s.offerId)}`;
    addEntry(island,`🛒 Chuyến hàng về trạm: nhận ${offer.receiveAmount} ${COMMODITIES[offer.receive]}.`, 'medium');
  }
}
