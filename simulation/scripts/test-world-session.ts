import { createIsland } from '../src/core/factory';
import { SimulationSession } from '../src/core/SimulationSession';
import { findPath } from '../src/core/pathfinding';
import { generateWorldMap } from '../src/renderer/WorldMap';
import { spawnResources } from '../src/renderer/ResourceSpawner';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const map = generateWorldMap(50, 35, 321, 'circle');
const island = createIsland('Test island', 5);
island.resources = spawnResources(map, 321);
const npc = island.npcs.find(candidate => candidate.age >= 18)!;
assert(npc, 'Test island should contain an adult NPC.');
npc.laborRole = 'idle';
const session = new SimulationSession(island, map);

const tree = [...island.resources.entries()].find(([, node]) => node.type === 'wood_tree' && node.amount >= 3);
assert(tree, 'Seeded test map should contain a harvestable tree.');
const [treeKey, treeNode] = tree;
const [treeX, treeY] = treeKey.split(',').map(Number);
const start = map.landTiles
  .map(tile => ({ tile, path: findPath(map, tile.x, tile.y, treeX, treeY) }))
  .filter(candidate => candidate.path !== null && candidate.path.length >= 4)
  .sort((a, b) => a.path!.length - b.path!.length)[0];
assert(start, 'Tree should be reachable from at least one land tile.');

const submit = (sequence: number, command: Parameters<SimulationSession['submit']>[0]['command']) =>
  session.submit({ playerId: 'test-player', sequence, command });

assert(!submit(1, { type: 'place_npc', npcId: npc.id, tileX: 0, tileY: 0 }).accepted,
  'Water placement should be rejected.');
assert(submit(1, { type: 'place_npc', npcId: npc.id, tileX: start.tile.x, tileY: start.tile.y }).accepted,
  'Valid land placement should be accepted.');
assert(submit(2, { type: 'place_npc', npcId: npc.id, tileX: start.tile.x, tileY: start.tile.y }).reason === 'already_placed',
  'An already placed NPC should not be teleportable.');
assert(submit(2, { type: 'manual_action', npcId: npc.id, action: 'chop_wood' }).accepted,
  'A valid manual harvest order should be accepted.');
assert(npc.path && npc.path.length >= 4, 'Harvest order should queue a real movement path.');

for (let i = 0; i < 120 && npc.actionTarget; i++) session.advanceTicks(1, false);
assert(!npc.actionTarget, 'Harvest order should finish within 120 server ticks.');
assert(island.wood >= 3, 'Completing the harvest order should increase authoritative wood.');
assert(npc.position !== null && (npc.position.tileX !== start.tile.x || npc.position.tileY !== start.tile.y),
  'NPC should move along its server-owned path to the resource.');
assert(treeNode.amount < treeNode.maxAmount, 'Harvest should deplete the authoritative resource node.');

const snapshot = session.snapshot();
assert(snapshot.island.resources && Array.isArray((snapshot.island.resources as { entries: unknown[] }).entries),
  'Snapshot should serialize resource Map entries for clients.');

console.log(JSON.stringify({
  tick: island.tick,
  wood: island.wood,
  remainingTree: treeNode.amount,
  npcPosition: npc.position,
  revision: session.revision,
}));
console.log('PASS: authoritative placement validation, anti-teleport, movement, harvest, depletion, and snapshot serialization.');
