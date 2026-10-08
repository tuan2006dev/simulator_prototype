import { once } from 'node:events';
import { startDevelopmentServer } from '../src/server/devServer';

const server = startDevelopmentServer(0);
async function main(): Promise<void> {
try {
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Server did not bind to a TCP port.');
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const invalidPopulation = await fetch(`${baseUrl}/api/islands`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ population: 99 }),
  });
  if (invalidPopulation.status !== 400) throw new Error('Invalid island configuration was accepted.');

  const createdResponse = await fetch(`${baseUrl}/api/islands`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ population: 5, seed: 321, shape: 'circle', size: 'small' }),
  });
  if (createdResponse.status !== 201) throw new Error('Could not create an authoritative island session.');
  const created = await createdResponse.json() as {
    islandId: string; connectionToken: string; revision: number;
    island: { npcs: Array<{ id: string; laborRole: string }> };
  };
  const npc = created.island.npcs[0];

  const commandResponse = await fetch(`${baseUrl}/api/islands/${created.islandId}/commands`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      connectionToken: created.connectionToken,
      sequence: 1,
      command: { type: 'assign_labor', npcId: npc.id, role: 'wood' },
      playerId: 'attacker-controlled-value',
    }),
  });
  const command = await commandResponse.json() as { accepted: boolean; revision: number };
  if (commandResponse.status !== 200 || !command.accepted) {
    throw new Error('Valid server command was rejected.');
  }

  const joinedResponse = await fetch(`${baseUrl}/api/islands/${created.islandId}/join`, { method: 'POST' });
  const joined = await joinedResponse.json() as {
    islandId: string; connectionToken: string; revision: number;
    island: { npcs: Array<{ id: string; laborRole: string }> };
    worldConfig: { seed: number; shape: string; size: string; startPop: number };
  };
  if (joinedResponse.status !== 200 || joined.islandId !== created.islandId ||
      joined.connectionToken === created.connectionToken || joined.island.npcs[0].laborRole !== 'wood' ||
      joined.worldConfig.seed !== 321) {
    throw new Error('Second client did not join the existing live island snapshot.');
  }

  const unauthenticatedCommand = await fetch(`${baseUrl}/api/islands/${created.islandId}/commands`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sequence: 1, command: { type: 'assign_labor', npcId: npc.id, role: 'stone' } }),
  });
  if (unauthenticatedCommand.status !== 401) throw new Error('Command without a session connection token was accepted.');

  const secondPlayerCommandResponse = await fetch(`${baseUrl}/api/islands/${created.islandId}/commands`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      connectionToken: joined.connectionToken,
      sequence: 1,
      command: { type: 'assign_labor', npcId: npc.id, role: 'stone' },
    }),
  });
  const secondPlayerCommand = await secondPlayerCommandResponse.json() as { accepted: boolean };
  if (secondPlayerCommandResponse.status !== 200 || !secondPlayerCommand.accepted) {
    throw new Error('A second client could not submit its independently sequenced command.');
  }

  const duplicateResponse = await fetch(`${baseUrl}/api/islands/${created.islandId}/commands`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      connectionToken: created.connectionToken,
      sequence: 1,
      command: { type: 'assign_labor', npcId: npc.id, role: 'wood' },
    }),
  });
  const duplicate = await duplicateResponse.json() as { accepted: boolean; duplicate?: boolean };
  if (duplicateResponse.status !== 200 || !duplicate.accepted || !duplicate.duplicate) {
    throw new Error('Server command replay was not idempotent.');
  }

  const forbiddenOrigin = await fetch(`${baseUrl}/api/health`, { headers: { origin: 'https://untrusted.example' } });
  if (forbiddenOrigin.status !== 403) throw new Error('Untrusted browser origin was allowed.');

  await new Promise(resolve => setTimeout(resolve, 1500));
  const clockProbe=await (await fetch(`${baseUrl}/api/islands/${created.islandId}`)).json() as {island:{tick:number;clock:{progressMs:number}}};
  if(clockProbe.island.tick!==0||clockProbe.island.clock.progressMs<=0||clockProbe.island.clock.progressMs>=12000)throw new Error('Server did not retain partial time before the 12-second step.');
  await new Promise(resolve => setTimeout(resolve, 11500));
  const snapshotResponse = await fetch(`${baseUrl}/api/islands/${created.islandId}`);
  const snapshot = await snapshotResponse.json() as { revision: number; island: { tick: number; npcs: Array<{ id: string; laborRole: string }> } };
  if (snapshot.island.tick !== 1 || snapshot.revision < 3 || snapshot.island.npcs[0].laborRole !== 'stone') {
    throw new Error('Second client command or server clock was not reflected in the shared authoritative snapshot.');
  }

  console.log(JSON.stringify({ revision: snapshot.revision, tick: snapshot.island.tick, joinedClients: 2, assignedRole: snapshot.island.npcs[0].laborRole }));
  console.log('PASS: join existing island, independent client identity/sequences, shared snapshots, authorization, idempotency, and autonomous ticking.');
} finally {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
}

void main();
