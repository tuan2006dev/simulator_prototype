# 📋 PROGRESS.md — Tiến trình Code Game

> **Cập nhật lần cuối**: 2026-10-02
> **Developer**: AI Game Developer
> **Project**: Strategy Settlement & Management Game (WorldBox-inspired)
> **Bundle hiện tại**: 68.8 KB ✅

---

## ✅ ĐÃ HOÀN THÀNH (Simulation Engine — TypeScript/Node)

### Core Engine (100% done)
| File | Dòng | Nội dung |
|---|---|---|
| `types.ts` | 110 | NPC, Island, Needs, Personality, Action types |
| `engine.ts` | 238 | Tick loop, Utility AI, starvation, pregnancy, aging |
| `actions.ts` | 612 | 9 actions: eat, sleep, work, chat, court, steal, fight, flee, pray |
| `factory.ts` | 184 | createNPC, createIsland, createChildNPC, Vietnamese names |
| `chronicle.ts` | ~50 | Event logging với importance levels |
| `utils.ts` | 90 | Math helpers, relationship system |
| `run.ts` | 352 | CLI runner, analysis reports (death/theft/marriage/genetics) |

### Tính năng đã có:
- [x] Utility AI: mỗi NPC tự chọn action dựa trên needs + personality
- [x] 4 nhu cầu: hunger, rest, safety, social
- [x] 5 trục tính cách: courage, greed, loyalty, piety, sociability
- [x] Starvation system: chết sau 12 tick đói ≥95
- [x] Hệ thống hôn nhân & sinh sản (pregnancy countdown, childbirth)
- [x] Di truyền tính cách từ cha mẹ (±15 mutation)
- [x] Trẻ em trưởng thành ở tuổi 18, nhận nghề theo personality
- [x] Hệ thống trộm cắp với cooldown và phát hiện
- [x] Hệ thống chiến đấu với per-target cooldown + daily limit
- [x] Hệ thống quan hệ (relationship -100 đến +100)
- [x] Chronicle (biên niên sử) với 3 mức importance
- [x] CLI runner với log file, realtime output, phân tích sau mô phỏng
- [x] Shared food storage + private food stash
- [x] Aging system (1 tuổi/ngày game = 10 tick)

---

## 🔨 ĐANG LÀM / KẾ HOẠCH TIẾP THEO

---

## PHASE 1: Web Foundation ✅ HOÀN THÀNH
**Mục tiêu**: Game chạy trên trình duyệt với tilemap pixel art và NPC hiển thị trực quan

### Tasks Phase 1:
- [x] 1.1 Tạo `index.html` — cấu trúc HTML cơ bản, canvas element
- [x] 1.2 Tạo `style.css` — layout, dark theme, font pixel
- [x] 1.3 Tạo `TilemapRenderer.ts` — Canvas 2D tilemap renderer 16×16
- [x] 1.4 Vẽ tile programmatic pixel art (không cần file ảnh)
- [x] 1.5 NPC hiển thị dưới dạng dot/sprite di chuyển trên bản đồ
- [x] 1.6 Camera pan & zoom (click-drag, scroll wheel)
- [x] 1.7 Port simulation engine sang browser-compatible ES module

**Đầu ra Phase 1**: Mở trình duyệt thấy bản đồ đảo pixel art với NPC di chuyển ✅

---

## PHASE 2: Simulation Bridge + HUD ✅ HOÀN THÀNH
**Mục tiêu**: Engine simulation chạy trong browser, HUD cập nhật real-time

### Tasks Phase 2:
- [x] 2.1 Engine.ts browser-ready (không có Node.js dependencies)
- [x] 2.2 Game loop với requestAnimationFrame (tick mỗi 600ms × speed)
- [x] 2.3 Top Bar HUD: Dân số, Food, Ngày
- [x] 2.4 Dual-arc Circular Gauge (Happiness vs Fear)
- [x] 2.5 Time controls: Pause, ×1, ×2, ×4 với active state glow
- [x] 2.6 Inspector Panel: Click NPC → hiển thị stats đầy đủ
- [x] 2.7 Chronicle Viewer (sidebar live + panel Nhật ký)
- [x] 2.8 Happiness% và Fear% tính từ NPC needs
- [x] 2.9 Minimap 160×100px thường trực góc dưới-phải (MỚI)
- [x] 2.10 NPC hover tooltip: tên/nghề/đói% (MỚI)
- [x] 2.11 Keyboard: Space=pause, Escape=deselect, M=minimap (MỚI)
- [x] 2.12 URL seed: `?seed=12345` (MỚI)
- [x] 2.13 Loading screen progress bar thật (MỚI)

**Đầu ra Phase 2**: HUD real-time, click NPC xem thông tin, pause/speed controls, minimap ✅

