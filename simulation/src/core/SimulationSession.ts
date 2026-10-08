import {knownTile,refreshVisibility,tickExploration,tickTorches,startExploration,recallExplorer,craftTorch,cancelTorch,chooseTorch,setPatrol,visitDiscovery} from './ExplorationManager';
import {ensureCauseway,startTidalScout,recallTidalScout,tickTides} from './TidalManager';
import {WORLD_STEP_MS} from './WorldClock';
import {startAdaptation,cancelAdaptation,prepareAdaptation,tickAdaptation,type AdaptationMode} from './AdaptationManager';
import {initializeEldritch,tickEldritch,setRelicExtraction,setRelicSafety} from './EldritchManager';
import {requestClinic,prepareClinic,tickClinic} from './ClinicManager';
import {tickCare,startTreatment,craftDefense,chooseDefense,cancelDefense} from './CareManager';
import {initializeSpirit,tickSpirit,setSpiritExtraction} from './SpiritManager';
import {startBranchDevelopment,cancelBranchDevelopment,tickBranchDevelopment} from './AnomalyManager';
import {setProductionQuota} from './ControlManager';
import {startAnalysis,cancelAnalysis,decideSite,cancelFoundation,tickAnalysis} from './AnalysisManager';
import {startSurvey,cancelSurvey,tickSurveys} from './SurveyManager';
import {setPower,tickPower,trackPower,synchronizePower} from './PowerManager';
import {castShield,respondToRaid,tickRaids} from './RaidManager';
import {setReserveTargets} from './reserves';
import {productive,refreshProductionAlerts} from './productionWorkforce';
import {castRainfall,tickWeather,fightForestFire} from './WeatherManager';
import {tickFaith,castBlessing,castIncite,workMultiplier} from './FaithManager';
import {tickLogistics} from './logistics';
// ============================================================
// SimulationSession.ts — authoritative island commands and simulation ticks
// ============================================================

import type { Island, LaborRole, NPC, BuildingType } from './types';
import type { WorldMap } from '../renderer/WorldMap';
import {regionAt} from '../renderer/WorldMap';
import { COMMAND_TERRAIN, COMMAND_YIELD, type NPCCommandType } from '../game/GameState';
import { findPath } from './pathfinding';
import { addEntry } from './chronicle';
import { tick } from './engine';
import { inviteSettler } from './settlers';
import { LABOR_DAILY_OUTPUT } from './labor';
import { tickBuildings, placeBuilding, upgradeBuilding, assignWorker, removeWorker, BUILD_TERRAIN, buildingSiteLock, materialRoom } from '../renderer/BuildingManager';
import { tickCivilization, startEraDevelopment } from './civilization';
import { TECH_TREE, startResearch, tickResearch } from './research';
import { createGameState } from '../game/GameState';
import { startTrade, cancelTrade } from './trade';
import { tickDailyLife, establishCampfire, movementSteps } from './dailyLife';
import { tickCargo, CARGO_LIMIT, STARTER_OUTPUT } from './settlement';
import {initializeWorkforce,planWorkforce,attributeBonus} from './workforce';
import {TOOLS,startToolCraft,cancelToolCraft,tickToolCraft,tickEquipment,harvestToolMultiplier} from './equipment';

export type PlayerCommand =
 | {type:'tidal_scout';npcId:string}
 | {type:'recall_tidal_scout'}
 | {type:'explore';npcId:string;tileX:number;tileY:number}
 | {type:'recall_explorer'}
 | {type:'set_patrol';npcId:string;enabled:boolean}
 | {type:'visit_discovery';npcId:string;pointId:string}
 | {type:'craft_torch';npcId:string}
 | {type:'cancel_torch'}
 | {type:'choose_torch';npcId:string;equip:boolean;refill?:boolean}
  | {type:'start_analysis';siteId:string;labId:string}
  | {type:'set_spirit_extraction';buildingId:string;enabled:boolean}
  | {type:'start_branch';branch:string;labId:string}
  | {type:'cancel_branch'}
  | {type:'set_production_quota';buildingId:string;batches:number|null}
  | {type:'cancel_analysis'}
  | {type:'decide_site';siteId:string;decision:'research'|'contain'|'ignore';labId?:string}
  | {type:'cancel_foundation'}
  | {type:'start_survey';siteId:string;npcId:string}
  | {type:'cancel_survey'}
  | {type:'set_power';buildingId:string;enabled:boolean;priority:number}
  | {type:'start_adaptation';npcId:string;labId:string;mode:AdaptationMode}
  | {type:'cancel_adaptation'}
  | {type:'set_relic_safety';buildingId:string;enabled:boolean}
  | {type:'set_relic_extraction';buildingId:string;enabled:boolean}
  | {type:'request_clinic';npcId:string;clinicId:string}
  | {type:'cancel_clinic';npcId:string}
  | {type:'treat_npc';npcId:string}
  | {type:'cancel_treatment';npcId:string}
  | {type:'cancel_defense'}
  | {type:'craft_defense';kind:import('./CareManager').DefenseKind}
  | {type:'choose_defense';npcId:string;kind:import('./CareManager').DefenseKind;equip:boolean}
  | {type:'cast_incite'}
  | {type:'cast_shield'}
  | {type:'set_guard';npcId:string;enabled:boolean}
  | {type:'set_reserve_targets';targets:Partial<Record<import('./types').LogisticsGood,number>>}
  | {type:'reset_reserve_targets'}
  | {type:'cast_blessing'}
  | {type:'cast_rainfall'}
  | {type:'set_building_auto';buildingId:string;enabled:boolean}
  | {type:'craft_tool';kind:import('./types').ToolKind}
  | {type:'cancel_tool_craft'}
  | {type:'assign_tool_crafter';npcId:string}
  | {type:'choose_tool';npcId:string;choice:'auto'|'none'|import('./types').ToolKind}
  | {type:'set_auto_claim';enabled:boolean}
  | {type:'set_labor_mode';npcId:string;mode:'auto'|'manual'}
  | { type: 'start_trade'; buildingId:string; offerId:string }
  | { type: 'cancel_trade'; buildingId:string }
  | { type: 'start_research'; techId: string }
  | { type: 'assign_researcher'; npcId: string }
  | { type: 'develop_era' }
  | { type: 'build'; buildingType: BuildingType; tileX: number; tileY: number }
  | { type: 'upgrade_building'; buildingId: string }
  | { type: 'assign_worker'; buildingId: string; npcId: string }
  | { type: 'remove_worker'; buildingId: string; npcId: string }
  | { type: 'invite_settler'; tileX: number; tileY: number }
  | { type: 'assign_labor'; npcId: string; role: LaborRole }
  | { type: 'place_npc'; npcId: string; tileX: number; tileY: number }
  | { type: 'manual_action'; npcId: string; action: NPCCommandType };

