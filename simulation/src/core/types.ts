// ============================================================
// types.ts — Core domain types for the Island God Game simulation
// ============================================================

// ── Needs (0 = fully satisfied, 100 = critical urgency) ──────────────────────
export interface Needs {
  hunger: number;   // increases each tick; 100 = starving
  rest: number;     // increases if not sleeping; 100 = exhausted
  safety: number;   // increases near threats or after attacks; 100 = panicking
  social: number;   // increases if isolated; 100 = severely lonely
}

// ── Personality axes (−100 to +100) ──────────────────────────────────────────
export interface Personality {
  courage: number;     // +100 fearless fighter, −100 total coward
  greed: number;       // +100 obsessive hoarder, −100 selfless giver
  loyalty: number;     // +100 fiercely loyal, −100 traitor
  piety: number;       // +100 devout, −100 atheist
  sociability: number; // +100 outgoing/extroverted, −100 reserved/introverted
}

// ── Occupation ────────────────────────────────────────────────────────────────
export type Occupation =
  | 'farmer'      // produces food each work tick
  | 'gatherer'    // forages for food
  | 'warrior'     // high combat skill
  | 'elder'       // boosts social/prayer outcomes
  | 'craftsman'   // crafting
  | 'child';      // under 18 years old, does not work or fight

export type LaborRole = 'food' | 'wood' | 'stone' | 'haul' | 'idle';
export type ToolKind = 'axe' | 'pickaxe' | 'fishing_rod';

// ── NPC state machine ─────────────────────────────────────────────────────────
export type NPCStatus =
  | 'idle'
  | 'eating'
  | 'sleeping'
  | 'working'
  | 'chatting'
  | 'courting'
  | 'stealing'
  | 'fighting'
  | 'fleeing'
  | 'praying';

// ── Relationship between two NPCs ─────────────────────────────────────────────
export interface Relationship {
  npcIdA: string;
  npcIdB: string;
  score: number;  // −100 (enemies) to +100 (best friends)
}

// ── NPC ───────────────────────────────────────────────────────────────────────
export interface NPC {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  needs: Needs;
  personality: Personality;
  occupation: Occupation;
  laborRole: LaborRole;
  laborMode?: 'auto' | 'manual';
  autoReason?: string;
  attributes?: { str:number; dex:number; int:number };
  divineState?: 'blessed'|'exhausted';
  equippedTool?: ToolKind;
  torch?: {fuel:number};
  torchChoice?: boolean;
  torchRefill?: boolean;
  exploring?: boolean;
  toolChoice?: 'auto' | 'none' | ToolKind;
  equipmentMessage?: string;
  laborTask?: { workTicks: number; totalTicks?: number };
  laborMessage?: string;
  laborRetryAt?: number;
  buildingWork?: { buildingId: string; ticks: number; cycleBoundary?: boolean };
  autoWorkProgress?: Record<string,number>;
  researching?: boolean;
  status: NPCStatus;
  isAlive: boolean;
  privateFood: number;          // personal food stash (can be stolen)
  freight?: {good:LogisticsGood;amount:number;target:string};
  haulTask?: {good:LogisticsGood;source:string;target:string};
  cargo?: { food: number; wood: number; stone: number; herbs: number };
  sleepSite?: string;           // actual occupied shelter, recomputed from reachable beds
  health?: number;              // 0–100; older saves default to 100
  survival?: { reason: 'dinner' | 'hunger' | 'rest' | 'health'; destination?: { x: number; y: number }; lastMealDay?: number };
  lastDinnerDay?: number;
  adaptation?:{kind:'hightech'|'mystic'|'eldritch';charge:number};
  adaptationReady?:boolean;
  exposure?:number;
  clinicalCare?:{clinicId:string;paid:boolean;workTicks:number};
  clinicReady?:boolean;
  herbalDoses?:number;
  treatment?: {paid:boolean;workTicks:number};
  defenseChoice?: {kind:'spear'|'padded_vest';equip:boolean};
  weapon?: 'spear';
  armor?: 'padded_vest';
  guardDuty?: boolean;
  raidResponse?: 'guarding'|'fleeing';
  survivalBlocked?: boolean;    // derived each tick; prevents a second work action
  lastAction: string;
  // ── Romance & Reproduction ───────────────────────────────────────────────────
  partnerId: string | null;     // ID of married partner, or null
  motherId: string | null;      // ID of mother, or null if generation 0
  fatherId: string | null;      // ID of father, or null if generation 0
  isPregnant: boolean;          // true if currently carrying a baby
  pregnancyDaysLeft: number;    // countdown days until birth
  // ── Balance v2 ───────────────────────────────────────────────────────────────
  attackCooldowns: Map<string, number>;  // victimId → ticks of cooldown remaining
  stealCooldowns: Map<string, number>;   // victimId → ticks of steal cooldown remaining
  hungerTicks: number;                   // consecutive ticks at hunger ≥ 95 (→ starvation)
  attacksThisDay: number;                // attacks performed in current 10-tick day window

