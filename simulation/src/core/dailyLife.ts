import type { Island, NPC } from './types';
import type { WorldMap } from '../renderer/WorldMap';
import { findPath } from './pathfinding';
import { clamp, getRelationship, TICKS_PER_DAY } from './utils';
import { addEntry } from './chronicle';
import { estimateDailyFoodDemand } from './labor';
import { sleepingAssignments, tickCampfire, storageSites, enableSettlement } from './settlement';
import {WORLD_STEP_MS} from './WorldClock';

// One authoritative clock, also used by HUD. A day currently has ten steps.
export function worldMinutes(tick: number,progressMs=0): number {
  return (360 + ((tick % TICKS_PER_DAY)+progressMs/WORLD_STEP_MS) * 1440 / TICKS_PER_DAY) % 1440;
}
export function dayPhase(tick: number,progressMs=0): string {
  const hour = worldMinutes(tick,progressMs) / 60;
  return hour >= 6 && hour < 18 ? 'Lao động' : hour >= 18 && hour < 20 ? 'Bữa tối' : 'Nghỉ ngơi';
}
export function mealSize(npc: NPC): number {
  return npc.age < 18 || npc.occupation === 'child' ? 10 : npc.isPregnant ? 25 : 20;
}
export function movementSteps(npc: NPC, island: Island): number {
  // A coarse 2.4-hour step must include enough travel for a daily commute.
  return island.dailyLife ? npc.needs.rest >= 100 ? 3 : 6 : 1;
}
/** A daily meal restores actual hunger, avoiding a full 20-Food meal for 8 hunger. */
function eat(npc: NPC, island: Island, shared: boolean): boolean {
  const recovery = npc.isPregnant ? 40 : 35;
  const wanted = mealSize(npc) * Math.min(1, npc.needs.hunger / recovery);
  const privateUsed = Math.min(npc.privateFood, wanted);
  const carriedUsed = Math.min(npc.cargo?.food??0,wanted-privateUsed);
  const freightUsed=Math.min(npc.freight?.good==='food'?npc.freight.amount:0,wanted-privateUsed-carriedUsed);
  const sharedUsed = shared ? Math.min(island.sharedFood, wanted - privateUsed-carriedUsed-freightUsed) : 0;
  const source=shared&&island.logistics&&island.sharedFood<=0&&npc.position?island.buildings.find(b=>b.complete&&(b.buffer?.output.food??0)>0&&Math.max(Math.abs(b.tileX-npc.position!.tileX),Math.abs(b.tileY-npc.position!.tileY))<=1):undefined;
  const onsiteUsed=source?Math.min(source.buffer!.output.food!,Math.max(0,wanted-privateUsed-carriedUsed-freightUsed-sharedUsed)):0;
  const consumed = privateUsed + carriedUsed + freightUsed + sharedUsed + onsiteUsed;
  if (consumed <= 0) return false;
  npc.privateFood -= privateUsed;
  if(npc.cargo)npc.cargo.food-=carriedUsed;
  if(npc.freight?.good==='food'){npc.freight.amount-=freightUsed;if(npc.freight.amount<=1e-8){npc.freight=undefined;npc.haulTask=undefined;}}
  island.sharedFood -= sharedUsed;if(source&&onsiteUsed>0)source.buffer!.output.food!-=onsiteUsed;
  npc.needs.hunger = clamp(npc.needs.hunger - recovery * consumed / mealSize(npc), 0, 100);
  npc.status = 'eating'; npc.lastAction = 'eat';
  npc.laborMessage = onsiteUsed>0?'Đang ăn thức ăn tại xưởng · giữ công việc':'Đang ăn · tiếp tục công việc sau bữa';
  return true;
}

export function establishCampfire(island: Island, map: WorldMap): void {
  if (!island.dailyLife || island.dailyLife.campfire) return;
  const first = island.npcs.find(n => n.isAlive && n.position);
  if (!first?.position) return;
  const origin = first.position;
  const candidates = map.landTiles.filter(t => !island.buildings.some(b => b.tileX === t.x && b.tileY === t.y))
    .sort((a, b) => Math.max(Math.abs(a.x-origin.tileX),Math.abs(a.y-origin.tileY)) - Math.max(Math.abs(b.x-origin.tileX),Math.abs(b.y-origin.tileY)));
  const site = candidates.find(t => ['grass','sand','forest'].includes(map.tiles[t.y]?.[t.x]) && findPath(map,origin.tileX,origin.tileY,t.x,t.y) !== null);
  if (!site) return;
  island.dailyLife.campfire = { tileX: site.x, tileY: site.y };
  if(island.dailyLife.settlementVersion===1)enableSettlement(island);
  addEntry(island, '🔥 Nhóm Lửa Trại Khởi Nguyên. Dân tự về ăn tối, nghỉ và giao tiếp. Tích gỗ trong ba ngày đầu để giữ lửa.', 'medium');
}

