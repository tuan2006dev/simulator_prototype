// ============================================================
// ResourceSpawner.ts — Phase 3: Cluster-based resource layer
// Spawns ResourceNodes on WorldMap tiles based on biome rules
// ============================================================

import type { ResourceNode, ResourceType } from '../core/types';
import type { WorldMap } from './WorldMap';
import { randInt } from '../core/utils';

// ── Seeded pseudo-random (deterministic given seed) ──────────────────────────
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Spawn rules per resource type ────────────────────────────────────────────
interface SpawnRule {
  type:       ResourceType;
  terrain:    string[];
  condition?: (elevation: number, moisture: number) => boolean;
  spawnChance: number;   // 0-1 base chance per cluster center
  minAmount:  number;
  maxAmount:  number;
  regenRate:  number;    // 0 = non-renewable
  clusters:   [number, number]; // [min, max] number of cluster centers
  radius:     [number, number]; // [min, max] radius of cluster in tiles
  falloff:    number;    // 0-1, how quickly density drops with distance
}

const SPAWN_RULES: SpawnRule[] = [
  {
    type: 'wood_tree',
    terrain: ['forest'],
    spawnChance: 0.80,
    minAmount: 40, maxAmount: 120, regenRate: 0.5,
    clusters: [4, 7], radius: [5, 8], falloff: 0.7,
  },
  {
    type: 'wood_tree',
    terrain: ['grass'],
    condition: (_, m) => m > 0.5,
    spawnChance: 0.25,
    minAmount: 15, maxAmount: 50, regenRate: 0.2,
    clusters: [2, 4], radius: [2, 4], falloff: 0.5,
  },
  {
    type: 'stone_deposit',
    terrain: ['mountain'],
    spawnChance: 0.70,
    minAmount: 80, maxAmount: 200, regenRate: 0,
    clusters: [3, 5], radius: [3, 5], falloff: 0.6,
  },
  {
    type: 'stone_deposit',
    terrain: ['grass'],
    condition: (e) => e > 0.5,
    spawnChance: 0.15,
    minAmount: 30, maxAmount: 80, regenRate: 0,
    clusters: [1, 3], radius: [2, 3], falloff: 0.4,
  },
  {
    type: 'herb_patch',
    terrain: ['grass'],
    condition: (_, m) => m > 0.4,
    spawnChance: 0.30,
    minAmount: 20, maxAmount: 60, regenRate: 1.0,
    clusters: [5, 8], radius: [2, 4], falloff: 0.6,
  },
  {
    type: 'fish_spot',
    terrain: ['shallow_water'],
    spawnChance: 0.40,
    minAmount: 50, maxAmount: 150, regenRate: 2.0,
    clusters: [4, 6], radius: [2, 3], falloff: 0.5,
  },
  {
    type: 'copper_vein',
    terrain: ['mountain'],
    condition: (e) => e > 0.75,
    spawnChance: 0.25,
    minAmount: 100, maxAmount: 300, regenRate: 0,
    clusters: [1, 3], radius: [2, 4], falloff: 0.5,
  },
  {
    type: 'fertile_soil',
    terrain: ['grass'],
    condition: (_, m) => m > 0.6,
    spawnChance: 0.35,
    minAmount: 1, maxAmount: 1, regenRate: 0, // purely a buff marker
    clusters: [3, 5], radius: [4, 6], falloff: 0.4,
  },
];

// ── The resource map (tileX, tileY) → ResourceNode ───────────────────────────
export type ResourceMap = Map<string, ResourceNode>;

function key(x: number, y: number): string { return `${x},${y}`; }