export interface CommandEnvelope {
  /** Must be derived from authenticated server context in production. */
  playerId: string;
  sequence: number;
  expectedRevision?: number;
  command: PlayerCommand;
}

export interface CommandResult {
  accepted: boolean;
  revision: number;
  reason?: string;
  duplicate?: boolean;
}

export interface SessionSnapshot {
  revision: number;
  /** JSON-safe state; Map values are represented as { __type: 'Map', entries }. */
  island: Record<string, unknown>;
}

const LABOR_ROLES = new Set<LaborRole>(['food', 'wood', 'stone', 'haul', 'idle']);
const MAX_TICKS_PER_ADVANCE = 10;
const RESOURCE_FOR_ACTION: Partial<Record<NPCCommandType, string>> = {
  gather_food: 'herb_patch',
  chop_wood: 'wood_tree',
  gather_stone: 'stone_deposit',
  fish: 'fish_spot',
};

/** Owns one island's state and only exposes mutations through commands/ticks. */
export class SimulationSession {
  private _revision = 0;
  private readonly lastSequenceByPlayer = new Map<string, number>();
  private readonly resultsByCommand = new Map<string, CommandResult>();

  constructor(
    private readonly island: Island,
    private readonly worldMap?: WorldMap,
    private readonly harvestMultiplier: () => number = () => 1,
  ) {island.clock??={version:1,progressMs:0};if(worldMap){ensureCauseway(worldMap);if(worldMap.causeway)island.tides??={version:1,completed:0,message:'Bãi cạn mở 09:00–15:00. Chuẩn bị thức ăn cho hai đợt nước rút.'};}}

  advanceTime(ms:number,runAI=false):{revision:number;tick:number}{
    if(!Number.isFinite(ms)||ms<0||ms>WORLD_STEP_MS*10)throw new RangeError('Elapsed time outside the bounded clock.');
    const clock=this.island.clock!;clock.progressMs+=ms;
    while(clock.progressMs>=WORLD_STEP_MS){clock.progressMs-=WORLD_STEP_MS;this.advanceTicks(1,runAI);}
    if(ms>0)this._revision++;
    return {revision:this._revision,tick:this.island.tick};
  }

  get revision(): number { return this._revision; }

  snapshot(): SessionSnapshot {
    const json = JSON.stringify(this.island, (_key, value: unknown) =>
      value instanceof Map ? { __type: 'Map', entries: [...value.entries()] } : value,
    );
    return { revision: this._revision, island: JSON.parse(json) as Record<string, unknown> };
  }

  submit(envelope: CommandEnvelope): CommandResult {
    if (!envelope || typeof envelope.playerId !== 'string' || !envelope.playerId.trim() ||
        !Number.isSafeInteger(envelope.sequence) || envelope.sequence < 1 ||
        (envelope.expectedRevision !== undefined && (!Number.isSafeInteger(envelope.expectedRevision) || envelope.expectedRevision < 0)) ||
        !envelope.command || typeof envelope.command !== 'object') {
      return { accepted: false, revision: this._revision, reason: 'invalid_envelope' };
    }

    const key = `${envelope.playerId}:${envelope.sequence}`;
    const previous = this.resultsByCommand.get(key);
    if (previous) return { ...previous, duplicate: true };
    const lastSequence = this.lastSequenceByPlayer.get(envelope.playerId) ?? 0;
    if (envelope.sequence <= lastSequence) return { accepted: false, revision: this._revision, reason: 'out_of_order' };
    if (envelope.expectedRevision !== undefined && envelope.expectedRevision !== this._revision) {
      return { accepted: false, revision: this._revision, reason: 'stale_revision' };
    }

    const applied = this.apply(envelope.command);
    if (!applied.accepted) return { ...applied, revision: this._revision };
    synchronizePower(this.island);
    if(this.worldMap)refreshProductionAlerts(this.island,this.worldMap);
    this.lastSequenceByPlayer.set(envelope.playerId, envelope.sequence);
    this._revision += 1;
    const result = { accepted: true, revision: this._revision } satisfies CommandResult;
    this.resultsByCommand.set(key, result);
    if (this.resultsByCommand.size > 1024) {
      const oldest = this.resultsByCommand.keys().next().value;
      if (oldest) this.resultsByCommand.delete(oldest);
    }
    return result;
  }

