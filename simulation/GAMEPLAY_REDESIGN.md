# 🏝️ GAMEPLAY REDESIGN — THẾ GIỚI TỪ ĐẦU
> Tài liệu thiết kế gameplay mới hoàn toàn
> Ngày: 2026-10-02 | Trạng thái: **Bản thiết kế lịch sử**.
> Cập nhật 2026-10-05: phần kỷ nguyên và điều khiển được thay bằng [ERA_SYSTEM_DESIGN.md](ERA_SYSTEM_DESIGN.md) (**Đề xuất**), theo hướng gameplay trong GAMEPLAY_SYSTEMS_V1.md. Các phần cây nghiên cứu, AI và kế hoạch code bên dưới còn chứa luật cũ; khi xung đột về kỷ nguyên, dùng tài liệu mới.

---

## I. TRIẾT LÝ THIẾT KẾ

> **"Từ hoang dã đến văn minh — mỗi quyết định bạn đưa ra đều có hậu quả."**

Game bắt đầu từ **không có gì** — chỉ có đại dương. Người chơi là **Thần** nhưng không phải thần toàn năng:
- Giai đoạn đầu: phải **trực tiếp điều khiển** từng hành động
- Giai đoạn giữa: dần **trao quyền** cho hệ thống tự động thông qua nghiên cứu
- Giai đoạn cuối: văn minh **tự vận hành**, người chơi chỉ đưa ra chiến lược vĩ mô

---

## II. VÒNG LẶP KHỞI ĐẦU (SESSION START)

```
[Màn hình khởi đầu]
        ↓
[Chỉ có đại dương — không có đảo]
        ↓
  ┌─────────────────────────────────┐
  │   CHỌN CÁCH TẠO THẾ GIỚI       │
  │                                 │
  │  🎲 Random Map                  │
  │     Chọn: Shape / Size / Seed   │
  │     Preview → Xác nhận          │
  │                                 │
  │  🖊️  Custom Map (Paint Mode)    │
  │     Vẽ tay terrain trên biển    │
  │     Brush: đất/rừng/núi/sông    │
  │                                 │
  └─────────────────────────────────┘
        ↓
[Thế giới được tạo — chỉ toàn địa hình, không có gì sống]
        ↓
  ┌─────────────────────────────────┐
  │   ĐẶT THỰC THỂ KHỞI ĐẦU       │
  │                                 │
  │  Người chơi kéo-thả vào map:   │
  │  • 5–15 Con Người (bắt buộc)    │
  │  • (chỉ có Con Người ban đầu)   │
  │                                 │
  │  Tip: Đặt gần rừng & nguồn nước │
  └─────────────────────────────────┘
        ↓
[Game bắt đầu — Kỷ nguyên Nguyên Thủy]
```

---

## III. CÁC KỶ NGUYÊN & ĐIỀU KIỆN MỞ KHÓA

Hướng đích theo yêu cầu người chơi ngày 2026-10-05: **Đồ Đá → Đồ Đồng → Đồ Sắt → Hiện Đại → Dị Tượng**, với ba nhánh **Công Nghệ Cao**, **Linh Khí / Huyền Bí**, **Quỷ Dị** trong GAME_DESIGN.md gốc.

Luật chi tiết tại [Hệ thống kỷ nguyên và dị tượng](ERA_SYSTEM_DESIGN.md). Định cư, thuần hóa và quản trị là nhóm công nghệ, không là thời đại độc lập. Bảng sáu mã kỷ nguyên 0–5 trong code hiện tại thuộc prototype cũ, cần chuyển dữ liệu rõ ràng khi triển khai tiến trình mới.

Không bắt buộc chờ tuổi già, thế hệ con cháu, wealth chưa định nghĩa hoặc chiến thắng PvP. Dị tượng có quá trình khảo sát và phản ứng, tạo công trình và biến thể theo nhánh; niềm tin đi xuyên tiến trình và tồn tại song song khoa học.
## IV. HỆ THỐNG ĐIỀU KHIỂN VÀ TỔ CHỨC LAO ĐỘNG