> **Xem kết quả đầy đủ**: `PHASE2_RESULT.md`

---

## PHASE 2.5: UI Overhaul ✅ HOÀN THÀNH
**Mục tiêu**: Thiết kế lại hoàn toàn giao diện — tối giản, chuyên nghiệp

### Tasks Phase 2.5:
- [x] 2.5.1 Canvas fullscreen — không còn sidebar cứng
- [x] 2.5.2 HUD mỏng 48px — inline mood bars thay canvas gauge
- [x] 2.5.3 Inspector Panel floating — slide in từ phải khi click NPC
- [x] 2.5.4 Chronicle floating — góc dưới phải, nhỏ gọn
- [x] 2.5.5 Need/Trait bars — CSS progress bars thay block chars
- [x] 2.5.6 Glassmorphism palette — Teal #00c896, glow effects
- [x] 2.5.7 Build panel cards — affordability check visual
- [x] 2.5.8 Building icons vẽ trực tiếp lên tile trên canvas

**Đầu ra Phase 2.5**: UI đẹp, chuyên nghiệp, canvas toàn màn hình ✅

---

## PHASE 3: Gameplay Redesign + World Creation + Research ✅ HOÀN THÀNH
**Mục tiêu**: Thiết kế lại cơ chế game từ đầu theo GAMEPLAY_REDESIGN.md

### Sprint 1 — World Creation:
- [x] 3.1 Start Screen mới — chọn shape/size/seed, preview realtime
- [x] 3.2 4 hình dạng đảo: Tòn / Dài / Cụm Đảo / Lưỡi Liềm
- [x] 3.3 3 kích thước: Nhỏ 50×35 / Vừa 80×50 / Lớn 120×80
- [x] 3.4 Seed input + Random 🎲 + preview canvas realtime
- [x] 3.5 Dân số khởi đầu slider 3–15 người
- [x] 3.6 GameState machine: MENU → WORLD_CREATE → PLAYING
- [x] 3.7 Era system (0-5) với điều kiện auto-advance

### Sprint 2 — Manual Control:
- [x] 3.8 Era 0: AI tắt hoàn toàn — chỉ decay needs
- [x] 3.9 Action Menu — click NPC → menu xuất hiện gần NPC
- [x] 3.10 6 lệnh thủ công: Hái lượm / Chặt cây / Nhặt đá / Câu cá / Nghỉ / Nói chuyện
- [x] 3.11 Yield ngay lập tức, lọc theo terrain
- [x] 3.12 Tool bonus ×1.5 khi đã nghiên cứu stone_tools
- [x] 3.13 Badge "Chế độ thủ công" hiện khi Era 0

### Sprint 3 — Research System:
- [x] 3.14 15 công nghệ — 5 danh mục: Công Cụ / Công Trình / Tự Nhiên / Xã Hội / Quân Sự
- [x] 3.15 Điều kiện mở khoá: tài nguyên + era + condition
- [x] 3.16 Elder ×2 tốc độ nghiên cứu
- [x] 3.17 Progress bar khi đang nghiên cứu
- [x] 3.18 Lock/unlock visual + affordability check
- [x] 3.19 Research Panel UI đầy đủ trong toolbar

### Resource & HUD:
- [x] 3.20 🌿 Thảo dược HUD chip
- [x] 3.21 Building icons vẽ trên canvas (tile)
- [x] 3.22 Construction progress bar dưới icon
- [x] 3.23 Era badge tự cập nhật

**Đầu ra Phase 3**: Start screen đẹp, điều khiển thủ công, research tech tree ✅

> **Xem kết quả**: `PHASE3_GAMEPLAY_RESULT.md`

---

## PHASE 3.5: Entity Placement + Pathfinding ✅ HOÀN THÀNH
**Mục tiêu**: Kéo thả NPC vào bản đồ khi khởi đầu, NPC di chuyển đến điểm thu thập

### Tasks Phase 3.5:
- [x] 3.5.1 Entity Placement Mode — kéo thả NPC vào tile sau khi tạo đảo
- [x] 3.5.2 Pathfinding cơ bản (A* hoặc BFS) đến tile target
- [x] 3.5.3 NPC di chuyển đến tile khai thác khi ra lệnh
- [x] 3.5.4 Action radius — chỉ ra lệnh khi NPC đang ở terrain phù hợp
- [x] 3.5.5 Resource overlay trên tile (vẽ ResourceNode lên map)

**Đầu ra Phase 3.5**: NPC thực sự đi đến nơi làm việc ✅

---

## PHASE 3.6: Map Editor Nâng cấp ✅ HOÀN THÀNH
**Mục tiêu**: Paint Mode trở thành công cụ thiết kế map chuyên nghiệp

