// ============================================================
// engine.ts — Tick loop and Utility AI dispatcher
// ============================================================

import type { Island, NPC } from './types';
import type { Action } from './types';
import { ALL_ACTIONS } from './actions';
import { assignAdultOccupation, createChildNPC } from './factory';
import { addEntry } from './chronicle';
import { clamp, getLivingNPCs, getRelationship, rand, randInt, TICKS_PER_DAY } from './utils';

// ── Needs decay per tick ──────────────────────────────────────────────────────
const NEEDS_DECAY = {
  hunger: 4,    // +4 hunger per tick (starves in ~25 ticks without food)
  rest: 3,      // +3 rest per tick (exhausted in ~33 ticks without sleep)
  safety: -2,   // −2 safety per tick (naturally calms down)
  social: 2,    // +2 social per tick (gets lonely)
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

function tickNPC(npc: NPC, island: Island): void {
  // 1. Decay needs (pregnant mothers get hungry/tired faster; children get hungry slower)
  const isChild = npc.occupation === 'child' || npc.age < 18;
  const hungerDecay = npc.isPregnant ? NEEDS_DECAY.hunger + 1 : isChild ? NEEDS_DECAY.hunger - 1 : NEEDS_DECAY.hunger;
  const restDecay = npc.isPregnant ? NEEDS_DECAY.rest + 1 : NEEDS_DECAY.rest;

  npc.needs.hunger = clamp(npc.needs.hunger + hungerDecay, 0, 100);
  npc.needs.rest = clamp(npc.needs.rest + restDecay, 0, 100);
  npc.needs.safety = clamp(npc.needs.safety + NEEDS_DECAY.safety, 0, 100);
  npc.needs.social = clamp(npc.needs.social + NEEDS_DECAY.social, 0, 100);

  // 2. Starvation system: track consecutive ticks at hunger ≥ 95; die after 12
  if (npc.needs.hunger >= 95) {
    npc.hungerTicks += 1;
  } else {
    npc.hungerTicks = 0;
  }
  if (npc.hungerTicks >= 12) {
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

  // 5. Pick and execute action
  const chosen = pickAction(npc, island, ALL_ACTIONS);
  if (chosen) {
    npc.lastAction = chosen.name;
    chosen.execute(npc, island);
  }
}

// ── Main tick ─────────────────────────────────────────────────────────────────

export function tick(island: Island): void {
  island.tick += 1;

  // Give farmers/gatherers a private food stash each day so stealing has a target
  if (island.tick % 5 === 0) {
    getLivingNPCs(island).forEach((npc) => {
      if (npc.occupation === 'farmer' || npc.occupation === 'gatherer') {
        npc.privateFood += 10;
      } else if (npc.occupation !== 'child') {
        npc.privateFood += 3;
      }
    });
  }

  // Daily cycle events (every 10 ticks = 1 in-game day = 1 game year)
  if (island.tick % TICKS_PER_DAY === 0) {
    const living = getLivingNPCs(island);

    // 1. Reset daily attack counter & Age NPCs
    living.forEach((npc) => {
      npc.attacksThisDay = 0;
      npc.age += 1;

      // Children reaching adulthood (age 18)
      if (npc.occupation === 'child' && npc.age >= 18) {
        npc.occupation = assignAdultOccupation(npc);
        addEntry(
          island,
          `🎓 ${npc.name} đã trưởng thành (18 tuổi) và tự hào nhận nghề ${npc.occupation}!`,
          'medium',
        );
      }
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
    tickNPC(npc, island);
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

