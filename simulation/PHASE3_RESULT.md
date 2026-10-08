# 📋 PHASE 2.5 + PHASE 3 — KẾT QUẢ & HƯỚNG DẪN TEST

> **Build**: `web/game.js` **44.8 KB** ✅
> **Thời gian build**: 18ms
> **Ngày hoàn thành**: 2026-10-02

---

## PHASE 2.5 — UI OVERHAUL ✅

### Những thay đổi chính

| Vấn đề cũ | Giải pháp mới |
|---|---|
| Sidebar chiếm 290px mất canvas | **Canvas fullscreen** — không còn sidebar cứng |
| Gauge canvas 160×90px to, cồng kềnh | **Inline mood bars** — 2 thanh nhỏ đẹp trong HUD |
| HUD cao 64px, chiếm không gian | **HUD 48px** — mỏng hơn, compact hơn |
| Inspector panel là sidebar luôn hiện | **Floating panel** — slide in từ phải khi click NPC |
| Chronicle log cố định sidebar | **Floating log** — góc dưới phải, nhỏ gọn |
| Button không có active state rõ | **Glow effect** — teal=active, đỏ=paused |
| Màu cũ: xanh lá (#2ecc71) generic | **Teal #00c896** — palette mới premium hơn |
| Chữ thô, size không nhất quán | **Typography scale** chặt chẽ hơn |

### File đã thay đổi
- `web/style.css` — **Rewrite hoàn toàn** (561 → 720 dòng)
- `web/index.html` — **Rewrite hoàn toàn** (layout mới)
- `src/ui/InspectorPanel.ts` — CSS-based need/trait bars
- `src/ui/HUD.ts` — mood bars + null-safe gauge

---

## PHASE 3 — BUILDING SYSTEM ✅

### Tính năng đã code

#### 1. Resource Layer
| File | Tính năng |
|---|---|
| `src/renderer/ResourceSpawner.ts` | Cluster-based seeded spawning — 6 loại resource |
| | Harvest API + tick regen (cây regen, đá không) |
| | 8 spawn rules với biome conditions |

#### 2. Building System
| File | Tính năng |
|---|---|
| `src/renderer/BuildingManager.ts` | 7 loại công trình |
| | Bảng chi phí (gỗ/đá/thức ăn) |
| | Construction progress (workers → speed up) |
| | Production per tick (lumbercamp→gỗ, mine→đá, farm→thức ăn) |
| | Worker assignment (tối đa 3-5/công trình) |

#### 3. Build Panel UI
| File | Tính năng |
|---|---|
| `src/ui/BuildPanel.ts` | Catalogue 7 công trình với chi phí |
| | Kiểm tra affordability (thiếu tiền → dim) |
| | Click → build mode → click canvas đặt công trình |
| | Kiểm tra terrain hợp lệ trước khi đặt |

#### 4. HUD Phase 3
- 🪵 **Gỗ** live counter (bắt đầu 0, tăng khi Trại gỗ hoạt động)
- 🪨 **Đá** live counter (bắt đầu 0, tăng khi Mỏ đá hoạt động)

---

## 7 Loại công trình

| Công trình | Icon | Chi phí | Terrain | Chức năng |
|---|---|---|---|---|
| Nông trại | 🌾 | 15🪵 5🪨 10🍖 | grass/sand | +thức ăn/tick |
| Trại gỗ | 🌲 | 5🪨 10🍖 | forest/grass | +gỗ/tick |
| Mỏ đá | ⛏️ | 10🪵 15🍖 | mountain | +đá/tick |
| Nhà ở | 🏠 | 20🪵 10🪨 15🍖 | grass/sand | Giảm mệt mỏi |
| Kho lương | 🏪 | 30🪵 20🪨 20🍖 | grass/sand | Tăng giới hạn thức ăn |
| Cầu | 🌉 | 30🪵 20🪨 10🍖 | river/shallow_water | Đi qua sông |
| Đền thờ | 🛕 | 40🪵 30🪨 25🍖 | grass | +hạnh phúc/sùng đạo |

---

## 6 Loại tài nguyên

| Resource | Terrain | Spawn% | Regen |
|---|---|---|---|
| 🌲 Cây gỗ | forest (80%) / grass (25%) | Cluster 4-7 | ✅ 0.5/tick |
| 🪨 Mỏ đá | mountain (70%) / grass cao (15%) | Cluster 3-5 | ❌ |
| 🌿 Thảo dược | grass ẩm (30%) | Cluster 5-8 | ✅ 1.0/tick |
| 🐟 Điểm câu | shallow_water (40%) | Cluster 4-6 | ✅ 2.0/tick |
| 🔶 Quặng đồng | mountain cao (25%) | Cluster 1-3 | ❌ |
| 🌾 Đất màu mỡ | grass ẩm (35%) | Cluster 3-5 | — (buff) |

---

## 🧪 HƯỚNG DẪN TEST

### UI Mới (Phase 2.5)
- [ ] Mở `web/index.html` — Canvas fullscreen, không còn sidebar trắng bên phải
- [ ] HUD mỏng hơn (48px), resources ở trái, mood bars ở giữa
- [ ] **Mood bars**: 2 thanh nhỏ xanh/đỏ thay vì canvas gauge to
- [ ] **Gỗ = 0, Đá = 0** hiện trong HUD (không còn `—`)
- [ ] Click NPC → Inspector panel **slide in từ phải** (không còn sidebar)
- [ ] Inspector có **need bars** CSS (không còn block chars)
- [ ] Inspector có **trait bars** centered (xanh=dương, đỏ=âm)
- [ ] Chronicle **floating** góc dưới phải
- [ ] Speed buttons glow **teal** khi active, **đỏ** khi pause

### Building System (Phase 3)
- [ ] Click **🏗️ Xây dựng** (toolbar dưới)
- [ ] Modal hiện 7 công trình với chi phí (Nông trại/Trại gỗ/Mỏ đá...)
- [ ] Công trình **dim** khi không đủ tài nguyên (ban đầu gỗ=0, đá=0)
- [ ] **Nông trại** (chỉ cần 15🪵 10🍖): không đủ ban đầu
- [ ] Chờ đến khi có đủ tài nguyên, click công trình → modal đóng, cursor đổi thành **✛ crosshair**
- [ ] Tiêu đề canvas hiện: "🏗️ Đặt: [tên] — Click vào ô đất phù hợp"
- [ ] Click ô đất phù hợp → công trình được đặt
- [ ] **Escape** → hủy build mode
- [ ] Chronicle log: "🏗️ Bắt đầu xây..." và sau đó "✅ ... hoàn thành!"
- [ ] Sau khi Trại gỗ hoàn thành + có workers: 🪵 tăng dần trong HUD

### Resources
- [ ] Gỗ và Đá bắt đầu ở 0
- [ ] Xây Trại gỗ trên rừng → gỗ tăng (cần phải có workers)
- [ ] **Lưu ý**: Workers Phase 3 chưa có UI assign — sẽ thêm Phase 3.5

---

## ⚠️ HẠN CHẾ BIẾT TRƯỚC

| Vấn đề | Giai đoạn fix |
|---|---|
| Worker assignment UI chưa có | Phase 3.5 |
| Resource overlay chưa vẽ lên tile | Phase 3.5 |
| Building sprite chưa vẽ lên canvas | Phase 3.5 |
| NPC auto-pathfind đến công trình | Phase 4 |
| Phase 3 cần gỗ/đá mới xây → vòng chicken-and-egg | Sẽ cho start wood=50 stone=30 |

---

## 📊 BUILD STATS

| Chỉ số | Phase 2 | Phase 2.5+3 |
|---|---|---|
| Bundle size | 37.6 KB | **44.8 KB** |
| Build time | 116ms | **18ms** |
| TypeScript files | 10 | **14** |