  /** The server clock is the sole caller in server mode. */
  advanceTicks(count = 1, runAI = false): { revision: number; tick: number } {
    if (!Number.isSafeInteger(count) || count < 1 || count > MAX_TICKS_PER_ADVANCE) {
      throw new RangeError(`advanceTicks count must be between 1 and ${MAX_TICKS_PER_ADVANCE}.`);
    }
    for (let i = 0; i < count; i++) {
      if (this.worldMap) this.worldMap.bridges = new Set(this.island.buildings.filter(b => b.complete && b.type === 'bridge').map(b => `${b.tileX},${b.tileY}`));
      tick(this.island, { runAI: runAI || Boolean(this.island.civilization), mapLabor: Boolean(this.worldMap) });
      // These flags belong to one interval, including legacy worlds without daily life.
      for(const n of this.island.npcs)n.survivalBlocked=false;
      if (this.worldMap) tickDailyLife(this.island, this.worldMap);
      if(this.worldMap)tickTides(this.island,this.worldMap);
      if(this.worldMap){tickExploration(this.island,this.worldMap);tickTorches(this.island,this.worldMap);}
      if(this.worldMap)prepareAdaptation(this.island,this.worldMap);
      if(this.worldMap)prepareClinic(this.island,this.worldMap);
      if(this.worldMap)tickCare(this.island,this.worldMap);
      if(this.worldMap)respondToRaid(this.island,this.worldMap);
      if (this.worldMap && (this.island.dailyLife?.settlementVersion===1 || this.island.npcs.some(n=>n.cargo))) tickCargo(this.island,this.worldMap);
      if(this.worldMap)fightForestFire(this.island,this.worldMap);
      if(this.worldMap)tickToolCraft(this.island,this.worldMap);
      if(this.worldMap)planWorkforce(this.island,this.worldMap);
      if(this.worldMap)tickEquipment(this.island,this.worldMap);
      if(this.worldMap)tickLogistics(this.island,this.worldMap);
      tickPower(this.island);
      initializeSpirit(this.island);
      initializeEldritch(this.island);
      this.planLabor();
      this.advanceNpcOrders();
      if (this.worldMap) tickBuildings(this.island, this.island.resources, this.worldMap);
      tickClinic(this.island);
      tickAdaptation(this.island);
      tickSpirit(this.island);
      tickEldritch(this.island);
      this.advanceResearch();
      if(this.worldMap)tickSurveys(this.island,this.worldMap);
      tickAnalysis(this.island);
      trackPower(this.island);
      tickCivilization(this.island);
      tickBranchDevelopment(this.island);
      this.regenerateResources();
      this.placeNewborns();
      if(this.worldMap)tickRaids(this.island,this.worldMap);
      tickWeather(this.island);
      tickFaith(this.island);
      if(this.worldMap)refreshVisibility(this.island,this.worldMap);
    }
    this._revision += count;
    return { revision: this._revision, tick: this.island.tick };
  }

