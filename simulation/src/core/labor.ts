import type { NPC } from './types';

/** Food produced by each assigned adult per simulated day. */
export const LABOR_DAILY_OUTPUT = {
  food: 10,
  wood: 3,
  stone: 2,
} as const;

/** Estimate demand from current meal sizes and the hunger recovery cycle. */
export function estimateDailyFoodDemand(npcs: NPC[]): number {
  return npcs.filter(npc => npc.isAlive).reduce((total, npc) => {
    const meal = npc.occupation === 'child' || npc.age < 18 ? 10 : npc.isPregnant ? 25 : 20;
    const hungerRecovery = npc.isPregnant ? 40 : 35;
    // Hunger rises by 0.8 per tick and an adult's meal lowers it by 35.
    return total + meal * (0.8 * 10 / hungerRecovery);
  }, 0);
}

export function estimateFoodDays(npcs: NPC[], sharedFood: number): number {
  const dailyDemand = estimateDailyFoodDemand(npcs);
  const totalStoredFood = Math.max(0, sharedFood) + npcs.filter(npc => npc.isAlive).reduce((sum, npc) => sum + Math.max(0, npc.privateFood) + (npc.cargo?.food??0)+(npc.freight?.good==='food'?npc.freight.amount:0), 0);
  return dailyDemand > 0 ? totalStoredFood / dailyDemand : 0;
}
