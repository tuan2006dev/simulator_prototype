import { createIsland } from '../src/core/factory';
import { tick } from '../src/core/engine';

const populationSizes = [5, 8, 15];
const days = 30;

for (const population of populationSizes) {
  const island = createIsland(`Labor test ${population}`, population);
  island.sharedFood = population * 5; // match the playable Era 0 starting stock
  island.wood = 0;
  island.stone = 0;

  for (let i = 0; i < days * 10; i++) tick(island, { runAI: false });

  const alive = island.npcs.filter(npc => npc.isAlive).length;
  const output = {
    population,
    days,
    alive,
    food: Math.round(island.sharedFood),
    wood: Math.round(island.wood),
    stone: Math.round(island.stone),
    foodWorkers: island.npcs.filter(npc => npc.laborRole === 'food').length,
  };
  console.log(JSON.stringify(output));

  if (alive < population || island.sharedFood <= 0 || island.wood <= 0 || island.stone <= 0) {
    throw new Error(`Labor survival scenario failed at population ${population}.`);
  }
}

console.log(`PASS: ${populationSizes.length} populations survived ${days} days using assigned daily labor only.`);
