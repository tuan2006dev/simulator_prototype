import {COMMODITIES} from './commodities';
import {modernRequirements,MODERN_FEE} from './ModernPreparation';
import type { Island, BuildingType, EraId, Commodity, CivilizationState } from './types';
import { estimateDailyFoodDemand } from './labor';
import { TICKS_PER_DAY } from './utils';
import { addEntry } from './chronicle';

export const ERAS: { id: EraId; name: string; implemented: boolean; description: string }[] = [
  { id: 'stone', name: 'Đồ Đá', implemented: true, description: 'Sinh tồn, nông nghiệp và tổ chức lao động.' },
  { id: 'bronze', name: 'Đồ Đồng', implemented: true, description: 'Khai thác quặng, luyện đồng và chế biến gỗ.' },
  { id: 'iron', name: 'Đồ Sắt', implemented: true, description: 'Luyện sắt bằng than, dệt vải và vận chuyển hàng trao đổi.' },
  { id: 'modern', name: 'Hiện Đại', implemented: true, description: 'Lắp ráp linh kiện bằng thép, đồng và điện; nâng cấp nhà máy bằng sản phẩm.' },
  { id: 'anomaly', name: 'Dị Tượng', implemented: true, description: 'Công Nghệ Cao: vi mạch, điều khiển và định mức xưởng. Linh Mạch: nguồn, tinh chất và chăm sóc cộng hưởng. Quỷ Dị: sinh chất, cách ly và lọc mẫu có kiểm soát. Ba hướng có thích nghi tự nguyện từng người ở vòng đầu; hạt nhân/đổi nhánh chưa triển khai.' },
];
export {COMMODITIES} from './commodities';

