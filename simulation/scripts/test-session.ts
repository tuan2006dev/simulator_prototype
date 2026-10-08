import { SimulationSession } from '../src/core/SimulationSession';
import { createIsland } from '../src/core/factory';

const island = createIsland('Session test', 5);
const session = new SimulationSession(island);
const adult = island.npcs.find(npc => npc.isAlive && npc.age >= 18)!;
if (!adult) throw new Error('Expected an adult NPC in the test island.');

const firstCommand = {
  playerId: 'player-a',
  sequence: 1,
  expectedRevision: 0,
  command: { type: 'assign_labor' as const, npcId: adult.id, role: 'wood' as const },
};
const accepted = session.submit(firstCommand);
if (!accepted.accepted || accepted.revision !== 1 || adult.laborRole !== 'wood') {
  throw new Error('Valid labor assignment was not applied.');
}

const duplicate = session.submit(firstCommand);
if (!duplicate.accepted || !duplicate.duplicate || session.revision !== 1) {
  throw new Error('Duplicate command was not idempotent.');
}

const stale = session.submit({
  playerId: 'player-a', sequence: 2, expectedRevision: 0,
  command: { type: 'assign_labor', npcId: adult.id, role: 'stone' },
});
if (stale.accepted || stale.reason !== 'stale_revision') throw new Error('Stale revision was accepted.');

const updated = session.submit({
  playerId: 'player-a', sequence: 2, expectedRevision: 1,
  command: { type: 'assign_labor', npcId: adult.id, role: 'stone' },
});
if (!updated.accepted || adult.laborRole !== 'stone') throw new Error('Fresh command was rejected.');

const child = island.npcs[0];
child.age = 10;
child.occupation = 'child';
const childAssignment = session.submit({
  playerId: 'player-a', sequence: 3, expectedRevision: 2,
  command: { type: 'assign_labor', npcId: child.id, role: 'food' },
});
if (childAssignment.accepted || childAssignment.reason !== 'npc_not_working_age') {
  throw new Error('A child was allowed to receive an adult labor assignment.');
}

const advanced = session.advanceTicks(10, false);
if (advanced.tick !== 10 || advanced.revision !== 12) throw new Error('Authoritative tick advancement is inconsistent.');

let rejectedBurst = false;
try { session.advanceTicks(11, false); } catch (error) { rejectedBurst = error instanceof RangeError; }
if (!rejectedBurst) throw new Error('Oversized tick burst was not rejected.');

console.log(JSON.stringify({ revision: session.revision, tick: island.tick, assignedRole: adult.laborRole, idempotentReplay: duplicate.duplicate }));
console.log('PASS: command ordering, idempotent replay, revision checks, labor validation, and bounded ticks.');
