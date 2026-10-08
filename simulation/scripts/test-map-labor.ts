import assert from 'node:assert/strict';
import { createIsland } from '../src/core/factory';
import { SimulationSession } from '../src/core/SimulationSession';
import { generateWorldMap } from '../src/renderer/WorldMap';

function fixture() {
  const map = generateWorldMap(50, 35, 321);
  map.tiles = Array.from({ length: 35 }, () => Array(50).fill('grass'));
  const island = createIsland('Map labor', 1);
  const npc = island.npcs[0];
  npc.age = 25; npc.occupation = 'gatherer'; npc.laborRole = 'wood';
  npc.needs.hunger = npc.needs.rest = 0;
  npc.position = { tileX: 2, tileY: 2 };
  island.wood = island.stone = 0; island.sharedFood = 100;
  island.resources = new Map([['6,2', { type: 'wood_tree', amount: 7, maxAmount: 7, regenRate: 0 }]]);
  return { map, island, npc, session: new SimulationSession(island, map) };
}
const advance = (session: SimulationSession, n: number) => { for (let i = 0; i < n; i++) session.advanceTicks(); };

{
  const { island, npc, session } = fixture();
  advance(session, 4);
  assert.deepEqual(npc.position, { tileX: 6, tileY: 2 });
  assert.equal(island.wood, 0, 'Walking must not generate resources');
  advance(session, 9); assert.equal(island.wood, 0);
  advance(session, 1); assert.equal(island.wood, 3);
  assert.equal(island.resources.get('6,2')!.amount, 4);
  advance(session, 20); assert.equal(island.wood, 7, 'Partial final harvest must conserve resource amounts');
  advance(session, 11); assert.equal(island.wood, 7);
  assert.match(npc.laborMessage!, /Hết tài nguyên/);
}
{
  const { island, npc, session } = fixture();
  advance(session, 2);
  assert(session.submit({ playerId: 'test', sequence: 1, command: { type: 'assign_labor', npcId: npc.id, role: 'idle' } }).accepted);
  const pos = { ...npc.position! }; advance(session, 20);
  assert.deepEqual(npc.position, pos); assert.equal(island.wood, 0);
  session.submit({ playerId: 'test', sequence: 2, command: { type: 'assign_labor', npcId: npc.id, role: 'wood' } });
  advance(session, 12); assert.equal(island.wood, 3);
}
{
  const { map, island, npc, session } = fixture();
  for (let y = 0; y < 35; y++) map.tiles[y][4] = 'deep_water';
  advance(session, 30); assert.equal(island.wood, 0);
  assert.match(npc.laborMessage!, /Không có đường/);
  map.tiles[2][4] = 'grass'; advance(session, 25); assert(island.wood >= 3, 'Blocked workers must retry after terrain changes');
}
{
  const { island, npc, session } = fixture();
  npc.position = null; advance(session, 20); assert.equal(island.wood, 0);
  npc.position = { tileX: 2, tileY: 2 }; npc.age = 10; advance(session, 20); assert.equal(island.wood, 0);
}
{
  const { island, npc, session } = fixture();
  advance(session, 4);
  session.submit({ playerId: 'test', sequence: 1, command: { type: 'manual_action', npcId: npc.id, action: 'chop_wood' } });
  assert.equal(island.wood, 3, 'Manual harvest replaces pending automatic harvest');
  advance(session, 10); assert.equal(island.wood, 6, 'Assigned labor resumes after manual command');
}
console.log('PASS: map labor movement, timed harvest, depletion, partial yield, role changes, blocked routes/retry, unplaced/child exclusion, and manual override.');
