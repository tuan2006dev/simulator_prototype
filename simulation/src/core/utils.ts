// ============================================================
// utils.ts — Shared math helpers and relationship utilities
// ============================================================

import type { Island, NPC, Relationship } from './types';

/** Linear interpolation from value v in [inMin, inMax] → [outMin, outMax] */
export function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) return outMin;
  const t = Math.max(0, Math.min(1, (v - inMin) / (inMax - inMin)));
  return outMin + t * (outMax - outMin);
}

/** Clamp a value to [min, max] */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Random float in [min, max) */
export function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Random integer in [min, max] (inclusive) */
export function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

/** Pick a random element from an array */
export function randPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Normalize a personality axis −100…+100 to a 0…1 multiplier */
export function personalityFactor(axis: number): number {
  return (axis + 100) / 200; // 0 at −100, 0.5 at 0, 1 at +100
}

/** Normalize a personality axis −100…+100 to a −1…+1 multiplier */
export function personalitySignedFactor(axis: number): number {
  return axis / 100;
}

// ── Relationship helpers ──────────────────────────────────────────────────────

function relKey(idA: string, idB: string): string {
  return idA < idB ? `${idA}:${idB}` : `${idB}:${idA}`;
}

export function getRelationship(island: Island, idA: string, idB: string): Relationship {
  const key = relKey(idA, idB);
  if (!island.relationships.has(key)) {
    island.relationships.set(key, { npcIdA: idA, npcIdB: idB, score: 0 });
  }
  return island.relationships.get(key)!;
}

export function changeRelationship(
  island: Island,
  idA: string,
  idB: string,
  delta: number,
): void {
  const rel = getRelationship(island, idA, idB);
  rel.score = clamp(rel.score + delta, -100, 100);
}

export function getLivingNPCs(island: Island): NPC[] {
  return island.npcs.filter((n) => n.isAlive);
}

/** Pick a random OTHER living NPC, or null if none */
export function randomOtherNPC(current: NPC, island: Island): NPC | null {
  const others = getLivingNPCs(island).filter((n) => n.id !== current.id);
  if (others.length === 0) return null;
  return randPick(others);
}

/** Convert tick to in-game day (each day = 10 ticks) */
export const TICKS_PER_DAY = 10;
export function tickToDay(tick: number): number {
  return Math.floor(tick / TICKS_PER_DAY) + 1;
}