Lao động cơ bản tự vận hành từ Đồ Đá theo ưu tiên và nguồn tài nguyên có đường tiếp cận. Người chơi có thể ra lệnh trực tiếp để can thiệp. Khi được phân công vào công trình hoặc nghiên cứu, cư dân chỉ thực hiện một vai trò kinh tế tại một thời điểm.

Kỷ nguyên cao mở công cụ tổ chức lớn hơn: nhóm nghề, dự trữ, chuyên môn, chính sách và quản trị vùng. Không dùng tỷ lệ “75% thủ công / 5% thủ công” hoặc khóa hành vi ăn, nghỉ, lao động đến kỷ nguyên 4. Quan hệ xã hội và sinh sản không là điều kiện bắt buộc để tiến kỷ nguyên.

Luật chuyển cấp, giao diện, tương thích bản lưu và thứ tự triển khai nằm trong [ERA_SYSTEM_DESIGN.md](ERA_SYSTEM_DESIGN.md). Các mục sau đây là lịch sử thiết kế và cần cập nhật khi triển khai hệ thống tương ứng.

---
## V. HỆ THỐNG NGHIÊN CỨU (TECH TREE)

### Cách hoạt động

```
[Điều kiện đủ]
       ↓
[Mở khoá Research Node]
       ↓
[Nhấn "Nghiên cứu" → Chọn công nghệ]
       ↓
[Tiêu tài nguyên + giao Elder làm]  
(không có Elder → chậm hơn 3×)
       ↓
[Đợi X ngày (tick)]
       ↓
[Công nghệ mở khoá → hiệu ứng áp dụng]
```

### Tech Tree chi tiết

```
NGUYÊN THỦY
├── 🔥 Lửa (free) → nấu ăn, sưởi ấm
├── 🪓 Công Cụ Đá → +50% thu thập
│   ├── ⚒️ Công Cụ Đồng → +100% thu thập  [cần đồng]
│   │   └── ⚔️ Vũ Khí → Chiến binh mạnh hơn
│   └── 🏗️ Kiến Trúc Đá → Nhà/Kho/Nông trại
│       ├── 🏰 Pháo đài → Phòng thủ
│       └── ⛩️ Đền thờ → Faith system
│
├── 🌾 Nông nghiệp → Farm hiệu quả hơn
│   ├── 💧 Tưới tiêu → +farm yield ×1.5
│   └── 🌱 Chọn giống → +regen resource
│
├── 🔬 Quan sát Tự nhiên → Mở khoá thuần hóa
│   ├── 🐄 Thuần hóa Gia súc [xem bảng loài]
│   ├── 🌿 Y học Thảo dược → Herbs có hiệu quả
│   └── 🌊 Hàng hải → Thuyền, mở rộng đảo
│
└── 👶 Hôn nhân & Dòng họ → Kích hoạt genealogy system
    ├── 📖 Chữ viết → Chronicle chi tiết hơn
    └── 🎓 Giáo dục → Trẻ em lớn nhanh hơn
```

### Chi phí ví dụ

| Công nghệ | Điều kiện | Chi phí | Thời gian |
|---|---|---|---|
| Công Cụ Đá | Đá ≥ 20, dân ≥ 3 | 20 đá | 5 ngày |
| Nông nghiệp | Gỗ ≥ 50, có đất | 50 gỗ + 20 đá | 10 ngày |
| Quan sát TN | Elder ≥ 1, thức ăn ≥ 200 | 30 gỗ + 20 đá | 10 ngày |
| Thuần hóa Bò | Quan sát TN, đồng cỏ | 50 gỗ + 20 đá | 15 ngày |
| Hàng hải | Gỗ ≥ 200, có bờ biển | 150 gỗ + 50 đá | 25 ngày |
| Chữ viết | Elder ≥ 2, kỷ nguyên 3+ | 100 gỗ + 30 đá | 20 ngày |