### Tasks Phase 3.6:
- [x] 3.6.1 Brush Size: 1×1, 3×3, 5×5, 7×7 với brush tròn (circle mask)
- [x] 3.6.2 Paint Mode: Địa hình / Tài nguyên / Xóa (3 mode)
- [x] 3.6.3 Resource Brush: đặt tài nguyên trực tiếp lên tile (6 loại: cây/đá/thảo dược/cá/đồng/đất màu)
- [x] 3.6.4 Undo/Redo 30 bước — ghi nhận batch mỗi stroke
- [x] 3.6.5 Grid Overlay: lưới tile với nhãn tọa độ (toggle `G`)
- [x] 3.6.6 Tọa độ tile real-time: hiển thị (x, y) và loại tile dưới cursor
- [x] 3.6.7 Distance Ruler: đặt điểm đầu bằng click, thước hiển thị khoảng cách tile + mét (1 tile = 10m)
- [x] 3.6.8 Map Stats Panel: đất liền/rừng/cát/núi, cảnh báo balance theo GDD (800-1800 tiles)
- [x] 3.6.9 Keyboard shortcuts: T/V/E mode · G grid · R ruler · [/] brush size · Ctrl+Z/Y undo/redo
- [x] 3.6.10 Paint mode bắt đầu với map ngẫu nhiên (thay vì vẽ trên ocean trống)
- [x] 3.6.11 Erase mode: xóa resource hoặc vẽ deep_water

**Đầu ra Phase 3.6**: Tool vẽ map chuyên nghiệp với ruler, grid, stats ✅

---

## PHASE 4: Genealogy + Animal Species (TODO)
**Mục tiêu**: Hệ thống gia phả trực quan, thuần hóa động vật

### Tasks Phase 4:
- [ ] 4.1 FamilyNode data structure + Bloodline tracking
- [ ] 4.2 Genealogy Tree UI (canvas-based)
- [ ] 4.3 Inspector hiển thị family tree cho từng NPC
- [ ] 4.4 Animal NPC type (bò, gà, chó...)
- [ ] 4.5 Domestication mechanic — thuần hóa sau nghiên cứu
- [ ] 4.6 Animal AI và breeding system
- [ ] 4.7 Animal sản xuất: sữa, trứng, len...

**Đầu ra Phase 4**: Gia phả trực quan, có động vật trong game

---

## PHASE 5: Divine Power + Raid + Diplomacy (TODO)
**Mục tiêu**: Quyền năng thần thánh, raid wave, ngoại giao

### Tasks Phase 5:
- [ ] 5.1 Faith resource: tính từ happiness + temple
- [ ] 5.2 Divine power panel: phép thuật với cost/cooldown
- [ ] 5.3 Escalating cost + Backlash system
- [ ] 5.4 Raid wave system: lịch tấn công định kỳ
- [ ] 5.5 Raid combat: warriors auto-fight
- [ ] 5.6 Decree system: sắc lệnh với tradeoff
- [ ] 5.7 Multi-island diplomacy

**Đầu ra Phase 5**: Game hoàn chỉnh — Divine powers + Raid + Ngoại giao

---

## 📊 METRICS THEO DÕI

### Performance Goals
| Metric | Target |
|---|---|
| Max NPC concurrent | 100+ NPC |
| Tick rate | 10 ticks/giây (x1 speed) |
| Frame rate | 60 FPS stable |
| Canvas size | 800x600 tilemap |

### Game Balance Targets (Kỷ nguyên 1)
| Chỉ số | Target |
|---|---|
| Starvation rate | < 20% trong 30 ngày đầu |
| Marriage rate | 40-60% dân số trưởng thành |
| Happiness baseline | 50-70% khi đủ ăn |
| Fear baseline | < 30% khi không có raid |

---

## 🐛 BUG LOG

| Bug | Status | Fix |
|---|---|---|
| emoji scope trong NPCRenderer | ✅ Fixed | Hoist emoji ra ngoài if block |
| Loading screen chạy 2 lần | ✅ Fixed | Xóa inline script, dùng main.ts |

---

## 💡 NOTES & DECISIONS

### Kiến trúc quyết định:
1. **Không dùng framework**: Vanilla HTML+CSS+TS để tối ưu performance cho canvas rendering
2. **Programmatic pixel art**: Vẽ tiles bằng Canvas API thay vì load file ảnh → dễ iterate
3. **Port engine không refactor**: Giữ nguyên logic simulation đã test kỹ, chỉ bỏ Node.js imports
4. **ECS-lite pattern**: NPC là data object thuần, actions là pure functions
5. **requestAnimationFrame loop**: Tách render loop khỏi simulation tick loop

### Cần thảo luận:
- [ ] Tilemap size: 50x50 hay 80x80 tiles?
- [ ] NPC pathfinding: simple random walk hay A* lite?
- [ ] Save/Load: localStorage hay không cần ở prototype?
