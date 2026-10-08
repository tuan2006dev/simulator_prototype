import type {Island,LogisticsGood} from './types';
import {RECIPES,warehouseAmount} from './logistics';
import {foodCapacity} from '../renderer/BuildingManager';
import {estimateDailyFoodDemand} from './labor';
export const RESERVE_GOODS=['food','wood','stone','copperOre','copper','lumber','clay','bricks','pottery','wheat','ironOre','coal','iron','fiber','cloth','steel','cutStone','machineParts','components','microchips','spiritStone','spiritEssence'] as LogisticsGood[];
export const MAX_RESERVE_TARGET=10000;
export function reserveStock(island:Island,good:LogisticsGood):number{return warehouseAmount(island,good)+island.buildings.reduce((s,b)=>s+(b.buffer?.output[good]??0),0)+island.npcs.filter(n=>n.isAlive).reduce((s,n)=>s+(n.freight?.good===good?n.freight.amount:0)+(good==='food'?n.privateFood:0)+(good==='food'||good==='wood'||good==='stone'?n.cargo?.[good]??0:0),0);}
export function defaultReserve(island:Island,good:LogisticsGood):number{return good==='food'?foodCapacity(island):good==='wood'?(island.civilization?.era==='iron'?180:island.civilization?.era==='bronze'?100:60):good==='stone'?(island.civilization?.era==='iron'?100:island.civilization?.era==='bronze'?60:40):30;}
export function reserveFloor(island:Island,good:LogisticsGood):number{
 if(good==='food')return Math.ceil(estimateDailyFoodDemand(island.npcs.filter(n=>n.position))*1.5);
 let floor=good==='coal'&&island.buildings.some(b=>b.type==='steam_generator'&&b.complete&&b.powerEnabled!==false)?9:0;
 floor=Math.max(floor,good==='wood'&&island.dailyLife?.campfire?16:0);
 for(const b of island.buildings){const r=RECIPES[b.type];if(!b.complete||b.upgrade||b.autoStaff===false||!r?.inputs[good])continue;const goal=island.reserves?.targets[r.output]??defaultReserve(island,r.output);if(reserveStock(island,r.output)<goal)floor=Math.max(floor,r.inputs[good]!*3);}
 return floor;
}
export function reserveTarget(island:Island,good:LogisticsGood):number{return Math.max(island.reserves?.targets[good]??defaultReserve(island,good),reserveFloor(island,good));}
export function updateReserveRequests(island:Island):void{const r=island.reserves;if(!r)return;for(const good of Object.keys(r.targets) as LogisticsGood[]){const target=reserveTarget(island,good),stock=reserveStock(island,good);if(stock>=target)r.requests[good]=false;else if(stock<=target*.8)r.requests[good]=true;else r.requests[good]??=stock<target;}}
export function needsReserve(island:Island,good:LogisticsGood):boolean{const stock=reserveStock(island,good);if(island.reserves?.targets[good]===undefined)return stock<defaultReserve(island,good);const target=reserveTarget(island,good);return stock>=target?false:stock<=target*.8?true:island.reserves.requests[good]??stock<target;}
export function setReserveTargets(island:Island,targets:Partial<Record<LogisticsGood,number>>):string|null{
 if(!targets||typeof targets!=='object'||Array.isArray(targets)||Object.entries(targets).some(([g,n])=>!RESERVE_GOODS.includes(g as LogisticsGood)||!Number.isSafeInteger(n)||n!<0||n!>MAX_RESERVE_TARGET))return 'Mục tiêu phải là số nguyên từ 0 đến 10.000, cho loại hàng hợp lệ.';
 const prior=island.reserves;const requests:Partial<Record<LogisticsGood,boolean>>={};for(const good of Object.keys(targets) as LogisticsGood[])if(prior&&prior.targets[good]===targets[good]&&prior.requests[good]!==undefined)requests[good]=prior.requests[good];island.reserves={version:1,targets:{...targets},requests};updateReserveRequests(island);return null;
}