  private apply(command: PlayerCommand): CommandResult {
    const result = (reason?: string | null): CommandResult => ({ accepted: !reason, revision: this._revision, ...(reason ? { reason } : {}) });
    if(command?.type==='recall_tidal_scout')return result(recallTidalScout(this.island));
    if(command&&'npcId' in command&&this.island.tides?.active?.npcId===command.npcId)return result('Cư dân đang qua bãi cạn; gọi về và chờ họ về làng trước khi đổi việc.');
    if(command?.type==='tidal_scout')return result(startTidalScout(this.island,this.worldMap,command.npcId));
    if(command?.type==='recall_explorer')return result(recallExplorer(this.island));
    if(command?.type==='set_patrol')return result(setPatrol(this.island,this.worldMap,command.npcId,command.enabled));
    if(command?.type==='cancel_torch')return result(cancelTorch(this.island));
    if(command&&'npcId' in command&&(this.island.exploration?.active?.npcId===command.npcId||this.island.exploration?.torchOrder?.npcId===command.npcId||this.island.exploration?.patrol?.enabled&&this.island.exploration.patrol.npcId===command.npcId))return result('Cư dân đang khám phá/chế đuốc/tuần tra; dừng tuần tra, gọi về hoặc hủy đơn trước khi đổi việc.');
    if(command?.type==='visit_discovery')return result(visitDiscovery(this.island,this.worldMap,command.npcId,command.pointId));
    if(command?.type==='explore')return result(startExploration(this.island,this.worldMap,command.npcId,command.tileX,command.tileY));
    if(command?.type==='craft_torch')return result(craftTorch(this.island,this.worldMap,command.npcId));
    if(command?.type==='choose_torch')return result(chooseTorch(this.island,command.npcId,command.equip,command.refill));
    if(command?.type==='build'&&!knownTile(this.island,command.tileX,command.tileY))return result('Khám phá vùng đất trước khi xây.');
    if(command?.type==='set_spirit_extraction')return result(setSpiritExtraction(this.island,command.buildingId,command.enabled));
    if(command?.type==='start_branch')return result(startBranchDevelopment(this.island,command.branch,command.labId));
    if(command?.type==='cancel_branch')return result(cancelBranchDevelopment(this.island));
    if(command?.type==='set_production_quota')return result(setProductionQuota(this.island,command.buildingId,command.batches));
    if(command?.type==='start_analysis')return result(startAnalysis(this.island,command.siteId,command.labId));
    if(command?.type==='decide_site')return result(decideSite(this.island,command.siteId,command.decision,command.labId));
    if(command?.type==='cancel_foundation')return result(cancelFoundation(this.island));
    if(command?.type==='cancel_analysis')return result(cancelAnalysis(this.island));
    if(command?.type==='cancel_survey')return result(cancelSurvey(this.island));
    if(command&&'npcId' in command&&this.island.surveys?.active?.npcId===command.npcId)return result('Cư dân đang đi khảo sát; hủy chuyến trước khi đổi việc.');
    if(command?.type==='start_survey')return result(startSurvey(this.island,this.worldMap,command.siteId,command.npcId));
    if(command?.type==='start_trade')return result(startTrade(this.island,this.worldMap,command.buildingId,command.offerId));
    if(command?.type==='cancel_trade'){
      const b=this.island.buildings.find(b=>b.id===command.buildingId);return result(b ? cancelTrade(this.island,b) : 'Trạm không tồn tại.');
    }
    if (command && ['build','upgrade_building','assign_worker','remove_worker','assign_researcher'].includes(command.type) && !this.island.civilization) return result('Hệ thống kỷ nguyên mới chưa được nối với chế độ này.');
    if (command?.type === 'develop_era') return result(startEraDevelopment(this.island));
    if (command?.type === 'assign_researcher') {
      const research = this.island.civilization?.research;
      const npc = this.island.npcs.find(n => n.id === command.npcId && n.isAlive && n.position && n.age >= 18 && n.occupation !== 'child');
      if (!research || !npc || this.island.adaptationProcess?.npcId===npc.id || npc.clinicalCare || npc.treatment || npc.defenseChoice || this.island.defense?.order?.npcId===npc.id || this.island.buildings.some(b => b.workers.includes(npc.id))) return result('Chọn người trưởng thành không làm ở công trình.');
      const previous = this.island.npcs.find(n=>n.id===research.researcherId); if (previous) previous.researching = false;
      research.researcherId = npc.id; npc.researching = true; this.clearOrder(npc); npc.buildingWork = undefined;
      return result();
    }
    if (command?.type === 'start_research') {
      const c = this.island.civilization, tech = TECH_TREE.find(t => t.id === command.techId);
      if (!c || !tech || c.research || c.transition || c.branchDevelopment) return result('Nghiên cứu không khả dụng hoặc đang có dự án.');
      const gs = createGameState(); gs.unlocks = new Set(c.unlocks);
      const stats = { population: this.island.npcs.filter(n => n.isAlive).length, sharedFood: this.island.sharedFood, wood: this.island.wood, stone: this.island.stone, herbs: this.island.herbs, buildingCount: this.island.buildings.length, completedBuildingCount: this.island.buildings.filter(b => b.complete).length, elderCount: 0, daysPassed: Math.floor(this.island.tick / 10) + 1, maxGeneration: 0, maxAdultGeneration: 0, domesticatedSpecies: 0 };
      const progress = startResearch(tech, this.island, gs, stats, stats.daysPassed);
      if (!progress) return result('Chưa đủ điều kiện, vật liệu hoặc người trưởng thành rảnh để nghiên cứu.');
      c.research = progress; return result();
    }
    if (command?.type === 'build') {
      const map = this.worldMap, x = command.tileX, y = command.tileY;
      if (!map || !Number.isSafeInteger(x) || !Number.isSafeInteger(y) || !Array.isArray(BUILD_TERRAIN[command.buildingType]) || !BUILD_TERRAIN[command.buildingType].includes(map.tiles[y]?.[x])) return result('Địa hình không phù hợp.');
      if (this.island.dailyLife?.campfire?.tileX === x && this.island.dailyLife.campfire.tileY === y) return result('Ô đất dành cho Lửa Trại Khởi Nguyên.');
      if (this.island.npcs.some(n => n.isAlive && n.position?.tileX === x && n.position?.tileY === y) || this.island.animals.some(a => a.isAlive && a.tileX === x && a.tileY === y)) return result('Ô đất đã có sinh vật.');
      const siteLock = buildingSiteLock(this.island, command.buildingType, x, y);
      if (siteLock) return result(siteLock);
      return result(placeBuilding(this.island, command.buildingType, x, y) ? null : 'Công trình chưa mở khóa, thiếu vật liệu hoặc ô đất đã có công trình.');
    }
    if (command?.type === 'upgrade_building') return result(upgradeBuilding(this.island, command.buildingId));
    if(command?.type==='set_reserve_targets'){if(!this.island.workforce)return result('Điều hành làng chưa hoạt động.');return result(setReserveTargets(this.island,command.targets));}
    if(command?.type==='reset_reserve_targets'){this.island.reserves=undefined;return result();}
    if(command?.type==='set_building_auto'){const b=this.island.buildings.find(b=>b.id===command.buildingId);if(!b||typeof command.enabled!=='boolean'||!this.island.workforce)return result('Chọn công trình có hệ phân công cục bộ.');b.autoStaff=command.enabled;return result();}
    if (command?.type === 'assign_worker') return result(assignWorker(this.island, command.buildingId, command.npcId) ? null : 'Không thể phân công người này.');
    if (command?.type === 'remove_worker') { const b = this.island.buildings.find(b => b.id === command.buildingId); if (!b?.workers.includes(command.npcId)) return result('Không có phân công này.'); removeWorker(this.island, b.id, command.npcId); return result(); }
    if(command?.type==='craft_tool')return result(startToolCraft(this.island,command.kind));
    if(command?.type==='cancel_tool_craft')return result(cancelToolCraft(this.island));
    if(command?.type==='choose_tool'){
      const npc=this.findLivingNpc(command.npcId);
      if(!this.island.equipment||!npc||npc.age<18||npc.occupation==='child'||!['auto','none',...Object.keys(TOOLS)].includes(command.choice))return result('Chọn công cụ cho người trưởng thành.');
      npc.toolChoice=command.choice;return result();
    }
    if(command?.type==='assign_tool_crafter'){
      const order=this.island.equipment?.order,npc=this.findLivingNpc(command.npcId);
      if(!order||!npc||this.island.adaptationProcess?.npcId===npc.id||!npc.position||npc.age<18||npc.occupation==='child'||npc.cargo||npc.freight||npc.haulTask||npc.actionTarget||npc.researching||this.island.buildings.some(b=>b.workers.includes(npc.id)))return result('Chọn người trưởng thành rảnh, đã giao xong hàng.');
      order.workerId=npc.id;return result();
    }
    if(command?.type==='set_auto_claim'){
      if(!this.island.civilization||this.island.dailyLife?.settlementVersion!==1||typeof command.enabled!=='boolean')return result('Tự nhận việc cần chế độ định cư cục bộ.');
      initializeWorkforce(this.island);this.island.workforce!.enabled=command.enabled;return result();
    }
    if(command?.type==='set_labor_mode'){
      const npc=this.findLivingNpc(command.npcId);
      if(!this.island.workforce||!npc||npc.age<18||npc.occupation==='child'||!['auto','manual'].includes(command.mode))return result('Chọn chế độ làm việc cho người trưởng thành.');
      npc.laborMode=command.mode;npc.autoReason=undefined;for(const b of this.island.buildings){if(command.mode==='manual')b.autoWorkers=b.autoWorkers?.filter(id=>id!==npc.id);else if(b.complete&&!b.upgrade&&productive(b)&&b.workers.includes(npc.id)){b.autoWorkers??=[];if(!b.autoWorkers.includes(npc.id))b.autoWorkers.push(npc.id);}}
      if(!npc.actionTarget)npc.laborRetryAt=0;
      return result();
    }
    if (command?.type === 'invite_settler') {
      if (!this.worldMap) return { accepted: false, revision: this._revision, reason: 'invalid_map' };
      const reason = inviteSettler(this.island, this.worldMap, command.tileX, command.tileY);
      return { accepted: !reason, revision: this._revision, ...(reason ? { reason } : {}) };
    }
    if(command.type==='set_power'){const reason=setPower(this.island,command.buildingId,command.enabled,command.priority);return {accepted:!reason,revision:this._revision,...(reason?{reason}:{})};}
    if(command.type==='start_adaptation')return result(startAdaptation(this.island,command.npcId,command.labId,command.mode));
    if(command.type==='cancel_adaptation')return result(cancelAdaptation(this.island));
    if(command.type==='set_relic_safety')return result(setRelicSafety(this.island,command.buildingId,command.enabled));
    if(command.type==='set_relic_extraction')return result(setRelicExtraction(this.island,command.buildingId,command.enabled));
    if(command.type==='request_clinic')return result(requestClinic(this.island,command.npcId,command.clinicId));
    if(command.type==='cancel_clinic'){const n=this.island.npcs.find(n=>n.id===command.npcId);if(!n?.clinicalCare)return result('Không có lịch khám.');n.clinicalCare=undefined;n.clinicReady=false;return result();}
    if(command.type==='treat_npc')return result(startTreatment(this.island,command.npcId));
    if(command.type==='cancel_treatment'){const n=this.island.npcs.find(n=>n.id===command.npcId);if(!n?.treatment)return result('Không có liệu trình.');n.treatment=undefined;return result();}
    if(command.type==='cancel_defense')return result(cancelDefense(this.island));
    if(command.type==='craft_defense')return result(craftDefense(this.island,command.kind));
    if(command.type==='choose_defense')return result(chooseDefense(this.island,command.npcId,command.kind,command.equip));
    if(command.type==='cast_incite')return result(castIncite(this.island));
    if(command.type==='cast_shield'){const reason=castShield(this.island);return {accepted:!reason,revision:this._revision,...(reason?{reason}:{})};}
    if(command.type==='set_guard'){const n=this.island.npcs.find(n=>n.id===command.npcId);if(!this.island.raids||!n?.isAlive||!n.position||n.age<18||n.occupation==='child'||typeof command.enabled!=='boolean'||command.enabled&&this.island.adaptationProcess?.npcId===n.id)return {accepted:false,revision:this._revision,reason:'Cần cư dân trưởng thành đã định cư.'};n.guardDuty=command.enabled;return {accepted:true,revision:this._revision};}
    if(command.type==='cast_rainfall'){const reason=castRainfall(this.island);return {accepted:!reason,revision:this._revision,...(reason?{reason}:{})};}
    if(command.type==='cast_blessing'){const reason=castBlessing(this.island);return {accepted:!reason,revision:this._revision,...(reason?{reason}:{})};}
    if (!command || typeof command !== 'object' || typeof command.npcId !== 'string') {
      return { accepted: false, revision: this._revision, reason: 'invalid_command' };
    }
    if (command.type === 'assign_labor') {
      if (!LABOR_ROLES.has(command.role)) return { accepted: false, revision: this._revision, reason: 'invalid_role' };
      const npc = this.findLivingNpc(command.npcId);
      if (!npc) return { accepted: false, revision: this._revision, reason: 'npc_missing' };
      if (npc.age < 18 || npc.occupation === 'child') return { accepted: false, revision: this._revision, reason: 'npc_not_working_age' };
      if(command.role==='haul'&&!this.island.logistics)return {accepted:false,revision:this._revision,reason:'logistics_unavailable'};
      npc.laborRole = command.role;
      if(!npc.freight)npc.haulTask=undefined;
      npc.laborMode='manual';npc.autoReason=undefined;
      if (npc.laborTask) this.clearOrder(npc);
      npc.laborRetryAt = 0;
      npc.laborMessage = command.role === 'idle' ? 'Đang nghỉ' : 'Đang tìm nơi làm việc';
      return { accepted: true, revision: this._revision };
    }
    if (command.type === 'place_npc') return this.placeNpc(command.npcId, command.tileX, command.tileY);
    if (command.type === 'manual_action') return this.issueManualAction(command.npcId, command.action);
    return { accepted: false, revision: this._revision, reason: 'invalid_command' };
  }