  // Pathfinding (Phase 3.5)
  path?: { x: number, y: number }[];
  actionTarget?: { type: string, x: number, y: number, npcId?: string };
  /** Authoritative server-owned map tile; null until the player places the settler. */
  position: { tileX: number; tileY: number } | null;
}

// ── Phase 4: Animal types ────────────────────────────────────────────────────
export type AnimalSpecies = 'cattle' | 'chicken' | 'dog';

export type AnimalStatus =
  | 'wild'          // roaming freely, flees from NPCs
  | 'taming'        // NPC is actively feeding it, trust building
  | 'domesticated'  // fully tamed, producing resources
  | 'breeding'      // pregnant / incubating
  | 'guarding';     // dog on patrol

export interface Animal {
  id: string;
  species: AnimalSpecies;
  status: AnimalStatus;
  isAlive: boolean;
  trust: number;          // 0-100; reaches 100 → domesticated
  age: number;            // in game days
  tileX: number;
  tileY: number;
  // Wander path
  path?: { x: number; y: number }[];
  // Production tracker
  produceTick: number;    // ticks since last produce
  breedCooldown: number;  // ticks until can breed again (0 = ready)
  motherId: string | null;
  fatherId: string | null;
}

// Animal species config (static)
export interface AnimalConfig {
  icon: string;
  name: string;
  color: string;
  trustNeeded: number;    // ticks of feeding to domesticate
  foodCostPerTick: number;// island.sharedFood consumed per tick
  produceInterval: number;// ticks between productions
  produceFood: number;    // food added per production
  produceName: string;    // display name of produce
  guardBonus: number;     // warrior defense bonus (dogs only)
  breedInterval: number;  // ticks between breeding events
  maxHerd: number;        // max of this species on island
}

export const ANIMAL_CONFIG: Record<AnimalSpecies, AnimalConfig> = {
  cattle: {
    icon: '🐄', name: 'Bò', color: '#c8a87a',
    trustNeeded: 50, foodCostPerTick: 3, produceInterval: 100, produceFood: 15,
    produceName: 'Sữa', guardBonus: 0, breedInterval: 300, maxHerd: 12,
  },
  chicken: {
    icon: '🐔', name: 'Gà', color: '#e8c840',
    trustNeeded: 30, foodCostPerTick: 1.5, produceInterval: 60, produceFood: 8,
    produceName: 'Trứng', guardBonus: 0, breedInterval: 200, maxHerd: 20,
  },
  dog: {
    icon: '🐕', name: 'Chó', color: '#b87a50',
    trustNeeded: 40, foodCostPerTick: 2, produceInterval: 0, produceFood: 0,
    produceName: '', guardBonus: 8, breedInterval: 400, maxHerd: 6,
  },
};

// ── Phase 4: Genealogy node ───────────────────────────────────────────────
export interface FamilyNode {
  npcId: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  isAlive: boolean;
  occupation: Occupation;
  motherId: string | null;
  fatherId: string | null;
  generation: number;  // 0 = founder, 1 = child, ...
}

// ── Phase 3: Resource types ───────────────────────────────────────────────────
export type ResourceType =
  | 'wood_tree'       // forest tile → wood
  | 'stone_deposit'   // mountain tile → stone
  | 'herb_patch'      // grass tile → herbs
  | 'fish_spot'       // shallow_water → food
  | 'copper_vein'     // high mountain → copper
  | 'clay_deposit'    // shoreline → finite clay
  | 'iron_vein'
  | 'coal_deposit'
  | 'fertile_soil';   // buff tile for farms

export interface ResourceNode {
  type:      ResourceType;
  amount:    number;     // current amount (0 = depleted)
  maxAmount: number;     // initial max
  regenRate: number;     // +amount per tick (0 = no regen)
}

