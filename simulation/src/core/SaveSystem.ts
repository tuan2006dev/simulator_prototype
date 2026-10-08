import {generatorCapacity} from './PowerManager';
import {RESERVE_GOODS,MAX_RESERVE_TARGET} from './reserves';
import {FAITH_CAP} from './FaithManager';
import {GOOD_LABELS,BUFFER_CAPACITY,sumStock,RECIPES,OUTPUTS,WAREHOUSE,inputsOf} from './logistics';
import type { Island } from './types';
import type { WorldMap } from '../renderer/WorldMap';
import type { WorldConfig } from '../ui/StartScreen';
import { generateWorldMap } from '../renderer/WorldMap';
import { spawnResources, ensureClayDeposits, ensureIronDeposits } from '../renderer/ResourceSpawner';
import { TRADE_OFFERS } from './trade';
import { createCivilization, ERAS, COMMODITIES } from './civilization';
import type { Commodity } from './types';
import { TECH_TREE } from './research';
import { BUILD_COSTS } from '../renderer/BuildingManager';
import {TOOLS} from './equipment';
import {WORLD_STEP_MS} from './WorldClock';

export const LOCAL_SAVE_KEY = 'dao_thien_nguyen_v2';
export const LEGACY_SAVE_KEY = 'dao_thien_nguyen_v1';
export interface SavedWorld { version: 5; savedAt: number; island: Island; map: WorldMap; config: WorldConfig; tutorialStep: number }
export function encodeSave(island: Island, map: WorldMap, config: WorldConfig, tutorialStep = 4): string {
  return JSON.stringify({ version: 5, savedAt: Date.now(), island: { ...island, chronicle: island.chronicle.slice(-200) }, map, config: { ...config, mode: 'local' }, tutorialStep }, (_key, value: unknown) => value instanceof Map ? { __kind: 'Map', entries: [...value] } : value instanceof Set ? { __kind: 'Set', values: [...value] } : value);
}
export function decodeSave(raw: string): SavedWorld {
  const data = JSON.parse(raw, (_key, value) => value?.__kind === 'Map' ? new Map(value.entries) : value?.__kind === 'Set' ? new Set(value.values) : value) as SavedWorld;
  if (data.version !== 5 || !data.island || !data.config || !data.map) throw new Error('Bản lưu không tương thích.');
  const island = data.island, map = data.map;
  if (!Number.isSafeInteger(map.width) || !Number.isSafeInteger(map.height) || map.width < 1 || map.height < 1 || map.width > 500 || map.height > 500 || !Array.isArray(map.tiles) || map.tiles.length !== map.height || !map.tiles.every(row => Array.isArray(row) && row.length === map.width && row.every(t => ['grass','sand','forest','mountain','deep_water','shallow_water'].includes(t)))) throw new Error('Bản đồ trong bản lưu không hợp lệ.');
  if(data.config.shape==='three-islands'&&!map.archipelago)throw new Error('Bản đồ ba đảo thiếu danh tính vùng.');
  if(map.archipelago){const a=map.archipelago,labels={'thien-nguyen':'Thiên Nguyên','than-ngu':'Thần Ngư','rang-nanh':'Răng Nanh'},point=(p:{x:number;y:number})=>p&&Number.isSafeInteger(p.x)&&Number.isSafeInteger(p.y)&&p.x>=0&&p.y>=0&&p.x<map.width&&p.y<map.height;
    if(data.config.shape!=='three-islands'||a.version!==1||!Number.isSafeInteger(a.masterSeed)||a.masterSeed!==data.config.seed||!Array.isArray(a.islands)||a.islands.length!==3||new Set(a.islands.map(r=>r.id)).size!==3||!(a.regions instanceof Map)||a.regions.size>map.width*map.height||a.islands.some(r=>!Object.prototype.hasOwnProperty.call(labels,r.id)||r.name!==labels[r.id]||!Number.isSafeInteger(r.seed)||r.seed<0||r.seed>0xffffffff||!point(r.center)||!point(r.landing)||!r.bounds||![r.bounds.x,r.bounds.y,r.bounds.width,r.bounds.height].every(Number.isSafeInteger)||r.bounds.x<0||r.bounds.y<0||r.bounds.width<1||r.bounds.height<1||r.bounds.x+r.bounds.width>map.width||r.bounds.y+r.bounds.height>map.height||a.regions.get(`${r.landing.x},${r.landing.y}`)!==r.id))throw new Error('Thông tin quần đảo không hợp lệ.');
    for(const [k,id] of a.regions){const r=a.islands.find(r=>r.id===id),coords=typeof k==='string'&&/^\d+,\d+$/.test(k)?k.split(',').map(Number):[],[x,y]=coords;if(!r||!point({x,y})||x<r.bounds.x||y<r.bounds.y||x>=r.bounds.x+r.bounds.width||y>=r.bounds.y+r.bounds.height)throw new Error('Vùng sở hữu bản đồ không hợp lệ.');}
  }
  if (!Array.isArray(island.npcs) || !Array.isArray(island.buildings) || !Array.isArray(island.animals) || !Array.isArray(island.chronicle) || !(island.resources instanceof Map) || !(island.relationships instanceof Map) || !Number.isSafeInteger(island.tick) || island.tick < 0) throw new Error('Dữ liệu thế giới không hợp lệ.');
  const exploration=island.exploration;
  if(island.clock&&(island.clock.version!==1||!Number.isFinite(island.clock.progressMs)||island.clock.progressMs<0||island.clock.progressMs>=WORLD_STEP_MS))throw new Error('Thời gian trong bản lưu không hợp lệ.');
  const explorationPoint=(p:{x:number;y:number})=>p&&Number.isSafeInteger(p.x)&&Number.isSafeInteger(p.y)&&p.x>=0&&p.y>=0&&p.x<map.width&&p.y<map.height;
  const causeway=map.causeway;
  if(causeway){const route=[causeway.main,...(Array.isArray(causeway.tiles)?causeway.tiles:[]),causeway.fang];
    if(!map.archipelago||causeway.version!==1||!Array.isArray(causeway.tiles)||causeway.tiles.length<1||causeway.tiles.length>11||!route.every(explorationPoint)||new Set(route.map(p=>`${p.x},${p.y}`)).size!==route.length||map.archipelago.regions.get(`${causeway.main.x},${causeway.main.y}`)!=='thien-nguyen'||map.archipelago.regions.get(`${causeway.fang.x},${causeway.fang.y}`)!=='rang-nanh'||route.some((p,i)=>i>0&&Math.max(Math.abs(p.x-route[i-1].x),Math.abs(p.y-route[i-1].y))!==1))throw new Error('Bãi cạn trong bản lưu không hợp lệ.');
  }
  const tide=island.tides;
  if(tide){const a=tide.active;
    if(!causeway||tide.version!==1||!Number.isSafeInteger(tide.completed)||tide.completed<0||typeof tide.message!=='string')throw new Error('Thủy triều trong bản lưu không hợp lệ.');
    if(a&&(!explorationPoint(a.home)||!['provision','approach','outward','survey','inward','home'].includes(a.phase)||!Number.isFinite(a.rations)||a.rations<0||a.rations>20||!Number.isFinite(a.collected)||a.collected<0||a.collected>3||typeof a.recall!=='boolean'||!Number.isSafeInteger(a.startedTick)||a.startedTick<0||a.startedTick>island.tick||typeof a.sourceKey!=='string'||island.resources.get(a.sourceKey)?.type!=='stone_deposit'||map.archipelago!.regions.get(a.sourceKey)!=='rang-nanh'||!island.npcs.some(n=>n.id===a.npcId&&n.isAlive&&n.position&&n.age>=18)||island.buildings.some(b=>b.workers.includes(a.npcId))||exploration?.active||exploration?.torchOrder||exploration?.patrol?.enabled))throw new Error('Chuyến qua bãi cạn không hợp lệ.');
  }
  const wild=island.wilderness;
  if(wild){const count=(v:number)=>Number.isSafeInteger(v)&&v>=0;
    if(wild.version!==1||!Array.isArray(wild.territories)||wild.territories.length>2||new Set(wild.territories.map(t=>t.id)).size!==wild.territories.length||![wild.encounters,wild.injuries,wild.repelled].every(count)||wild.injuries>wild.encounters||wild.repelled>wild.encounters||typeof wild.message!=='string'||wild.territories.some(t=>typeof t.id!=='string'||!['wolf','boar'].includes(t.species)||!explorationPoint(t)||!explorationPoint({x:t.animalX,y:t.animalY})||Math.max(Math.abs(t.x-t.animalX),Math.abs(t.y-t.animalY))>2||typeof t.seen!=='boolean'||!count(t.retreatUntil)||!count(t.cooldownUntil)||t.retreatUntil>island.tick+10||t.cooldownUntil>island.tick+5))throw new Error('Thú hoang/lãnh địa không hợp lệ.');
    const encounter=wild.lastEncounter;if(encounter&&(!island.npcs.some(n=>n.id===encounter.npcId)||!wild.territories.some(t=>t.id===encounter.territoryId)||!count(encounter.tick)||encounter.tick>island.tick||!['warning','injury','repelled'].includes(encounter.kind)||!Number.isFinite(encounter.damage)||encounter.damage<0||encounter.damage>16||encounter.kind!=='injury'&&encounter.damage!==0))throw new Error('Cuộc gặp thú không hợp lệ.');
  }
  if(exploration){
    const e=exploration,validSet=(v:Set<string>)=>v instanceof Set&&v.size<=map.width*map.height&&[...v].every(k=>typeof k==='string'&&/^\d+,\d+$/.test(k)&&explorationPoint({x:Number(k.split(',')[0]),y:Number(k.split(',')[1])}));
    if(e.version!==1||!validSet(e.discovered)||!validSet(e.visible)||[...e.visible].some(k=>!e.discovered.has(k))||typeof e.legacy!=='boolean'||typeof e.message!=='string'||!e.mission||![e.mission.region,e.mission.food,e.mission.returned].every(v=>typeof v==='boolean')||!Array.isArray(e.torchStock)||e.torchStock.some(v=>!Number.isSafeInteger(v)||v<0||v>30)||!Number.isSafeInteger(e.torchCrafted)||e.torchCrafted<0||e.torchStock.length+island.npcs.filter(n=>n.torch).length!==e.torchCrafted||!Number.isSafeInteger(e.completed)||e.completed<0)throw new Error('Khám phá/đuốc trong bản lưu không hợp lệ.');
    const a=e.active;if(a&&(!explorationPoint(a.target)||!explorationPoint(a.home)||!['outbound','returning'].includes(a.stage)||typeof a.reached!=='boolean'||typeof a.foundFood!=='boolean'||typeof a.reason!=='string'||!Number.isSafeInteger(a.newLand)||a.newLand<0||a.newLand>map.width*map.height||!island.npcs.some(n=>n.id===a.npcId&&n.isAlive&&n.position&&n.age>=18)||island.buildings.some(b=>b.workers.includes(a.npcId))||e.torchOrder))throw new Error('Chuyến khám phá không hợp lệ.');
    const o=e.torchOrder;if(o&&(!Number.isSafeInteger(o.workTicks)||o.workTicks<0||o.workTicks>=2||!island.npcs.some(n=>n.id===o.npcId&&n.age>=18)||island.buildings.some(b=>b.workers.includes(o.npcId))))throw new Error('Đơn đuốc không hợp lệ.');
    if(e.warning!==undefined&&typeof e.warning!=='string')throw new Error('Cảnh báo khám phá không hợp lệ.');
    if(e.points!==undefined&&(!Array.isArray(e.points)||e.points.length>3||new Set(e.points.map(p=>p.id)).size!==e.points.length||e.points.some(p=>typeof p.id!=='string'||!explorationPoint(p)||!['food_cache','herb_cache','monolith'].includes(p.kind)||typeof p.claimed!=='boolean'||typeof p.exhausted!=='boolean'||p.claimed&&p.exhausted||!Number.isSafeInteger(p.workTicks)||p.workTicks<0||p.workTicks>2||!Number.isFinite(p.collected)||p.collected<0||p.collected>(p.kind==='food_cache'?8:p.kind==='herb_cache'?2:1)||!p.claimed&&p.collected!==0||p.kind!=='monolith'&&(p.sourceKey!==`${p.x},${p.y}`||island.resources.get(p.sourceKey)?.type!=='herb_patch'))))throw new Error('Điểm khám phá không hợp lệ.');
    if(a&&(a.automatic!==undefined&&typeof a.automatic!=='boolean'||a.pointId!==undefined&&!e.points?.some(p=>p.id===a.pointId&&p.x===a.target.x&&p.y===a.target.y)))throw new Error('Mốc khám phá không hợp lệ.');
    const patrol=e.patrol;if(patrol&&(typeof patrol.enabled!=='boolean'||![patrol.nextTick,patrol.trips].every(v=>Number.isSafeInteger(v)&&v>=0)||!island.npcs.some(n=>n.id===patrol.npcId&&n.age>=18&&n.occupation!=='child')||patrol.enabled&&(!!o||a&&a.npcId!==patrol.npcId||island.buildings.some(b=>b.workers.includes(patrol.npcId)))))throw new Error('Tuần tra không hợp lệ.');
  }
  for(const n of island.npcs){if(n.torch&&(!exploration||!Number.isSafeInteger(n.torch.fuel)||n.torch.fuel<0||n.torch.fuel>30)||n.torchChoice!==undefined&&typeof n.torchChoice!=='boolean'||n.torchRefill!==undefined&&typeof n.torchRefill!=='boolean')throw new Error('Đuốc cư dân không hợp lệ.');n.exploring=island.tides?.active?.npcId===n.id||exploration?.active?.npcId===n.id||exploration?.torchOrder?.npcId===n.id||!!exploration?.patrol?.enabled&&exploration.patrol.npcId===n.id;}
  const raid=island.raids;
  if(raid){const time=(v:number)=>Number.isSafeInteger(v)&&v>=0;const pos=(v:{x:number;y:number})=>v&&Number.isSafeInteger(v.x)&&Number.isSafeInteger(v.y)&&v.x>=0&&v.y>=0&&v.x<map.width&&v.y<map.height;
    if(raid.version!==1||!['peace','warning','active'].includes(raid.phase)||![raid.clockMs,raid.untilMs,raid.count,raid.shieldUntilMs,raid.shieldCooldownUntilMs].every(time)||raid.untilMs<raid.clockMs||!Number.isFinite(raid.stolen)||!Number.isFinite(raid.budget)||raid.stolen<0||raid.budget<raid.stolen||raid.budget>40||typeof raid.result!=='string'||!Array.isArray(raid.enemies)||raid.enemies.length>2||new Set(raid.enemies.map(e=>e.id)).size!==raid.enemies.length||raid.enemies.some(e=>typeof e.id!=='string'||!pos(e)||!Number.isFinite(e.health)||e.health<=0||e.health>36)||(raid.target!==null&&!pos(raid.target))||(raid.phase!=='peace'&&!raid.target)||(raid.phase!=='active'&&raid.enemies.length>0)||raid.shieldUntilMs>raid.shieldCooldownUntilMs||raid.shieldCooldownUntilMs>raid.clockMs+90000||raid.shieldUntilMs>raid.clockMs+30000)throw new Error('Đột kích hoặc Khiên Thần không hợp lệ.');
  }
  if(island.npcs.some(n=>n.guardDuty!==undefined&&typeof n.guardDuty!=='boolean'))throw new Error('Người bảo vệ không hợp lệ.');
  for (const amount of [island.sharedFood, island.wood, island.stone, island.herbs]) if (!Number.isFinite(amount) || amount < 0) throw new Error('Tài nguyên không hợp lệ.');
  if (!island.civilization || !ERAS.some(e => e.id === island.civilization!.era) || !Array.isArray(island.civilization.unlocks)) throw new Error('Tiến trình kỷ nguyên không hợp lệ.');
  if (!island.civilization.inventory || !island.civilization.produced) throw new Error('Kho hàng không hợp lệ.');
  for (const key of Object.keys(COMMODITIES) as Commodity[]) {
    // Version 5 saves made before the Bronze expansion lack these four keys.
    if (['clay','bricks','pottery','wheat','ironOre','coal','iron','fiber','cloth','steel','cutStone','machineParts','components','microchips','spiritStone','spiritEssence','relicBone','bloodstone','biomatter','medicine'].includes(key)) {
      island.civilization.inventory[key] ??= 0;
      island.civilization.produced[key] ??= 0;
    }
    for (const amount of [island.civilization.inventory[key],island.civilization.produced[key]]) if (!Number.isFinite(amount) || amount < 0) throw new Error('Kho hàng không hợp lệ.');
  }
  for(const n of island.npcs){if(n.adaptation&&(n.age<18||n.occupation==='child'||!['hightech','mystic','eldritch'].includes(n.adaptation.kind)||island.civilization.anomalyBranch!==n.adaptation.kind||!island.civilization.unlocks.includes(n.adaptation.kind==='eldritch'?'biological_adaptation':n.adaptation.kind==='mystic'?'spiritual_attunement':'assistive_augmentation')||!Number.isSafeInteger(n.adaptation.charge)||n.adaptation.charge<0||n.adaptation.charge>100))throw new Error('Thích nghi cư dân không hợp lệ.');n.adaptationReady=false;}
  const support=island.adaptationProcess;
  if(support){const n=island.npcs.find(n=>n.id===support.npcId);if(!['hightech','mystic','eldritch'].includes(island.civilization.anomalyBranch??'')||!island.civilization.unlocks.includes(island.civilization.anomalyBranch==='eldritch'?'biological_adaptation':island.civilization.anomalyBranch==='mystic'?'spiritual_attunement':'assistive_augmentation')||!n?.position||n.age<18||n.occupation==='child'||!['apply','service','remove'].includes(support.mode)||support.mode==='apply'&&n.adaptation||support.mode!=='apply'&&!n.adaptation||n.researching||n.clinicalCare||n.treatment||!Number.isSafeInteger(support.workTicks)||support.workTicks<0||support.workTicks>=(support.mode==='apply'?10:support.mode==='service'?4:5)||!island.buildings.some(b=>b.id===support.labId&&b.type==='measurement_lab'&&b.complete&&!b.upgrade))throw new Error('Dự án hỗ trợ cư dân không hợp lệ.');}
  for(const n of island.npcs){const a=n.clinicalCare;if(a&&(!island.civilization.unlocks.includes('modern_medicine')||!n.position||n.treatment||typeof a.paid!=='boolean'||!Number.isSafeInteger(a.workTicks)||a.workTicks<0||a.workTicks>=5||!a.paid&&a.workTicks!==0||!island.buildings.some(b=>b.id===a.clinicId&&b.type==='clinic'&&b.complete)))throw new Error('Lịch khám không hợp lệ.');n.clinicReady=false;}
  for(const b of island.buildings.filter(b=>b.type==='clinic'))if(island.npcs.filter(n=>n.clinicalCare?.clinicId===b.id&&n.clinicalCare.paid).length>(b.clinicalDoses??0))throw new Error('Lịch khám thiếu ghi nhận liều thuốc.');
  for(const b of island.buildings)if(b.clinicalDoses!==undefined&&(b.type!=='clinic'||!Number.isSafeInteger(b.clinicalDoses)||b.clinicalDoses<0||b.clinicalDoses>island.tick)||b.completedCare!==undefined&&(b.type!=='clinic'||!Number.isSafeInteger(b.completedCare)||b.completedCare<0||b.completedCare>(b.clinicalDoses??0)))throw new Error('Chăm sóc phòng khám không hợp lệ.');
  const defense=island.defense;
  if(defense){const kinds=['spear','padded_vest'] as const;if(defense.version!==1||!defense.stock||!defense.crafted||kinds.some(k=>!Number.isSafeInteger(defense.stock[k])||defense.stock[k]<0||!Number.isSafeInteger(defense.crafted[k])||defense.crafted[k]<0||defense.stock[k]+island.npcs.filter(n=>k==='spear'?n.weapon===k:n.armor===k).length!==defense.crafted[k]))throw new Error('Kho phòng vệ không hợp lệ.');const a=defense.order;if(a&&(!kinds.includes(a.kind)||!Number.isSafeInteger(a.workTicks)||a.workTicks<0||a.workTicks>=5||!island.npcs.some(n=>n.id===a.npcId&&n.age>=18&&n.position)))throw new Error('Đơn phòng vệ không hợp lệ.');}
  for(const n of island.npcs){if(n.herbalDoses!==undefined&&(!Number.isSafeInteger(n.herbalDoses)||n.herbalDoses<0||n.herbalDoses>island.tick))throw new Error('Liều thảo dược không hợp lệ.');if(n.weapon!==undefined&&(n.weapon!=='spear'||!defense)||n.armor!==undefined&&(n.armor!=='padded_vest'||!defense))throw new Error('Trang bị phòng vệ không hợp lệ.');const a=n.treatment;if(a&&(!island.civilization.unlocks.includes('herbalism')||!n.position||n.age<18||typeof a.paid!=='boolean'||!Number.isSafeInteger(a.workTicks)||a.workTicks<0||a.workTicks>=4||!a.paid&&a.workTicks!==0))throw new Error('Liệu trình không hợp lệ.');const x=n.defenseChoice;if(x&&(!defense||!n.position||n.age<18||!['spear','padded_vest'].includes(x.kind)||typeof x.equip!=='boolean'))throw new Error('Yêu cầu phòng vệ không hợp lệ.');}
  const survey=island.surveys;
  if(survey){const pos=(p:{x:number;y:number})=>p&&Number.isSafeInteger(p.x)&&Number.isSafeInteger(p.y)&&p.x>=0&&p.y>=0&&p.x<map.width&&p.y<map.height;
    if(survey.version!==1||typeof survey.message!=='string'||!Array.isArray(survey.sites)||survey.sites.length!==3||new Set(survey.sites.map(p=>p.id)).size!==3||new Set(survey.sites.map(p=>p.kind)).size!==3||new Set(survey.sites.map(p=>`${p.x},${p.y}`)).size!==3||survey.sites.some(p=>!pos(p)||typeof p.id!=='string'||!['hightech','mystic','eldritch'].includes(p.kind)||typeof p.surveyed!=='boolean'||p.analyzed!==undefined&&(typeof p.analyzed!=='boolean'||p.analyzed&&!p.surveyed)))throw new Error('Điểm khảo sát không hợp lệ.');
    const a=survey.active;if(a&&(!survey.sites.some(p=>p.id===a.siteId&&!p.surveyed)||!['outbound','observing','returning'].includes(a.stage)||!Number.isSafeInteger(a.workTicks)||a.workTicks<0||a.workTicks>10||a.stage==='returning'&&a.workTicks!==10||a.stage==='outbound'&&a.workTicks!==0||a.stage==='observing'&&a.workTicks>=10||island.equipment?.order?.workerId===a.npcId||!island.npcs.some(n=>n.id===a.npcId&&n.isAlive&&n.position&&n.age>=18&&n.researching)||island.buildings.some(b=>b.workers.includes(a.npcId))||island.civilization.research?.researcherId===a.npcId||!island.buildings.some(b=>b.id===a.homeId&&b.type==='study_table'&&b.complete)||island.civilization.era!=='modern'||!island.civilization.unlocks.includes('field_surveys')))throw new Error('Chuyến khảo sát không hợp lệ.');
  }
  const analysis=island.analysis;
  if(analysis){const a=analysis.active;if(analysis.version!==1||typeof analysis.message!=='string'||a&&(!island.surveys?.sites.some(p=>p.id===a.siteId&&p.surveyed&&!p.analyzed)||!island.buildings.some(b=>b.id===a.labId&&b.type==='measurement_lab'&&b.complete&&!b.upgrade)||!Number.isSafeInteger(a.workTicks)||a.workTicks<0||a.workTicks>=40||island.civilization.era!=='modern'||!island.civilization.unlocks.includes('measurement_science')))throw new Error('Phân tích hồ sơ không hợp lệ.');}
  for(const p of survey?.sites??[]){
    if(p.decision!==undefined&&(!p.analyzed||!['research','contain','ignore'].includes(p.decision))||p.foundationComplete!==undefined&&(typeof p.foundationComplete!=='boolean'||p.foundationComplete&&p.decision!=='research'))throw new Error('Quyết định điểm lạ không hợp lệ.');
    if(p.decision==='research'&&!p.foundationComplete&&analysis?.foundation?.siteId!==p.id)throw new Error('Dự án nền tảng thiếu tiến độ.');
  }
  const foundation=analysis?.foundation;
  if(foundation&&(analysis?.active||!survey?.sites.some(p=>p.id===foundation.siteId&&p.analyzed&&p.decision==='research'&&!p.foundationComplete)||!island.buildings.some(b=>b.id===foundation.labId&&b.type==='measurement_lab'&&b.complete&&!b.upgrade)||!Number.isSafeInteger(foundation.workTicks)||foundation.workTicks<0||foundation.workTicks>=60||island.civilization.era!=='modern'||!island.civilization.unlocks.includes('measurement_science')))throw new Error('Dự án nền tảng không hợp lệ.');
  if(island.buildings.some(b=>b.labPoweredTicks!==undefined&&(b.type!=='measurement_lab'||!Number.isSafeInteger(b.labPoweredTicks)||b.labPoweredTicks<0||b.labPoweredTicks>(island.power?.clockTicks??0))))throw new Error('Điện của cơ sở đo đạc không hợp lệ.');
  for(const b of island.buildings){if(b.relicSafety!==undefined&&(b.type!=='relic_extractor'||typeof b.relicSafety!=='boolean'||island.civilization.anomalyBranch!=='eldritch')||b.relicSafetyBatches!==undefined&&(b.type!=='relic_extractor'||island.civilization.anomalyBranch!=='eldritch'||!Number.isSafeInteger(b.relicSafetyBatches)||b.relicSafetyBatches<0||b.relicSafetyBatches>5))throw new Error('Lọc mẫu di tích không hợp lệ.');}
  const source=island.eldritchSource;
  if(source&&(source.version!==1||!island.surveys?.sites.some(p=>p.id===source.siteId&&p.kind==='eldritch'&&p.foundationComplete&&p.decision==='research')||!island.civilization.unlocks.includes('relic_handling')||![source.charge,source.contamination,source.clockTicks].every(Number.isSafeInteger)||source.charge<0||source.charge>24||source.contamination<0||source.contamination>100||source.clockTicks<0||source.clockTicks>island.tick))throw new Error('Di tích biến chất không hợp lệ.');
  for(const n of island.npcs)if(n.exposure!==undefined&&(!source||!Number.isSafeInteger(n.exposure)||n.exposure<0||n.exposure>30))throw new Error('Phơi nhiễm không hợp lệ.');
  for(const b of island.buildings){if(b.relicEnabled!==undefined&&(b.type!=='relic_extractor'||typeof b.relicEnabled!=='boolean'))throw new Error('Khai thác di tích không hợp lệ.');if(b.quarantineFuelTicks!==undefined&&(b.type!=='quarantine'||!Number.isSafeInteger(b.quarantineFuelTicks)||b.quarantineFuelTicks<0||b.quarantineFuelTicks>10)||b.quarantineCareTicks!==undefined&&(b.type!=='quarantine'||!Number.isSafeInteger(b.quarantineCareTicks)||b.quarantineCareTicks<0||b.quarantineCareTicks>island.tick))throw new Error('Cách ly không hợp lệ.');}
  const vein=island.spiritVein;
  if(vein&&(vein.version!==1||!island.surveys?.sites.some(p=>p.id===vein.siteId&&p.kind==='mystic'&&p.foundationComplete&&p.decision==='research')||!island.civilization.unlocks.includes('spirit_channeling')||![vein.charge,vein.stability,vein.clockTicks].every(Number.isSafeInteger)||vein.charge<0||vein.charge>24||vein.stability<0||vein.stability>100||vein.clockTicks<0||vein.clockTicks>island.tick))throw new Error('Linh mạch không hợp lệ.');
  for(const b of island.buildings){if(b.spiritEnabled!==undefined&&(b.type!=='spirit_extractor'||typeof b.spiritEnabled!=='boolean'))throw new Error('Khai thác linh mạch không hợp lệ.');if(b.resonanceFuelTicks!==undefined&&(b.type!=='resonance_tower'||!Number.isSafeInteger(b.resonanceFuelTicks)||b.resonanceFuelTicks<0||b.resonanceFuelTicks>10)||b.resonanceCareTicks!==undefined&&(b.type!=='resonance_tower'||!Number.isSafeInteger(b.resonanceCareTicks)||b.resonanceCareTicks<0||b.resonanceCareTicks>island.tick))throw new Error('Chăm sóc cộng hưởng không hợp lệ.');}
  const branch=island.civilization.anomalyBranch,project=island.civilization.branchDevelopment;
  const supported=(value:unknown)=>value==='hightech'||value==='mystic'||value==='eldritch';
  if(branch!==undefined&&(!supported(branch)||island.civilization.era!=='anomaly')||island.civilization.era==='anomaly'&&!supported(branch))throw new Error('Nhánh Dị Tượng không hợp lệ.');
  const chosen=branch??project?.branch,c=island.civilization;
  if(chosen&&((island.surveys?.sites.filter(p=>p.analyzed).length??0)<3||!island.surveys?.sites.some(p=>p.kind===chosen&&p.foundationComplete&&p.decision==='research')||(chosen==='hightech'?c.produced.microchips<6||!c.unlocks.includes('industrial_control'):chosen==='eldritch'?c.produced.relicBone<20||c.produced.bloodstone<10||c.produced.biomatter<9||!c.unlocks.includes('bio_containment')||!island.eldritchSource||!island.buildings.some(b=>b.type==='relic_extractor'&&b.complete)||!island.buildings.some(b=>b.type==='biomatter_workshop'&&b.complete&&(b.productionBatches??0)>=9)||!island.buildings.some(b=>b.type==='quarantine'&&b.complete&&(b.quarantineCareTicks??0)>=20):!supported(chosen)||c.produced.spiritStone<12||c.produced.spiritEssence<9||!c.unlocks.includes('resonance_care')||!island.buildings.some(b=>b.type==='resonance_tower'&&(b.resonanceCareTicks??0)>=20))))throw new Error('Bằng chứng nền tảng nhánh không hợp lệ.');
  if(project&&(!supported(project.branch)||c.era!=='modern'||branch||c.transition||c.research||island.analysis?.active||island.analysis?.foundation||!Number.isSafeInteger(project.workTicks)||project.workTicks<0||project.workTicks>=50||!island.buildings.some(b=>b.id===project.labId&&b.type==='measurement_lab'&&b.complete&&!b.upgrade)))throw new Error('Dự án chuyển nhánh không hợp lệ.');
  for(const b of island.buildings)if(b.productionQuota!==undefined&&(!Number.isSafeInteger(b.productionQuota)||b.productionQuota<0||b.productionQuota>100||!['component_factory','microchip_factory','prototype_workshop','steelworks'].includes(b.type)||branch!=='hightech'))throw new Error('Định mức sản xuất không hợp lệ.');
  const transition = island.civilization.transition, research = island.civilization.research;
  if (transition && ((!['bronze','iron','modern'].includes(transition.target)) || island.civilization.era !== (transition.target==='modern'?'iron':transition.target==='iron'?'bronze':'stone') || !Number.isSafeInteger(transition.workTicks) || transition.workTicks < 0 || transition.workTicks > transition.ticksNeeded || transition.ticksNeeded !== (transition.target==='modern'?50:transition.target==='iron'?30:20))) throw new Error('Tiến độ phát triển không hợp lệ.');
  if (research && (!TECH_TREE.some(t=>t.id===research.techId&&t.implemented!==false) || !Number.isFinite(research.daysNeeded) || research.daysNeeded <= 0 || !Number.isFinite(research.workTicks) || research.workTicks! < 0)) throw new Error('Tiến độ nghiên cứu không hợp lệ.');
  for (const building of island.buildings) if (!Object.prototype.hasOwnProperty.call(BUILD_COSTS,building.type) || !Number.isSafeInteger(building.tileX) || !Number.isSafeInteger(building.tileY) || building.tileX<0 || building.tileY<0 || building.tileX>=map.width || building.tileY>=map.height || !Array.isArray(building.workers)) throw new Error('Công trình không hợp lệ.');
  for(const b of island.buildings){
    const s=b.shipment;
    if(s&&(b.type!=='tradepost'||!Object.prototype.hasOwnProperty.call(TRADE_OFFERS,s.offerId)||typeof s.workerId!=='string'||!['outbound','returning'].includes(s.stage)||!Number.isSafeInteger(s.exchangeTicks)||s.exchangeTicks<0||s.exchangeTicks>10||!s.destination||!Number.isSafeInteger(s.destination.x)||!Number.isSafeInteger(s.destination.y)||s.destination.x<0||s.destination.y<0||s.destination.x>=map.width||s.destination.y>=map.height))throw new Error('Chuyến hàng không hợp lệ.');
  }
  if(island.civilization.completedTrades!==undefined&&(!Number.isSafeInteger(island.civilization.completedTrades)||island.civilization.completedTrades<0))throw new Error('Lịch sử giao thương không hợp lệ.');
  for (const npc of island.npcs) if (!(npc.attackCooldowns instanceof Map) || !(npc.stealCooldowns instanceof Map) || !npc.needs || !npc.personality || typeof npc.id !== 'string') throw new Error('Dữ liệu cư dân không hợp lệ.');
  for(const n of island.npcs){if(n.autoWorkProgress!==undefined&&(typeof n.autoWorkProgress!=='object'||n.autoWorkProgress===null||Array.isArray(n.autoWorkProgress)||Object.entries(n.autoWorkProgress).some(([id,t])=>!island.buildings.some(b=>b.id===id)||!Number.isFinite(t)||t<0||t>=10)))throw new Error('Tiến độ nhân công tự động không hợp lệ.');if(n.buildingWork?.cycleBoundary!==undefined&&typeof n.buildingWork.cycleBoundary!=='boolean')throw new Error('Mốc mẻ công trình không hợp lệ.');}
  if(island.reserves){const r=island.reserves;if(r.version!==1||!r.targets||typeof r.targets!=='object'||Array.isArray(r.targets)||!r.requests||typeof r.requests!=='object'||Array.isArray(r.requests)||Object.entries(r.targets).some(([g,t])=>!RESERVE_GOODS.includes(g as import('./types').LogisticsGood)||!Number.isSafeInteger(t)||t!<0||t!>MAX_RESERVE_TARGET)||Object.entries(r.requests).some(([g,v])=>!Object.prototype.hasOwnProperty.call(r.targets,g)||typeof v!=='boolean'))throw new Error('Mục tiêu dự trữ trong bản lưu không hợp lệ.');}
  const automaticIds=new Set<string>();for(const b of island.buildings){if(b.autoStaff!==undefined&&typeof b.autoStaff!=='boolean')throw new Error('Phân công tự động công trình không hợp lệ.');if(b.autoWorkers!==undefined){if(!Array.isArray(b.autoWorkers)||new Set(b.autoWorkers).size!==b.autoWorkers.length||b.autoWorkers.some(id=>typeof id!=='string'||!b.workers.includes(id)||!island.npcs.some(n=>n.id===id)||automaticIds.has(id)))throw new Error('Nhân công tự động công trình không hợp lệ.');for(const id of b.autoWorkers)automaticIds.add(id);}}
  for(const b of island.buildings){if(b.powerEnabled!==undefined&&typeof b.powerEnabled!=='boolean'||b.powerPriority!==undefined&&(!Number.isInteger(b.powerPriority)||b.powerPriority<0||b.powerPriority>2)||b.powerFuelTicks!==undefined&&(b.type!=='steam_generator'||!Number.isInteger(b.powerFuelTicks)||b.powerFuelTicks<0||b.powerFuelTicks>10)||b.poweredTicks!==undefined&&(b.type!=='prototype_workshop'||!Number.isSafeInteger(b.poweredTicks)||b.poweredTicks<0||b.poweredTicks>(island.power?.clockTicks??0)))throw new Error('Cấu hình điện không hợp lệ.');}
  if(island.power){const p=island.power,num=(n:number)=>Number.isSafeInteger(n)&&n>=0;if(p.version!==1||![p.clockTicks,p.supply,p.demand,p.steadyTicks].every(num)||p.steadyTicks>p.clockTicks||p.steadyTicks!==Math.max(0,...island.buildings.filter(b=>b.type==='prototype_workshop').map(b=>b.poweredTicks??0))||!Array.isArray(p.supplied)||new Set(p.supplied).size!==p.supplied.length||p.supplied.some(id=>!island.buildings.some(b=>b.id===id&&['prototype_workshop','component_factory','measurement_lab','microchip_factory','control_center','spirit_refinery','resonance_tower','apothecary','clinic','biomatter_workshop','quarantine'].includes(b.type)&&b.complete&&!b.upgrade&&b.powerEnabled!==false))||p.supplied.length*2>p.supply||p.supply>island.buildings.filter(b=>b.type==='steam_generator').reduce((v,b)=>v+generatorCapacity(b),0)||p.demand>island.buildings.filter(b=>['prototype_workshop','component_factory','measurement_lab','microchip_factory','control_center','spirit_refinery','resonance_tower','apothecary','clinic','biomatter_workshop','quarantine'].includes(b.type)).length*2)throw new Error('Lưới điện trong bản lưu không hợp lệ.');}
  if(island.weather){
    const w=island.weather,time=(t:number)=>Number.isSafeInteger(t)&&t>=0;
    const key=(k:string)=>{if(typeof k!=='string'||!/^\d+,\d+$/.test(k))return false;const [x,y]=k.split(',').map(Number);return x<map.width&&y<map.height;};
    if(w.version!==1||!time(w.clockMs)||!['clear','rain','drought'].includes(w.kind)||!time(w.untilMs)||w.untilMs<=w.clockMs||w.untilMs>w.clockMs+60000||!time(w.seed)||w.seed>4294967295||typeof w.dryFireChecked!=='boolean'||!time(w.rainUntilMs)||w.rainUntilMs>w.clockMs+45000||!time(w.rainCooldownUntilMs)||w.rainCooldownUntilMs>w.clockMs+60000||w.rainUntilMs>0&&w.rainCooldownUntilMs-w.rainUntilMs!==15000||!time(w.incidentCount)||!Array.isArray(w.fires)||w.fires.length>8||!Array.isArray(w.burned)||w.burned.length>8||w.burned.some(k=>!key(k))||new Set(w.burned).size!==w.burned.length||w.fires.some(f=>!key(f.key)||!w.burned.includes(f.key)||!Number.isInteger(f.life)||f.life<1||f.life>20||!Number.isInteger(f.heat)||f.heat<1||f.heat>3)||new Set(w.fires.map(f=>f.key)).size!==w.fires.length)throw new Error('Thời tiết hoặc cháy rừng trong bản lưu không hợp lệ.');
  }
  if(island.faith){
    const inc=island.faith.incite,clock=island.faith.clockMs;
    if(island.faith.inciteCooldownUntilMs!==undefined&&(!Number.isSafeInteger(island.faith.inciteCooldownUntilMs)||island.faith.inciteCooldownUntilMs<0||island.faith.inciteCooldownUntilMs>clock+30000)||inc&&(!Number.isSafeInteger(inc.untilMs)||inc.untilMs<0||inc.untilMs>clock+20000||!Array.isArray(inc.targets)||new Set(inc.targets).size!==inc.targets.length||inc.targets.some(id=>!island.npcs.some(n=>n.id===id&&n.age>=18)))||island.faith.inciteCasts!==undefined&&(!Array.isArray(island.faith.inciteCasts)||island.faith.inciteCasts.some((v,i,a)=>!Number.isSafeInteger(v)||v<0||v>clock||i>0&&v<=a[i-1])))throw new Error('Khích Lệ không hợp lệ.');
    const f=island.faith,b=f.blessing;const time=(t:number)=>Number.isSafeInteger(t)&&t>=0;
    if(f.version!==1||!Number.isFinite(f.amount)||f.amount<0||f.amount>FAITH_CAP||!time(f.clockMs)||!time(f.cooldownUntilMs)||f.cooldownUntilMs>f.clockMs+45000||!Array.isArray(f.casts)||f.casts.some(t=>!time(t)||t>f.clockMs)||f.casts.some((t,i)=>i>0&&t<=f.casts[i-1]))throw new Error('Niềm tin trong bản lưu không hợp lệ.');
    if(b&&(!time(b.untilMs)||!time(b.exhaustUntilMs)||b.exhaustUntilMs-b.untilMs!==60000||b.untilMs>f.clockMs+30000||b.exhaustUntilMs<=f.clockMs||typeof b.exhaustApplied!=='boolean'||b.exhaustApplied!==(f.clockMs>=b.untilMs)))throw new Error('Thời hạn Ban Phước không hợp lệ.');
  }
  if(island.logistics&&(island.logistics.version!==1||island.logistics.completedTrips!==undefined&&(!Number.isSafeInteger(island.logistics.completedTrips)||island.logistics.completedTrips<0)))throw new Error('Hậu cần không hợp lệ.');
  const validSite=(id:string)=>id===WAREHOUSE||island.buildings.some(b=>b.id===id&&b.complete&&b.buffer);
  const validDestination=(id:string,good:keyof typeof GOOD_LABELS)=>id===WAREHOUSE||island.buildings.some(b=>b.id===id&&Boolean(inputsOf(b)[good]));
  for(const b of island.buildings)if(b.buffer){
    if(!island.logistics||!RECIPES[b.type]&&!OUTPUTS[b.type]&&b.type!=='steam_generator'&&b.type!=='resonance_tower'&&b.type!=='quarantine'&&b.type!=='clinic')throw new Error('Kho xưởng không hợp lệ.');
    for(const stock of [b.buffer.input,b.buffer.output])if(!stock||typeof stock!=='object'||Array.isArray(stock)||Object.entries(stock).some(([good,n])=>!Object.prototype.hasOwnProperty.call(GOOD_LABELS,good)||!Number.isFinite(n)||n<0)||sumStock(stock)>BUFFER_CAPACITY+1e-8)throw new Error('Hàng trong xưởng không hợp lệ.');
    for(const good of Object.keys(b.buffer.input))if(!inputsOf(b)[good as keyof typeof GOOD_LABELS])throw new Error('Nguyên liệu xưởng không hợp lệ.');
    for(const good of Object.keys(b.buffer.output))if(!(b.type==='relic_extractor'&&['relicBone','bloodstone'].includes(good))&&good!==(RECIPES[b.type]?.output??OUTPUTS[b.type]))throw new Error('Thành phẩm xưởng không hợp lệ.');
  }
  for(const n of island.npcs){
    if(n.freight&&(!island.logistics||n.cargo||!Object.prototype.hasOwnProperty.call(GOOD_LABELS,n.freight.good)||!Number.isFinite(n.freight.amount)||n.freight.amount<=0||n.freight.amount>30||!validSite(n.freight.target)||!validDestination(n.freight.target,n.freight.good)))throw new Error('Túi hàng hậu cần không hợp lệ.');
    if(n.haulTask&&(!island.logistics||!Object.prototype.hasOwnProperty.call(GOOD_LABELS,n.haulTask.good)||!validSite(n.haulTask.source)||!validSite(n.haulTask.target)||n.haulTask.source===n.haulTask.target||!validDestination(n.haulTask.target,n.haulTask.good)))throw new Error('Chuyến hậu cần không hợp lệ.');
    if(n.laborRole==='haul'&&!island.logistics)throw new Error('Nghề vận chuyển không hợp lệ.');
  }
  const fire = island.dailyLife?.campfire;
  if(island.dailyLife?.settlementVersion!==undefined&&island.dailyLife.settlementVersion!==1)throw new Error('Định cư trong bản lưu không hợp lệ.');
  if(fire){
    if(fire.fuel!==undefined&&(!Number.isFinite(fire.fuel)||fire.fuel<0||fire.fuel>12))throw new Error('Nhiên liệu lửa không hợp lệ.');
    if(fire.graceUntil!==undefined&&(!Number.isSafeInteger(fire.graceUntil)||fire.graceUntil<0||fire.graceUntil>island.tick+30))throw new Error('Thời gian an toàn không hợp lệ.');
    if(fire.lastBurnTick!==undefined&&(!Number.isSafeInteger(fire.lastBurnTick)||fire.lastBurnTick<0||fire.lastBurnTick>island.tick))throw new Error('Thời gian dùng củi không hợp lệ.');
    if(fire.lit!==undefined&&typeof fire.lit!=='boolean')throw new Error('Trạng thái lửa không hợp lệ.');
  }
  if (island.dailyLife && (typeof island.dailyLife !== 'object' || island.dailyLife.campfire === undefined)) throw new Error('Nhịp sống trong bản lưu không hợp lệ.');
  if (fire && (!Number.isSafeInteger(fire.tileX) || !Number.isSafeInteger(fire.tileY) || !['grass','sand','forest'].includes(map.tiles[fire.tileY]?.[fire.tileX]) || island.buildings.some(b => b.tileX === fire.tileX && b.tileY === fire.tileY))) throw new Error('Lửa trại trong bản lưu không hợp lệ.');
  for (const npc of island.npcs) {
    if(npc.equippedTool!==undefined&&!Object.prototype.hasOwnProperty.call(TOOLS,npc.equippedTool))throw new Error('Công cụ trang bị không hợp lệ.');
    if(npc.toolChoice!==undefined&&!['auto','none',...Object.keys(TOOLS)].includes(npc.toolChoice))throw new Error('Lựa chọn công cụ không hợp lệ.');
    if(npc.laborMode!==undefined&&!['auto','manual'].includes(npc.laborMode))throw new Error('Chế độ nghề không hợp lệ.');
    if(npc.autoReason!==undefined&&typeof npc.autoReason!=='string')throw new Error('Lý do nghề không hợp lệ.');
    if(npc.attributes&&['str','dex','int'].some(axis=>!Number.isInteger(npc.attributes![axis as keyof typeof npc.attributes])||npc.attributes![axis as keyof typeof npc.attributes]<1||npc.attributes![axis as keyof typeof npc.attributes]>10))throw new Error('Thuộc tính cư dân không hợp lệ.');
    if(npc.cargo){
      const amounts=['food','wood','stone','herbs'].map(key=>npc.cargo![key as keyof NonNullable<typeof npc.cargo>]);
      if(amounts.some(n=>!Number.isFinite(n)||n<0)||amounts.reduce((sum,n)=>sum+n,0)>30+1e-8)throw new Error('Hàng mang theo không hợp lệ.');
    }
    npc.health ??= 100;
    if (!Number.isFinite(npc.health) || npc.health < 0 || npc.health > 100) throw new Error('Sức khỏe cư dân không hợp lệ.');
    if (npc.lastDinnerDay !== undefined && (!Number.isSafeInteger(npc.lastDinnerDay) || npc.lastDinnerDay < 0 || npc.lastDinnerDay > Math.floor(island.tick / 10))) throw new Error('Bữa ăn trong bản lưu không hợp lệ.');
    if (npc.survival && !['dinner','hunger','rest','health'].includes(npc.survival.reason)) throw new Error('Sinh hoạt cư dân không hợp lệ.');
    npc.survivalBlocked = false; // derived by the next authoritative tick
  }
  if(island.workforce&&(island.workforce.version!==1||typeof island.workforce.enabled!=='boolean'))throw new Error('Tự nhận việc trong bản lưu không hợp lệ.');
  if(island.equipment){
    const gear=island.equipment;if(gear.version!==1||!gear.stock||!gear.crafted)throw new Error('Kho công cụ không hợp lệ.');
    for(const kind of Object.keys(TOOLS) as (keyof typeof TOOLS)[]){
      if(!Number.isSafeInteger(gear.stock[kind])||gear.stock[kind]<0||!Number.isSafeInteger(gear.crafted[kind])||gear.crafted[kind]<0||gear.stock[kind]+island.npcs.filter(n=>n.equippedTool===kind).length!==gear.crafted[kind])throw new Error('Số lượng công cụ không bảo toàn.');
    }
    const order=gear.order;if(order&&(!Object.prototype.hasOwnProperty.call(TOOLS,order.kind)||!island.npcs.some(n=>n.id===order.workerId)||!Number.isFinite(order.workTicks)||order.workTicks<0||order.workTicks>=5))throw new Error('Đơn chế tạo không hợp lệ.');
  }else if(island.npcs.some(n=>n.equippedTool))throw new Error('Trang bị không có kho công cụ.');
  map.landTiles = [];
  map.tiles.forEach((row, y) => row.forEach((tile, x) => { if (['grass','forest','sand'].includes(tile)) map.landTiles.push({x,y}); }));
  if (ensureClayDeposits(map, island.resources)) island.civilization.migrationNotice = [island.civilization.migrationNotice, 'Đã bổ sung mỏ đất sét ven nước cho thế giới cũ.'].filter(Boolean).join(' ');
  if (ensureIronDeposits(map, island.resources)) island.civilization.migrationNotice = [island.civilization.migrationNotice, 'Đã bổ sung nguồn sắt/than vào ô trống; giữ nguyên các tài nguyên cũ.'].filter(Boolean).join(' ');
  return data;
}
export function migrateLegacy(raw: string): SavedWorld {
  const old = JSON.parse(raw);
  if (old.version !== 4 || !old.island || !Array.isArray(old.island.npcs)) throw new Error('Bản lưu cũ không tương thích.');
  const config: WorldConfig = { seed: Number(old.worldSeed) || 42, shape: ['circle','crescent','elongated','archipelago'].includes(old.worldShape) ? old.worldShape : 'circle', size: ['small','medium','large'].includes(old.worldSize) ? old.worldSize : 'medium', startPop: old.island.npcs.length, mode: 'local' };
  const dimensions = {small:[50,35],medium:[80,50],large:[120,80]} as const, [w,h] = dimensions[config.size];
  const map = generateWorldMap(w,h,config.seed,config.shape);
  const island = old.island as Island;
  island.resources = spawnResources(map,config.seed); island.relationships = new Map(); island.civilization = createCivilization();
  if (island.dailyLife) { island.dailyLife.campfire = null; island.npcs.forEach(n => { n.survival = undefined; n.lastDinnerDay = undefined; }); }
  island.civilization.unlocks = (old.unlocks ?? []).filter((id: string) => TECH_TREE.some(t => t.id === id && t.needEra === 0 && t.implemented !== false));
  island.civilization.migrationNotice = 'Đã chuyển bản lưu cũ sang Đồ Đá; giữ dân, công trình, cấp và vật tư. Bản cũ không lưu tài nguyên trên bản đồ/quan hệ nên các dữ liệu đó đã được khởi tạo lại. Thành tích sản xuất bắt đầu từ 0.';
  island.npcs.forEach(n => { n.attackCooldowns = new Map(); n.stealCooldowns = new Map(); n.researching = false; n.position ??= null; n.laborRole ??= 'food'; });
  island.animals ??= []; island.buildings ??= []; island.chronicle ??= [];
  return decodeSave(encodeSave(island,map,config,4));
}
export function readLocalSave(): SavedWorld | null {
  const raw = localStorage.getItem(LOCAL_SAVE_KEY);
  if (raw) return decodeSave(raw);
  const legacy = localStorage.getItem(LEGACY_SAVE_KEY);
  return legacy ? migrateLegacy(legacy) : null;
}
