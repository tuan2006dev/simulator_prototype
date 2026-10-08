// ============================================================
// factory.ts — NPC and Island factory functions
// ============================================================

import type { Island, NPC, Occupation, Personality, Animal, AnimalSpecies } from './types';
import { changeRelationship, clamp, randInt, randPick } from './utils';

// Vietnamese name parts for generated NPCs
const MALE_NAMES = [
  'An', 'Bình', 'Dũng', 'Hùng', 'Nam', 'Phi', 'Quân', 'Sơn',
  'Tuấn', 'Lực', 'Bảo', 'Cát', 'Hải', 'Phong', 'Trí', 'Đạt',
  'Khang', 'Minh', 'Long', 'Đức', 'Thắng', 'Kiên', 'Việt', 'Tùng',
];

const FEMALE_NAMES = [
  'Chi', 'Em', 'Hà', 'Lan', 'Mai', 'Ngọc', 'Thu', 'Uyên',
  'Vân', 'Xuan', 'Yến', 'Thảo', 'Diệu', 'Hồng', 'Linh', 'Trang',
  'Hương', 'Quỳnh', 'Ánh', 'Dung', 'Tâm', 'Hân', 'Nhi', 'Trâm',
];

const OCCUPATIONS: Occupation[] = ['farmer', 'gatherer', 'warrior', 'elder', 'craftsman'];
const OCCUPATION_WEIGHTS = [0.35, 0.25, 0.15, 0.10, 0.15];

export function weightedOccupation(): Occupation {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < OCCUPATIONS.length; i++) {
    cumulative += OCCUPATION_WEIGHTS[i];
    if (r < cumulative) return OCCUPATIONS[i];
  }
  return 'farmer';
}

export function assignAdultOccupation(npc: NPC): Occupation {
  // Assign occupation dynamically based on personality inclinations
  if (npc.personality.courage > 40 && Math.random() < 0.6) {
    return 'warrior';
  }
  if (npc.personality.sociability > 40 && npc.personality.piety > 20 && Math.random() < 0.5) {
    return 'elder';
  }
  if (npc.personality.loyalty > 20 && Math.random() < 0.5) {
    return 'farmer';
  }
  if (npc.personality.greed < 0 && Math.random() < 0.5) {
    return 'gatherer';
  }
  return weightedOccupation();
}

export function randomPersonality(): Personality {
  return {
    courage: randInt(-80, 80),
    greed: randInt(-60, 80),
    loyalty: randInt(-40, 90),
    piety: randInt(-50, 80),
    sociability: randInt(-70, 85),
  };
}

let _npcCounter = 0;

export function createNPC(nameOverride?: string, genderOverride?: 'male' | 'female', ageOverride?: number): NPC {
  _npcCounter += 1;
  const gender = genderOverride ?? (Math.random() < 0.5 ? 'male' : 'female');
  const name = nameOverride ?? (gender === 'male' ? randPick(MALE_NAMES) : randPick(FEMALE_NAMES));
  return {
    id: `npc_${_npcCounter}`,
    name: `${name}#${_npcCounter}`,
    age: ageOverride ?? randInt(18, 50),
    gender,
    needs: {
      hunger: randInt(5, 40),
      rest: randInt(5, 35),
      safety: randInt(0, 20),
      social: randInt(10, 50),
    },
    personality: randomPersonality(),
    occupation: weightedOccupation(),
    laborRole: 'food',
    status: 'idle',
    isAlive: true,
    privateFood: randInt(5, 20),
    lastAction: 'none',
    // Romance & Reproduction
    partnerId: null,
    motherId: null,
    fatherId: null,
    isPregnant: false,
    pregnancyDaysLeft: 0,
    // Balance v2
    attackCooldowns: new Map(),
    stealCooldowns: new Map(),
    hungerTicks: 0,
    attacksThisDay: 0,
    position: null,
  };
}

/**
 * Creates a child inheriting personality traits from Mother and Father with mutation (±15)
 */
