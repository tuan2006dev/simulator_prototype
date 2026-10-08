// ============================================================
// engine.ts — Tick loop and Utility AI dispatcher
// ============================================================

import type { Island, NPC } from './types';
import type { Action } from './types';
import { ALL_ACTIONS } from './actions';
import { assignAdultOccupation, createChildNPC } from './factory';
import { addEntry } from './chronicle';
import { clamp, getLivingNPCs, getRelationship, rand, randInt, TICKS_PER_DAY } from './utils';
import { LABOR_DAILY_OUTPUT } from './labor';

const DAYS_PER_YEAR = 30;
const TICKS_PER_YEAR = TICKS_PER_DAY * DAYS_PER_YEAR;

// ── Needs decay per tick ──────────────────────────────────────────────────────
const NEEDS_DECAY = {
  hunger: 0.8,
  rest: 0.5,
  safety: -0.2,
  social: 0.3,
};

// ── Utility AI ────────────────────────────────────────────────────────────────

/**
 * Score all actions for one NPC and pick the best one.
 * A small random jitter (±5%) prevents identical NPCs from acting identically.
 */
function pickAction(npc: NPC, island: Island, actions: Action[]): Action | null {
  const scored = actions
    .map((a) => ({
      action: a,
      score: a.score(npc, island) * (1 + rand(-0.05, 0.05)),
    }))
    .filter((s) => s.score > 0);

  if (scored.length === 0) return null;

  scored.sort((a, b) => b.score - a.score);
  return scored[0].action;
}

// ── Per-tick NPC update ───────────────────────────────────────────────────────

function tickNPC(npc: NPC, island: Island, runAI: boolean, mapLabor: boolean): void {
  if (island.dailyLife && !npc.position) { npc.status = 'idle'; return; }
  // 1. Decay needs (pregnant mothers get hungry/tired faster; children get hungry slower)
  const isChild = npc.occupation === 'child' || npc.age < 18;
  const hungerDecay = npc.isPregnant ? NEEDS_DECAY.hunger + 0.2 : isChild ? NEEDS_DECAY.hunger * 0.6 : NEEDS_DECAY.hunger;
  const restDecay = npc.isPregnant ? NEEDS_DECAY.rest + 0.2 : NEEDS_DECAY.rest;

  const previousHunger = npc.needs.hunger;
  npc.needs.hunger = clamp(npc.needs.hunger + hungerDecay, 0, 100);
  npc.needs.rest = clamp(npc.needs.rest + restDecay, 0, 100);
  npc.needs.safety = clamp(npc.needs.safety + NEEDS_DECAY.safety, 0, 100);
  npc.needs.social = clamp(npc.needs.social + NEEDS_DECAY.social, 0, 100);

  if (previousHunger < 70 && npc.needs.hunger >= 70) {
    addEntry(
      island,
      `⚠️ ${npc.name} đang đói. Cư dân sẽ tự ăn nếu kho chung hoặc kho riêng còn thức ăn.`,
      'high',
    );
  }

  // 2. Starvation system: a missed meal is recoverable; death follows a grace period.
  if (npc.needs.hunger >= 100) {
    npc.hungerTicks += 1;
  } else {
    npc.hungerTicks = 0;
  }
  npc.health ??= 100;
  if (island.dailyLife && npc.needs.hunger >= 100) npc.health = clamp(npc.health - 100 / 30, 0, 100);
  if (island.dailyLife ? npc.health <= 0 : npc.hungerTicks >= 30) {
    npc.isAlive = false;
    addEntry(
      island,
      `💀 ${npc.name} chết đói sau ${npc.hungerTicks} tick liên tiếp không kiếm được lương thực.`,
      'high',
    );

    // Free partner if married
    if (npc.partnerId) {
      const partner = island.npcs.find((n) => n.id === npc.partnerId);
      if (partner) {
        partner.partnerId = null;
        addEntry(island, `🥀 ${partner.name} đau đớn chịu tang khi bạn đời ${npc.name} qua đời.`, 'medium');
      }
      npc.partnerId = null;
    }
    return;
  }

  // 3. Decay per-target attack & steal cooldowns
  npc.attackCooldowns.forEach((remaining, victimId) => {
    if (remaining <= 1) {
      npc.attackCooldowns.delete(victimId);
    } else {
      npc.attackCooldowns.set(victimId, remaining - 1);
    }
  });

  npc.stealCooldowns.forEach((remaining, victimId) => {
    if (remaining <= 1) {
      npc.stealCooldowns.delete(victimId);
    } else {
      npc.stealCooldowns.set(victimId, remaining - 1);
    }
  });

  // 4. Reset status to idle before deciding
  npc.status = 'idle';

  // The map session owns scheduled survival and physical trips in this mode.
  if (island.dailyLife && mapLabor) return;

  // 5. Pick and execute action
  const survivalActions = ALL_ACTIONS.filter((action) =>
    (action.name === 'eat' && npc.needs.hunger >= 70) ||
    (action.name === 'sleep' && npc.needs.rest >= 80),
  );
  const chosen = island.civilization && mapLabor
    ? pickAction(npc, island, survivalActions) ?? pickAction(npc, island, ALL_ACTIONS.filter(action => ['chat', 'pray'].includes(action.name)))
    : pickAction(npc, island, runAI ? mapLabor ? ALL_ACTIONS.filter(action => action.name !== 'work') : ALL_ACTIONS : survivalActions);
  if (chosen) {
    npc.lastAction = chosen.name;
    chosen.execute(npc, island);
  }
}

