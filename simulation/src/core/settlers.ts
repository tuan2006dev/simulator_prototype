import type { Island } from './types';
import type { WorldMap } from '../renderer/WorldMap';
import {regionAt} from '../renderer/WorldMap';
import { createNPC } from './factory';
import { addEntry } from './chronicle';
import { buildingLevel } from '../renderer/BuildingManager';

export const SETTLER_COST = { food: 60, wood: 20 };
export function settlerCapacity(island: Island): number {
  return 15 + island.buildings.filter(b => b.complete && ['house','tent'].includes(b.type)).reduce((sum, b) => sum + (b.type==='tent'?3:buildingLevel(b)*5), 0);
}
export function canInviteSettler(island: Island): string | null {
  if (island.npcs.some(n => n.isAlive && !n.position)) return 'Đặt hết cư dân khởi đầu trước khi đón thêm người.';
  if (island.npcs.filter(n => n.isAlive).length >= settlerCapacity(island)) return 'Hết chỗ ở. Xây nhà hoặc nâng cấp nhà: mỗi cấp thêm 5 chỗ.';
  if (island.sharedFood < SETTLER_COST.food || island.wood < SETTLER_COST.wood) return 'Cần 60 thức ăn và 20 gỗ để đón một cư dân.';
  return null;
}
export function inviteSettler(island: Island, map: WorldMap, x: number, y: number): string | null {
  if(map.archipelago&&regionAt(map,x,y)?.id!=='thien-nguyen')return 'Đón cư dân trên Thiên Nguyên; chưa có đường vượt biển.';
  if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y) || !['grass', 'sand', 'forest'].includes(map.tiles[y]?.[x])) return 'invalid_tile';
  if (island.npcs.some(n => n.isAlive && n.position?.tileX === x && n.position?.tileY === y) || island.buildings.some(b => b.tileX === x && b.tileY === y)) return 'tile_occupied';
  const reason = canInviteSettler(island);
  if (reason) return reason;
  const npc = createNPC();
  npc.position = { tileX: x, tileY: y };
  island.sharedFood -= SETTLER_COST.food;
  island.wood -= SETTLER_COST.wood;
  island.npcs.push(npc);
  addEntry(island, `👤 ${npc.name.split('#')[0]} đến định cư trên đảo (60 thức ăn, 20 gỗ).`, 'medium');
  return null;
}