export function createChildNPC(mother: NPC, father: NPC, island: Island): NPC {
  _npcCounter += 1;
  const gender: 'male' | 'female' = Math.random() < 0.5 ? 'male' : 'female';
  const name = gender === 'male' ? randPick(MALE_NAMES) : randPick(FEMALE_NAMES);

  const inheritAxis = (motherVal: number, fatherVal: number): number => {
    const avg = (motherVal + fatherVal) / 2;
    const mutation = randInt(-15, 15);
    return clamp(Math.round(avg + mutation), -100, 100);
  };

  const childPersonality: Personality = {
    courage: inheritAxis(mother.personality.courage, father.personality.courage),
    greed: inheritAxis(mother.personality.greed, father.personality.greed),
    loyalty: inheritAxis(mother.personality.loyalty, father.personality.loyalty),
    piety: inheritAxis(mother.personality.piety, father.personality.piety),
    sociability: inheritAxis(mother.personality.sociability, father.personality.sociability),
  };

  const child: NPC = {
    id: `npc_${_npcCounter}`,
    name: `${name}#${_npcCounter}`,
    age: 0,
    gender,
    needs: {
      hunger: randInt(5, 20),
      rest: randInt(5, 20),
      safety: 0,
      social: randInt(10, 30),
    },
    personality: childPersonality,
    occupation: 'child',
    laborRole: 'food',
    status: 'idle',
    isAlive: true,
    privateFood: 5,
    lastAction: 'none',
    partnerId: null,
    motherId: mother.id,
    fatherId: father.id,
    isPregnant: false,
    pregnancyDaysLeft: 0,
    attackCooldowns: new Map(),
    stealCooldowns: new Map(),
    hungerTicks: 0,
    attacksThisDay: 0,
    position: null,
  };

  // Strong initial bond between child and parents (+80)
  changeRelationship(island, child.id, mother.id, 80);
  changeRelationship(island, child.id, father.id, 80);

  return child;
}

let _animalCounter = 0;
/** Continue identifiers after restoring a world in a fresh browser runtime. */
export function reserveEntityIds(island: Island): void {
  for (const npc of island.npcs) { const number = Number(npc.id.match(/^npc_(\d+)$/)?.[1]); if (Number.isSafeInteger(number)) _npcCounter = Math.max(_npcCounter, number); }
  for (const animal of island.animals) { const number = Number(animal.id.match(/_(\d+)$/)?.[1]); if (Number.isSafeInteger(number)) _animalCounter = Math.max(_animalCounter, number); }
}

export function createAnimal(
  species: AnimalSpecies,
  tileX: number,
  tileY: number,
  status: 'wild' | 'domesticated' = 'wild',
  motherId: string | null = null,
  fatherId: string | null = null,
): Animal {
  _animalCounter++;
  return {
    id: `animal_${species}_${_animalCounter}`,
    species,
    status,
    isAlive: true,
    trust: status === 'domesticated' ? 100 : 0,
    age: randInt(1, 60),
    tileX,
    tileY,
    produceTick: 0,
    breedCooldown: randInt(0, 100),
    motherId,
    fatherId,
  };
}

export function createIsland(name: string, npcCount: number): Island {
  const npcs: NPC[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < npcCount; i++) {
    const gender: 'male' | 'female' = i % 2 === 0 ? 'male' : 'female';
    const namePool = gender === 'male' ? MALE_NAMES : FEMALE_NAMES;

    let baseName: string;
    let attempts = 0;
    do {
      baseName = randPick(namePool);
      attempts++;
    } while (usedNames.has(baseName) && attempts < 50);
    usedNames.add(baseName);
    npcs.push(createNPC(baseName, gender));
  }

  // Start with enough hands on food to cover basic needs, then split the rest
  // between materials so the player has meaningful priorities from day one.
  const adults = npcs.filter(npc => npc.age >= 18);
  const foodWorkers = Math.ceil(adults.length * 0.5);
  adults.forEach((npc, index) => {
    npc.laborRole = index < foodWorkers ? 'food' : (index - foodWorkers) % 2 === 0 ? 'wood' : 'stone';
  });

  return {
    id: 'island_1',
    name,
    npcs,
    sharedFood: npcCount * 8,
    wood:  50,    // starting wood — enough for first Farm/Lumbercamp
    stone: 30,    // starting stone
    herbs: 0,
    tick: 0,
    relationships: new Map(),
    chronicle: [],
    buildings: [],
    resources: new Map(),
    animals: [],  // Phase 4: populated after domestication research
  };
}