// ── Spawn resources onto the world map ────────────────────────────────────────
export function spawnResources(map: WorldMap, seed: number): ResourceMap {
  if(map.archipelago)return spawnArchipelagoResources(map);
  const rng    = seededRand(seed + 999); // different seed from terrain
  const result: ResourceMap = new Map();
  const { width, height, tiles } = map;

  // We store elevation/moisture; WorldMap has to expose them
  // Use tile type as proxy (best we have without full data)

  for (const rule of SPAWN_RULES) {
    const numClusters = randIntRng(rng, rule.clusters[0], rule.clusters[1]);

    // Collect candidate tiles matching this rule's terrain
    const candidates: [number, number][] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (rule.terrain.includes(tiles[y][x])) {
          candidates.push([x, y]);
        }
      }
    }
    if (candidates.length === 0) continue;

    // Pick cluster centers randomly
    for (let c = 0; c < numClusters; c++) {
      const [cx, cy] = candidates[Math.floor(rng() * candidates.length)];
      const radius   = randIntRng(rng, rule.radius[0], rule.radius[1]);

      // Spawn within radius of center
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const tx = cx + dx;
          const ty = cy + dy;
          if (tx < 0 || ty < 0 || tx >= width || ty >= height) continue;
          if (!rule.terrain.includes(tiles[ty][tx])) continue;
          if (result.has(key(tx, ty))) continue; // tile already has resource

          // Distance falloff — further from center = less likely
          const dist   = Math.sqrt(dx*dx + dy*dy);
          const prob   = rule.spawnChance * Math.pow(1 - dist / (radius + 1), rule.falloff * 2);
          if (rng() > prob) continue;

          const amount = randIntRng(rng, rule.minAmount, rule.maxAmount);
          result.set(key(tx, ty), {
            type:      rule.type,
            amount,
            maxAmount: amount,
            regenRate: rule.regenRate,
          });
        }
      }
    }
  }

  // Ensure the first metal chain has an approachable deposit, even when earlier
  // stone clusters occupied all of the randomly selected mountain sites.
  const approachable = [...result].some(([key, node]) => {
    const [x,y] = key.split(',').map(Number);
    return node.type === 'copper_vein' && map.landTiles.some(t => Math.max(Math.abs(t.x-x),Math.abs(t.y-y)) <= 2);
  });
  if (!approachable) {
    const candidate = map.landTiles.find(t => !result.has(key(t.x,t.y)) && tiles[t.y][t.x] === 'grass');
    if (candidate) result.set(key(candidate.x,candidate.y), {type:'copper_vein',amount:240,maxAmount:240,regenRate:0});
  }
  ensureClayDeposits(map, result);
  ensureIronDeposits(map, result);
  return result;
}

/** Each named island has its own stream; stock is in world deposits, never gifted to a player. */
function spawnArchipelagoResources(map:WorldMap):ResourceMap{
 const result:ResourceMap=new Map();
 for(const region of map.archipelago!.islands){const {bounds:b}=region;
  const local:WorldMap={width:b.width,height:b.height,tiles:Array.from({length:b.height},(_,y)=>Array.from({length:b.width},(_,x)=>map.archipelago!.regions.get(key(x+b.x,y+b.y))===region.id?map.tiles[y+b.y][x+b.x]:'deep_water')),landTiles:[]};
  local.tiles.forEach((row,y)=>row.forEach((t,x)=>{if(['grass','forest','sand'].includes(t))local.landTiles.push({x,y});}));
  const nodes=spawnResources(local,region.seed),rng=seededRand(region.seed+7187);
  if(region.id==='than-ngu'){
   for(let y=0;y<local.height;y++)for(let x=0;x<local.width;x++)if(local.tiles[y][x]==='shallow_water'&&!nodes.has(key(x,y))&&rng()<.7)nodes.set(key(x,y),{type:'fish_spot',amount:200,maxAmount:200,regenRate:3});
   for(const node of nodes.values()){if(node.type==='fish_spot'){node.amount=Math.max(200,node.amount*2);node.maxAmount=node.amount;node.regenRate=3;}if(node.type==='wood_tree'){node.amount=Math.max(80,node.amount);node.maxAmount=node.amount;node.regenRate=.8;}}
  }
  if(region.id==='rang-nanh'){
   let food=0,fish=0,wood=0;
   for(const [k,node] of nodes){if(node.type==='herb_patch'&&++food>2||node.type==='fish_spot'&&++fish>3||node.type==='wood_tree'&&++wood>4){nodes.delete(k);continue;}if(['herb_patch','fish_spot','wood_tree'].includes(node.type)){node.amount=20;node.maxAmount=20;node.regenRate=.2;}if(node.type==='stone_deposit'){node.amount=Math.max(240,node.amount*3);node.maxAmount=node.amount;}}
   for(let y=0;y<local.height;y++)for(let x=0;x<local.width;x++)if(local.tiles[y][x]==='mountain'&&!nodes.has(key(x,y))&&rng()<.45)nodes.set(key(x,y),{type:'stone_deposit',amount:360,maxAmount:360,regenRate:0});
  }
  if(region.id==='thien-nguyen'){
   const landing={x:region.landing.x-b.x,y:region.landing.y-b.y},near=local.landTiles.filter(p=>(p.x!==landing.x||p.y!==landing.y)&&Math.max(Math.abs(p.x-landing.x),Math.abs(p.y-landing.y))<=3).sort((a,c)=>Math.hypot(a.x-landing.x,a.y-landing.y)-Math.hypot(c.x-landing.x,c.y-landing.y));
   nodes.delete(key(landing.x,landing.y));
   // Reserve distinct nearby harvest sites, including on poor random cluster rolls.
   const used=new Set<string>();for(const type of ['herb_patch','wood_tree','stone_deposit'] as const){const p=near.find(p=>!used.has(key(p.x,p.y))&&(type!=='herb_patch'||local.tiles[p.y][p.x]==='grass'));if(!p)throw new Error('Đảo chính thiếu khu vực sinh tồn.');const k=key(p.x,p.y);used.add(k);const amount=type==='herb_patch'?120:type==='wood_tree'?120:180;nodes.set(k,{type,amount,maxAmount:amount,regenRate:type==='herb_patch'?1:type==='wood_tree'?.5:0});}
  }
  for(const [k,node] of nodes){const [x,y]=k.split(',').map(Number),globalKey=key(x+b.x,y+b.y);if(map.archipelago!.regions.get(globalKey)===region.id)result.set(globalKey,node);}
 }return result;
}