---

## VI. HỆ THỐNG SINH SẢN & GIA PHẢ

### Luồng sinh sản

```
[Hai người khác giới, age 18-45]
            ↓
[Relationship score ≥ 40]
            ↓
[Tán tỉnh (courting action)] → [Xác suất kết hôn 30%/ngày]
            ↓
[Kết hôn → partnerId set]
            ↓
[7.5%/ngày → có thai] (nếu rel ≥ 40)
            ↓
[Mang thai 7-10 ngày]
            ↓
[Sinh con → NPC mới]
            ↓
[Con inherit tính cách cha mẹ ±15]
            ↓
[Con = child occupation, không làm việc]
            ↓
[Age ≥ 18 → trưởng thành → nhận nghề]
```

### Cấu trúc Gia phả

```typescript
interface FamilyNode {
  npcId:      string;
  name:       string;
  generation: number;       // 0 = người đặt ban đầu
  birthDay:   number;       // tick/10
  deathDay:   number | null;
  motherId:   string | null;
  fatherId:   string | null;
  partnerId:  string | null;
  childrenIds: string[];
  
  // Inherited traits summary
  dominantTraits: string[];  // e.g. ['can đảm', 'lòng tham']
  bloodline: string;         // tên dòng họ (lấy từ cha)
}
```

### Dòng họ (Bloodline)

- Thế hệ 0: Người chơi đặt tên họ ban đầu (VD: "Nguyễn", "Trần")
- Con cái theo họ cha
- Nếu bố không có họ → tạo họ mới từ pool
- Họ ảnh hưởng đến: mối quan hệ ngoại giao, liên minh, xung đột

### Genealogy Tree UI

```
[Gia phả] Button (toolbar hoặc trong Inspector)

Thế hệ 0: [An] ─── [Lan]
           Nguyễn     Trần
              │
         ┌────┴────┐
    Thế hệ 1: [Bình] [Mai]
              Nguyễn  Nguyễn
                 │
            Thế hệ 2: [Hùng]
                       Nguyễn
```

---

## VII. LUỒNG LOGIC NPC THEO KỶ NGUYÊN

### Kỷ nguyên 0 (Lệnh trực tiếp + lao động nền)
```
NPC.utilityAI = OFF
Người chơi phân công ưu tiên food / wood / stone / idle
Mỗi ngày người trưởng thành tạo tài nguyên theo ưu tiên
Người chơi click NPC → setCommand(action) để xử lý tình huống cụ thể
Lệnh trực tiếp không thay thế ưu tiên lao động nền
```

### Kỷ nguyên 1-2 (Công trình + lao động nền)
```
Người chơi có thể gán cư dân vào công trình
Cư dân đang làm công trình không nhận thêm sản lượng lao động nền
Nếu tài nguyên công trình hết → cần đổi phân công hoặc ra lệnh khác
```

### Kỷ nguyên 3 (Semi-Auto)
```
NPC có urgency scores cho từng need
Nếu hunger > 70 → tự tìm thức ăn
Nếu rest > 80 → tự ngủ
Còn lại → làm assignedTask
```

### Kỷ nguyên 4-5 (Full AI - Utility AI)
```
Mỗi tick: score tất cả actions
Chọn action điểm cao nhất
Thực thi → chronicle event nếu quan trọng
Player chỉ can thiệp qua Decree / Miracle
```

---

## VIII. KHỞI ĐẦU BALANCED (Starting Conditions)

| Yếu tố | Giá trị khởi đầu | Lý do |
|---|---|---|
| Con người | 5–15 (player chọn) | Đủ để tồn tại |
| Thức ăn | 5 mỗi cư dân trong bản prototype | Có thời gian xem sản lượng và đặt ưu tiên trước khi kho cạn |
| Gỗ thô | 0 | Phải đi chặt |
| Đá thô | 0 | Phải đi nhặt |
| AI level | 0 (direct commands); ưu tiên lao động nền vẫn hoạt động | Học điều phối vĩ mô trước, lệnh cá nhân dùng khi cần |
| Mùa đầu tiên | Xuân (dễ hơn) | Buffer time |

