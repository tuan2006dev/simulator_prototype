import assert from 'node:assert/strict';
import { createIsland } from '../src/core/factory';
import { SimulationSession } from '../src/core/SimulationSession';
import { placeBuilding, assignWorker, removeWorker, upgradeBuilding, upgradeCost, tickBuildings, foodCapacity } from '../src/renderer/BuildingManager';
import { generateWorldMap } from '../src/renderer/WorldMap';
import { findPath } from '../src/core/pathfinding';
import { settlerCapacity } from '../src/core/settlers';

function fixture(pop = 1) {
  const map = generateWorldMap(50, 35, 321);
  map.tiles = Array.from({ length: 35 }, () => Array(50).fill('grass'));
  const island = createIsland('Building test', pop);
  island.wood = island.stone = 1000; island.sharedFood = 300;
  island.npcs.forEach((n, i) => { n.age = 25; n.occupation = 'gatherer'; n.laborRole = 'idle'; n.position = { tileX: 2 + i, tileY: 2 }; n.needs.hunger = n.needs.rest = 0; });
  return { map, island, npc: island.npcs[0], session: new SimulationSession(island, map) };
}
function advance(s: SimulationSession, n: number) { for (let i = 0; i < n; i++) s.advanceTicks(); }
{
  const { island, npc, session } = fixture();
  const b = placeBuilding(island, 'house', 6, 2)!;
  advance(session, 10); assert.equal(b.progress, 0, 'No free construction without builders');
  assert.equal(settlerCapacity(island), 15);
  assert(assignWorker(island, b.id, npc.id));
  advance(session, 4); assert.equal(b.progress, 0, 'Walking does not count as construction');
  assert.deepEqual(npc.position, { tileX: 6, tileY: 2 });
  advance(session, 20); assert(b.complete); assert.equal(settlerCapacity(island), 20);
  assert.equal(b.workers.length, 0, 'House builders return to their labor priority');
  const cost = upgradeCost(b), before = island.wood;
  assert.equal(upgradeBuilding(island, b.id), null); assert.equal(island.wood, before - cost.wood);
  assert(upgradeBuilding(island, b.id)); assert.equal(island.wood, before - cost.wood, 'Repeated upgrade must not charge twice');
  advance(session, 10); assert.equal(b.upgrade?.progress, 0); assert.equal(settlerCapacity(island), 20);
  assert(assignWorker(island, b.id, npc.id)); advance(session, 40);
  assert.equal(b.level, 2); assert.equal(settlerCapacity(island), 25);
  assert.equal(upgradeBuilding(island, b.id), null); assert(assignWorker(island, b.id, npc.id));
  advance(session, 50); assert.equal(b.level, 3); assert.equal(settlerCapacity(island), 30);
  const maxWood = island.wood; assert(upgradeBuilding(island, b.id)); assert.equal(island.wood, maxWood);
}
{
  const { island, npc, session } = fixture();
  const camp = placeBuilding(island, 'lumbercamp', 6, 2)!; camp.complete = true;
  island.resources.set('7,2', { type: 'wood_tree', amount: 8, maxAmount: 8, regenRate: 0 });
  island.resources.set('6,2', { type: 'stone_deposit', amount: 100, maxAmount: 100, regenRate: 0 });
  island.wood = 0; npc.laborRole = 'wood'; assignWorker(island, camp.id, npc.id);
  advance(session, 4); assert.equal(island.wood, 0);
  advance(session, 10); assert.equal(island.wood, 6, 'Camp output cannot stack with basic labor');
  assert.equal(island.resources.get('6,2')!.amount, 100, 'Lumbercamp cannot consume stone');
  advance(session, 20); assert.equal(island.wood, 8); assert.match(camp.workMessage!, /Hết tài nguyên/);
  island.wood = 100;
  const farm = placeBuilding(island, 'farm', 3, 2)!; farm.complete = true;
  assert(assignWorker(island, farm.id, npc.id)); assert(!camp.workers.includes(npc.id));
  removeWorker(island, farm.id, npc.id); assert(!npc.buildingWork);
}
{
  const { island, npc, session } = fixture();
  const farm = placeBuilding(island, 'farm', 2, 2)!; farm.complete = true; farm.level = 2;
  island.resources.set('3,2', { type: 'fertile_soil', amount: 1, maxAmount: 1, regenRate: 0 });
  island.sharedFood = 100; assignWorker(island, farm.id, npc.id); advance(session, 10);
  assert.equal(island.sharedFood, 137.5, 'Level 2 farm applies fertile soil and produces once per 10 ticks');
  island.sharedFood = 299; advance(session, 10); assert.equal(island.sharedFood, 300);
  const store = placeBuilding(island, 'storehouse', 5, 5)!;
  assert.equal(foodCapacity(island), 300); store.complete = true; assert.equal(foodCapacity(island), 700);
  store.level = 3; assert.equal(foodCapacity(island), 1500);
  island.wood = 0; const before = island.stone; assert(upgradeBuilding(island, farm.id)); assert.equal(island.stone, before);
}
{
  const { map, island, npc, session } = fixture();
  for (let y = 0; y < 35; y++) map.tiles[y][4] = 'shallow_water';
  assert.equal(findPath(map, 2, 2, 6, 2), null);
  const bridge = placeBuilding(island, 'bridge', 4, 2)!;
  bridge.complete = true; advance(session, 1); assert(findPath(map, 2, 2, 6, 2));
  const house = placeBuilding(island, 'house', 6, 2)!;
  npc.age = 10; assert(!assignWorker(island, house.id, npc.id)); npc.age = 25;
  npc.position = null; assert(!assignWorker(island, house.id, npc.id));
}
console.log('PASS: onsite construction, housing/upgrades/costs/max level, exclusive worker assignment, resource type/depletion, farm levels/fertility, storage capacity, bridges, and child/unplaced rejection.');