export function createCivilization(): CivilizationState {
  const empty = (): Record<Commodity, number> => ({ copperOre: 0, copper: 0, lumber: 0, clay: 0, bricks: 0, pottery: 0, wheat: 0, ironOre: 0, coal: 0, iron: 0, fiber: 0, cloth: 0, steel:0,cutStone:0,machineParts:0,components:0,microchips:0,spiritStone:0,spiritEssence:0,relicBone:0,bloodstone:0,biomatter:0,medicine:0 });
  return { rulesVersion: 1, era: 'stone', unlocks: [], inventory: empty(), produced: empty(), harvestedStone: 0 };
}
export function goodsCapacity(island: Island): number {
  return 100 + island.buildings.filter(b => b.complete && b.type === 'storehouse').reduce((sum, b) => sum + (b.level ?? 1) * 200, 0) + Math.min(10, island.civilization?.inventory.pottery ?? 0) * 10;
}
export function storeGoods(island: Island, kind: Commodity, amount: number): number {
  const c = island.civilization;
  if (!c || !Number.isFinite(amount) || amount <= 0) return 0;
  const gain = Math.min(amount, Math.max(0, goodsCapacity(island) - c.inventory[kind]));
  c.inventory[kind] += gain; c.produced[kind] += gain;
  return gain;
}
const BUILD_UNLOCK: Partial<Record<BuildingType, string>> = {
  relic_extractor:'relic_handling',biomatter_workshop:'biomatter_processing',quarantine:'bio_containment',apothecary:'modern_medicine',clinic:'modern_medicine',spirit_extractor:'spirit_channeling',spirit_refinery:'essence_refining',resonance_tower:'resonance_care',microchip_factory:'advanced_semiconductors',control_center:'industrial_control',measurement_lab:'measurement_science',component_factory:'industrial_assembly',steelworks:'steelmaking',stonecutter:'mechanics',steam_generator:'electricity',prototype_workshop:'electricity',
  farm: 'basic_agriculture', lumbercamp: 'stone_tools', mine: 'stone_tools', storehouse: 'woodcutting',
  bridge: 'woodcutting', temple: 'community_rites', copper_mine: 'mineral_survey', smelter: 'copper_smelting', sawmill: 'woodcutting',
  clay_pit: 'ceramics', brick_kiln: 'ceramics', pottery_workshop: 'ceramics', wheat_field: 'grain_processing', bakery: 'grain_processing',
  iron_mine: 'iron_smelting', coal_mine: 'iron_smelting', iron_smelter: 'iron_smelting', flax_field: 'textiles', weaver: 'textiles', tradepost: 'trade_routes',
};
export function buildingLock(island: Island, type: BuildingType, targetLevel = 1): string | null {
  if(['relic_extractor','biomatter_workshop','quarantine','apothecary','clinic','measurement_lab','microchip_factory','control_center','spirit_extractor','spirit_refinery','resonance_tower'].includes(type)&&targetLevel>1)return 'Công trình này hiện có một cấp.';
  if(['tent','stockpile','fishing_dock','study_table'].includes(type)&&targetLevel>1)return 'Công trình sơ khai có một cấp. Xây nhà ở hoặc kho lương khi làng phát triển.';
  const c = island.civilization;
  const bronzeBuildings = ['copper_mine','smelter','sawmill','clay_pit','brick_kiln','pottery_workshop','wheat_field','bakery'];
  const ironBuildings = ['iron_mine','coal_mine','iron_smelter','flax_field','weaver','tradepost','steelworks','stonecutter','steam_generator','prototype_workshop'];
  if(['relic_extractor','biomatter_workshop','quarantine','apothecary','clinic','measurement_lab','component_factory','microchip_factory','control_center','spirit_extractor','spirit_refinery','resonance_tower'].includes(type)&&(!c||!['modern','anomaly'].includes(c.era)))return 'Cần kỷ nguyên Hiện Đại.';
  if (!c) return [...bronzeBuildings,...ironBuildings].includes(type) ? 'Cần hệ thống kỷ nguyên.' : null;
  if (ironBuildings.includes(type) && ['stone','bronze'].includes(c.era)) return 'Cần kỷ nguyên Đồ Sắt.';
  if (bronzeBuildings.includes(type) && c.era === 'stone') return 'Cần kỷ nguyên Đồ Đồng.';
  const research = BUILD_UNLOCK[type];
  if (research && !c.unlocks.includes(research)) return `Cần nghiên cứu ${({ relic_handling:'Tiếp cận di tích biến chất',biomatter_processing:'Sinh chất ổn định',bio_containment:'Kiểm soát phơi nhiễm',modern_medicine:'Y tế cộng đồng',spirit_channeling:'Dẫn linh sơ khai',essence_refining:'Tinh luyện tinh chất',resonance_care:'Chăm sóc cộng hưởng',advanced_semiconductors:'Bán dẫn tiên tiến',industrial_control:'Điều khiển công nghiệp',measurement_science:'Đo đạc hiện đại',industrial_assembly:'Lắp ráp công nghiệp',steelmaking:'Luyện thép',mechanics:'Cơ giới sơ khai',electricity:'Điện học',basic_agriculture: 'Nông nghiệp cơ bản', stone_tools: 'Công cụ đá', woodcutting: 'Mộc và bảo quản', community_rites: 'Sinh hoạt cộng đồng', mineral_survey: 'Khảo sát khoáng sản', copper_smelting: 'Luyện đồng', ceramics: 'Gạch và đồ gốm', grain_processing: 'Lúa mì và làm bánh', iron_smelting: 'Luyện sắt', textiles: 'Trồng lanh và dệt vải', trade_routes: 'Giao thương và vận chuyển' } as Record<string, string>)[research]}.`;
  if (targetLevel >= 2 && c.era === 'stone') return 'Cần Đồ Đồng để nâng công trình lên cấp 2.';
  if (targetLevel >= 2 && !c.unlocks.includes('bronze_construction')) return 'Cần nghiên cứu Kiến trúc Đồ Đồng.';
  if (targetLevel >= 3 && ['stone','bronze'].includes(c.era)) return 'Cần Đồ Sắt để nâng công trình lên cấp 3.';
  if (targetLevel >= 3 && !c.unlocks.includes('iron_construction')) return 'Cần nghiên cứu Kiến trúc Đồ Sắt.';
  return null;
}
export interface EraRequirement { label: string; progress: string; met: boolean; panel?: string }
export function bronzeRequirements(island: Island): EraRequirement[] {
  const c = island.civilization;
  const alive = island.npcs.filter(n => n.isAlive && n.position);
  const count = (label: string, current: number, target: number, panel?: string): EraRequirement => ({ label, progress: `${Math.floor(current)}/${target}`, met: current >= target, panel });
  const tech = (id: string, name: string): EraRequirement => ({ label: name, progress: c?.unlocks.includes(id) ? 'Hoàn tất' : 'Chưa học', met: Boolean(c?.unlocks.includes(id)), panel: 'research' });
  const complete = (type: BuildingType) => island.buildings.some(b => b.type === type && b.complete);
  const foodDemand = estimateDailyFoodDemand(alive);
  const reserve = foodDemand ? island.sharedFood / foodDemand : 0;
  const capacity = 15 + island.buildings.filter(b => b.type === 'house' && b.complete).reduce((s, b) => s + (b.level ?? 1) * 5, 0);
  return [
    count('Dân sống đã định cư', alive.length, 12, 'creatures'), tech('fire', 'Lửa'), tech('stone_tools', 'Công cụ đá'),
    tech('basic_agriculture', 'Nông nghiệp cơ bản'), tech('mineral_survey', 'Khảo sát khoáng sản'),
    { label: 'Nhà ở và kho đã hoàn thành', progress: complete('house') && complete('storehouse') ? 'Đã có' : 'Chưa đủ', met: complete('house') && complete('storehouse'), panel: 'build' },
    count('Mẻ nông trại đã sản xuất', Math.max(0, ...island.buildings.filter(b => b.complete && b.type === 'farm').map(b => b.productionBatches ?? 0)), 5, 'build'),
    count('Mẻ bãi gỗ hoặc mỏ đá', Math.max(0, ...island.buildings.filter(b => b.complete && ['lumbercamp', 'mine'].includes(b.type)).map(b => b.productionBatches ?? 0)), 5, 'build'),
    { label: 'Sức chứa cư dân', progress: `${alive.length}/${capacity}`, met: alive.length > 0 && alive.length <= capacity, panel: 'build' },
    { label: 'Dự trữ thức ăn', progress: `${reserve.toFixed(1)}/3 ngày`, met: reserve >= 3, panel: 'population' },
  ];
}
export function ironRequirements(island: Island): EraRequirement[] {
  const c=island.civilization!, alive=island.npcs.filter(n=>n.isAlive&&n.position);
  const tech=(id:string,label:string):EraRequirement=>({label,progress:c.unlocks.includes(id)?'Hoàn tất':'Chưa học',met:c.unlocks.includes(id),panel:'research'});
  const produced=(kind:Commodity,label:string,target:number):EraRequirement=>({label,progress:`${Math.floor(c.produced[kind])}/${target}`,met:c.produced[kind]>=target,panel:'build'});
  const demand=estimateDailyFoodDemand(alive),reserve=demand ? island.sharedFood/demand : 0;
  const capacity=15+island.buildings.filter(b=>b.complete&&b.type==='house').reduce((s,b)=>s+(b.level??1)*5,0);
  return [
    {label:'Dân sống đã định cư',progress:`${alive.length}/25`,met:alive.length>=25,panel:'creatures'},
    tech('copper_smelting','Luyện đồng'),tech('writing','Chữ viết'),tech('iron_survey','Khảo sát sắt'),
    produced('copper','Tổng đồng đã sản xuất',50),produced('lumber','Tổng gỗ xẻ đã sản xuất',30),
    {label:'Kho hàng hoàn thành',progress:island.buildings.some(b=>b.complete&&b.type==='storehouse')?'Đã có':'Chưa có',met:island.buildings.some(b=>b.complete&&b.type==='storehouse'),panel:'build'},
    {label:'Sức chứa cư dân',progress:`${alive.length}/${capacity}`,met:alive.length>0&&alive.length<=capacity,panel:'build'},
    {label:'Dự trữ thức ăn',progress:`${reserve.toFixed(1)}/5 ngày`,met:reserve>=5,panel:'population'},
  ];
}
/** Modern investment is staged behind ERAS.modern until its production chain is verified. */
export function beginModernDevelopment(island:Island):string|null {
 const c=island.civilization;if(!c||c.era!=='iron')return 'Cần kỷ nguyên Đồ Sắt.';
 if(c.transition)return 'Đang phát triển kỷ nguyên.';
 if(c.research)return 'Hoàn tất nghiên cứu đang làm trước khi tiến kỷ nguyên.';
 if(island.npcs.some(n=>n.isAlive&&!n.position))return 'Đặt hết cư dân khởi đầu trước.';
 const missing=modernRequirements(island).find(r=>!r.met);if(missing)return `Chưa đạt: ${missing.label} (${missing.progress}).`;
 if(Object.entries(MODERN_FEE).some(([g,a])=>c.inventory[g as keyof typeof MODERN_FEE]<a))return 'Cần 30 thép, 40 đá xây và 20 vải đã về kho.';
 for(const [g,a] of Object.entries(MODERN_FEE))c.inventory[g as keyof typeof MODERN_FEE]-=a;
 c.transition={target:'modern',workTicks:0,ticksNeeded:5*TICKS_PER_DAY};
 addEntry(island,'🏙️ Bắt đầu phát triển Hiện Đại (5 ngày). Phí đầu tư đã trả; dân vẫn cần thức ăn.', 'high');return null;
}
export function startEraDevelopment(island: Island): string | null {
  const c = island.civilization;
  if(c?.era==='iron'&&ERAS.find(e=>e.id==='modern')?.implemented)return beginModernDevelopment(island);
  if (!c || !['stone','bronze'].includes(c.era)) return 'Hiện Đại chưa được triển khai.';
  if(c.branchDevelopment)return 'Đang chuyển nhánh.';
  if (c.transition) return 'Đang phát triển kỷ nguyên.';
  if (c.research) return 'Hoàn tất nghiên cứu đang làm trước khi tiến kỷ nguyên.';
  if (island.npcs.some(n => n.isAlive && !n.position)) return 'Đặt hết cư dân khởi đầu trước.';
  const unmet = (c.era === 'stone' ? bronzeRequirements(island) : ironRequirements(island)).find(r => !r.met);
  if (unmet) return `Chưa đạt: ${unmet.label} (${unmet.progress}).`;
  if (c.era === 'stone') {
    if (island.wood < 40 || island.stone < 20) return 'Cần 40 gỗ và 20 đá.';
    island.wood -= 40; island.stone -= 20;
    c.transition = { target: 'bronze', workTicks: 0, ticksNeeded: 2 * TICKS_PER_DAY };
  } else {
    if (c.inventory.lumber < 30 || c.inventory.copper < 20 || c.inventory.bricks < 20) return 'Cần 30 gỗ xẻ, 20 đồng và 20 gạch.';
    c.inventory.lumber -= 30; c.inventory.copper -= 20; c.inventory.bricks -= 20;
    c.transition = { target: 'iron', workTicks: 0, ticksNeeded: 3 * TICKS_PER_DAY };
  }
  addEntry(island, `🏺 Bắt đầu phát triển ${c.transition.target==='iron'?'Đồ Sắt (3 ngày)':'Đồ Đồng (2 ngày)'}.`, 'high');
  return null;
}
export function tickCivilization(island: Island): void {
  const c = island.civilization, transition = c?.transition;
  if (!c || !transition || !island.npcs.some(n => n.isAlive && n.position && n.age >= 18)) return;
  if (++transition.workTicks >= transition.ticksNeeded) {
    c.era = transition.target; c.transition = undefined;
    addEntry(island, c.era==='modern' ? '🏙️ Bước vào Hiện Đại: nghiên cứu công nghiệp, nhà máy và linh kiện với điện đang cấp.' : c.era==='iron' ? '⚒️ Bước vào Đồ Sắt: mở luyện sắt, dệt vải, giao thương và kiến trúc cấp 3 theo nghiên cứu.' : '🏺 Bước vào Đồ Đồng: mở mỏ đồng, luyện kim, xưởng gỗ và kiến trúc mới.', 'high');
  }
}