**Chiến lược khởi đầu tối ưu**:
1. Đặt người gần rừng + nước
2. Kiểm tra dự báo tiêu thụ và số ngày dự trữ trong HUD
3. Điều chỉnh ưu tiên food / wood / stone trong bảng Dân cư
4. Dùng lệnh trực tiếp khi cần xử lý tình huống cụ thể
5. Theo dõi nhịp sản lượng trước khi tăng dân số hoặc đầu tư công trình

> **Giới hạn prototype hiện tại:** ưu tiên lao động tạo tài nguyên theo ngày và chưa kiểm tra đường đi/ô địa hình. Đây là mô hình kinh tế nền để thử nhịp sinh tồn, chưa phải hệ thống nghề nghiệp cuối cùng cho multiplayer.

---

## IX. KẾ HOẠCH CODE (Implementation Order)

### Sprint 1: World Creation Flow
- [ ] Màn hình khởi đầu (chỉ biển)
- [ ] Random Map Panel (shape/seed)
- [ ] Paint Mode (vẽ tay terrain)
- [ ] Entity Placement Mode (kéo thả người)

### Sprint 2: Manual Control System
- [ ] Command Queue cho NPC
- [ ] Action Menu (click NPC → menu)
- [ ] Manual gather/chop/fish/rest
- [ ] Kỷ nguyên 0 giới hạn quyết định AI phức tạp; vẫn cho phép lao động nền và nhu cầu sinh tồn tự vận hành
- [ ] Resource accumulation HUD

### Sprint 3: Research System
- [ ] ResearchNode data structure
- [ ] Tech Tree data (conditions + costs + effects)
- [ ] Research Panel UI
- [ ] Unlock condition checker
- [ ] Research progress timer

### Sprint 4: Era Progression
- [ ] Era checker (auto-detect kỷ nguyên)
- [ ] Era transition event + animation
- [ ] AI unlock per era
- [x] Labor priority UI và sản lượng lao động nền (prototype; chưa có pathfinding hay tick server-authoritative)

### Sprint 5: Genealogy
- [ ] FamilyNode data structure
- [ ] Bloodline system
- [ ] Genealogy Tree UI (canvas-based)
- [ ] Inspector panel hiển thị family tree

### Sprint 6: Animal Species
- [ ] Animal NPC type
- [ ] Domestication research + mechanic
- [ ] Animal behavior AI
- [ ] Animal breeding system

---

## X. FILE CẦN SỬA/TẠO

| File | Action | Ưu tiên |
|---|---|---|
| `src/core/types.ts` | Thêm Command, Era, FamilyNode, AnimalNPC | 🔴 Critical |
| `src/core/engine.ts` | Era-based AI toggle, command execution | 🔴 Critical |
| `src/ui/StartScreen.ts` | **Tạo mới** — màn hình khởi đầu | 🔴 Critical |
| `src/ui/EntityPlacer.ts` | **Tạo mới** — drag & drop entity vào map | 🔴 Critical |
| `src/ui/ActionMenu.ts` | **Tạo mới** — click NPC → action menu | 🔴 Critical |
| `src/ui/ResearchPanel.ts` | **Tạo mới** — Tech Tree UI | 🟡 High |
| `src/ui/GenealogyTree.ts` | **Tạo mới** — Family tree canvas | 🟡 High |
| `src/core/research.ts` | **Tạo mới** — Tech tree data & logic | 🟡 High |
| `src/core/bloodline.ts` | **Tạo mới** — Bloodline & family tracking | 🟡 High |
| `src/renderer/WorldMap.ts` | Custom paint mode integration | 🟡 High |
| `web/index.html` | Start screen + entity placer | 🟡 High |
