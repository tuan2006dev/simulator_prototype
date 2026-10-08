// ============================================================
// research.ts — Tech tree data, unlock logic, research progress
// ============================================================

import type { Island, Commodity } from './types';
import { COMMODITIES, ERAS } from './civilization';
import type { GameState, IslandStats } from '../game/GameState';
import { addEntry } from './chronicle';

// ── Tech node definition ──────────────────────────────────────────────────────
export interface TechNode {
  implemented?: boolean;
  costGoods?: Partial<Record<Commodity, number>>;
  id:          string;
  name:        string;
  description: string;
  icon:        string;
  category:    'tool' | 'building' | 'nature' | 'society' | 'military';
  // Prerequisites
  requires:    string[];    // IDs of other tech nodes
  needEra:     number;      // minimum era
  // Cost
  costWood:    number;
  costStone:   number;
  costFood:    number;
  costHerbs:   number;
  // Duration
  daysNeeded:  number;      // without Elder
  // Condition check (extra)
  condition?:  (island: Island, stats: IslandStats) => boolean;
  conditionLabel?: string;
  // Effects — what gets unlocked
  unlocksId:   string;      // stored in GameState.unlocks
  effect:      string;      // human-readable effect
}

// ── Full tech tree ────────────────────────────────────────────────────────────
const tech = (id: string, name: string, icon: string, category: TechNode['category'], requires: string[], needEra: number, costs: [number, number, number, number], days: number, effect: string, implemented = true): TechNode => ({
  id, name, icon, category, requires, needEra, costWood: costs[0], costStone: costs[1], costFood: costs[2], costHerbs: costs[3], daysNeeded: days, unlocksId: id, description: effect, effect, implemented,
});
export const TECH_TREE: TechNode[] = [
  { ...tech('biological_adaptation', 'Th\u00EDch nghi sinh ch\u1EA5t t\u1EF1 nguy\u1EC7n', '\u2726', 'society', ['bio_containment'], 4, [10, 5, 15, 0], 3, 'Vi\u1EC7n h\u1ED7 tr\u1EE3 ng\u01B0\u1EDDi tr\u01B0\u1EDFng th\u00E0nh \u0111\u1ED3ng \u00FD, ph\u01A1i nhi\u1EC5m<15:2sinh ch\u1EA5t1v\u1EA3i/10nh\u1ECBp/2c\u00F4ng su\u1EA5t.100m\u1EBB thu gi\u1EA3m ph\u01A1i nhi\u1EC5m c\u00E1 nh\u00E2n5\u21923 ho\u1EB7c l\u1ECDc2\u21921; nhi\u1EC5m ngu\u1ED3n/ng\u01B0\u1EE1ng30/60/yield kh\u00F4ng \u0111\u1ED5i. Ch\u0103m s\u00F3c1sinh ch\u1EA5t4nh\u1ECBp/g\u1EE1 mi\u1EC5n ph\u00ED5nh\u1ECBp. Kh\u00F4ng mi\u1EC5n nhi\u1EC5m/gi\u1EBFt/\u0111\u1ED5i to\u00E0n d\u00E2n.'), costGoods: { biomatter: 2, cloth: 2 }, condition: s => s.civilization?.anomalyBranch === 'eldritch', conditionLabel: 'C\u1EA7n ch\u1ED1t Qu\u1EF7 D\u1ECB.' },
  tech('fire', 'L\u1EEDa', '\uD83D\uDD25', 'tool', [], 0, [5, 0, 5, 0], 2, 'C\u01B0 d\u00E2n gi\u1EA3m lo l\u1EAFng m\u1ED7i ng\u00E0y; n\u1EC1n t\u1EA3ng luy\u1EC7n kim.'),
  tech('stone_tools', 'C\u00F4ng c\u1EE5 \u0111\u00E1', '\u2692\uFE0F', 'tool', ['fire'], 0, [0, 20, 10, 0], 2, '+50% thu g\u1ED7 v\u00E0 \u0111\u00E1; m\u1EDF tr\u1EA1i g\u1ED7, m\u1ECF \u0111\u00E1.'),
  tech('research_table', 'T\u1ED5 ch\u1EE9c nghi\u00EAn c\u1EE9u', '\uD83D\uDCD6', 'society', ['stone_tools'], 0, [15, 10, 10, 0], 3, 'M\u1EDF c\u00E1c nghi\u00EAn c\u1EE9u \u0111\u1ECBnh c\u01B0; ng\u01B0\u1EDDi tr\u01B0\u1EDFng th\u00E0nh c\u00F3 th\u1EC3 nghi\u00EAn c\u1EE9u.'),
  tech('basic_agriculture', 'N\u00F4ng nghi\u1EC7p c\u01A1 b\u1EA3n', '\uD83C\uDF3E', 'nature', ['research_table'], 0, [20, 10, 15, 0], 4, 'M\u1EDF n\u00F4ng tr\u1EA1i; s\u1EA3n xu\u1EA5t c\u1EA7n ng\u01B0\u1EDDi \u0111\u1EBFn ru\u1ED9ng.'),
  tech('woodcutting', 'M\u1ED9c v\u00E0 b\u1EA3o qu\u1EA3n', '\uD83C\uDF32', 'building', ['stone_tools'], 0, [10, 5, 10, 0], 2, 'M\u1EDF kho, c\u1EA7u v\u00E0 x\u01B0\u1EDFng g\u1ED7 \u1EDF \u0110\u1ED3 \u0110\u1ED3ng.'),
  tech('basic_shelter', 'N\u01A1i \u1EDF c\u01A1 b\u1EA3n', '\uD83C\uDFE0', 'building', ['research_table'], 0, [20, 10, 10, 0], 2, 'Nh\u00E0 \u1EDF gi\u00FAp h\u1ED3i ph\u1EE5c ngh\u1EC9 th\u00EAm 2 \u0111i\u1EC3m/ng\u00E0y.'),
  tech('mineral_survey', 'Kh\u1EA3o s\u00E1t kho\u00E1ng s\u1EA3n', '\uD83D\uDD0E', 'tool', ['research_table'], 0, [15, 10, 10, 0], 2, '\u0110i\u1EC1u ki\u1EC7n v\u00E0o \u0110\u1ED3 \u0110\u1ED3ng; m\u1EDF m\u1ECF \u0111\u1ED3ng khi ti\u1EBFn c\u1EA5p.'),
  tech('nature_observation', 'Quan s\u00E1t t\u1EF1 nhi\u00EAn', '\uD83D\uDD2D', 'nature', ['basic_agriculture'], 0, [20, 10, 20, 5], 3, 'M\u1EDF nghi\u00EAn c\u1EE9u thu\u1EA7n h\u00F3a; kh\u00F4ng c\u1EA7n gi\u00E0 l\u00E0ng.'),
  tech('community_rites', 'Sinh ho\u1EA1t c\u1ED9ng \u0111\u1ED3ng', '\uD83D\uDED5', 'society', ['basic_shelter'], 0, [15, 10, 15, 0], 3, 'M\u1EDF \u0111\u1EC1n h\u1ED7 tr\u1EE3 tinh th\u1EA7n; Faith \u0111\u1EA7y \u0111\u1EE7 ch\u01B0a tri\u1EC3n khai.'),
  tech('domesticate_cattle', 'Thu\u1EA7n H\u00F3a B\u00F2', '\uD83D\uDC04', 'nature', ['nature_observation'], 0, [30, 10, 30, 5], 4, 'Cho \u0111\u1EB7t v\u00E0 ch\u0103m s\u00F3c b\u00F2; s\u1EA3n xu\u1EA5t theo chu k\u1EF3.'),
  tech('domesticate_chicken', 'Nu\u00F4i G\u00E0', '\uD83D\uDC13', 'nature', ['nature_observation'], 0, [15, 5, 20, 0], 3, 'Cho \u0111\u1EB7t v\u00E0 ch\u0103m s\u00F3c g\u00E0; s\u1EA3n xu\u1EA5t theo chu k\u1EF3.'),
  tech('domesticate_dog', 'Thu\u1EA7n H\u00F3a Ch\u00F3', '\uD83D\uDC15', 'nature', ['nature_observation'], 0, [20, 0, 20, 0], 3, 'Cho \u0111\u1EB7t v\u00E0 ch\u0103m s\u00F3c ch\u00F3.'),
  tech('copper_smelting', 'Luy\u1EC7n \u0111\u1ED3ng', '\uD83D\uDD36', 'tool', ['mineral_survey', 'fire'], 1, [25, 20, 20, 0], 4, 'M\u1EDF l\u00F2 luy\u1EC7n: 4 qu\u1EB7ng + 2 g\u1ED7 \u2192 2 \u0111\u1ED3ng m\u1ED7i m\u1EBB/th\u1EE3.'),
  { ...tech('bronze_construction', 'Ki\u1EBFn tr\u00FAc \u0110\u1ED3 \u0110\u1ED3ng', '\uD83C\uDFFA', 'building', ['copper_smelting', 'woodcutting'], 1, [20, 15, 10, 0], 4, 'M\u1EDF n\u00E2ng c\u1EA5p c\u00F4ng tr\u00ECnh l\u00EAn c\u1EA5p 2 v\u00E0 ki\u1EBFn tr\u00FAc m\u1EDBi.'), costGoods: { copper: 5, lumber: 12 } },
  tech('ceramics', 'G\u1EA1ch v\u00E0 \u0111\u1ED3 g\u1ED1m', '\uD83C\uDFFA', 'building', ['fire', 'mineral_survey'], 1, [20, 15, 15, 0], 3, 'M\u1EDF h\u1ED1 \u0111\u1EA5t s\u00E9t, l\u00F2 g\u1EA1ch v\u00E0 x\u01B0\u1EDFng g\u1ED1m. M\u1ED7i \u0111\u1ED3 g\u1ED1m trong kho th\u00EAm 10 s\u1EE9c ch\u1EE9a h\u00E0ng, t\u1ED1i \u0111a +100.'),
  tech('grain_processing', 'L\u00FAa m\u00EC v\u00E0 l\u00E0m b\u00E1nh', '\uD83E\uDD56', 'nature', ['basic_agriculture', 'woodcutting'], 1, [20, 10, 15, 0], 3, 'M\u1EDF ru\u1ED9ng l\u00FAa m\u00EC v\u00E0 l\u00F2 b\u00E1nh. L\u00FAa m\u00EC c\u1EA7n ch\u1EBF bi\u1EBFn; b\u00E1nh b\u1ED5 sung th\u1EE9c \u0103n d\u00F9ng \u0111\u01B0\u1EE3c.'),
  tech('writing', 'Ch\u1EEF vi\u1EBFt', '\u270D\uFE0F', 'society', ['research_table'], 1, [40, 15, 20, 0], 5, 'M\u1EDF kh\u1EA3o s\u00E1t s\u1EAFt v\u00E0 n\u1EC1n t\u1EA3ng giao th\u01B0\u01A1ng; \u0111i\u1EC1u ki\u1EC7n ti\u1EBFn \u0110\u1ED3 S\u1EAFt.'),
  tech('iron_survey', 'Kh\u1EA3o s\u00E1t s\u1EAFt', '\uD83D\uDD0D', 'tool', ['writing', 'mineral_survey'], 1, [25, 20, 20, 0], 3, '\u0110i\u1EC1u ki\u1EC7n ti\u1EBFn \u0110\u1ED3 S\u1EAFt; x\u00E1c \u0111\u1ECBnh ngu\u1ED3n qu\u1EB7ng s\u1EAFt v\u00E0 than \u0111\u00E3 c\u00F3 tr\u00EAn b\u1EA3n \u0111\u1ED3.'),
  tech('iron_smelting', 'Luy\u1EC7n s\u1EAFt', '\u2692\uFE0F', 'tool', ['iron_survey', 'copper_smelting'], 2, [30, 20, 20, 0], 4, 'M\u1EDF m\u1ECF s\u1EAFt, m\u1ECF than v\u00E0 l\u00F2 luy\u1EC7n: 4 qu\u1EB7ng s\u1EAFt +2 than \u21922 s\u1EAFt.'),
  tech('textiles', 'Tr\u1ED3ng lanh v\u00E0 d\u1EC7t v\u1EA3i', '\uD83E\uDDF5', 'nature', ['basic_agriculture', 'writing'], 2, [25, 15, 20, 0], 3, 'M\u1EDF ru\u1ED9ng lanh t\u1EA1o s\u1EE3i v\u00E0 x\u01B0\u1EDFng d\u1EC7t: 6 s\u1EE3i \u21923 v\u1EA3i.'),
  { ...tech('iron_construction', 'Ki\u1EBFn tr\u00FAc \u0110\u1ED3 S\u1EAFt', '\uD83C\uDFDB\uFE0F', 'building', ['iron_smelting', 'bronze_construction'], 2, [30, 20, 20, 0], 4, 'M\u1EDF c\u1EA5p 3, d\u00F9ng s\u1EAFt, g\u1EA1ch v\u00E0 g\u1ED7 x\u1EBB cho c\u00F4ng tr\u00ECnh.'), costGoods: { iron: 10, bricks: 12 } },
  { ...tech('trade_routes', 'Giao th\u01B0\u01A1ng v\u00E0 v\u1EADn chuy\u1EC3n', '\uD83D\uDED2', 'society', ['writing', 'textiles'], 2, [25, 15, 20, 0], 3, 'M\u1EDF tr\u1EA1m giao th\u01B0\u01A1ng. Ng\u01B0\u1EDDi v\u1EADn chuy\u1EC3n \u0111i t\u1EDBi \u0111i\u1EC3m th\u01B0\u01A1ng nh\u00E2n ven n\u01B0\u1EDBc r\u1ED3i mang h\u00E0ng v\u1EC1; ch\u1EC9 kh\u1EDFi h\u00E0nh khi b\u1EA1n \u0111\u1EB7t chuy\u1EBFn.'), costGoods: { cloth: 6 } },
  { ...tech('mechanics', 'C\u01A1 gi\u1EDBi s\u01A1 khai', '\u2699\uFE0F', 'tool', ['iron_smelting', 'writing'], 2, [30, 20, 20, 0], 4, 'M\u1EDF x\u01B0\u1EDFng c\u1EAFt \u0111\u00E1; n\u1EC1n t\u1EA3ng m\u00E1y m\u00F3c ti\u1EC1n c\u00F4ng nghi\u1EC7p.'), costGoods: { iron: 8, lumber: 10 } },
  { ...tech('steelmaking', 'Luy\u1EC7n th\u00E9p', '\u2692\uFE0F', 'tool', ['mechanics', 'iron_smelting'], 2, [25, 20, 20, 0], 4, 'M\u1EDF l\u00F2 th\u00E9p: 4 s\u1EAFt +2 than \u21922 th\u00E9p, c\u1EA7n v\u1EADn chuy\u1EC3n th\u1EADt.'), costGoods: { iron: 10, bricks: 8 } },
  { ...tech('electricity', '\u0110i\u1EC7n h\u1ECDc nguy\u00EAn m\u1EABu', '\u26A1', 'tool', ['mechanics', 'steelmaking'], 2, [30, 20, 20, 0], 5, 'M\u1EDF m\u00E1y ph\u00E1t than v\u00E0 x\u01B0\u1EDFng m\u00E1y c\u1EA7n \u0111i\u1EC7n; ch\u1ECDn \u01B0u ti\u00EAn khi thi\u1EBFu c\u00F4ng su\u1EA5t.'), costGoods: { steel: 4, copper: 6 } },
  { ...tech('industrial_assembly', 'L\u1EAFp r\u00E1p c\u00F4ng nghi\u1EC7p', '\u2699\uFE0F', 'building', ['mechanics', 'electricity'], 3, [20, 15, 20, 0], 4, 'M\u1EDF nh\u00E0 m\u00E1y: 2 th\u00E9p +2 \u0111\u1ED3ng +2 c\u00F4ng su\u1EA5t \u21923 linh ki\u1EC7n. Linh ki\u1EC7n d\u00F9ng n\u00E2ng c\u1EA5p nh\u00E0 m\u00E1y, t\u0103ng s\u1ED1 th\u1EE3.'), costGoods: { machineParts: 4, lumber: 8 } },
  { ...tech('industrial_supply', 'H\u1EE3p \u0111\u1ED3ng cung \u1EE9ng', '\uD83D\uDED2', 'society', ['industrial_assembly', 'trade_routes'], 3, [15, 10, 20, 0], 3, 'M\u1EDF trao \u0111\u1ED5i v\u1EA3i l\u1EA5y than v\u00E0 \u0111\u1ED3ng khi m\u1ECF c\u1EA1n: 8 v\u1EA3i \u219210 than ho\u1EB7c 12 v\u1EA3i \u21926 \u0111\u1ED3ng. Ch\u1ECDn t\u1EEBng chuy\u1EBFn, tr\u1EA3 h\u00E0ng tr\u01B0\u1EDBc, v\u1EADn chuy\u1EC3n v\u1EC1 kho.'), costGoods: { components: 3, machineParts: 2 } },
  { ...tech('field_surveys', 'Kh\u1EA3o s\u00E1t th\u1EF1c \u0111\u1ECBa', '\uD83D\uDD0E', 'society', ['industrial_supply'], 3, [15, 10, 20, 0], 3, 'M\u1EDF ba chuy\u1EBFn kh\u1EA3o s\u00E1t s\u01A1 b\u1ED9: ch\u1ECDn ng\u01B0\u1EDDi \u0111i t\u1EDBi \u0111i\u1EC3m l\u1EA1, quan s\u00E1t r\u1ED3i mang h\u1ED3 s\u01A1 v\u1EC1 b\u00E0n; m\u1ED7i chuy\u1EBFn 2 linh ki\u1EC7n +2 v\u1EA3i. Ch\u01B0a ph\u00E2n t\u00EDch hay nh\u1EADn bi\u1EBFn th\u1EC3.'), costGoods: { components: 6, machineParts: 1 } },
  { ...tech('measurement_science', '\u0110o \u0111\u1EA1c hi\u1EC7n \u0111\u1EA1i', '\uD83D\uDD2C', 'building', ['field_surveys', 'electricity'], 3, [15, 10, 20, 0], 3, 'M\u1EDF c\u01A1 s\u1EDF ph\u00E2n t\u00EDch h\u1ED3 s\u01A1: th\u1EE3 t\u1EDBi l\u00E0m, m\u1ED7i h\u1ED3 s\u01A1 2 linh ki\u1EC7n/40 nh\u1ECBp, c\u1EA7n 2 c\u00F4ng su\u1EA5t. \u0110i\u1EC7n 5 ng\u00E0y t\u00EDnh ri\u00EAng cho c\u01A1 s\u1EDF.'), costGoods: { components: 6, machineParts: 1 } },
  { ...tech('advanced_semiconductors', 'B\u00E1n d\u1EABn ti\u00EAn ti\u1EBFn', '\u2699\uFE0F', 'building', ['measurement_science', 'industrial_assembly'], 3, [15, 10, 20, 0], 4, 'M\u1EDF x\u01B0\u1EDFng vi m\u1EA1ch: 2 linh ki\u1EC7n +1 \u0111\u1ED3ng \u21921 vi m\u1EA1ch, th\u1EE3/\u0111i\u1EC7n/v\u1EADn chuy\u1EC3n. Vi m\u1EA1ch d\u00F9ng nghi\u00EAn c\u1EE9u v\u00E0 x\u00E2y trung t\u00E2m \u0111i\u1EC1u khi\u1EC3n; ch\u01B0a chuy\u1EC3n nh\u00E1nh ch\u1EE7 \u0111\u1EA1o.'), costGoods: { components: 8, machineParts: 2 }, condition: t => !!t.surveys?.sites.some(e => e.kind === 'hightech' && e.foundationComplete && e.decision === 'research'), conditionLabel: 'C\u1EA7n ho\u00E0n t\u1EA5t d\u1EF1 \u00E1n n\u1EC1n t\u1EA3ng C\u00F4ng ngh\u1EC7 t\u1EA1i c\u01A1 s\u1EDF \u0111o \u0111\u1EA1c.' },
  { ...tech('spiritual_attunement', 'C\u1ED9ng h\u01B0\u1EDFng t\u1EF1 nguy\u1EC7n', '\u2728', 'society', ['resonance_care'], 4, [10, 5, 15, 0], 3, 'Vi\u1EC7n gi\u00FAp t\u1EEBng ng\u01B0\u1EDDi tr\u01B0\u1EDFng th\u00E0nh \u0111\u1ED3ng \u00FD c\u1ED9ng h\u01B0\u1EDFng:2tinh ch\u1EA5t1v\u1EA3i/10nh\u1ECBp/2c\u00F4ng su\u1EA5t. Trong4\u00F4 th\u00E1p ho\u1EA1t \u0111\u1ED9ng/ngu\u1ED3n \u1ED5n \u0111\u1ECBnh, +20% ti\u1EBFn \u0111\u1ED9 tinh luy\u1EC7n/d\u1EC7t/xay/n\u01B0\u1EDBng khi \u0111\u1EE7 \u0111\u1EA7u v\u00E0o/ch\u1ED7 h\u00E0ng,100l\u01B0\u1EE3t. Ch\u0103m s\u00F3c1tinh ch\u1EA5t/4nh\u1ECBp; g\u1EE1 mi\u1EC5n ph\u00ED/5nh\u1ECBp. Kh\u00F4ng t\u0103ng qu\u00E2n l\u1EF1c ho\u1EB7c \u0111\u1ED5i ngh\u1EC1.'), costGoods: { spiritEssence: 2, cloth: 2 }, condition: t => t.civilization?.anomalyBranch === 'mystic', conditionLabel: 'C\u1EA7n ch\u1ED1t Linh M\u1EA1ch.' },
  { ...tech('assistive_augmentation', 'Thi\u1EBFt b\u1ECB h\u1ED7 tr\u1EE3 t\u1EF1 nguy\u1EC7n', '\u2699\uFE0F', 'society', ['industrial_control'], 4, [10, 5, 15, 0], 3, 'Vi\u1EC7n h\u1ED7 tr\u1EE3 t\u1EEBng ng\u01B0\u1EDDi \u0111\u1ED3ng \u00FD:1vi m\u1EA1ch2linh ki\u1EC7n/10nh\u1ECBp/th\u1EE32c\u00F4ng su\u1EA5t. +15% ti\u1EBFn \u0111\u1ED9 c\u00F4ng nghi\u1EC7p trong100l\u01B0\u1EE3t c\u00F3 v\u1EADt t\u01B0; b\u1EA3o d\u01B0\u1EE1ng1linh ki\u1EC7n/4nh\u1ECBp, g\u1EE1 mi\u1EC5n ph\u00ED/5nh\u1ECBp. Kh\u00F4ng \u0111\u1ED5i ngh\u1EC1/quan h\u1EC7/t\u00EDnh c\u00E1ch.'), costGoods: { microchips: 1, components: 3 }, condition: t => t.civilization?.anomalyBranch === 'hightech', conditionLabel: 'C\u1EA7n ch\u1ED1t C\u00F4ng Ngh\u1EC7 Cao.' },
  { ...tech('industrial_control', '\u0110i\u1EC1u khi\u1EC3n c\u00F4ng nghi\u1EC7p', '\u2699\uFE0F', 'building', ['advanced_semiconductors'], 3, [10, 5, 15, 0], 3, 'M\u1EDF trung t\u00E2m \u0111i\u1EC1u khi\u1EC3n: th\u1EE3 l\u00E0m t\u1EA1i ch\u1ED7 v\u00E0 2 c\u00F4ng su\u1EA5t t\u0103ng t\u1ED1c m\u1EBB c\u00F4ng nghi\u1EC7p trong 6 \u00F4 th\u00EAm25%; kh\u00F4ng c\u1ED9ng d\u1ED3n, v\u1EABn t\u1ED1n \u0111\u1EE7 nguy\u00EAn li\u1EC7u.'), costGoods: { microchips: 4 } },
  { ...tech('relic_handling', 'Ti\u1EBFp c\u1EADn di t\u00EDch bi\u1EBFn ch\u1EA5t', '\uD83D\uDD2C', 'building', ['measurement_science'], 3, [10, 5, 15, 0], 3, 'M\u1EDF tr\u1EA1m trong2\u00F4 di t\u00EDch:2x\u01B0\u01A1ng c\u1ED1t1huy\u1EBFt th\u1EA1ch/m\u1EBB. Nhi\u1EC5m t\u1EA1i ngu\u1ED3n v\u00E0 ng\u01B0\u1EDDi thu t\u0103ng, c\u00F3 ng\u01B0\u1EE1ng d\u1EEBng; kh\u00F4ng gi\u1EBFt d\u00E2n/bi\u1EBFn \u0111\u1ED5i. Ch\u01B0a ch\u1ECDn nh\u00E1nh.'), costGoods: { cloth: 6, cutStone: 4 }, condition: t => !!t.surveys?.sites.some(e => e.kind === 'eldritch' && e.foundationComplete && e.decision === 'research'), conditionLabel: 'C\u1EA7n n\u1EC1n t\u1EA3ng Qu\u1EF7 D\u1ECB t\u1EA1i vi\u1EC7n.' },
  { ...tech('biomatter_processing', 'Sinh ch\u1EA5t \u1ED5n \u0111\u1ECBnh', '\uD83D\uDD2C', 'building', ['relic_handling'], 3, [10, 5, 15, 0], 3, 'X\u01B0\u1EDFng2x\u01B0\u01A1ng c\u1ED1t1huy\u1EBFt th\u1EA1ch1th\u1EA3o d\u01B0\u1EE3c\u21921sinh ch\u1EA5t, th\u1EE3/2c\u00F4ng su\u1EA5t/v\u1EADn chuy\u1EC3n. D\u00F9ng cho nghi\u00EAn c\u1EE9u, x\u00E2y v\u00E0 v\u1EADn h\u00E0nh khu c\u00E1ch ly.'), costGoods: { relicBone: 2, bloodstone: 1, cloth: 4 } },
  { ...tech('bio_containment', 'Ki\u1EC3m so\u00E1t ph\u01A1i nhi\u1EC5m', '\uD83D\uDD2C', 'building', ['biomatter_processing'], 3, [10, 5, 15, 0], 3, 'Khu c\u00E1ch ly d\u00F9ng1sinh ch\u1EA5t/10nh\u1ECBp c\u00F3 t\u00E1c d\u1EE5ng,2c\u00F4ng su\u1EA5t/ng\u01B0\u1EDDi t\u1EA1i ch\u1ED7. Gi\u1EA3m2nhi\u1EC5m ngu\u1ED3n trong3\u00F4 v\u00E02ph\u01A1i nhi\u1EC5m c\u01B0 d\u00E2n trong4\u00F4; kh\u00F4ng ch\u1EEFa t\u1EEB xa/to\u00E0n \u0111\u1EA3o, kh\u00F4ng t\u1EF1 bi\u1EBFn \u0111\u1ED5i.'), costGoods: { biomatter: 3 } },
  { ...tech('spirit_channeling', 'D\u1EABn linh s\u01A1 khai', '\uD83D\uDD2C', 'building', ['measurement_science'], 3, [10, 5, 15, 0], 3, 'M\u1EDF tr\u1EA1m d\u1EABn linh trong2\u00F4 c\u1EE7a m\u1EA1ch \u0111\u00E3 kh\u1EA3o s\u00E1t: linh th\u1EA1ch c\u00F3 tr\u1EEF l\u01B0\u1EE3ng/\u1ED5n \u0111\u1ECBnh, khai th\u00E1c qu\u00E1 m\u1EE9c ph\u1EA3i ngh\u1EC9. Ch\u01B0a ch\u1ECDn nh\u00E1nh ch\u1EE7 \u0111\u1EA1o.'), costGoods: { cloth: 6, cutStone: 4 }, condition: t => !!t.surveys?.sites.some(e => e.kind === 'mystic' && e.foundationComplete && e.decision === 'research'), conditionLabel: 'C\u1EA7n ho\u00E0n t\u1EA5t n\u1EC1n t\u1EA3ng Linh M\u1EA1ch t\u1EA1i vi\u1EC7n.' },
  { ...tech('essence_refining', 'Tinh luy\u1EC7n tinh ch\u1EA5t', '\uD83D\uDD2C', 'building', ['spirit_channeling'], 3, [10, 5, 15, 0], 3, 'M\u1EDF x\u01B0\u1EDFng tinh luy\u1EC7n:2linh th\u1EA1ch+1th\u1EA3o d\u01B0\u1EE3c\u21921tinh ch\u1EA5t; th\u1EE3,2c\u00F4ng su\u1EA5t v\u00E0 v\u1EADn chuy\u1EC3n. Tinh ch\u1EA5t d\u00F9ng nghi\u00EAn c\u1EE9u/x\u00E2y/nu\u00F4i th\u00E1p c\u1ED9ng h\u01B0\u1EDFng.'), costGoods: { spiritStone: 4, cloth: 4 } },
  { ...tech('resonance_care', 'Ch\u0103m s\u00F3c c\u1ED9ng h\u01B0\u1EDFng', '\uD83D\uDD2C', 'building', ['essence_refining'], 3, [10, 5, 15, 0], 3, 'M\u1EDF th\u00E1p:1tinh ch\u1EA5t/10nh\u1ECBp ng\u01B0\u1EDDi l\u00E0m t\u1EA1i ch\u1ED7+2c\u00F4ng su\u1EA5t, m\u1EA1ch \u1ED5n \u0111\u1ECBnh\u226540, h\u1ED3i1s\u1EE9c kh\u1ECFe v\u00E0 gi\u1EA3m1\u0111\u1ED9 m\u1EC7t m\u1ED7i nh\u1ECBp cho ng\u01B0\u1EDDi trong4\u00F4. Kh\u00F4ng bi\u1EBFn \u0111\u1ED5i c\u01B0 d\u00E2n.'), costGoods: { spiritEssence: 3 } },
  tech('herbalism', 'Y h\u1ECDc th\u1EA3o d\u01B0\u1EE3c', '\uD83C\uDF3F', 'nature', ['nature_observation'], 0, [20, 10, 20, 15], 4, 'Cho c\u01B0 d\u00E2n tr\u01B0\u1EDFng th\u00E0nh v\u1EC1 kho d\u00F9ng2th\u1EA3o d\u01B0\u1EE3c cho li\u1EC7u tr\u00ECnh4nh\u1ECBp, h\u1ED3i5s\u1EE9c kh\u1ECFe/nh\u1ECBp; gi\u1EEF c\u00F4ng vi\u1EC7c v\u00E0 h\u00E0ng mang.'),
  { ...tech('modern_medicine', 'Y t\u1EBF c\u1ED9ng \u0111\u1ED3ng', '\uD83C\uDF3F', 'building', ['herbalism', 'industrial_assembly'], 3, [15, 10, 20, 5], 3, 'M\u1EDF x\u01B0\u1EDFng2th\u1EA3o d\u01B0\u1EE3c+1v\u1EA3i\u21921thu\u1ED1c v\u00E0 ph\u00F2ng kh\u00E1m. C\u1EA7n v\u1EADn chuy\u1EC3n, th\u1EE3 v\u00E0 \u0111i\u1EC7n; nh\u1EADn ng\u01B0\u1EDDi l\u1EDBn/tr\u1EBB em, kh\u00F4ng b\u1EAFt ch\u1ECDn nh\u00E1nh d\u1ECB t\u01B0\u1EE3ng.'), costGoods: { components: 4, cloth: 6 } },
  tech('ai_behavior', 'K\u1EBF ho\u1EA1ch lao \u0111\u1ED9ng', '\uD83E\uDDE0', 'society', ['writing'], 2, [40, 20, 30, 0], 6, 'L\u1ECBch ph\u00E2n c\u00F4ng n\u00E2ng cao \u2014 ch\u01B0a tri\u1EC3n khai.', !1),
  tech('navigation', 'H\u00E0ng h\u1EA3i', '\u26F5', 'military', ['woodcutting', 'writing'], 2, [80, 30, 40, 0], 6, 'Thuy\u1EC1n v\u00E0 giao th\u01B0\u01A1ng li\u00EAn \u0111\u1EA3o \u2014 ch\u01B0a tri\u1EC3n khai.', !1)
];

