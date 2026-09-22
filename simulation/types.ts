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
  courage: number;   // +100 fearless fighter, −100 total coward
  greed: number;     // +100 obsessive hoarder, −100 selfless giver
  loyalty: number;   // +100 fiercely loyal, −100 traitor
  piety: number;     // +100 devout, −100 atheist
}

// ── Occupation ────────────────────────────────────────────────────────────────
export type Occupation =
  | 'farmer'      // produces food each work tick
  | 'gatherer'    // forages for food
  | 'warrior'     // high combat skill
  | 'elder'       // boosts social/prayer outcomes
  | 'craftsman';  // will be useful in later eras

// ── NPC state machine ─────────────────────────────────────────────────────────
export type NPCStatus =
  | 'idle'
  | 'eating'
  | 'sleeping'
  | 'working'
  | 'chatting'
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
  needs: Needs;
  personality: Personality;
  occupation: Occupation;
  status: NPCStatus;
  isAlive: boolean;
  privateFood: number;   // personal food stash (can be stolen)
  lastAction: string;
}

// ── Island ────────────────────────────────────────────────────────────────────
export interface Island {
  id: string;
  name: string;
  npcs: NPC[];
  sharedFood: number;        // communal food storage
  tick: number;
  relationships: Map<string, Relationship>;  // key: "idA:idB" (sorted)
  chronicle: ChronicleEntry[];
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