  private placeNpc(npcId: string, tileX: number, tileY: number): CommandResult {
    if (!this.worldMap) return { accepted: false, revision: this._revision, reason: 'invalid_map' };
    const npc = this.findLivingNpc(npcId);
    if (!npc) return { accepted: false, revision: this._revision, reason: 'npc_missing' };
    if (npc.position) return { accepted: false, revision: this._revision, reason: 'already_placed' };
    if(this.worldMap.archipelago&&regionAt(this.worldMap,tileX,tileY)?.id!=='thien-nguyen')return {accepted:false,revision:this._revision,reason:'Dân khởi đầu định cư trên Thiên Nguyên; chưa có đường vượt biển.'};
    const tile = this.worldMap.tiles[tileY]?.[tileX];
    if (!Number.isSafeInteger(tileX) || !Number.isSafeInteger(tileY) || !tile || !['grass', 'sand', 'forest'].includes(tile)) {
      return { accepted: false, revision: this._revision, reason: 'invalid_tile' };
    }
    if (this.island.npcs.some(other => other.isAlive && other.id !== npcId && other.position?.tileX === tileX && other.position?.tileY === tileY)) {
      return { accepted: false, revision: this._revision, reason: 'tile_occupied' };
    }
    npc.position = { tileX, tileY };
    establishCampfire(this.island, this.worldMap);
    refreshVisibility(this.island,this.worldMap);
    return { accepted: true, revision: this._revision };
  }