// ── Active research progress ───────────────────────────────────────────────────
export interface ResearchProgress {
  techId:      string;
  startDay:    number;
  daysNeeded:  number;    // adjusted by Elder bonus
  assignedElderId: string | null;
  researcherId?: string;
  workTicks?: number;
}

// ── Research manager functions ─────────────────────────────────────────────────
export function canResearch(
  tech: TechNode,
  island: Island,
  gs: GameState,
  stats: IslandStats,
): { ok: boolean; reason?: string } {
  if (tech.implemented === false) return { ok: false, reason: 'Chưa có trong phiên bản này' };
  if (gs.unlocks.has(tech.unlocksId)) return { ok: false, reason: 'Đã nghiên cứu' };
  if (island.civilization?.transition) return { ok: false, reason: 'Đang phát triển kỷ nguyên' };
  if (island.civilization && !island.npcs.some(n=>n.isAlive&&n.position&&n.age>=18&&n.occupation!=='child'&&!n.cargo&&!n.freight&&!n.haulTask&&island.equipment?.order?.workerId!==n.id&&island.defense?.order?.npcId!==n.id&&!n.treatment&&!n.clinicalCare&&island.adaptationProcess?.npcId!==n.id&&!island.buildings.some(b=>b.workers.includes(n.id)))) return { ok: false, reason: 'Cần một người trưởng thành không làm ở công trình' };
  const eraIndex = island.civilization ? ERAS.findIndex(e => e.id === island.civilization!.era) : gs.era;
  if (eraIndex < tech.needEra)
    return { ok: false, reason: `Cần đạt ${ERAS[tech.needEra]?.name ?? tech.needEra}` };

  for (const req of tech.requires) {
    if (!gs.unlocks.has(req))
      return { ok: false, reason: `Cần nghiên cứu trước: ${TECH_TREE.find(t => t.id === req)?.name}` };
  }
  if (island.wood      < tech.costWood)  return { ok: false, reason: `Thiếu gỗ (cần ${tech.costWood})` };
  if (island.stone     < tech.costStone) return { ok: false, reason: `Thiếu đá (cần ${tech.costStone})` };
  if (island.sharedFood < tech.costFood) return { ok: false, reason: `Thiếu thức ăn (cần ${tech.costFood})` };
  if (island.herbs     < tech.costHerbs) return { ok: false, reason: `Thiếu thảo dược (cần ${tech.costHerbs})` };

  if (tech.condition && !tech.condition(island, stats))
    return { ok: false, reason: tech.conditionLabel ?? 'Điều kiện chưa đủ' };

  for (const [kind, amount] of Object.entries(tech.costGoods ?? {})) {
    if ((island.civilization?.inventory[kind as Commodity] ?? 0) < amount) return { ok: false, reason: 'Thiếu ' + COMMODITIES[kind as Commodity] + ' (cần ' + amount + ')' };
  }
  return { ok: true };
}

