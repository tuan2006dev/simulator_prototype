import {useAugmentation} from '../core/AdaptationManager';
import {harvestRelic,relicSite} from '../core/EldritchManager';
import {harvestSpirit,spiritSite} from '../core/SpiritManager';
import {controlMultiplier} from '../core/ControlManager';
import {hasPower,generatorCapacity} from '../core/PowerManager';
import {agricultureMultiplier} from '../core/WeatherManager';
import {workMultiplier} from '../core/FaithManager';
import {RECIPES,outputRoom,addOutput,processLocalRecipe} from '../core/logistics';
import type { Building, BuildingType, Island } from '../core/types';
import type { ResourceMap } from './ResourceSpawner';
import type { WorldMap } from './WorldMap';
import { findPath } from '../core/pathfinding';
import { addEntry } from '../core/chronicle';
import { buildingLock, goodsCapacity, storeGoods, COMMODITIES } from '../core/civilization';
import { tickTrades } from '../core/trade';
import type { Commodity } from '../core/types';
import { movementSteps } from '../core/dailyLife';
import {attributeBonus} from '../core/workforce';
import {harvestToolMultiplier} from '../core/equipment';

export interface BuildCost { wood: number; stone: number; food: number; goods?: Partial<Record<Commodity, number>> }
export const BUILD_COSTS: Record<BuildingType, BuildCost> = {
  relic_extractor:{wood:15,stone:5,food:10,goods:{cloth:4,cutStone:4}},biomatter_workshop:{wood:20,stone:10,food:15,goods:{cloth:6,cutStone:4}},quarantine:{wood:20,stone:10,food:15,goods:{biomatter:2,cutStone:4}},
  apothecary:{wood:20,stone:10,food:15,goods:{components:3,cloth:4}},clinic:{wood:25,stone:10,food:15,goods:{components:3,cutStone:4,cloth:4}},
  spirit_extractor:{wood:15,stone:5,food:10,goods:{cloth:4,cutStone:4}},spirit_refinery:{wood:20,stone:10,food:15,goods:{cloth:6,cutStone:4}},resonance_tower:{wood:20,stone:10,food:15,goods:{spiritEssence:2,cutStone:6}},
  microchip_factory:{wood:20,stone:10,food:20,goods:{components:6,machineParts:2,cutStone:6}},control_center:{wood:20,stone:10,food:20,goods:{microchips:2,machineParts:2,steel:5,cutStone:8}},
  measurement_lab:{wood:25,stone:20,food:20,goods:{components:8,machineParts:2,cutStone:8}},component_factory:{wood:30,stone:20,food:20,goods:{steel:4,cutStone:10,machineParts:4}},
  steelworks:{wood:30,stone:30,food:20,goods:{iron:6,bricks:8}},stonecutter:{wood:20,stone:20,food:15,goods:{iron:4,lumber:4}},steam_generator:{wood:25,stone:25,food:20,goods:{steel:4,copper:4}},prototype_workshop:{wood:25,stone:25,food:20,goods:{steel:4,lumber:8}},
  fishing_dock:{wood:10,stone:2,food:0}, study_table:{wood:6,stone:2,food:0},
  tent: {wood:8,stone:0,food:0}, stockpile: {wood:6,stone:2,food:0},
  lumbercamp: { wood: 0, stone: 5, food: 10 }, mine: { wood: 10, stone: 0, food: 15 },
  farm: { wood: 15, stone: 5, food: 10 }, house: { wood: 20, stone: 10, food: 15 },
  storehouse: { wood: 30, stone: 20, food: 20 }, bridge: { wood: 30, stone: 20, food: 10 },
  temple: { wood: 40, stone: 30, food: 25 },
  copper_mine: { wood: 25, stone: 15, food: 20 }, smelter: { wood: 30, stone: 30, food: 20 }, sawmill: { wood: 25, stone: 15, food: 15 },
  clay_pit: { wood: 15, stone: 10, food: 15 }, brick_kiln: { wood: 20, stone: 20, food: 15 },
  pottery_workshop: { wood: 20, stone: 15, food: 15, goods: { lumber: 4 } },
  wheat_field: { wood: 15, stone: 5, food: 15 }, bakery: { wood: 20, stone: 10, food: 15, goods: { bricks: 8, pottery: 2 } },
  iron_mine:{wood:30,stone:20,food:20},coal_mine:{wood:25,stone:20,food:20},iron_smelter:{wood:30,stone:25,food:20,goods:{bricks:8}},
  flax_field:{wood:20,stone:5,food:15},weaver:{wood:25,stone:10,food:20,goods:{lumber:6}},tradepost:{wood:30,stone:20,food:20,goods:{iron:5,cloth:4}},
};
export const BUILD_LABELS: Record<BuildingType, string> = {
  relic_extractor:'Trạm thu di tích',biomatter_workshop:'Xưởng sinh chất',quarantine:'Khu cách ly',apothecary:'Xưởng thuốc',clinic:'Phòng khám',spirit_extractor:'🔬 Trạm dẫn linh',spirit_refinery:'🔬 Xưởng tinh chất',resonance_tower:'🔬 Tháp cộng hưởng',microchip_factory:'⚙️ Xưởng vi mạch',control_center:'⚙️ Trung tâm điều khiển',measurement_lab:'🔬 Cơ sở đo đạc',component_factory:'⚙️ Nhà máy linh kiện',steelworks:'⚒️ Lò thép nguyên mẫu',stonecutter:'🪨 Xưởng cắt đá',steam_generator:'⚡ Máy phát than thử nghiệm',prototype_workshop:'⚙️ Xưởng máy nguyên mẫu',
  fishing_dock:'🐟 Bến câu', study_table:'📖 Bàn nghiên cứu sơ khai',
  tent:'🏠 Lều sơ khai', stockpile:'📦 Bãi chứa sơ khai',
  lumbercamp: '🌲 Trại gỗ', mine: '⛏️ Mỏ đá', farm: '🌾 Nông trại', house: '🏠 Nhà ở',
  storehouse: '🏪 Kho lương', bridge: '🌉 Cầu', temple: '🛕 Đền thờ',
  copper_mine: '🔶 Mỏ đồng', smelter: '🔥 Lò luyện đồng', sawmill: '🪚 Xưởng gỗ',
  clay_pit: '🟤 Hố đất sét', brick_kiln: '🧱 Lò gạch', pottery_workshop: '🏺 Xưởng gốm', wheat_field: '🌾 Ruộng lúa mì', bakery: '🥖 Lò bánh',
  iron_mine:'⛏️ Mỏ sắt',coal_mine:'⚫ Mỏ than',iron_smelter:'⚒️ Lò luyện sắt',flax_field:'🌿 Ruộng lanh',weaver:'🧵 Xưởng dệt',tradepost:'🛒 Trạm giao thương',
};
export const BUILD_DESC: Record<BuildingType, string> = {
  relic_extractor:'Trong2ô di tích nền tảng, thu2xương1huyết thạch; tăng8nhiễm nguồn/5phơi nhiễm thợ, dừng trước rủi ro cao.',biomatter_workshop:'2xương1huyết thạch1thảo dược→1sinh chất,2công suất/thợ/haul.',quarantine:'1sinh chất/10nhịp có tác dụng,2công suất/thợ. Giảm nhiễm nguồn3ô và phơi nhiễm cư dân4ô.',apothecary:'2thảo dược+1vải→1thuốc băng bó,2công suất/thợ/vận chuyển.',clinic:'1thuốc/5bước chăm sóc, hồi8sức khỏe/bước. Người bệnh và người chữa phải tại chỗ,2công suất; hỗ trợ trẻ em.',spirit_extractor:'Đặt trong2ô mạch đã nghiên cứu. Thợ thu2linh thạch/mẻ, giảm6ổn định. Mạch hồi1trữ lượng/ngày và1ổn định mỗi5nhịp; cho nghỉ khi yếu.',spirit_refinery:'2linh thạch+1thảo dược→1tinh chất/mẻ; cần thợ/vận chuyển và2công suất.',resonance_tower:'1tinh chất/10nhịp hoạt động+2công suất/người tại chỗ; mạch ổn định≥40. Hồi sức khỏe/nghỉ cho người trong4ô; không biến đổi dân.',microchip_factory:'2 linh kiện +1 đồng →1 vi mạch/mẻ; cần 2 công suất, thợ và vận chuyển. Một cấp.',control_center:'Thợ tại chỗ +2 công suất: tăng tốc mẻ công nghiệp trong 6 ô thêm25%, không cộng dồn; vẫn tốn đủ đầu vào.',measurement_lab:'Phân tích hồ sơ bằng 2 linh kiện/40 nhịp làm tại chỗ; cần 2 công suất. Theo dõi 5 ngày điện riêng cho cơ sở.',component_factory:'2 thép +2 đồng →3 linh kiện/mẻ, cần 2 công suất. Nâng cấp tiêu linh kiện và tăng số công nhân.',steelworks:'4 sắt +2 than →2 thép; vật liệu phải giao tới lò, thành phẩm cần vận chuyển.',stonecutter:'4 đá →3 đá xây/mẻ, dùng nâng cấp công trình công nghiệp.',steam_generator:'1 than/ngày mô phỏng từ kho đầu vào, cấp 4 công suất. Tự chạy sau xây xong; không cần giữ thợ và không tích điện.',prototype_workshop:'2 thép +2 gỗ xẻ →2 bộ phận máy. Cần 2 công suất; bạn chọn ưu tiên khi thiếu điện.',
  fishing_dock:'Đặt trên đất sát nguồn cá (1 ô). Một người câu 24 thức ăn/mẻ, mang về kho; nguồn cá có thể cạn và hồi tự nhiên.',
  study_table:'Xây trước nghiên cứu đầu tiên. Người nghiên cứu tự đến bàn; nghỉ ăn/ngủ rồi quay lại. Không cần Trưởng lão.',
  tent:'Ba chỗ ngủ thật. Dân tự về lều còn chỗ, hồi nghỉ tốt hơn ngủ ngoài trời. Không cần nghiên cứu.',
  stockpile:'Nơi giao thức ăn và vật liệu gần chỗ làm. Thêm 100 sức chứa thức ăn; không cần nghiên cứu.',
  lumbercamp: 'Thu gỗ từ cây trong bán kính 3 ô, cần thợ đến trại.',
  mine: 'Thu đá từ mỏ trong bán kính 3 ô, cần thợ đến chân mỏ.',
  farm: 'Thợ đến ruộng để trồng lương thực; đất màu mỡ tăng 25% sản lượng.',
  house: 'Mỗi cấp thêm 5 chỗ ở và giúp cư dân hồi phục sức nghỉ.',
  storehouse: 'Mỗi cấp thêm 400 sức chứa lương thực vào kho chung.',
  bridge: 'Nối đường qua nước nông và giúp xây dựng nhanh hơn.',
  temple: 'Thợ đến đền để giúp cư dân gần đó giảm cô đơn và lo lắng.',
  copper_mine: 'Khai thác quặng đồng trong bán kính 3 ô; quặng có thể cạn.',
  smelter: 'Mỗi mẻ/thợ: 4 quặng đồng + 2 gỗ nhiên liệu → 2 đồng.',
  sawmill: 'Mỗi mẻ/thợ: 6 gỗ thô → 4 gỗ xẻ.',
  clay_pit: 'Thu đất sét hữu hạn trong bán kính 3 ô; đặt gần mỏ đất sét ven nước.',
  brick_kiln: 'Mỗi mẻ/thợ: 4 đất sét + 2 gỗ nhiên liệu → 4 gạch; gạch dùng xây lò bánh.',
  pottery_workshop: 'Mỗi mẻ/thợ: 3 đất sét + 1 gỗ → 2 đồ gốm. Gốm thêm sức chứa hàng và dùng xây lò bánh.',
  wheat_field: 'Mỗi mẻ/thợ: 12 lúa mì; đất màu mỡ +25%. Lúa mì chưa phải thức ăn.',
  bakery: 'Mỗi mẻ/thợ: 8 lúa mì + 2 gỗ → bánh tương đương 40 thức ăn trong kho lương.',
  iron_mine:'Thu quặng sắt hữu hạn trong bán kính 3 ô.',coal_mine:'Thu than đá hữu hạn trong bán kính 3 ô.',
  iron_smelter:'Mỗi mẻ/thợ: 4 quặng sắt +2 than đá →2 sắt.',flax_field:'Mỗi mẻ/thợ: 12 sợi lanh; đất màu mỡ +25%.',
  weaver:'Mỗi mẻ/thợ: 6 sợi lanh →3 vải. Vải dùng xây trạm và trao đổi.',
  tradepost:'Chọn gói trao đổi trong chi tiết trạm. Người vận chuyển đi tới thương nhân ven nước rồi mang hàng về; không tự tiêu hàng.',
};
export const BUILD_TERRAIN: Record<BuildingType, string[]> = {
  relic_extractor:['grass','sand','forest'],biomatter_workshop:['grass','sand'],quarantine:['grass','sand','forest'],apothecary:['grass','sand'],clinic:['grass','sand'],spirit_extractor:['grass','sand','forest'],spirit_refinery:['grass','sand'],resonance_tower:['grass','sand'],microchip_factory:['grass','sand'],control_center:['grass','sand'],measurement_lab:['grass','sand'],component_factory:['grass','sand'],steelworks:['grass','sand'],stonecutter:['grass','sand'],steam_generator:['grass','sand'],prototype_workshop:['grass','sand'],
  fishing_dock:['grass','sand'],study_table:['grass','sand'],
  tent:['grass','sand'],stockpile:['grass','sand'],
  lumbercamp: ['forest', 'grass'], mine: ['mountain', 'grass'], farm: ['grass'],
  house: ['grass', 'sand'], storehouse: ['grass', 'sand'], bridge: ['shallow_water', 'river'], temple: ['grass'],
  copper_mine: ['grass', 'mountain'], smelter: ['grass', 'sand'], sawmill: ['grass', 'forest'],
  clay_pit: ['grass', 'sand'], brick_kiln: ['grass', 'sand'], pottery_workshop: ['grass', 'sand'], wheat_field: ['grass'], bakery: ['grass', 'sand'],
  iron_mine:['grass','mountain'],coal_mine:['grass','mountain'],iron_smelter:['grass','sand'],flax_field:['grass'],weaver:['grass','sand'],tradepost:['grass','sand'],
};
export function buildingLevel(b: Building): number { return Math.max(1, Math.min(3, b.level ?? 1)); }
export function maxBuildingWorkers(b: Building): number {
  if(['relic_extractor','quarantine','clinic','spirit_extractor','resonance_tower'].includes(b.type))return b.complete?1:3;
  if(b.type==='control_center')return b.complete?1:3;
  if(b.type==='measurement_lab')return b.complete?1:3;
  if(b.type==='steam_generator')return b.complete&&!b.upgrade?0:3;
  if(b.type==='fishing_dock')return b.complete?1:3;
  if(['tent','stockpile','study_table'].includes(b.type))return b.complete?0:3;
  if (['copper_mine', 'smelter', 'sawmill', 'clay_pit', 'brick_kiln', 'pottery_workshop', 'wheat_field', 'bakery','iron_mine','coal_mine','iron_smelter','flax_field','weaver','tradepost','steelworks','stonecutter','prototype_workshop','component_factory','microchip_factory','spirit_refinery','biomatter_workshop','apothecary'].includes(b.type)) return !b.complete || b.upgrade ? 3 : 2 + buildingLevel(b) - 1;
  if (!b.complete) return 3;
  if (b.upgrade) return Math.max(3, ({ lumbercamp: 3, mine: 3, farm: 5, temple: 2, house: 0, storehouse: 0, bridge: 0 } as Partial<Record<BuildingType, number>>)[b.type]! + buildingLevel(b) - 1);
  return ({ lumbercamp: 3, mine: 3, farm: 5, temple: 2, house: 0, storehouse: 0, bridge: 0 } as Partial<Record<BuildingType, number>>)[b.type]! +
    (['lumbercamp', 'mine', 'farm', 'temple'].includes(b.type) ? buildingLevel(b) - 1 : 0);
}
export function foodCapacity(island: Island): number {
  return 300 + island.buildings.filter(b => b.complete && ['storehouse','stockpile'].includes(b.type)).reduce((sum, b) => sum + (b.type==='stockpile'?100:buildingLevel(b)*400), 0);
}
/** Each raw-material ledger has the same starter-storage allowance; old rules stay uncapped. */
export function materialCapacity(island: Island): number { return island.dailyLife?.settlementVersion===1?foodCapacity(island):Infinity; }
export function materialRoom(island: Island,kind:'wood'|'stone'|'herbs'): number {
  return Math.max(0,materialCapacity(island)-island[kind]-island.npcs.filter(n=>n.isAlive).reduce((sum,n)=>sum+(n.cargo?.[kind]??0),0));
}
export function buildingBenefit(b: Building, level = buildingLevel(b)): string {
  const multiplier = 1 + (level - 1) * .5;
  switch (b.type) {
    case 'steelworks':return '4 sắt +2 than →2 thép';
    case 'stonecutter':return '4 đá →3 đá xây';
    case 'steam_generator':return `${generatorCapacity(b)} công suất · 1 than/ngày · tự chạy sau xây xong`;
    case 'component_factory':return '2 thép +2 đồng →3 linh kiện · 2 công suất · linh kiện dùng nâng cấp nhà máy';
    case 'spirit_extractor':return '2linh thạch/mẻ tại mạch · cần giữ trữ lượng và độ ổn định';
    case 'apothecary':return '2thảo dược+1vải→1thuốc · 2công suất/thợ/giao hàng';
    case 'relic_extractor':return '2xương cốt +1huyết thạch/mẻ · ngưỡng nhiễm/nguồn/thợ';
    case 'biomatter_workshop':return '2xương +1huyết thạch +1thảo dược →1sinh chất ·2công suất';
    case 'quarantine':return '1sinh chất/10nhịp · giảm2nhiễm/phơi nhiễm trong vùng ·2công suất';
    case 'clinic':return '1thuốc/5bước chữa · +8sức khỏe/bước · thợ/2công suất';
    case 'spirit_refinery':return '2linh thạch+1thảo dược→1tinh chất · 2công suất';
    case 'resonance_tower':return '1tinh chất/10nhịp hoạt động · ổn định≥40 · chăm sóc sức khỏe/nghỉ trong4ô';
    case 'microchip_factory':return '2 linh kiện +1 đồng →1 vi mạch · 2 công suất · đầu ra dùng điều khiển';
    case 'control_center':return '+25% tốc độ mẻ công nghiệp trong 6 ô khi có điện/thợ tại chỗ · không cộng dồn';
    case 'measurement_lab':return '2 linh kiện/hồ sơ · 40 nhịp tại chỗ · 2 công suất · điện riêng 5 ngày';
    case 'prototype_workshop':return '2 thép +2 gỗ xẻ →2 bộ phận máy · cần 2 điện';
    case 'tent': return '3 chỗ ngủ · hồi nghỉ 18/bước; ngoài trời 6/bước';
    case 'stockpile': return '+100 sức chứa cho thức ăn/gỗ/đá/thảo dược · điểm giao hàng';
    case 'house': return `+${level * 5} chỗ ở · hồi phục nghỉ +${level * 2}/ngày`;
    case 'storehouse': return `+${level * 400} sức chứa thức ăn`;
    case 'lumbercamp': return `${6 * multiplier} gỗ/thợ/lượt · bán kính 3 ô`;
    case 'mine': return `${4 * multiplier} đá/thợ/lượt · bán kính 3 ô`;
    case 'farm': return `${20 * multiplier} thức ăn/thợ/lượt · đất màu mỡ +25%`;
    case 'fishing_dock': return '24 thức ăn/mẻ · 1 người câu · giao cá về kho';
    case 'study_table': return 'Người trưởng thành đến bàn để nghiên cứu · không cần Trưởng lão';
    case 'temple': return `Giảm ${4 * level} cô đơn và lo lắng/lượt trong ${3 + level} ô`;
    case 'bridge': return `Đi qua nước nông · tăng ${level * 10}% tốc độ xây dựng toàn đảo`;
    case 'copper_mine': return `${4 * multiplier} quặng/thợ/mẻ · bán kính 3 ô`;
    case 'smelter': return `4 quặng + 2 gỗ → 2 đồng/thợ/mẻ`;
    case 'sawmill': return `6 gỗ thô → 4 gỗ xẻ/thợ/mẻ`;
    case 'clay_pit': return `${6 * multiplier} đất sét/thợ/mẻ · bán kính 3 ô`;
    case 'brick_kiln': return '4 đất sét + 2 gỗ → 4 gạch/thợ/mẻ';
    case 'pottery_workshop': return '3 đất sét + 1 gỗ → 2 đồ gốm/thợ/mẻ';
    case 'wheat_field': return `${12 * multiplier} lúa mì/thợ/mẻ · đất màu mỡ +25%`;
    case 'bakery': return '8 lúa mì + 2 gỗ → 40 thức ăn/thợ/mẻ';
    case 'iron_mine':return `${4*multiplier} quặng sắt/thợ/mẻ · bán kính 3 ô`;
    case 'coal_mine':return `${6*multiplier} than đá/thợ/mẻ · bán kính 3 ô`;
    case 'iron_smelter':return '4 quặng sắt +2 than →2 sắt/thợ/mẻ';
    case 'flax_field':return `${12*multiplier} sợi lanh/thợ/mẻ · đất màu mỡ +25%`;
    case 'weaver':return '6 sợi lanh →3 vải/thợ/mẻ';
    case 'tradepost':return 'Vận chuyển hai chiều · trao đổi 10 tick tại thương nhân · hàng về mới nhập kho';
  }
}
export function upgradeCost(b: Building, island?: Island): BuildCost {
  const base = BUILD_COSTS[b.type], scale = buildingLevel(b);
  return { wood: (base.wood + 20) * scale, stone: (base.stone + 10) * scale, food: (base.food + 10) * scale, ...(island?.civilization ? { goods: scale>=2 ? {...(b.type==='component_factory'?{components:6*scale}:{}),iron:10,lumber:20,bricks:20,...(['steelworks','stonecutter','steam_generator','prototype_workshop'].includes(b.type)?{cutStone:10*scale}:{}),...(['steam_generator','prototype_workshop'].includes(b.type)?{machineParts:4*scale,steel:4*scale}:{})} : { ...(b.type==='component_factory'?{components:6*scale}:{}),copper: 5 * scale, lumber: 10 * scale,...(['steelworks','stonecutter','steam_generator','prototype_workshop'].includes(b.type)?{cutStone:10*scale}:{}),...(['steam_generator','prototype_workshop'].includes(b.type)?{machineParts:4*scale,steel:4*scale}:{}) } } : {}) };
}
export function canAfford(island: Island, cost: BuildCost): boolean {
  return island.wood >= cost.wood && island.stone >= cost.stone && island.sharedFood >= cost.food && Object.entries(cost.goods ?? {}).every(([kind, amount]) => (island.civilization?.inventory[kind as Commodity] ?? 0) >= amount);
}
function pay(island: Island, cost: BuildCost): void { island.wood -= cost.wood; island.stone -= cost.stone; island.sharedFood -= cost.food; for (const [kind, amount] of Object.entries(cost.goods ?? {})) island.civilization!.inventory[kind as Commodity] -= amount; }
export function upgradeBuilding(island: Island, id: string): string | null {
  const b = island.buildings.find(b => b.id === id);
  if (!b || !b.complete) return 'Hoàn thành xây dựng trước khi nâng cấp.';
  if (b.upgrade) return 'Công trình đang được nâng cấp.';
  if(b.shipment)return 'Hoàn tất hoặc hủy chuyến hàng trước khi nâng cấp trạm.';
  if (buildingLevel(b) >= 3) return 'Đã đạt cấp tối đa.';
  const lock = buildingLock(island, b.type, buildingLevel(b) + 1);
  if (lock) return lock;
  const cost = upgradeCost(b, island);
  if (!canAfford(island, cost)) return 'Chưa đủ vật liệu hoặc thức ăn để nâng cấp.';
  pay(island, cost);
  b.upgrade = { targetLevel: buildingLevel(b) + 1, progress: 0 };
  b.workMessage = 'Chờ thợ đến nâng cấp';
  for (const npc of island.npcs.filter(n => b.workers.includes(n.id))) { npc.buildingWork = undefined; npc.path = undefined; }
  addEntry(island, `🔨 Nâng cấp ${BUILD_LABELS[b.type]} lên cấp ${b.upgrade.targetLevel}.`, 'medium');
  return null;
}
export function getBuildingAt(island: Island, x: number, y: number): Building | null {
  return island.buildings.find(b => b.tileX === x && b.tileY === y) ?? null;
}
export function buildingSiteLock(island: Island, type: BuildingType, tileX: number, tileY: number): string | null {
  if(type==='relic_extractor'){const site=relicSite(island);if(!site||Math.max(Math.abs(site.x-tileX),Math.abs(site.y-tileY))>2)return 'Đặt trạm trong2ô di tích nền tảng Quỷ Dị.';}
  if(type==='spirit_extractor'){const p=spiritSite(island);if(!p||Math.max(Math.abs(p.x-tileX),Math.abs(p.y-tileY))>2)return 'Đặt trạm trong2ô của mạch đã hoàn tất nền tảng Linh Mạch.';}
  if(type==='fishing_dock'&&![...island.resources].some(([key,node])=>{const [x,y]=key.split(',').map(Number);return node.type==='fish_spot'&&node.amount>0&&Math.max(Math.abs(x-tileX),Math.abs(y-tileY))===1;}))return 'Đặt bến trên đất sát nguồn cá còn trữ lượng (1 ô).';
  const resource=type==='clay_pit'?'clay_deposit':type==='iron_mine'?'iron_vein':type==='coal_mine'?'coal_deposit':undefined;
  if (resource && ![...island.resources].some(([key, node]) => {
    const [x,y] = key.split(',').map(Number);
    return node.type === resource && node.amount > 0 && Math.max(Math.abs(x-tileX), Math.abs(y-tileY)) <= 3;
  })) return `Đặt công trình trong bán kính 3 ô từ nguồn ${resource==='clay_deposit'?'đất sét (🟤)':resource==='iron_vein'?'sắt (⛏️)':'than (⚫)'} còn trữ lượng.`;
  return null;
}
export function placeBuilding(island: Island, type: BuildingType, tileX: number, tileY: number): Building | null {
  const cost = BUILD_COSTS[type];
  if (buildingLock(island, type)) return null;
  if (!cost || !Number.isSafeInteger(tileX) || !Number.isSafeInteger(tileY) || getBuildingAt(island, tileX, tileY) || !canAfford(island, cost)) return null;
  if (buildingSiteLock(island, type, tileX, tileY)) return null;
  pay(island, cost);
  let index = 1; while (island.buildings.some(b => b.id === `b_${index}`)) index++;
  const b: Building = { id: `b_${index}`, type, tileX, tileY, workers: [], progress: 0, complete: false, level: 1, technology: island.civilization?.era === 'iron' ? 'iron' : island.civilization?.era === 'bronze' ? 'bronze' : 'stone', workMessage: 'Chờ thợ đến xây dựng' };
  island.buildings.push(b);
  addEntry(island, `🏗️ Xây ${BUILD_LABELS[type]} tại (${tileX}, ${tileY}). Phân công thợ để bắt đầu.`, 'medium');
  return b;
}
export function assignWorker(island: Island, buildingId: string, npcId: string, automatic=false): boolean {
  const b = island.buildings.find(b => b.id === buildingId);
  const npc = island.npcs.find(n => n.id === npcId && n.isAlive && n.age >= 18 && n.occupation !== 'child' && n.position);
  if (!b || !npc || island.adaptationProcess?.npcId===npcId || b.workers.includes(npcId) || b.workers.length >= maxBuildingWorkers(b)) return false;
  for (const other of island.buildings){other.workers = other.workers.filter(id => id !== npcId);other.autoWorkers=other.autoWorkers?.filter(id=>id!==npcId); }
  b.workers.push(npcId);
  if(automatic){b.autoWorkers??=[];b.autoWorkers.push(npcId);}else{npc.laborMode='manual';npc.autoReason=undefined;}
  npc.researching = false;
  npc.path = undefined; npc.actionTarget = undefined; npc.laborTask = undefined; npc.buildingWork = automatic&&npc.autoWorkProgress?.[b.id]!==undefined?{buildingId:b.id,ticks:npc.autoWorkProgress[b.id]}:undefined;if(automatic&&npc.autoWorkProgress)delete npc.autoWorkProgress[b.id];
  npc.laborMessage = 'Đang tìm đường đến công trình';
  return true;
}
export function removeWorker(island: Island, buildingId: string, npcId: string, manual=true): void {
  const b = island.buildings.find(b => b.id === buildingId);
  if (!b?.workers.includes(npcId)) return;
  b.workers = b.workers.filter(id => id !== npcId);b.autoWorkers=b.autoWorkers?.filter(id=>id!==npcId);
  const npc = island.npcs.find(n => n.id === npcId);
  if (npc) { if(manual){npc.laborMode='manual';npc.autoReason=undefined;}npc.buildingWork = undefined; npc.path = undefined; npc.laborRetryAt = 0; npc.laborMessage = 'Trở lại ưu tiên lao động'; }
}
export function tickBuildings(island: Island, resources: ResourceMap, map?: WorldMap): void {
  tickTrades(island,map);
  const constructionBonus = 1 + island.buildings.filter(b => b.complete && b.type === 'bridge').reduce((sum, b) => sum + buildingLevel(b) * .1, 0);
  // Resolve support operators in this interval before dependent workshops.
  const support=(b:Building)=>b.type==='resonance_tower'||b.type==='control_center'?1:0;
  for (const b of [...island.buildings].sort((a,b)=>support(b)-support(a))) {
    b.workers = [...new Set(b.workers)].filter(id => island.npcs.some(n => n.id === id && n.isAlive && n.age >= 18));
    let onsite = 0;
    for (const id of b.workers) {
      const npc = island.npcs.find(n => n.id === id)!;
      if(b.shipment?.workerId===id)continue;
      if (!npc.position || npc.survivalBlocked || npc.cargo || npc.freight || npc.actionTarget || npc.status === 'sleeping' || npc.status === 'eating' || npc.needs.hunger >= 95) continue;
      if (npc.buildingWork?.buildingId !== b.id || (!npc.path?.length && Math.max(Math.abs(npc.position.tileX-b.tileX),Math.abs(npc.position.tileY-b.tileY)) > 1)) {
        const path = map ? findPath(map, npc.position.tileX, npc.position.tileY, b.tileX, b.tileY) : [];
        if (path === null) { npc.laborMessage = 'Không có đường đến công trình'; continue; }
        const ticks = npc.buildingWork?.buildingId === b.id ? npc.buildingWork.ticks : 0;
        npc.path = path; npc.buildingWork = { buildingId: b.id, ticks };
      }
      if (npc.path?.length) {
        const next = npc.path.splice(0,movementSteps(npc,island)).pop()!; npc.position = { tileX: next.x, tileY: next.y };
        npc.laborMessage = 'Đang đi đến công trình'; npc.status = 'working'; continue;
      }
      if (Math.max(Math.abs(npc.position.tileX - b.tileX), Math.abs(npc.position.tileY - b.tileY)) > 1) { npc.buildingWork = undefined; continue; }
      onsite+=workMultiplier(island,npc); npc.status = 'working';
      if (!b.complete || b.upgrade) { npc.laborMessage = b.upgrade ? 'Đang nâng cấp công trình' : 'Đang xây dựng'; continue; }
      if(b.productionQuota===0){npc.laborMessage=b.workMessage='Đã đủ định mức · giữ vật tư';continue;}
      if(!hasPower(island,b)){npc.laborMessage='Thiếu điện · giữ tiến độ mẻ';b.workMessage=npc.laborMessage;continue;}
      if(b.type==='control_center'){npc.laborMessage='Điều phối tại trung tâm';b.workMessage='Đang điều phối · +25% tốc độ xưởng trong 6 ô';continue;}
      if(b.type==='resonance_tower'){npc.laborMessage='Chăm sóc cộng hưởng tại tháp';continue;}
      if(b.type==='quarantine'){npc.laborMessage='Kiểm soát phơi nhiễm tại khu cách ly';continue;}
      if(b.type==='clinic'){npc.laborMessage='Chăm sóc tại phòng khám';continue;}
      if(b.type==='measurement_lab'){npc.laborMessage='Làm tại cơ sở đo đạc';continue;}
      const cycle = island.dailyLife ? 5 : 10;
      npc.laborMessage = `Đang làm tại công trình · ${(npc.buildingWork!.ticks % cycle) + 1}/${cycle}`;
      npc.buildingWork!.cycleBoundary=false;
      const oldProgress=npc.buildingWork!.ticks%cycle;
      npc.buildingWork!.ticks=oldProgress+workMultiplier(island,npc)*controlMultiplier(island,b)*useAugmentation(island,npc,b);
      if(npc.buildingWork!.ticks<cycle)continue;
      npc.buildingWork!.ticks-=cycle;npc.buildingWork!.cycleBoundary=true;
      const multiplier = 1 + (buildingLevel(b) - 1) * .5;
      if(island.logistics&&['lumbercamp','mine','farm','copper_mine','clay_pit','iron_mine','coal_mine','wheat_field','flax_field'].includes(b.type)&&outputRoom(island,b)<=0){b.workMessage='Kho tại công trình đầy · cần người vận chuyển';continue;}
      if(b.type==='relic_extractor'){harvestRelic(island,b,npc);continue;}
      if(b.type==='spirit_extractor'){harvestSpirit(island,b);continue;}
      if(b.type==='fishing_dock'){
        const room=Math.max(0,foodCapacity(island)-island.sharedFood-island.npcs.filter(n=>n.isAlive).reduce((s,n)=>s+(n.cargo?.food??0),0));
        let remaining=Math.min(24*attributeBonus(npc,'dex')*harvestToolMultiplier(island,npc,'fish'),30,room),harvested=0;
        for(const [key,node] of resources){const [x,y]=key.split(',').map(Number);if(node.type!=='fish_spot'||Math.max(Math.abs(x-b.tileX),Math.abs(y-b.tileY))!==1||node.amount<=0)continue;const amount=Math.min(remaining,node.amount);node.amount-=amount;remaining-=amount;harvested+=amount;if(remaining<=0)break;}
        if(harvested>0){npc.cargo={food:harvested,wood:0,stone:0,herbs:0};npc.path=undefined;b.productionBatches=(b.productionBatches??0)+1;}
        b.workMessage=harvested?`Câu ${harvested.toFixed(1)} thức ăn · đang mang về kho`:room<=0?'Kho thức ăn đầy · chờ chỗ trống':'Nguồn cá đã cạn · chờ cá hồi';
      } else if (['copper_mine','clay_pit','iron_mine','coal_mine'].includes(b.type)) {
        const kind:Commodity=b.type==='clay_pit'?'clay':b.type==='iron_mine'?'ironOre':b.type==='coal_mine'?'coal':'copperOre';
        const resource=kind==='clay'?'clay_deposit':kind==='ironOre'?'iron_vein':kind==='coal'?'coal_deposit':'copper_vein',name=COMMODITIES[kind].toLowerCase();
        let remaining = Math.min((['clay','coal'].includes(kind) ? 6 : 4) * multiplier, island.logistics?outputRoom(island,b):Math.max(0, goodsCapacity(island) - (island.civilization?.inventory[kind] ?? 0))), harvested = 0;
        for (const [key, node] of resources) {
          const [x, y] = key.split(',').map(Number);
          if (node.type !== resource || Math.max(Math.abs(x - b.tileX), Math.abs(y - b.tileY)) > 3 || node.amount <= 0) continue;
          const amount = Math.min(remaining, node.amount); node.amount -= amount; remaining -= amount; harvested += amount;
          if (remaining <= 0) break;
        }
        const gained = island.logistics?addOutput(island,b,kind,harvested):storeGoods(island, kind, harvested);
        if (gained > 0) b.productionBatches = (b.productionBatches ?? 0) + 1;
        b.workMessage = gained ? `Thu ${gained} ${name}/mẻ` : (island.civilization?.inventory[kind] ?? 0) >= goodsCapacity(island) ? `Kho ${name} đã đầy` : `Hết ${name} trong bán kính 3 ô · chọn vị trí khác`;
      } else if (island.logistics&&RECIPES[b.type]) {
        processLocalRecipe(island,b);
      } else if (['smelter','sawmill','brick_kiln','pottery_workshop','bakery','iron_smelter','weaver'].includes(b.type)) {
        const recipes: Partial<Record<BuildingType, { input?: Commodity; amount: number; wood: number; coal?:number; output?: Commodity; yield: number; message: string }>> = {
          smelter: { input: 'copperOre', amount: 4, wood: 2, output: 'copper', yield: 2, message: '4 quặng + 2 gỗ → 2 đồng' },
          sawmill: { amount: 0, wood: 6, output: 'lumber', yield: 4, message: '6 gỗ thô → 4 gỗ xẻ' },
          brick_kiln: { input: 'clay', amount: 4, wood: 2, output: 'bricks', yield: 4, message: '4 đất sét + 2 gỗ → 4 gạch' },
          pottery_workshop: { input: 'clay', amount: 3, wood: 1, output: 'pottery', yield: 2, message: '3 đất sét + 1 gỗ → 2 đồ gốm' },
          bakery: { input: 'wheat', amount: 8, wood: 2, yield: 40, message: '8 lúa mì + 2 gỗ → bánh (40 thức ăn)' },
          iron_smelter:{input:'ironOre',amount:4,wood:0,coal:2,output:'iron',yield:2,message:'4 quặng sắt +2 than →2 sắt'},
          weaver:{input:'fiber',amount:6,wood:0,output:'cloth',yield:3,message:'6 sợi lanh →3 vải'},
        };
        const c = island.civilization, recipe = recipes[b.type]!;
        if (!c) { b.workMessage = 'Chưa có hệ thống Đồ Đồng'; continue; }
        const free = recipe.output ? goodsCapacity(island) - c.inventory[recipe.output] : foodCapacity(island) - island.sharedFood;
        if (free < recipe.yield) { b.workMessage = 'Kho thành phẩm đã đầy · xây hoặc nâng cấp kho'; continue; }
        if (recipe.input && c.inventory[recipe.input] < recipe.amount) { b.workMessage = `Thiếu ${recipe.amount} ${COMMODITIES[recipe.input].toLowerCase()}/mẻ`; continue; }
        if(recipe.coal && c.inventory.coal<recipe.coal){b.workMessage=`Thiếu ${recipe.coal} than đá/mẻ`;continue;}
        if (island.wood < recipe.wood) { b.workMessage = `Thiếu ${recipe.wood} gỗ/mẻ`; continue; }
        if (recipe.input) c.inventory[recipe.input] -= recipe.amount;
        if(recipe.coal)c.inventory.coal-=recipe.coal;
        island.wood -= recipe.wood;
        if (recipe.output) storeGoods(island, recipe.output, recipe.yield); else island.sharedFood += recipe.yield;
        b.productionBatches = (b.productionBatches ?? 0) + 1;
        b.workMessage = recipe.message;
      } else if (b.type === 'lumbercamp' || b.type === 'mine') {
        const personalTool=npc.equippedTool===(b.type==='lumbercamp'?'axe':'pickaxe')?harvestToolMultiplier(island,npc,b.type==='lumbercamp'?'chop_wood':'gather_stone'):1;
        let remaining = Math.min((b.type === 'lumbercamp' ? 6 : 4) * multiplier*attributeBonus(npc,'str')*personalTool,island.logistics?outputRoom(island,b):materialRoom(island,b.type==='lumbercamp'?'wood':'stone')), harvested = 0;
        for (const [key, node] of resources) {
          const [x, y] = key.split(',').map(Number);
          if (node.type !== (b.type === 'lumbercamp' ? 'wood_tree' : 'stone_deposit') || Math.max(Math.abs(x - b.tileX), Math.abs(y - b.tileY)) > 3) continue;
          const amount = Math.min(remaining, node.amount); node.amount -= amount; remaining -= amount; harvested += amount;
          if (remaining <= 0) break;
        }
        if(island.logistics)addOutput(island,b,b.type==='lumbercamp'?'wood':'stone',harvested);else if (b.type === 'lumbercamp') island.wood += harvested; else island.stone += harvested;
        if (harvested > 0) { b.productionBatches = (b.productionBatches ?? 0) + 1; if (!island.logistics && b.type === 'mine' && island.civilization) island.civilization.harvestedStone += harvested; }
        b.workMessage = harvested ? `Thu ${harvested.toFixed(1)} ${b.type === 'mine' ? 'đá' : 'gỗ'}/lượt vừa rồi` : (b.type==='mine'?island.stone:island.wood)>=materialCapacity(island)?'Kho vật liệu đã đầy · xây bãi chứa hoặc kho':'Hết tài nguyên trong bán kính 3 ô';
      } else if (b.type === 'farm' || b.type === 'wheat_field' || b.type==='flax_field') {
        const fertile = [...resources].some(([key, node]) => { const [x, y] = key.split(',').map(Number); return node.type === 'fertile_soil' && Math.max(Math.abs(x - b.tileX), Math.abs(y - b.tileY)) <= 1; });
        const output = (b.type === 'farm' ? 20 : 12) * multiplier * (fertile ? 1.25 : 1) * agricultureMultiplier(island);
        const gained = island.logistics?addOutput(island,b,b.type==='farm'?'food':b.type==='flax_field'?'fiber':'wheat',output):b.type !== 'farm' ? storeGoods(island, b.type==='flax_field'?'fiber':'wheat', output) : Math.min(output, Math.max(0, foodCapacity(island) - island.sharedFood));
        if (!island.logistics&&b.type === 'farm') island.sharedFood += gained;
        b.workMessage = gained ? `Thu ${gained} ${b.type === 'wheat_field' ? 'lúa mì (cần làm bánh)' : b.type==='flax_field'?'sợi lanh':'thức ăn'}/mẻ` : 'Kho đã đầy · xây hoặc nâng cấp kho';
        if (gained > 0) b.productionBatches = (b.productionBatches ?? 0) + 1;
      } else if (b.type === 'temple') {
        for (const neighbor of island.npcs.filter(n => n.isAlive && n.position && Math.max(Math.abs(n.position.tileX - b.tileX), Math.abs(n.position.tileY - b.tileY)) <= 3 + buildingLevel(b))) {
          neighbor.needs.social = Math.max(0, neighbor.needs.social - 4 * buildingLevel(b));
          neighbor.needs.safety = Math.max(0, neighbor.needs.safety - 4 * buildingLevel(b));
        }
        b.workMessage = 'Đang giúp cư dân gần đền';
      }
    }
    if ((!b.complete || b.upgrade) && onsite) {
      const gain = onsite * (b.upgrade ? 2.5 : 5) * constructionBonus * (island.dailyLife ? 2 : 1);
      if (b.upgrade) {
        b.upgrade.progress = Math.min(100, b.upgrade.progress + gain);
        if (b.upgrade.progress >= 100) { b.level = b.upgrade.targetLevel; b.upgrade = undefined; finishBuilding(island, b); }
      } else {
        b.progress = Math.min(100, b.progress + gain);
        if (b.progress >= 100) { b.complete = true; finishBuilding(island, b); }
      }
    }
    if ((!b.complete || b.upgrade) && !onsite) b.workMessage = b.workers.length ? 'Chờ thợ đến nơi hoặc nghỉ xong' : 'Chưa có thợ · hãy phân công';
  }
  if (island.tick % 10 === 0) {
    const restBonus = Math.min(10, island.buildings.filter(b => b.complete && b.type === 'house').reduce((sum, b) => sum + buildingLevel(b) * 2, 0)) + (island.civilization?.unlocks.includes('basic_shelter') ? 2 : 0);
    for (const npc of island.npcs.filter(n => n.isAlive && n.position)) npc.needs.rest = Math.max(0, npc.needs.rest - restBonus);
    if (island.civilization?.unlocks.includes('fire')) for (const npc of island.npcs.filter(n => n.isAlive && n.position)) npc.needs.safety = Math.max(0, npc.needs.safety - 3);
  }
  island.sharedFood = Math.min(island.sharedFood, foodCapacity(island));
}
function finishBuilding(island: Island, b: Building): void {
  if (buildingLevel(b) >= 2 && ['bronze','iron'].includes(island.civilization?.era??'')) b.technology = island.civilization!.era as 'bronze'|'iron';
  b.workMessage = 'Hoàn thành';
  addEntry(island, `✅ ${BUILD_LABELS[b.type]} cấp ${buildingLevel(b)} hoàn thành.`, 'high');
  while (b.workers.length > maxBuildingWorkers(b)) removeWorker(island, b.id, b.workers[b.workers.length - 1]);
}
export function getBuildingSummary(island: Island): string {
  return `${island.buildings.filter(b => b.complete).length} công trình hoàn thành, ${island.buildings.filter(b => !b.complete).length} đang xây`;
}
