// ============================================================
// actions.ts — 9 actions with Utility AI scoring
// ============================================================
// Formula:  score = urgency_factor * personality_weight * context_modifier
// All scores are non-negative; higher = more likely to be chosen.
// ============================================================

import type { Action, Island, NPC } from './types';
import {
  changeRelationship,
  clamp,
  getRelationship,
  mapRange,
  personalityFactor,
  personalitySignedFactor,
  rand,
  randInt,
  randomOtherNPC,
  TICKS_PER_DAY,
} from './utils';
import { addEntry } from './chronicle';

// ── Helper: need urgency → score weight (exponential feel) ───────────────────
function urgency(need: number): number {
  // 0 → 0.01, 50 → 0.25, 80 → 0.64, 100 → 1.0
  return Math.pow(need / 100, 1.5);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. EAT
// ─────────────────────────────────────────────────────────────────────────────
export const actionEat: Action = {
  name: 'eat',

  score(npc, island) {
    if (island.sharedFood <= 0 && npc.privateFood <= 0) return 0;
    // Greedier NPCs are a bit more food-focused
    const greedBonus = 1 + 0.3 * personalityFactor(npc.personality.greed);
    // Pregnant mothers have extra appetite
    const pregnantBonus = npc.isPregnant ? 1.25 : 1.0;
    return urgency(npc.needs.hunger) * greedBonus * pregnantBonus * 10;
  },

  execute(npc, island) {
    // Children eat less (10), pregnant mothers eat more (25), regular adults (20)
    const isChild = npc.occupation === 'child' || npc.age < 18;
    const amount = isChild ? 10 : (npc.isPregnant ? 25 : 20);
    npc.status = 'eating';

    // Consume whatever is available proportionally. The previous implementation
    // could drain the shared store without satisfying hunger when the private
    // store could not cover the remainder of a full meal.
    const available = island.sharedFood + npc.privateFood;
    if (available <= 0) return null;
    const consumed = Math.min(amount, available);
    const sharedUsed = Math.min(island.sharedFood, consumed);
    const privateUsed = consumed - sharedUsed;
    island.sharedFood -= sharedUsed;
    npc.privateFood -= privateUsed;
    const source = sharedUsed > 0 && privateUsed > 0
      ? 'kho chung và kho riêng'
      : sharedUsed > 0 ? 'kho chung' : 'kho riêng';

    const before = npc.needs.hunger;
    const hungerReduction = (npc.isPregnant ? 40 : 35) * (consumed / amount);
    npc.needs.hunger = clamp(npc.needs.hunger - hungerReduction, 0, 100);

    if (before >= 70) {
      const roleStr = npc.isPregnant ? ' (mẹ bầu)' : isChild ? ' (trẻ nhỏ)' : '';
      addEntry(island, `${npc.name}${roleStr} đang đói (${Math.round(before)}), ăn từ ${source}.`, 'low');
    }
    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SLEEP
// ─────────────────────────────────────────────────────────────────────────────
export const actionSleep: Action = {
  name: 'sleep',

  score(npc, _island) {
    // Brave NPCs push through tiredness a bit longer
    const courageModifier = 1 - 0.2 * personalityFactor(npc.personality.courage);
    // Pregnant mothers tire a bit more easily
    const pregnancyModifier = npc.isPregnant ? 1.2 : 1.0;
    return urgency(npc.needs.rest) * courageModifier * pregnancyModifier * 9;
  },

  execute(npc, island) {
    npc.status = 'sleeping';
    const before = npc.needs.rest;
    npc.needs.rest = clamp(npc.needs.rest - 40, 0, 100);
    if (before >= 80) {
      addEntry(island, `${npc.name} kiệt sức (${Math.round(before)}), ngủ gục tại chỗ.`, 'low');
    }
    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. WORK (produce food based on occupation)
// ─────────────────────────────────────────────────────────────────────────────
export const actionWork: Action = {
  name: 'work',

  score(npc, _island) {
    // Children do not work
    if (npc.occupation === 'child' || npc.age < 18) return 0;
    // Assigned workers produce through the daily labor system instead.
    if (npc.laborRole !== 'idle') return 0;
    // Only work if not too hungry/tired; loyal NPCs work harder
    if (npc.needs.hunger > 70 || npc.needs.rest > 75) return 0;
    const loyaltyBonus = 1 + 0.4 * personalityFactor(npc.personality.loyalty);
    // Greedier NPCs slack off slightly unless they have low food
    const greedPenalty = 1 - 0.15 * personalityFactor(npc.personality.greed);
    return loyaltyBonus * greedPenalty * 5;
  },

  execute(npc, island) {
    npc.status = 'working';

    const foodProduced: Record<string, number> = {
      farmer:    randInt(8, 14),
      gatherer:  randInt(4, 9),
      warrior:   randInt(0, 2),
      elder:     randInt(2, 5),
      craftsman: randInt(2, 5),
    };

    let produced = foodProduced[npc.occupation] ?? 4;

    // Pregnancy penalty: working mother produces 25% less output
    if (npc.isPregnant) {
      produced = Math.max(1, Math.floor(produced * 0.75));
    }

    // Hunger penalty: starving NPC works far less efficiently
    if (npc.needs.hunger > 80) {
      produced = Math.floor(produced * 0.4);
    }

    island.sharedFood += produced;
    npc.needs.rest = clamp(npc.needs.rest + 8, 0, 100); // work costs rest
    npc.needs.hunger = clamp(npc.needs.hunger + 5, 0, 100);

    // Log at lower threshold
    if (produced >= 10) {
      addEntry(island, `${npc.name} (${npc.occupation}) làm việc chăm chỉ, thêm ${produced} lương thực vào kho.`, 'low');
    }
    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. CHAT
// ─────────────────────────────────────────────────────────────────────────────
export const actionChat: Action = {
  name: 'chat',

  score(npc, island) {
    const othersAvailable = island.npcs.filter(
      (n) => n.isAlive && n.id !== npc.id && n.status !== 'sleeping' && n.status !== 'fighting',
    ).length;
    if (othersAvailable === 0) return 0;
    // Sociable & loyal NPCs enjoy chatting
    const sociabilityBonus = 1 + 0.35 * personalityFactor(npc.personality.sociability);
    const socialBonus = 1 + 0.2 * personalityFactor(npc.personality.loyalty);
    return urgency(npc.needs.social) * sociabilityBonus * socialBonus * 7;
  },

  execute(npc, island) {
    const target = randomOtherNPC(npc, island);
    if (!target || target.status === 'sleeping') return null;

    npc.status = 'chatting';

    const relBefore = getRelationship(island, npc.id, target.id).score;
    npc.needs.social = clamp(npc.needs.social - 30, 0, 100);
    target.needs.social = clamp(target.needs.social - 15, 0, 100);

    // Sociability + Loyalty alignment
    const sociabilityAvg = (npc.personality.sociability + target.personality.sociability) / 2;
    const loyaltyAvg = (npc.personality.loyalty + target.personality.loyalty) / 2;
    const partnerBonus = npc.partnerId === target.id ? 4 : 0;
    const delta = clamp(5 + sociabilityAvg * 0.05 + loyaltyAvg * 0.05 + partnerBonus, 2, 15);
    changeRelationship(island, npc.id, target.id, delta);

    const relAfter = getRelationship(island, npc.id, target.id).score;
    if (relAfter >= 60 && relBefore < 60) {
      addEntry(
        island,
        `${npc.name} và ${target.name} trở thành bạn thân (quan hệ: ${Math.round(relAfter)}).`,
        'medium',
      );
    }
    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. COURTSHIP (Tán tỉnh & Tìm bạn đời)
// ─────────────────────────────────────────────────────────────────────────────
export const actionCourt: Action = {
  name: 'court',

  score(npc, island) {
    // Only single adults can court
    if (npc.partnerId !== null || npc.age < 18 || !npc.isAlive) return 0;
    if (npc.needs.hunger > 80 || npc.needs.rest > 85) return 0;

    // Look for available single adult opposite gender (or any single adult)
    const availableSingles = island.npcs.filter(
      (n) =>
        n.isAlive &&
        n.id !== npc.id &&
        n.age >= 18 &&
        n.partnerId === null &&
        n.gender !== npc.gender &&
        n.status !== 'sleeping' &&
        n.status !== 'fighting',
    );
    if (availableSingles.length === 0) return 0;

    // Sociability bonus: high sociability actively seeks romantic partners
    const sociabilityBonus = 1 + 0.6 * personalityFactor(npc.personality.sociability);
    // Age urgency: older unmarried NPCs feel more pressure/desire to settle down
    const ageUrgency = 1 + Math.max(0, (npc.age - 20) / 25);
    // Social need urgency
    const loneliness = urgency(npc.needs.social);

    return (0.4 + loneliness * 0.6) * sociabilityBonus * ageUrgency * 7.5;
  },

  execute(npc, island) {
    const availableSingles = island.npcs.filter(
      (n) =>
        n.isAlive &&
        n.id !== npc.id &&
        n.age >= 18 &&
        n.partnerId === null &&
        n.gender !== npc.gender &&
        n.status !== 'sleeping' &&
        n.status !== 'fighting',
    );
    if (availableSingles.length === 0) return null;

    // Prioritize candidate with highest existing relationship + slight random attraction
    const candidates = availableSingles.map((c) => {
      const relScore = getRelationship(island, npc.id, c.id).score;
      const attraction = relScore + rand(-10, 20);
      return { candidate: c, attraction, relScore };
    });
    candidates.sort((a, b) => b.attraction - a.attraction);
    const chosen = candidates[0];
    const target = chosen.candidate;

    npc.status = 'courting';

    // Courtship success probability based on relationship, sociability, and mutual compatibility
    const relFactor = (chosen.relScore + 100) / 200; // 0 to 1
    const socScore = (personalityFactor(npc.personality.sociability) + personalityFactor(target.personality.sociability)) / 2;
    const successChance = clamp(0.35 + relFactor * 0.4 + socScore * 0.25, 0.2, 0.95);

    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
      const bondGain = randInt(10, 18);
      changeRelationship(island, npc.id, target.id, bondGain);
      npc.needs.social = clamp(npc.needs.social - 35, 0, 100);
      target.needs.social = clamp(target.needs.social - 25, 0, 100);

      const newRel = getRelationship(island, npc.id, target.id).score;

      // Check if bond reaches threshold (≥60) to marry
      if (newRel >= 60 && npc.partnerId === null && target.partnerId === null) {
        npc.partnerId = target.id;
        target.partnerId = npc.id;
        addEntry(
          island,
          `💍 ${npc.name} (${npc.age}t) và ${target.name} (${target.age}t) chính thức kết đôi thành vợ chồng (điểm gắn bó: ${Math.round(newRel)})!`,
          'medium',
        );
      } else {
        addEntry(
          island,
          `💐 ${npc.name} tán tỉnh ${target.name} thành công (tình cảm: ${Math.round(newRel)}).`,
          'low',
        );
      }
    } else {
      // Rejection: slight embarrassment, minor relationship dip
      changeRelationship(island, npc.id, target.id, -4);
      npc.needs.social = clamp(npc.needs.social - 10, 0, 100);
      npc.needs.safety = clamp(npc.needs.safety + 5, 0, 100);

      addEntry(
        island,
        `💔 ${npc.name} ngỏ lời với ${target.name} nhưng bị từ chối khéo.`,
        'low',
      );
    }

    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. STEAL
// ─────────────────────────────────────────────────────────────────────────────
export const actionSteal: Action = {
  name: 'steal',

  score(npc, island) {
    // Children do not steal
    if (npc.occupation === 'child' || npc.age < 18) return 0;

    // Only greedy or very hungry NPCs steal
    const greedFactor = personalityFactor(npc.personality.greed); // 0-1
    const hungerFactor = urgency(npc.needs.hunger);
    const baseScore = (greedFactor * 0.6 + hungerFactor * 0.8) * 8;

    // Loyal NPCs heavily suppress this action
    const loyaltyPenalty = Math.max(0, npc.personality.loyalty / 100);
    const rawScore = baseScore * (1 - loyaltyPenalty * 0.8);

    // Need a viable victim with private food (exclude partner unless greed is extreme > 90)
    const potentialVictims = island.npcs.filter(
      (n) => n.isAlive && n.id !== npc.id && (npc.personality.greed > 90 || n.id !== npc.partnerId) && n.privateFood > 0,
    );
    if (potentialVictims.length === 0) return 0;

    // Cooldown penalty if all viable victims are currently on cooldown
    const hasNonCooldownVictim = potentialVictims.some(
      (v) => (npc.stealCooldowns.get(v.id) ?? 0) <= 0,
    );
    const cooldownFactor = hasNonCooldownVictim ? 1.0 : 0.25;

    return rawScore * cooldownFactor;
  },

  execute(npc, island) {
    const potentialVictims = island.npcs.filter(
      (n) => n.isAlive && n.id !== npc.id && (npc.personality.greed > 90 || n.id !== npc.partnerId) && n.privateFood > 0,
    );
    if (potentialVictims.length === 0) return null;

    // Score and rank candidates: prefer more food, avoid active cooldown, minor random jitter
    const candidates = potentialVictims.map((v) => {
      const cd = npc.stealCooldowns.get(v.id) ?? 0;
      const cdMult = cd > 0 ? 0.25 : 1.0;
      const weight = v.privateFood * cdMult * (1 + rand(-0.1, 0.1));
      return { victim: v, weight };
    });

    candidates.sort((a, b) => b.weight - a.weight);
    const victim = candidates[0].victim;

    npc.status = 'stealing';
    const stolenAmount = Math.min(victim.privateFood, randInt(10, 25));
    victim.privateFood -= stolenAmount;
    npc.privateFood += stolenAmount;
    npc.needs.hunger = clamp(npc.needs.hunger - 15, 0, 100); // morale boost

    // Apply steal cooldown: 7 ticks between (thief, victim)
    npc.stealCooldowns.set(victim.id, 7);

    // Detection check: loyalty of victim affects chance of noticing
    const detectionChance = 0.4 + 0.3 * personalityFactor(victim.personality.loyalty);
    const detected = Math.random() < detectionChance;

    const reason =
      npc.needs.hunger > 60
        ? `đói khát (${Math.round(npc.needs.hunger)})`
        : `lòng tham (${Math.round(npc.personality.greed)})`;

    addEntry(
      island,
      `${npc.name} trộm ${stolenAmount} lương thực của ${victim.name} vì ${reason}.`,
      'high',
    );

    if (detected) {
      changeRelationship(island, npc.id, victim.id, -30);
      victim.needs.safety = clamp(victim.needs.safety + 25, 0, 100);

      addEntry(
        island,
        `${victim.name} phát hiện! Quan hệ với ${npc.name} giảm mạnh (${Math.round(getRelationship(island, npc.id, victim.id).score)}).`,
        'high',
      );

      // Loyal victim might warn others
      if (victim.personality.loyalty > 40) {
        const bystander = randomOtherNPC(victim, island);
        if (bystander && bystander.id !== npc.id) {
          changeRelationship(island, bystander.id, npc.id, -10);
          addEntry(
            island,
            `${victim.name} tố cáo ${npc.name} với ${bystander.name}. Tiếng xấu lan ra.`,
            'medium',
          );
        }
      }
    }
    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. FIGHT
// ─────────────────────────────────────────────────────────────────────────────
export const actionFight: Action = {
  name: 'fight',

  score(npc, island) {
    // Children do not fight
    if (npc.occupation === 'child' || npc.age < 18) return 0;

    // Only brave NPCs fight; triggered by low relationship or threat
    const courageFactor = personalityFactor(npc.personality.courage);
    if (courageFactor < 0.55) return 0; // cowards don't fight

    // Hard cap: max 3 attacks per 10-tick day window
    if (npc.attacksThisDay >= 3) return 0;

    // Look for an enemy (relationship < −20, exclude spouse)
    const enemies = island.npcs.filter(
      (n) =>
        n.isAlive &&
        n.id !== npc.id &&
        n.id !== npc.partnerId &&
        n.occupation !== 'child' &&
        getRelationship(island, npc.id, n.id).score < -20,
    );
    if (enemies.length === 0) return 0;

    // Primary target = most hated; apply cooldown penalty if on cooldown
    enemies.sort(
      (a, b) =>
        getRelationship(island, npc.id, a.id).score -
        getRelationship(island, npc.id, b.id).score,
    );
    const primaryTarget = enemies[0];
    const cooldownRemaining = npc.attackCooldowns.get(primaryTarget.id) ?? 0;
    const cooldownPenalty = cooldownRemaining > 0 ? 0.15 : 1.0;

    const threatScore = urgency(npc.needs.safety);
    return courageFactor * (1 + threatScore) * 6 * cooldownPenalty;
  },

  execute(npc, island) {
    // Find the most-hated alive NPC (excluding spouse)
    const enemies = island.npcs
      .filter(
        (n) =>
          n.isAlive &&
          n.id !== npc.id &&
          n.id !== npc.partnerId &&
          n.occupation !== 'child' &&
          getRelationship(island, npc.id, n.id).score < -20,
      )
      .sort(
        (a, b) =>
          getRelationship(island, npc.id, a.id).score -
          getRelationship(island, npc.id, b.id).score,
      );

    const target = enemies[0];
    if (!target) return null;

    npc.status = 'fighting';
    target.status = 'fighting';

    // Combat resolution: courage + random
    const attackerPower =
      personalityFactor(npc.personality.courage) * 0.7 + Math.random() * 0.3;
    const defenderPower =
      personalityFactor(target.personality.courage) * 0.7 + Math.random() * 0.3;

    const attackerWins = attackerPower > defenderPower;

    const winner = attackerWins ? npc : target;
    const loser = attackerWins ? target : npc;

    // Winner gains some of loser's private food
    const loot = Math.min(loser.privateFood, randInt(5, 15));
    loser.privateFood -= loot;
    winner.privateFood += loot;

    // Both become more stressed
    npc.needs.safety = clamp(npc.needs.safety + 20, 0, 100);
    target.needs.safety = clamp(target.needs.safety + 30, 0, 100);

    // Loser's rest drops (injuries)
    loser.needs.rest = clamp(loser.needs.rest + 25, 0, 100);

    changeRelationship(island, npc.id, target.id, -20);

    addEntry(
      island,
      `⚔️ ${npc.name} tấn công ${target.name}! ${winner.name} thắng, cướp ${loot} lương thực. ${loser.name} bị thương.`,
      'high',
    );

    // Set per-target cooldown (8 ticks) and increment daily attack counter
    npc.attackCooldowns.set(target.id, 8);
    npc.attacksThisDay += 1;

    // Cowardly loser flees next tick
    if (loser.personality.courage < 0) {
      loser.needs.safety = clamp(loser.needs.safety + 20, 0, 100);
    }

    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. FLEE
// ─────────────────────────────────────────────────────────────────────────────
export const actionFlee: Action = {
  name: 'flee',

  score(npc, island) {
    // Cowardly NPCs flee when scared
    const cowardFactor = 1 - personalityFactor(npc.personality.courage); // 0 brave → 1 coward
    const threatFactor = urgency(npc.needs.safety);

    // Also flee if there's a known enemy nearby
    const hasEnemy = island.npcs.some(
      (n) =>
        n.isAlive &&
        n.id !== npc.id &&
        getRelationship(island, npc.id, n.id).score < -30,
    );

    if (!hasEnemy && npc.needs.safety < 40) return 0;
    return cowardFactor * threatFactor * 8;
  },

  execute(npc, island) {
    npc.status = 'fleeing';
    npc.needs.safety = clamp(npc.needs.safety - 30, 0, 100);
    npc.needs.rest = clamp(npc.needs.rest + 10, 0, 100); // running is tiring

    if (npc.needs.safety > 50 || npc.personality.courage < -30) {
      addEntry(
        island,
        `${npc.name} hoảng sợ (gan dạ: ${Math.round(npc.personality.courage)}), bỏ chạy khỏi nguy hiểm.`,
        'medium',
      );
    }
    return null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. PRAY
// ─────────────────────────────────────────────────────────────────────────────
export const actionPray: Action = {
  name: 'pray',

  score(npc, island) {
    // Pious NPCs pray frequently; scared/lonely NPCs also seek comfort
    const pietyFactor = personalityFactor(npc.personality.piety);
    const comfortNeed = (urgency(npc.needs.safety) + urgency(npc.needs.social)) / 2;
    // Non-pious NPCs only pray when desperate
    if (pietyFactor < 0.4 && comfortNeed < 0.3) return 0;
    return (pietyFactor * 0.7 + comfortNeed * 0.3) * 5;
  },

  execute(npc, island) {
    npc.status = 'praying';
    npc.needs.safety = clamp(npc.needs.safety - 15, 0, 100);
    npc.needs.social = clamp(npc.needs.social - 10, 0, 100);

    // If multiple NPCs pray in the same tick, communal bonus
    const praying = island.npcs.filter((n) => n.isAlive && n.status === 'praying').length;
    if (praying >= 3 && island.lastCommunalPrayerTick !== island.tick && (!island.civilization || island.tick % TICKS_PER_DAY === 0)) {
      island.lastCommunalPrayerTick = island.tick;
      island.npcs.forEach((n) => {
        if (n.isAlive) {
          n.needs.safety = clamp(n.needs.safety - 5, 0, 100);
          n.needs.social = clamp(n.needs.social - 5, 0, 100);
        }
      });
      addEntry(
        island,
        `🙏 ${praying} người dân cùng cầu nguyện, tinh thần chung tăng nhẹ.`,
        'medium',
      );
    }
    return null;
  },
};

// ── All actions registry ──────────────────────────────────────────────────────
export const ALL_ACTIONS: Action[] = [
  actionEat,
  actionSleep,
  actionWork,
  actionChat,
  actionCourt,
  actionSteal,
  actionFight,
  actionFlee,
  actionPray,
];