function destinations(island: Island, reason: string): { x: number; y: number }[] {
  const camp = island.dailyLife?.campfire;
  const sites = island.buildings.filter(b => b.complete && b.type === (reason === 'hunger' ? 'storehouse' : 'house'))
    .map(b => ({ x: b.tileX, y: b.tileY }));
  if (camp) sites.push({ x: camp.tileX, y: camp.tileY });
  return reason === 'dinner' && camp ? [{ x: camp.tileX, y: camp.tileY }] : sites;
}
function socialize(npc: NPC, island: Island): boolean {
  const peers = island.npcs.filter(other => other.id !== npc.id && other.isAlive && other.position && npc.position &&
    Math.max(Math.abs(other.position.tileX-npc.position.tileX),Math.abs(other.position.tileY-npc.position.tileY)) <= 2);
  if (!peers.length) return false;
  npc.needs.social = clamp(npc.needs.social-8,0,100);
  for (const peer of peers) {
    const relationship = getRelationship(island,npc.id,peer.id);
    relationship.score = clamp(relationship.score+1,-100,100);
  }
  return true;
}

export function tickDailyLife(island: Island, map: WorldMap): void {
  if (!island.dailyLife) return;
  establishCampfire(island, map);
  const hour = worldMinutes(island.tick) / 60;
  // The offset clock rolls to the next day at dawn, not at midnight.
  const day = Math.floor(island.tick / TICKS_PER_DAY);
  const evening = hour >= 18 || hour < 6;
  const settlement=island.dailyLife.settlementVersion===1;
  const sleeping=settlement?sleepingAssignments(island,map):undefined;
  const firekeeper=tickCampfire(island,map);
  for (const npc of island.npcs) {
    npc.survivalBlocked = false;
    npc.sleepSite=undefined;
    if (!npc.isAlive || !npc.position) continue;
    if(island.tides?.active?.npcId===npc.id){npc.survivalBlocked=true;continue;}
    if(npc.id===firekeeper){npc.survivalBlocked=true;continue;}
    npc.health ??= 100;
    const caravan = island.buildings.some(b => b.shipment?.workerId === npc.id);
    if (caravan && evening && npc.needs.hunger < 80 && npc.health >= 40 && npc.needs.rest < 80) {
      // A caravan camps on its route; sending it back nightly would prevent trading.
      npc.survival = undefined; npc.survivalBlocked = true;
      if (npc.lastDinnerDay !== day) {
        npc.lastDinnerDay = day;
        if (eat(npc,island,false)) continue;
      }
      npc.status = 'sleeping'; npc.laborMessage = 'Đoàn vận chuyển nghỉ đêm tại chỗ';
      npc.needs.rest = clamp(npc.needs.rest-12,0,100);
      if (npc.needs.hunger < 50) npc.health = npc.health<90?Math.min(90,npc.health+2):npc.health;
      continue;
    }
    const bed=sleeping?.get(npc.id);
    const reason = npc.needs.hunger >= 80 ? 'hunger' : npc.health < 40 ? 'health' :
      npc.needs.rest >= 80 ? 'rest' : evening && npc.lastDinnerDay !== day ? 'dinner' : undefined;
    // Release the previous trip at dawn, except an emergency.
    if (!reason && !evening) {
      npc.survival = undefined;
      // Ending a meal/night must release its status too; otherwise a bound worker
      // can be skipped by tickBuildings even though the survival trip has ended.
      if(['sleeping','eating','chatting'].includes(npc.status))npc.status='idle';
    }
    if (reason && npc.survival?.reason !== reason) npc.survival = { reason };
    if(settlement&&evening&&!reason&&bed)npc.survival={reason:'rest'};
    let trip = npc.survival;
    let restMessage: string | undefined;
    if (!trip && !evening) continue;
    npc.survivalBlocked = true;

    if (trip) {
      if (trip.reason === 'hunger' && (npc.privateFood > 0||(npc.cargo?.food??0)>0||(npc.freight?.good==='food'&&npc.freight.amount>0)) && eat(npc, island, false)) {
        if (npc.needs.hunger < 80) npc.survival = undefined;
        continue;
      }
      const camp=island.dailyLife.campfire;
      const emergencyFood=trip.reason==='hunger'&&island.sharedFood<=0&&island.logistics?island.buildings.filter(b=>b.complete&&(b.buffer?.output.food??0)>0).map(b=>({x:b.tileX,y:b.tileY})):[];
      const targets=emergencyFood.length?emergencyFood:!settlement?destinations(island,trip.reason):trip.reason==='hunger'?storageSites(island):
        ['rest','health'].includes(trip.reason)&&bed?[{x:bed.tileX,y:bed.tileY}]:camp?[{x:camp.tileX,y:camp.tileY}]:[];
      const paths = targets.flatMap(dest => {
        const path = findPath(map, npc.position!.tileX, npc.position!.tileY, dest.x, dest.y);
        return path === null ? [] : [{ dest, path }];
      }).sort((a,b) => a.path.length - b.path.length);
      const route = paths[0];
      if (route?.path.length) {
        trip.destination = route.dest;
        const next = route.path[Math.min(movementSteps(npc,island),route.path.length)-1]; npc.position = { tileX: next.x, tileY: next.y };
        // Work progress stays intact; its path must be rebuilt from this new position.
        npc.path = undefined;
        npc.status = 'idle';
        npc.laborMessage = trip.reason === 'hunger' ? emergencyFood.length?'Đói · đang đến xưởng lấy bữa ăn':'Đói · đang về kho ăn' : trip.reason === 'dinner' ? 'Đang về lửa trại ăn tối' : 'Đang về nghỉ hồi sức';
        continue;
      }
      if (!route) {
        restMessage = 'Không có đường về kho/lửa · nghỉ tại chỗ';
        if ((npc.privateFood > 0||(npc.cargo?.food??0)>0||(npc.freight?.good==='food'&&npc.freight.amount>0)) && eat(npc,island,false)) {
          if (trip.reason === 'dinner') { npc.lastDinnerDay = day; npc.survival = undefined; }
          continue;
        }
      } else if (trip.reason === 'hunger' || trip.reason === 'dinner') {
        const ate = eat(npc,island,true);
        if (ate && trip.reason === 'dinner') socialize(npc,island);
        if (!ate) npc.laborMessage = npc.needs.hunger > 0 ? 'Thiếu thức ăn · chờ bổ sung kho' : 'Đã no · nghỉ bên lửa';
        if (!ate && npc.needs.hunger > 0) restMessage = 'Thiếu thức ăn · chờ bổ sung kho';
        if (trip.reason === 'dinner') npc.lastDinnerDay = day;
        // Take one ration from the shared ledger for work far from the village.
        const reserve = estimateDailyFoodDemand(island.npcs);
        const ration = Math.min(mealSize(npc) * 8 / (npc.isPregnant ? 40 : 35), Math.max(0, island.sharedFood - reserve * 2), Math.max(0, mealSize(npc)-npc.privateFood));
        npc.privateFood += ration; island.sharedFood -= ration;
        npc.survival = undefined;
        if (ate) continue;
      }
    }
    // Evening social time precedes sleep. Emergency rest is available at any hour.
    if (!restMessage && hour >= 20 && hour < 22 && npc.health >= 40 && npc.needs.rest < 80 && socialize(npc,island)) {
      npc.status = 'chatting'; npc.laborMessage = 'Trò chuyện bên lửa trại';
    } else {
      const sheltered=Boolean(bed&&npc.position.tileX===bed.tileX&&npc.position.tileY===bed.tileY);
      if(sheltered)npc.sleepSite=bed!.id;
      npc.status = 'sleeping'; npc.laborMessage = restMessage ?? (settlement?sheltered?`Đang ngủ trong ${bed!.type==='tent'?'lều':'nhà'} · giữ nguyên công việc`:'Ngủ ngoài trời · thiếu chỗ ngủ hoặc chưa tới lều':npc.health < 40 ? 'Nghỉ hồi sức · tạm dừng lao động' : 'Đang ngủ · giữ nguyên công việc');
      npc.needs.rest = clamp(npc.needs.rest - (settlement?sheltered?18:6:12),0,100);
      if (npc.needs.hunger < 50) npc.health = npc.health<90?Math.min(90,npc.health+2):npc.health;
      if(settlement&&evening)npc.needs.safety=clamp(npc.needs.safety+(island.dailyLife.campfire?.lit?-2:1),0,100);
      if (npc.health >= 40 && npc.needs.rest < 50 && !evening) npc.survival = undefined;
    }
  }
}