  private issueManualAction(npcId: string, action: NPCCommandType): CommandResult {
    const npc = this.findLivingNpc(npcId);
    if (!npc) return { accepted: false, revision: this._revision, reason: 'npc_missing' };
    if(npc.cargo||npc.freight)return {accepted:false,revision:this._revision,reason:'deliver_cargo_first'};
    if (typeof action !== 'string' || !(action in COMMAND_TERRAIN)) return { accepted: false, revision: this._revision, reason: 'invalid_action' };
    if (action === 'rest') {
      npc.laborMode='manual';npc.autoReason=undefined;
      this.clearOrder(npc);
      npc.laborRetryAt = this.island.tick + 10;
      npc.needs.rest = Math.max(0, npc.needs.rest - 30);
      npc.status = 'sleeping';
      npc.lastAction = action;
      return { accepted: true, revision: this._revision };
    }
    if (action === 'talk') {
      const result = this.talk(npc);
      if (result.accepted) { npc.laborMode='manual';npc.autoReason=undefined;this.clearOrder(npc); npc.laborRetryAt = this.island.tick + 5; }
      return result;
    }
    if (!npc.position || !this.worldMap) return { accepted: false, revision: this._revision, reason: 'npc_not_placed' };
    const resourceType = RESOURCE_FOR_ACTION[action];
    const output = COMMAND_YIELD[action];
    if (!resourceType || !output) return { accepted: false, revision: this._revision, reason: 'invalid_action' };

    const targets = [...this.island.resources.entries()]
      .filter(([key, node]) => node.type === resourceType && node.amount > 0 && knownTile(this.island,...key.split(',').map(Number) as [number,number]))
      .map(([key]) => {
        const [tileX, tileY] = key.split(',').map(Number);
        const path = findPath(this.worldMap!, npc.position!.tileX, npc.position!.tileY, tileX, tileY);
        return { tileX, tileY, path };
      })
      .filter((target): target is { tileX: number; tileY: number; path: NonNullable<ReturnType<typeof findPath>> } => target.path !== null)
      .sort((a, b) => a.path.length - b.path.length);
    const target = targets[0];
    if (!target) return { accepted: false, revision: this._revision, reason: 'no_resource_available' };
    npc.laborMode='manual';npc.autoReason=undefined;
    this.clearOrder(npc);
    npc.path = [...target.path];
    npc.actionTarget = { type: action, x: target.tileX, y: target.tileY };
    npc.status = 'working';
    npc.lastAction = action;
    if (!npc.path.length) this.completeGathering(npc);
    return { accepted: true, revision: this._revision };
  }

  private talk(npc: NPC): CommandResult {
    if (!npc.position) return { accepted: false, revision: this._revision, reason: 'npc_not_placed' };
    const nearby = this.island.npcs
      .filter(other => other.isAlive && other.id !== npc.id && other.position)
      .map(other => ({
        other,
        distance: Math.max(Math.abs(other.position!.tileX - npc.position!.tileX), Math.abs(other.position!.tileY - npc.position!.tileY)),
      }))
      .filter(item => item.distance <= 4)
      .sort((a, b) => a.distance - b.distance)[0]?.other;
    if (!nearby) return { accepted: false, revision: this._revision, reason: 'no_nearby_npc' };
    npc.needs.social = Math.max(0, npc.needs.social - 30);
    nearby.needs.social = Math.max(0, nearby.needs.social - 15);
    npc.status = nearby.status = 'chatting';
    const key = npc.id < nearby.id ? `${npc.id}:${nearby.id}` : `${nearby.id}:${npc.id}`;
    const relationship = this.island.relationships.get(key) ?? { npcIdA: npc.id, npcIdB: nearby.id, score: 0 };
    relationship.score = Math.min(100, relationship.score + 5);
    this.island.relationships.set(key, relationship);
    return { accepted: true, revision: this._revision };
  }

