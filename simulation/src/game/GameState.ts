// ============================================================
// GameState.ts — State machine: MENU → WORLD_CREATE → PLACE → PLAY
// ============================================================

export type GamePhase =
  | 'MENU'          // start screen — all ocean
  | 'WORLD_CREATE'  // random/paint map creation
  | 'ENTITY_PLACE'  // drag & drop starting humans
  | 'MAP_PAINT'     // player painting the map manually
  | 'PLAYING';      // actual game

export interface GameState {
  phase:       GamePhase;
  era:         number;     // UI index only; stable progression id lives in Island.civilization.
  autoLevel:   number;     // 0=direct commands, 1=assigned buildings, 2=semi-auto, 3=full-AI
  daysPassed:  number;
  /** Unlock flags accumulated via research */
  unlocks: Set<string>;
}

export function createGameState(): GameState {
  return {
    phase:      'MENU',
    era:        0,
    autoLevel:  0,
    daysPassed: 0,
    unlocks:    new Set(),
  };
}

// ── Era names ──────────────────────────────────────────────────────────────────
export const ERA_NAMES: Record<number, string> = {
  0: '🪨 Đồ Đá',
  1: '🏺 Đồ Đồng',
  2: '⚔️ Đồ Sắt',
  3: '🏙️ Hiện Đại',
  4: '🌀 Dị Tượng',
};

// ── Era unlock conditions ──────────────────────────────────────────────────────
export interface EraCondition {
  era:        number;
  label:      string;
  requirements(state: GameState, islandStats: IslandStats): EraRequirementStatus[];
}

export interface EraRequirementStatus {
  label: string;
  progress: string;
  met: boolean;
}

export interface IslandStats {
  population:    number;
  sharedFood:    number;
  wood:          number;
  stone:         number;
  herbs:         number;
  buildingCount: number;
  completedBuildingCount: number;
  elderCount:    number;
  daysPassed:    number;
  maxGeneration: number;   // highest generation number alive
  maxAdultGeneration: number; // highest generation among living adults
  domesticatedSpecies: number;
}

// Progression rules are centralized in core/civilization.ts.

// ── NPC Command (for manual era 0) ────────────────────────────────────────────
export type NPCCommandType =
  | 'gather_food'
  | 'chop_wood'
  | 'gather_stone'
  | 'fish'
  | 'rest'
  | 'talk';

export interface NPCCommand {
  type:    NPCCommandType;
  targetX?: number;
  targetY?: number;
  done:    boolean;
}

export const COMMAND_LABELS: Record<NPCCommandType, string> = {
  gather_food:  '🌿 Hái lượm',
  chop_wood:    '🪓 Chặt cây',
  gather_stone: '🪨 Nhặt đá',
  fish:         '🐟 Câu cá',
  rest:         '😴 Nghỉ ngơi',
  talk:         '💬 Nói chuyện',
};

export const COMMAND_TERRAIN: Record<NPCCommandType, string[]> = {
  gather_food:  ['grass', 'forest', 'sand'],
  chop_wood:    ['forest'],
  gather_stone: ['mountain'],
  fish:         ['shallow_water'],
  rest:         ['grass', 'sand', 'forest'],
  talk:         ['grass', 'sand', 'forest'],
};

// ── Yield per command execution ───────────────────────────────────────────────
export const COMMAND_YIELD: Record<NPCCommandType, { food?: number; wood?: number; stone?: number; herbs?: number }> = {
  // Food commands should be legible against the adult meal size (20): one
  // successful harvest/fishing order now represents roughly one meal.
  gather_food:  { food: 20, herbs: 1 },
  chop_wood:    { wood: 3 },
  gather_stone: { stone: 2 },
  fish:         { food: 25 },
  rest:         {},
  talk:         {},
};