// ── Phase 3: Building types ───────────────────────────────────────────────────
export type BuildingType =
  | 'tent' | 'stockpile' | 'fishing_dock' | 'study_table'
  | 'lumbercamp'   // workers → harvest wood_tree
  | 'mine'         // workers → harvest stone_deposit
  | 'farm'         // workers → produce food (bonus on fertile_soil)
  | 'house'        // reduces rest need decay for occupants
  | 'storehouse'   // increases food cap
  | 'bridge'       // placed on river tile — allows crossing
  | 'temple'
  | 'copper_mine'
  | 'smelter'
  | 'sawmill'
  | 'clay_pit'
  | 'brick_kiln'
  | 'pottery_workshop'
  | 'wheat_field'
  | 'bakery'
  | 'iron_mine' | 'coal_mine' | 'iron_smelter' | 'flax_field' | 'weaver' | 'tradepost' | 'steelworks' | 'stonecutter' | 'steam_generator' | 'prototype_workshop' | 'component_factory' | 'measurement_lab' | 'microchip_factory' | 'control_center' | 'spirit_extractor' | 'spirit_refinery' | 'resonance_tower' | 'apothecary' | 'clinic' | 'relic_extractor' | 'biomatter_workshop' | 'quarantine';

export interface Building {
  id:       string;
  type:     BuildingType;
  tileX:    number;
  tileY:    number;
  autoWorkers?: string[];
  autoStaff?: boolean;
  powerEnabled?: boolean;
  powerPriority?: number;
  powerFuelTicks?: number;
  poweredTicks?: number;
  labPoweredTicks?: number;
  productionAlert?: string;
  workers:  string[];     // NPC ids assigned here
  progress: number;       // 0-100, construction progress
  complete: boolean;
  level?: number;
  upgrade?: { targetLevel: number; progress: number };
  workMessage?: string;
  productionBatches?: number;
  productionQuota?: number;
  relicSafety?:boolean;
  relicSafetyBatches?:number;
  relicEnabled?:boolean;
  quarantineFuelTicks?:number;
  quarantineCareTicks?:number;
  spiritEnabled?: boolean;
  resonanceFuelTicks?: number;
  resonanceCareTicks?: number;
  clinicalDoses?:number;
  completedCare?:number;
  buffer?: {input:Partial<Record<LogisticsGood,number>>;output:Partial<Record<LogisticsGood,number>>};
  technology?: 'stone' | 'bronze' | 'iron';
  shipment?: { offerId: string; workerId: string; destination: { x: number; y: number }; stage: 'outbound' | 'returning'; exchangeTicks: number };
}