  private advanceNpcOrders(): void {
    for (const npc of this.island.npcs) {
      if (!npc.isAlive || !npc.position || !npc.actionTarget) continue;
      if (npc.survivalBlocked) continue;
      if (!npc.path) {
        const path = this.worldMap ? findPath(this.worldMap, npc.position.tileX, npc.position.tileY, npc.actionTarget.x, npc.actionTarget.y) : [];
        if (path === null) { npc.laborMessage = 'Không có đường trở lại công việc'; continue; }
        npc.path = path;
      }
      if (npc.status === 'sleeping' || npc.status === 'eating' || npc.needs.hunger >= 95) {
        npc.laborMessage = 'Tạm dừng để ăn hoặc nghỉ';
        continue;
      }
      if (npc.path?.length) {
        const next = npc.path.splice(0,movementSteps(npc,this.island)).pop()!;
        npc.position = { tileX: next.x, tileY: next.y };
        npc.status = 'working';
        if (npc.laborTask) npc.laborMessage = 'Đang đi đến tài nguyên';
        if (!npc.path.length && !npc.laborTask) this.completeGathering(npc);
        continue;
      }
      if (npc.laborTask) {
        npc.status = 'working';
        const duration = npc.laborTask.totalTicks ?? 10;
        npc.laborMessage = `Đang thu hoạch · ${duration + 1 - npc.laborTask.workTicks}/${duration}`;
        npc.laborTask.workTicks=Math.max(0,npc.laborTask.workTicks-workMultiplier(this.island,npc));
        if (npc.laborTask.workTicks === 0) this.completeGathering(npc);
      } else this.completeGathering(npc);
    }
  }

  private clearOrder(npc: NPC): void {
    npc.path = undefined;
    npc.actionTarget = undefined;
    npc.laborTask = undefined;
  }

  private planLabor(): void {
    if (!this.worldMap) return;
    const buildingWorkers = new Set(this.island.buildings.flatMap(b => b.workers));
    if(this.island.equipment?.order)buildingWorkers.add(this.island.equipment.order.workerId);
    if(this.island.defense?.order)buildingWorkers.add(this.island.defense.order.npcId);
    for (const npc of this.island.npcs) {
      if (npc.survivalBlocked) continue;
      if(npc.cargo||npc.freight||npc.laborRole==='haul')continue;
      if (!npc.isAlive || npc.age < 18 || npc.occupation === 'child' || !npc.position ||
          npc.laborRole === 'idle' || buildingWorkers.has(npc.id) || npc.researching) {
        if (npc.laborTask) this.clearOrder(npc);
        npc.laborMessage = !npc.position ? 'Chưa được đặt lên đảo' : npc.researching ? 'Đang nghiên cứu' : buildingWorkers.has(npc.id) ? 'Đang làm tại công trình' : 'Đang nghỉ';
        continue;
      }
      if (npc.actionTarget || (npc.laborRetryAt ?? 0) > this.island.tick) continue;
      const actions: NPCCommandType[] = npc.laborRole === 'food' ? ['gather_food', 'fish'] :
        npc.laborRole === 'wood' ? ['chop_wood'] : ['gather_stone'];
      const candidates = [...this.island.resources.entries()].flatMap(([key, node]) => {
        const action = actions.find(a => RESOURCE_FOR_ACTION[a] === node.type);
        if (!action || node.amount <= 0) return [];
        const coords=key.split(',').map(Number);if(!knownTile(this.island,coords[0],coords[1]))return [];
        const [x, y] = key.split(',').map(Number);
        return [{ x, y, action, distance: Math.max(Math.abs(x - npc.position!.tileX), Math.abs(y - npc.position!.tileY)) }];
      }).sort((a, b) => a.distance - b.distance);
      const free = candidates.filter(t => !this.island.npcs.some(other => other.isAlive && other.id !== npc.id && other.actionTarget?.x === t.x && other.actionTarget?.y === t.y));
      let found = false;
      for (const target of free) {
        const path = findPath(this.worldMap, npc.position.tileX, npc.position.tileY, target.x, target.y);
        if (path === null) continue;
        npc.path = path;
        npc.actionTarget = { type: target.action, x: target.x, y: target.y };
        // Five daytime work steps per day: preserve the previous daily output.
        const duration = this.island.dailyLife ? 5 : 10;
        npc.laborTask = { workTicks: duration, totalTicks: duration };
        npc.lastAction = target.action;
        npc.laborMessage = path.length ? 'Đang đi đến tài nguyên' : 'Đang thu hoạch';
        found = true;
        break;
      }
      if (!found) {
        npc.laborMessage = !candidates.length ? 'Hết tài nguyên phù hợp' : !free.length ? 'Chờ nơi thu hoạch trống' : 'Không có đường đến tài nguyên';
        npc.laborRetryAt = this.island.tick + 10;
      }
    }
  }

