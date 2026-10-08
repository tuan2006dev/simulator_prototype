// ============================================================
// AnimalSystem.ts — Phase 4: Animal AI, domestication, production
// Tick-based simulation: feeding, trust, breeding, production
// ============================================================

import type { Island, Animal, AnimalSpecies } from './types';
import { ANIMAL_CONFIG } from './types';
import { createAnimal } from './factory';
import { addEntry } from './chronicle';
import type { WorldMap } from '../renderer/WorldMap';

let _animalIdCounter = 1000;

// ── Tile walkability for animals ──────────────────────────────────────────────
function isAnimalWalkable(tile: string, species: AnimalSpecies): boolean {
  if (species === 'chicken') {
    return tile === 'grass' || tile === 'sand' || tile === 'forest';
  }
  return tile === 'grass' || tile === 'sand' || tile === 'forest';
}

// ── Random wander step ────────────────────────────────────────────────────────
function wanderAnimal(animal: Animal, map: WorldMap): void {
  if (Math.random() > 0.25) return; // 25% chance to move each tick
  const dirs = [
    { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
    { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
    { dx: -1, dy: -1 }, { dx: 1, dy: -1 },
    { dx: -1, dy: 1 }, { dx: 1, dy: 1 },
  ];
  const shuffled = [...dirs].sort(() => Math.random() - 0.5);
  for (const { dx, dy } of shuffled) {
    const nx = animal.tileX + dx;
    const ny = animal.tileY + dy;
    if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) continue;
    if (isAnimalWalkable(map.tiles[ny][nx], animal.species)) {
      animal.tileX = nx;
      animal.tileY = ny;
      break;
    }
  }
}

// ── Spawn wild animals on the map ─────────────────────────────────────────────
export function spawnWildAnimals(
  island: Island,
  map: WorldMap,
  species: AnimalSpecies,
  count: number,
): void {
  const cfg = ANIMAL_CONFIG[species];
  // Only spawn if below max
  const existing = island.animals.filter(a => a.species === species && a.isAlive).length;
  if (existing >= cfg.maxHerd) return;

  const landTiles = map.landTiles.filter(t => {
    const tile = map.tiles[t.y][t.x];
    return isAnimalWalkable(tile, species);
  });
  if (landTiles.length === 0) return;

  const toSpawn = Math.min(count, cfg.maxHerd - existing);
  for (let i = 0; i < toSpawn; i++) {
    const tile = landTiles[Math.floor(Math.random() * landTiles.length)];
    island.animals.push(createAnimal(species, tile.x, tile.y, 'wild'));
  }
}

// ── Feed an animal (called when player/NPC interacts) ─────────────────────────
export function feedAnimal(
  island: Island,
  animalId: string,
  foodAmount: number,
): { success: boolean; trustGain: number; domesticated: boolean } {
  const animal = island.animals.find(a => a.id === animalId && a.isAlive);
  if (!animal) return { success: false, trustGain: 0, domesticated: false };

  const cfg = ANIMAL_CONFIG[animal.species];

  // Cost: take food from island
  const cost = Math.min(foodAmount, island.sharedFood);
  if (cost <= 0) return { success: false, trustGain: 0, domesticated: false };
  island.sharedFood -= cost;

  // Trust gain proportional to food given
  const trustGain = Math.round((cost / 10) * 15);
  animal.trust = Math.min(100, animal.trust + trustGain);
  animal.status = 'taming';

  // Check domestication threshold
  if (animal.trust >= cfg.trustNeeded) {
    animal.status = 'domesticated';
    animal.trust = 100;
    addEntry(island, `🎉 ${cfg.icon} ${cfg.name} đã được thuần hóa! Nó sẽ bắt đầu sản xuất ${cfg.produceName || 'nguồn lợi'} cho đảo.`, 'high');
    return { success: true, trustGain, domesticated: true };
  }

  return { success: true, trustGain, domesticated: false };
}

// ── Main animal tick ──────────────────────────────────────────────────────────
export function tickAnimals(island: Island, map: WorldMap): void {
  const toAdd: Animal[] = [];

  for (const animal of island.animals) {
    if (!animal.isAlive) continue;

    const cfg = ANIMAL_CONFIG[animal.species];

    // Age animal (1 tick ≈ day/10)
    animal.age++;

    // Death from old age (cattle: 3000 ticks, chicken: 2000, dog: 4000)
    const maxAge = { cattle: 3000, chicken: 2000, dog: 4000 }[animal.species];
    if (animal.age > maxAge) {
      animal.isAlive = false;
      addEntry(island, `💀 ${cfg.icon} ${cfg.name} đã già và chết sau ${Math.floor(animal.age / 10)} ngày.`, 'low');
      continue;
    }

    // Wander
    wanderAnimal(animal, map);

    // Wild animals slowly lose trust if not fed
    if (animal.status === 'wild') {
      animal.trust = Math.max(0, animal.trust - 0.1);
      continue;
    }

    // Domesticated: consume food
    if (animal.status === 'domesticated' || animal.status === 'breeding' || animal.status === 'guarding') {
      if (island.sharedFood >= cfg.foodCostPerTick) {
        island.sharedFood -= cfg.foodCostPerTick;
      } else {
        // Starvation: lose trust
        animal.trust = Math.max(0, animal.trust - 2);
        if (animal.trust <= 0) {
          animal.status = 'wild';
          addEntry(island, `⚠️ ${cfg.icon} ${cfg.name} bị bỏ đói và quay lại hoang dã!`, 'medium');
        }
        continue;
      }

      // Production (cattle & chicken)
      if (cfg.produceInterval > 0) {
        animal.produceTick++;
        if (animal.produceTick >= cfg.produceInterval) {
          animal.produceTick = 0;
          island.sharedFood += cfg.produceFood;
          // Low priority log (don't spam)
          if (Math.random() < 0.15) {
            addEntry(island, `${cfg.icon} ${cfg.name} sản xuất ${cfg.produceName} (+${cfg.produceFood} thức ăn).`, 'low');
          }
        }
      }

      // Dog guarding: reduce safety need for nearby NPCs (applied in main tick)
      if (animal.species === 'dog') {
        animal.status = 'guarding';
      }

      // Breeding
      if (animal.breedCooldown > 0) {
        animal.breedCooldown--;
      } else {
        // Check if there's a mate of the same species
        const mates = island.animals.filter(
          b => b.isAlive && b.id !== animal.id &&
               b.species === animal.species &&
               (b.status === 'domesticated' || b.status === 'breeding' || b.status === 'guarding') &&
               b.breedCooldown === 0
        );
        const currentCount = island.animals.filter(a => a.species === animal.species && a.isAlive).length;

        if (mates.length > 0 && currentCount < cfg.maxHerd) {
          const mate = mates[0];
          // Spawn offspring near parent
          const offspring = createAnimal(
            animal.species, animal.tileX, animal.tileY,
            'domesticated', animal.id, mate.id,
          );
          toAdd.push(offspring);
          animal.breedCooldown = cfg.breedInterval;
          mate.breedCooldown = cfg.breedInterval;
          addEntry(island, `🐣 ${cfg.icon} ${cfg.name} mới ra đời! Đàn hiện có ${currentCount + 1} con.`, 'medium');
        }
      }
    }
  }

  // Add offspring
  island.animals.push(...toAdd);
}

// ── Dog bonus: reduce safety for all living NPCs ──────────────────────────────
export function applyDogGuardBonus(island: Island): void {
  const dogs = island.animals.filter(a => a.isAlive && a.species === 'dog' && a.status === 'guarding');
  if (dogs.length === 0) return;
  const bonus = dogs.length * ANIMAL_CONFIG.dog.guardBonus;
  for (const npc of island.npcs) {
    if (!npc.isAlive) continue;
    npc.needs.safety = Math.max(0, npc.needs.safety - bonus * 0.01);
  }
}

// ── Build FamilyNode tree from NPCs ──────────────────────────────────────────
import type { FamilyNode, Occupation } from './types';

export function buildFamilyTree(island: Island): FamilyNode[] {
  const npcById = new Map(island.npcs.map(n => [n.id, n]));

  // Memoised generation counter
  const genMemo = new Map<string, number>();
  function genOf(id: string, visiting = new Set<string>()): number {
    if (genMemo.has(id)) return genMemo.get(id)!;
    if (visiting.has(id)) return 0;
    const npc = npcById.get(id);
    if (!npc) return 0;
    const parents = [npc.motherId, npc.fatherId].filter((p): p is string => p !== null && npcById.has(p));
    if (parents.length === 0) { genMemo.set(id, 0); return 0; }
    const next = new Set(visiting).add(id);
    const gen = 1 + Math.max(...parents.map(p => genOf(p, next)));
    genMemo.set(id, gen);
    return gen;
  }

  const nodes: FamilyNode[] = island.npcs.map(npc => ({
    npcId:      npc.id,
    name:       npc.name.split('#')[0],
    gender:     npc.gender,
    age:        npc.age,
    isAlive:    npc.isAlive,
    occupation: npc.occupation as Occupation,
    motherId:   npc.motherId,
    fatherId:   npc.fatherId,
    generation: genOf(npc.id),
  }));

  // Cache on island
  island._familyNodes = nodes;
  return nodes;
}

// ── Save / Load helpers ───────────────────────────────────────────────────────
export const SAVE_KEY = 'dao_thien_nguyen_v1';

export interface SaveData {
  version: number;
  savedAt: number;
  island: {
    id: string; name: string; sharedFood: number;
    wood: number; stone: number; herbs: number; tick: number;
    npcs: any[]; buildings: any[]; chronicle: any[];
    animals: any[];
  };
  unlocks: string[];
  era: number;
  autoLevel: number;
  worldSeed: number;
  worldShape: string;
  worldSize: string;
}

export function saveGame(island: Island, gameState: any, worldSeed: number, worldShape: string, worldSize: string): void {
  try {
    const data: SaveData = {
      version: 4,
      savedAt: Date.now(),
      island: {
        id: island.id,
        name: island.name,
        sharedFood: island.sharedFood,
        wood: island.wood,
        stone: island.stone,
        herbs: island.herbs,
        tick: island.tick,
        npcs: island.npcs.map(npc => ({
          ...npc,
          attackCooldowns: [],
          stealCooldowns: [],
          path: undefined,
          actionTarget: undefined,
        })),
        buildings: island.buildings,
        chronicle: island.chronicle.slice(-200),
        animals: island.animals,
      },
      unlocks: [...gameState.unlocks],
      era: gameState.era,
      autoLevel: gameState.autoLevel,
      worldSeed,
      worldShape,
      worldSize,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    console.warn('[save] Failed to save game (localStorage full?)');
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data: SaveData = JSON.parse(raw);
    if (!data.version || data.version < 4) return null; // incompatible
    return data;
  } catch {
    return null;
  }
}

export function hasSaveGame(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSaveGame(): void {
  localStorage.removeItem(SAVE_KEY);
}