// ── Island ────────────────────────────────────────────────────────────────────
export interface Island {
  clock?: {version:1;progressMs:number};
  tides?: {version:1;completed:number;message:string;active?:{npcId:string;home:{x:number;y:number};phase:'provision'|'approach'|'outward'|'survey'|'inward'|'home';rations:number;sourceKey:string;collected:number;recall:boolean;startedTick:number}};
  wilderness?: {version:1;territories:{id:string;species:'wolf'|'boar';x:number;y:number;animalX:number;animalY:number;seen:boolean;retreatUntil:number;cooldownUntil:number}[];encounters:number;injuries:number;repelled:number;message:string;lastEncounter?:{npcId:string;territoryId:string;tick:number;kind:'warning'|'injury'|'repelled';damage:number}};
  exploration?: {version:1;discovered:Set<string>;visible:Set<string>;legacy:boolean;message:string;warning?:string;points?:{id:string;kind:'food_cache'|'herb_cache'|'monolith';x:number;y:number;sourceKey?:string;claimed:boolean;exhausted:boolean;workTicks:number;collected:number}[];patrol?:{npcId:string;enabled:boolean;nextTick:number;trips:number};mission:{region:boolean;food:boolean;returned:boolean};torchStock:number[];torchCrafted:number;torchOrder?:{npcId:string;workTicks:number};active?:{npcId:string;target:{x:number;y:number};home:{x:number;y:number};stage:'outbound'|'returning';reached:boolean;newLand:number;foundFood:boolean;reason:string;pointId?:string;automatic?:boolean};completed:number};
  defense?: {version:1;stock:Record<'spear'|'padded_vest',number>;crafted:Record<'spear'|'padded_vest',number>;order?:{kind:'spear'|'padded_vest';npcId:string;workTicks:number}};
  adaptationProcess?:{npcId:string;labId:string;mode:'apply'|'service'|'remove';workTicks:number};
  adaptationMessage?:string;
  eldritchSource?:{version:1;siteId:string;charge:number;contamination:number;clockTicks:number};
  spiritVein?:{version:1;siteId:string;charge:number;stability:number;clockTicks:number};
  analysis?: {version:1;active?:{siteId:string;labId:string;workTicks:number};foundation?:{siteId:string;labId:string;workTicks:number};message:string};
  surveys?: {version:1;sites:{id:string;kind:'hightech'|'mystic'|'eldritch';x:number;y:number;surveyed:boolean;analyzed?:boolean;decision?:'research'|'contain'|'ignore';foundationComplete?:boolean}[];active?:{siteId:string;npcId:string;homeId:string;stage:'outbound'|'observing'|'returning';workTicks:number};message:string};
  power?: {version:1;clockTicks:number;supply:number;demand:number;supplied:string[];steadyTicks:number};
  raids?: {version:1;clockMs:number;phase:'peace'|'warning'|'active';untilMs:number;count:number;target:{x:number;y:number}|null;enemies:{id:string;x:number;y:number;health:number}[];stolen:number;budget:number;shieldUntilMs:number;shieldCooldownUntilMs:number;result:string};
  weather?: {version:1;clockMs:number;kind:'clear'|'rain'|'drought';untilMs:number;seed:number;dryFireChecked:boolean;rainUntilMs:number;rainCooldownUntilMs:number;fires:{key:string;life:number;heat:number}[];burned:string[];incidentCount:number};
  faith?: {version:1;amount:number;clockMs:number;cooldownUntilMs:number;casts:number[];incite?:{untilMs:number;targets:string[]};inciteCooldownUntilMs?:number;inciteCasts?:number[];blessing?:{untilMs:number;exhaustUntilMs:number;exhaustApplied:boolean}};
  logistics?: {version:1;completedTrips?:number};
  equipment?: {version:1;stock:Record<ToolKind,number>;crafted:Record<ToolKind,number>;order?:{kind:ToolKind;workerId:string;workTicks:number}};
  reserves?: {version:1;targets:Partial<Record<LogisticsGood,number>>;requests:Partial<Record<LogisticsGood,boolean>>};
  workforce?: { version:1; enabled:boolean };
  dailyLife?: { settlementVersion?: 1; campfire: { tileX: number; tileY: number; fuel?: number; graceUntil?: number; lastBurnTick?: number; lit?: boolean } | null };
  civilization?: CivilizationState;
  id: string;
  name: string;
  npcs: NPC[];
  // Phase 1-2 resources
  sharedFood: number;
  // Phase 3 resources
  wood:   number;
  stone:  number;
  herbs:  number;
  tick: number;
  lastCommunalPrayerTick?: number;
  relationships: Map<string, Relationship>;
  chronicle: ChronicleEntry[];
  // Phase 3
  buildings: Building[];
  /** Resource-node inventory keyed by map tile (`x,y`). */
  resources: Map<string, ResourceNode>;
  // Phase 4: Animals & Genealogy
  animals: Animal[];
  /** Computed on demand — cache invalidated each tick */
  _familyNodes?: FamilyNode[];
}

export type EraId = 'stone' | 'bronze' | 'iron' | 'modern' | 'anomaly';
export type LogisticsGood = 'food'|'wood'|'stone'|'herbs'|Commodity;
export type Commodity = 'copperOre' | 'copper' | 'lumber' | 'clay' | 'bricks' | 'pottery' | 'wheat' | 'ironOre' | 'coal' | 'iron' | 'fiber' | 'cloth' | 'steel' | 'cutStone' | 'machineParts' | 'components' | 'microchips' | 'spiritStone' | 'spiritEssence' | 'medicine' | 'relicBone' | 'bloodstone' | 'biomatter';
export interface CivilizationState {
  rulesVersion: 1;
  era: EraId;
  unlocks: string[];
  inventory: Record<Commodity, number>;
  produced: Record<Commodity, number>;
  harvestedStone: number;
  anomalyBranch?: 'hightech'|'mystic'|'eldritch';
  branchDevelopment?: {branch:'hightech'|'mystic'|'eldritch';labId:string;workTicks:number};
  branchMessage?: string;
  completedTrades?: number;
  transition?: { target: 'bronze' | 'iron' | 'modern'; workTicks: number; ticksNeeded: number };
  research?: { techId: string; startDay: number; daysNeeded: number; assignedElderId: string | null; researcherId?: string; workTicks?: number };
  migrationNotice?: string;
}

// ── Chronicle (narrative log) ─────────────────────────────────────────────────
export interface ChronicleEntry {
  tick: number;
  day: number;
  message: string;
  importance: 'low' | 'medium' | 'high';
}

// ── Action ────────────────────────────────────────────────────────────────────
export interface Action {
  name: string;
  /**
   * Returns a priority score [0, ∞).
   * Higher score = more likely to be chosen.
   */
  score(npc: NPC, island: Island): number;
  /**
   * Executes the action, mutating NPC and Island state in place.
   * Returns an optional log message.
   */
  execute(npc: NPC, island: Island): string | null;
}