  private completeGathering(npc: NPC): void {
    const target = npc.actionTarget;
    if (!target || !npc.position || Math.max(Math.abs(target.x - npc.position.tileX), Math.abs(target.y - npc.position.tileY)) > 1) return;
    const action = target.type as NPCCommandType;
    const role = npc.laborRole;
    const dailyOutput=this.island.dailyLife?.settlementVersion===1?STARTER_OUTPUT:LABOR_DAILY_OUTPUT;
    const output = npc.laborTask && role !== 'idle'
      ? role === 'food' ? { food: dailyOutput.food, herbs: action === 'gather_food' ? 0.5 : 0 }
        : role === 'wood' ? { wood: dailyOutput.wood } : { stone: dailyOutput.stone }
      : COMMAND_YIELD[action];
    const node = this.island.resources.get(`${target.x},${target.y}`);
    if (!node || node.amount <= 0 || !output) {
      npc.path = undefined;
      npc.actionTarget = undefined;
      npc.laborTask = undefined;
      npc.laborMessage = 'Tài nguyên đã hết · đang tìm nơi khác';
      npc.status = 'idle';
      return;
    }
    const toolApplies = action === 'chop_wood' || action === 'gather_stone';
    const multiplier = (this.island.civilization ? harvestToolMultiplier(this.island,npc,action) : Math.max(1, this.harvestMultiplier()))*attributeBonus(npc,toolApplies?'str':'dex');
    const nominalYield = (output.food ?? output.wood ?? output.stone ?? output.herbs ?? 1) * multiplier;
    const settlement=this.island.dailyLife?.settlementVersion===1;
    const carryFraction=settlement?Math.min(1,CARGO_LIMIT/(Object.values(output).reduce((sum,n)=>sum+n,0)*multiplier)):1;
    const available=settlement&&output.wood?materialRoom(this.island,'wood'):settlement&&output.stone?materialRoom(this.island,'stone'):settlement&&output.herbs&&!output.food?materialRoom(this.island,'herbs'):Infinity;
    const amount = Math.min(node.amount, nominalYield*carryFraction,available);
    if(amount<=0){npc.laborMessage='Kho vật liệu đã đầy · chờ chỗ trống';npc.status='idle';return;}
    const fraction = amount / nominalYield;
    node.amount = Math.max(0, node.amount - amount);
    if(settlement){
      npc.cargo={food:(output.food??0)*multiplier*fraction,wood:(output.wood??0)*multiplier*fraction,stone:(output.stone??0)*multiplier*fraction,herbs:Math.min((output.herbs??0)*multiplier*fraction,materialRoom(this.island,'herbs'))};
    }else{
    this.island.sharedFood += (output.food ?? 0) * multiplier * fraction;
    this.island.wood += (output.wood ?? 0) * multiplier * fraction;
    this.island.stone += (output.stone ?? 0) * multiplier * fraction;
    if (this.island.civilization) this.island.civilization.harvestedStone += (output.stone ?? 0) * multiplier * fraction;
    this.island.herbs += (output.herbs ?? 0) * multiplier * fraction;
    }
    npc.path = undefined;
    npc.actionTarget = undefined;
    npc.laborTask = undefined;
    npc.laborMessage = settlement?'Đã thu hoạch · chuẩn bị mang về kho':'Đã chuyển tài nguyên vào kho';
    npc.status = 'idle';
    addEntry(this.island, `${npc.name.split('#')[0]} hoàn tất ${action} tại (${target.x},${target.y}).`, 'low');
  }

  private regenerateResources(): void {
    this.island.resources.forEach(node => {
      if (!this.island.weather?.fires.some(f=>this.island.resources.get(f.key)===node) && node.regenRate > 0 && node.amount < node.maxAmount) node.amount = Math.min(node.maxAmount, node.amount + node.regenRate);
    });
  }

  private advanceResearch(): void {
    const c = this.island.civilization, progress = c?.research;
    if (!c || !progress) return;
    const researcher = this.island.npcs.find(n => n.id === progress.researcherId && n.isAlive && n.position && n.age >= 18);
    if (!researcher || this.island.buildings.some(b => b.workers.includes(researcher.id))) return;
    researcher.researching = true;
    if (researcher.survivalBlocked || researcher.status === 'sleeping' || researcher.status === 'eating' || researcher.needs.hunger >= 95 || researcher.actionTarget || (researcher.laborRetryAt ?? 0) > this.island.tick) { if (!researcher.survivalBlocked) researcher.laborMessage = 'Nghiên cứu tạm nghỉ'; return; }
    if(this.island.dailyLife?.settlementVersion===1&&this.worldMap){
      const tables=this.island.buildings.filter(b=>b.complete&&b.type==='study_table');
      // Saves with an already active project remain playable even without a new table.
      if(tables.length){
        const routes=tables.flatMap(b=>{const path=findPath(this.worldMap!,researcher.position!.tileX,researcher.position!.tileY,b.tileX,b.tileY);return path===null?[]:[path];}).sort((a,b)=>a.length-b.length);
        const path=routes[0];
        if(!path){researcher.laborMessage='Không có đường đến bàn nghiên cứu';return;}
        if(path.length){const next=path[Math.min(movementSteps(researcher,this.island),path.length)-1];researcher.position={tileX:next.x,tileY:next.y};researcher.path=undefined;researcher.status='working';researcher.laborMessage='Đang đến bàn nghiên cứu';return;}
      }
    }
    // A daytime shift has five work steps instead of the legacy ten.
    progress.workTicks = (progress.workTicks ?? 0) + (this.island.dailyLife ? 2 : 1)*attributeBonus(researcher,'int')*workMultiplier(this.island,researcher);
    researcher.status = 'working'; researcher.laborMessage = 'Đang nghiên cứu';
    const gs = createGameState(); gs.unlocks = new Set(c.unlocks);
    c.research = tickResearch(progress, gs, this.island, Math.floor(this.island.tick / 10) + 1) ?? undefined;
    c.unlocks = [...gs.unlocks];
  }

  private placeNewborns(): void {
    for (const npc of this.island.npcs) {
      if (!npc.isAlive || npc.position || !this.worldMap) continue;
      const parent = this.island.npcs.find(candidate => candidate.id === npc.motherId && candidate.position)
        ?? this.island.npcs.find(candidate => candidate.id === npc.fatherId && candidate.position);
      if (!parent?.position) continue;
      const tile = this.worldMap.landTiles.find(candidate =>
        Math.abs(candidate.x - parent.position!.tileX) <= 2 && Math.abs(candidate.y - parent.position!.tileY) <= 2 &&
        !this.island.npcs.some(other => other.isAlive && other.position?.tileX === candidate.x && other.position?.tileY === candidate.y),
      );
      if (tile) npc.position = { tileX: tile.x, tileY: tile.y };
    }
  }

  private findLivingNpc(npcId: string): NPC | undefined {
    return this.island.npcs.find(candidate => candidate.id === npcId && candidate.isAlive);
  }
}