/** Add shoreline clay to older worlds without replacing existing resources or replenishing exhausted deposits. */
export function ensureClayDeposits(map: WorldMap, resources: ResourceMap): number {
  if ([...resources.values()].some(n => n.type === 'clay_deposit')) return 0;
  const shoreline = map.landTiles.filter(t => ['grass','sand'].includes(map.tiles[t.y][t.x]) && !resources.has(key(t.x,t.y)) &&
    [-3,-2,-1,0,1,2,3].some(dy => [-3,-2,-1,0,1,2,3].some(dx => ['shallow_water','deep_water','river'].includes(map.tiles[t.y+dy]?.[t.x+dx]))));
  let count = 0;
  for (const tile of shoreline) {
    if ([...resources].some(([k,n]) => { const [x,y]=k.split(',').map(Number); return n.type==='clay_deposit' && Math.max(Math.abs(x-tile.x), Math.abs(y-tile.y)) < 5; })) continue;
    resources.set(key(tile.x,tile.y), {type:'clay_deposit',amount:180,maxAmount:180,regenRate:0});
    if (++count >= 5) break;
  }
  return count;
}

// ── Tick: regen renewable resources ──────────────────────────────────────────
export function ensureIronDeposits(map: WorldMap, resources: ResourceMap): number {
  let added=0;
  for(const type of ['iron_vein','coal_deposit'] as const){
    let count=0;
    if([...resources.values()].some(n=>n.type===type))continue;
    // Prefer land bordering mountains, but keep an accessible fallback on islands without mountains.
    const candidates=map.landTiles.filter(t=>map.tiles[t.y][t.x]==='grass'&&!resources.has(key(t.x,t.y)));
    candidates.sort((a,b)=>Number(map.tiles[b.y]?.[b.x+1]==='mountain')-Number(map.tiles[a.y]?.[a.x+1]==='mountain'));
    for(const tile of candidates){
      if([...resources].some(([k,n])=>{const [x,y]=k.split(',').map(Number);return n.type===type&&Math.max(Math.abs(x-tile.x),Math.abs(y-tile.y))<6;}))continue;
      resources.set(key(tile.x,tile.y),{type,amount:300,maxAmount:300,regenRate:0});
      added++;if(++count>=3)break;
    }
  }
  return added;
}

// ── Tick: regen renewable resources ──────────────────────────────────────────
export function tickResources(resources: ResourceMap): void {
  resources.forEach(node => {
    if (node.regenRate > 0 && node.amount < node.maxAmount) {
      node.amount = Math.min(node.maxAmount, node.amount + node.regenRate);
    }
  });
}

// ── Harvest from a tile ────────────────────────────────────────────────────────
export function harvestResource(
  resources: ResourceMap,
  tileX: number,
  tileY: number,
  amount: number,
): number {
  const node = resources.get(key(tileX, tileY));
  if (!node || node.amount <= 0) return 0;
  const taken = Math.min(amount, node.amount);
  node.amount -= taken;
  return taken;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function randIntRng(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// ── Resource visual config ────────────────────────────────────────────────────
export const RESOURCE_ICONS: Record<ResourceType, string> = {
  wood_tree:    '🌲',
  stone_deposit:'🪨',
  herb_patch:   '🌿',
  fish_spot:    '🐟',
  copper_vein:  '🔶',
  clay_deposit:'🟤',
  iron_vein:'⛏️', coal_deposit:'⚫',
  fertile_soil: '🌾',
};

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  wood_tree:    '#2d6b2a',
  stone_deposit:'#8b7355',
  herb_patch:   '#5a9e5a',
  fish_spot:    '#1a9090',
  copper_vein:  '#b87333',
  clay_deposit:'#bc8662',
  iron_vein:'#87959c', coal_deposit:'#343a40',
  fertile_soil: '#8b6914',
};