export function startResearch(
  tech: TechNode,
  island: Island,
  gs: GameState,
  stats: IslandStats,
  currentDay: number,
): ResearchProgress | null {
  const check = canResearch(tech, island, gs, stats);
  if (!check.ok) return null;

  if (island.civilization?.research || island.civilization?.transition) return null;
  const researcher = island.civilization ? island.npcs.find(n => n.isAlive && n.position && n.age >= 18 && n.occupation !== 'child' && !n.exploring&&!n.researching && !n.cargo && !n.freight && !n.haulTask && island.equipment?.order?.workerId!==n.id&&island.defense?.order?.npcId!==n.id&&!n.treatment&&!n.clinicalCare&&island.adaptationProcess?.npcId!==n.id && !island.buildings.some(b => b.workers.includes(n.id))) : null;
  if (island.civilization && !researcher) return null;
  if (researcher) { researcher.researching = true; researcher.path = undefined; researcher.actionTarget = undefined; researcher.laborTask = undefined; }
  for (const [kind, amount] of Object.entries(tech.costGoods ?? {})) island.civilization!.inventory[kind as Commodity] -= amount;
  // Deduct costs
  island.wood        -= tech.costWood;
  island.stone       -= tech.costStone;
  island.sharedFood  -= tech.costFood;
  island.herbs       -= tech.costHerbs;

  // Elder speeds up research ×2
  const speedMult    = !island.civilization && stats.elderCount >= 1 ? 0.5 : 1.0;
  const adjustedDays = Math.ceil(tech.daysNeeded * speedMult);

  addEntry(island, `📖 Bắt đầu nghiên cứu: ${tech.name} (${adjustedDays} ngày).`, 'medium');

  return {
    ...(researcher ? { researcherId: researcher.id, workTicks: 0 } : {}),
    techId:          tech.id,
    startDay:        currentDay,
    daysNeeded:      adjustedDays,
    assignedElderId: null,
  };
}

export function tickResearch(
  progress: ResearchProgress | null,
  gs: GameState,
  island: Island,
  currentDay: number,
): ResearchProgress | null {
  if (!progress) return null;

  const elapsed = progress.workTicks === undefined ? currentDay - progress.startDay : progress.workTicks / 10;
  if (elapsed >= progress.daysNeeded) {
    // Research complete!
    const tech = TECH_TREE.find(t => t.id === progress.techId);
    if (tech) {
      gs.unlocks.add(tech.unlocksId);
      addEntry(island, `✨ Nghiên cứu hoàn thành: ${tech.icon} ${tech.name}! ${tech.effect}`, 'high');
    }
    if (progress.researcherId) { const researcher = island.npcs.find(n => n.id === progress.researcherId); if (researcher) { researcher.researching = false; researcher.laborRetryAt = 0; } }
    return null; // clear active research
  }
  return progress;
}