// ── Main tick ─────────────────────────────────────────────────────────────────

export function tick(island: Island, options: { runAI?: boolean; mapLabor?: boolean } = {}): void {
  const runAI = options.runAI ?? true;
  island.tick += 1;

  // Give farmers/gatherers a private food stash each day so stealing has a target
  if (runAI && !options.mapLabor && island.tick % 5 === 0) {
    getLivingNPCs(island).forEach((npc) => {
      if (npc.occupation === 'farmer' || npc.occupation === 'gatherer') {
        npc.privateFood += 10;
      } else if (npc.occupation !== 'child') {
        npc.privateFood += 3;
      }
    });
  }

  // Daily cycle events.
  if (island.tick % TICKS_PER_DAY === 0) {
    const living = getLivingNPCs(island);

    // 1. Reset daily attack counter
    living.forEach((npc) => {
      npc.attacksThisDay = 0;
    });

    // 2. Divorce / Breakup check for married couples with severely deteriorated relationships
    const checkedPairs = new Set<string>();
    living.forEach((npc) => {
      if (npc.partnerId && !checkedPairs.has(npc.id)) {
        const partner = living.find((n) => n.id === npc.partnerId);
        if (partner) {
          checkedPairs.add(npc.id);
          checkedPairs.add(partner.id);
          const relScore = getRelationship(island, npc.id, partner.id).score;
          if (relScore <= -30) {
            npc.partnerId = null;
            partner.partnerId = null;
            addEntry(
              island,
              `💔 ${npc.name} và ${partner.name} đã chính thức ly hôn vì tình cảm rạn nứt nặng nề (${Math.round(relScore)}).`,
              'medium',
            );
          }
        } else {
          npc.partnerId = null; // partner no longer alive
        }
      }
    });

    // 3. Pregnancy countdown & Childbirth
    living.forEach((npc) => {
      if (npc.isPregnant) {
        npc.pregnancyDaysLeft -= 1;
        if (npc.pregnancyDaysLeft <= 0) {
          npc.isPregnant = false;
          npc.pregnancyDaysLeft = 0;
          const father = island.npcs.find((n) => n.id === npc.partnerId) ?? npc;
          const child = createChildNPC(npc, father, island);
          island.npcs.push(child);

          addEntry(
            island,
            `👶 ${npc.name} và ${father.name} vừa sinh hạ một bé (${child.name}, ${child.gender === 'male' ? 'bé trai' : 'bé gái'})! Dân số đảo tăng lên ${getLivingNPCs(island).length} người.`,
            'high',
          );
        }
      }
    });

    // 4. Conception check for married couples in reproductive age window (18-45)
    living.forEach((npc) => {
      if (npc.gender === 'female' && npc.partnerId && !npc.isPregnant && npc.age >= 18 && npc.age <= 45) {
        const partner = living.find((n) => n.id === npc.partnerId);
        if (partner && partner.age >= 18 && partner.age <= 48) {
          const rel = getRelationship(island, npc.id, partner.id).score;
          if (rel >= 40) {
            // 7.5% chance per day to conceive
            if (Math.random() < 0.075) {
              npc.isPregnant = true;
              npc.pregnancyDaysLeft = randInt(7, 10);
              addEntry(
                island,
                `🤰 ${npc.name} và ${partner.name} hạnh phúc đón nhận tin có thai (dự kiến sinh sau ${npc.pregnancyDaysLeft} ngày).`,
                'medium',
              );
            }
          }
        }
      }
    });
  }

  // Age advances yearly, independently of daily needs and pregnancy events.
  if (island.tick % TICKS_PER_YEAR === 0) {
    getLivingNPCs(island).forEach((npc) => {
      npc.age += 1;
      if (npc.occupation === 'child' && npc.age >= 18) {
        npc.occupation = assignAdultOccupation(npc);
        npc.laborRole = 'food';
        addEntry(
          island,
          `🎓 ${npc.name} đã trưởng thành (18 tuổi) và tự hào nhận nghề ${npc.occupation}!`,
          'medium',
        );
      }
    });
  }

  // Relationship recovery: negative scores drift toward 0 (+1.5 every 5 ticks)
  if (island.tick % 5 === 0) {
    island.relationships.forEach((rel) => {
      if (rel.score < 0) {
        rel.score = Math.min(0, rel.score + 1.5);
      }
    });
  }

  // Shuffle NPC order each tick to avoid first-NPC bias
  const shuffled = [...getLivingNPCs(island)].sort(() => Math.random() - 0.5);
  for (const npc of shuffled) {
    tickNPC(npc, island, runAI, Boolean(options.mapLabor));
  }

  // Basic settlement labor runs once per simulated day, including in manual
  // control mode. Direct commands remain available as tactical overrides.
  if (!options.mapLabor && island.tick % TICKS_PER_DAY === 0) {
    const assignedToBuilding = new Set(island.buildings.filter(building => building.complete).flatMap(building => building.workers));
    const workers = getLivingNPCs(island).filter(npc => npc.age >= 18 && npc.occupation !== 'child' && !assignedToBuilding.has(npc.id));
    let food = 0;
    let wood = 0;
    let stone = 0;
    for (const npc of workers) {
      if (npc.needs.hunger >= 95 || npc.needs.rest >= 98) continue;
      if (npc.laborRole === 'food') food += LABOR_DAILY_OUTPUT.food;
      else if (npc.laborRole === 'wood') wood += LABOR_DAILY_OUTPUT.wood;
      else if (npc.laborRole === 'stone') stone += LABOR_DAILY_OUTPUT.stone;
    }
    island.sharedFood += food;
    island.wood += wood;
    island.stone += stone;
    if (island.tick % (TICKS_PER_DAY * 5) === 0 && (food || wood || stone)) {
      addEntry(island, `👷 Lao động 5 ngày: +${food} thức ăn, +${wood} gỗ, +${stone} đá.`, 'low');
    }
  }

  // Periodic summary events
  if (island.tick % 50 === 0) {
    const alive = getLivingNPCs(island).length;
    const avgHunger =
      getLivingNPCs(island).reduce((s, n) => s + n.needs.hunger, 0) / (alive || 1);
    addEntry(
      island,
      `📊 [Tổng kết] ${alive} dân còn sống, kho lương thực: ${Math.round(island.sharedFood)}, đói trung bình: ${Math.round(avgHunger)}.`,
      'medium',
    );
  }
}


