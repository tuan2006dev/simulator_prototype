# 📜 ĐẶC TẢ THIẾT KẾ & TÍNH NĂNG MỚI: KỶ NGUYÊN 0 & HỆ THỐNG THẦN LỰC (FAITH)
> **Tài liệu hướng dẫn triển khai cho Đội ngũ Phát triển (Dev & Design Team)**  
> **Dự án**: Đảo Thiên Nguyên (The Genesis Island)  
> **Ngày cập nhật**: 2026-10-05  
> **Trạng thái**: Đã thống nhất thiết kế — Sẵn sàng lập trình  

---

## 📌 MỤC LỤC
1. [Cốt Truyện Mở Đầu & Kịch Bản Intro (Narrative Lore)](#1-cốt-truyện-mở-đầu--kịch-bản-intro)
2. [Nhịp Sinh Hoạt 1 Ngày & Cơ Chế Sinh Tồn Tự Động](#2-nhịp-sinh-hoạt-1-ngày--cơ-chế-sinh-tồn-tự-động)
3. [Hệ Thống Kho Đồ & Ô Trang Bị Cá Nhân (Inventory & Equipment)](#3-hệ-thống-kho-đồ--ô-trang-bị-cá-nhân)
4. [Hệ Thống Chỉ Số NPC 3 Tầng (Needs - Attributes - Traits)](#4-hệ-thống-chỉ-số-npc-3-tầng)
5. [Hệ Thống Nghề Nghiệp & Thuật Toán Tự Nhận Nghề (Auto-Claim)](#5-hệ-thống-nghề-nghiệp--thuật-toán-tự-nhận-nghề)
6. [Công Trình & Tài Nguyên Kỷ Nguyên 0](#6-công-trình--tài-nguyên-kỷ-nguyên-0)
7. [Mối Đe Dọa Sinh Tồn (Early-game Hazards)](#7-mối-đe-dọa-sinh-tồn)
8. [Các Ý Tưởng Tương Tác Sâu Sắc (Events & Culture)](#8-các-ý-tưởng-tương-tác-sâu-sắc)
9. [Đặc Tả Kỹ Thuật: Hệ Thống Mana Niềm Tin (Faith) & Thần Lực](#9-đặc-tả-kỹ-thuật-hệ-thống-mana-niềm-tin-faith--thần-lực)
10. [Checklist Triển Khai Mã Nguồn (Dev Tasklist)](#10-checklist-triển-khai-mã-nguồn)

---

## 1. CỐT TRUYỆN MỞ ĐẦU & KỊCH BẢN INTRO

### 1.1 Đại bối cảnh
* **Vòng lặp tái sinh**: Kỷ nguyên trước (Kỷ Hoàng Hôn) sụp đổ vì chiến tranh, bị nhấn chìm dưới **Đại Hồng Thủy Tẩy Trần**.
* **Con người (5–15 người đầu tiên)**: Trôi dạt trên chiếc thuyền vỡ, **bị sóng biển xóa sạch toàn bộ ký ức** (không nhớ quá khứ, không có công cụ, tâm trí thuần khiết).
* **Người chơi**: Là **"Ý Niệm Khởi Thủy" (The Primal Will)** — linh hồn của trời đất thức tỉnh theo lời khẩn cầu của con người, nâng đỉnh núi cổ đại ngập nước nhô lên khỏi biển tạo thành **Đảo Thiên Nguyên**.

### 1.2 Kịch bản 3 Video Intro (10s mỗi đoạn)
* **Clip 1 (0s – 10s) — Sự Thức Tỉnh**: Thuyền vỡ trôi dạt giữa biển đêm sương mù $\rightarrow$ Cột sáng thần linh chiếu rọi $\rightarrow$ Hòn đảo nhiệt đới trỗi dậy từ lòng đại dương.
  * *Voiceover*: *"Khi kỷ nguyên cũ chìm sâu vào tro tàn dưới đáy biển... từ trong hư vô, Đất Mẹ thức giấc theo lời khẩn cầu."*
* **Clip 2 (10s – 20s) — Cập Bến & Đốm Lửa**: Thuyền dạt vào bãi cát trắng $\rightarrow$ Dân làng bước xuống, strike đá nhóm ngọn lửa trại đầu tiên.
  * *Voiceover*: *"Những đứa con sống sót bước lên bờ hoang với hai bàn tay trắng... Hãy nhóm lại ngọn lửa đầu tiên, thắp sáng niềm hy vọng."*
* **Clip 3 (20s – 30s) — Khởi Đầu Kỷ Nguyên**: Dân bắt đầu làm việc, dựng lều $\rightarrow$ Camera zoom out toàn cảnh đảo khớp hoàn toàn giao diện game.
  * *Voiceover*: *"Từ hoang dã, một nền văn minh mới chính thức ra đời. Chào mừng Người đến với... Đảo Thiên Nguyên!"*

---

## 2. NHỊP SINH HOẠT 1 NGÀY & CƠ CHẾ SINH TỒN TỰ ĐỘNG

Giải quyết triệt để lỗi logic: *"Kho đầy thức ăn nhưng dân vẫn chết đói"* và giảm bớt thao tác bấm tay vi mô (micromanagement).

### 2.1 Đồng hồ sinh học 1 ngày
* **06:00 – 18:00 (Giờ lao động)**: Dân tự động làm việc theo vai trò đã giao. Thanh Đói và Mệt mỏi tăng dần.
* **18:00 – 20:00 (Bữa tối tập thể tự động)**:
  * Toàn bộ dân làng quay về quây quần quanh **Lửa Trại Khởi Nguyên**.
  * Kho chung tự động trừ $1 \sim 2$ thức ăn/người. Cư dân hồi phục thanh Đói về mức an toàn.
* **20:00 – 06:00 (Nghỉ ngơi & Xã hội)**: Dân trò chuyện tăng chỉ số Hạnh phúc và Mối quan hệ, sau đó ngủ trong Lều cỏ hoặc quanh đống lửa.

### 2.2 Cơ chế "Ngắt Khẩn Cấp" (Threshold Interrupt)
* **Khi Đói $\ge 80\%$ (bất kể ban ngày hay đêm)**:
  1. NPC lập tức bỏ cuốc/rìu, tự ăn **Lương khô dắt lưng** trong túi (mất 3 giây).
  2. Nếu túi không có, tự chạy về Kho chung ăn thức ăn.
  3. Ăn xong mới tiếp tục quay lại làm việc.
* **Khi Sức khỏe $< 40\%$ (Bị thương / Kiệt sức)**:
  * NPC tự động ngừng lao động nặng, quay về Lều cỏ / Lửa trại nằm nghỉ ngơi.
  * Tốc độ hồi phục: $+5\%$ Sức khỏe mỗi giờ nghỉ ngơi (khi Đói $< 50\%$).

---

## 3. HỆ THỐNG KHO ĐỒ & Ô TRANG BỊ CÁ NHÂN

Bổ sung cấu trúc dữ liệu cho mỗi NPC trong `src/core/types.ts`:

```typescript
interface NPCInventory {
  // 3 Ô Trang Bị
  equipment: {
    tool: Item | null;     // Rìu đá (+50% chặt gỗ), Cuốc đá (+50% đập đá), Cần câu, Giáo mác
    clothing: Item | null; // Áo da thú (giữ ấm, giảm sát thương)
    bag: Item | null;      // Giỏ mây / Gùi da (tăng tải trọng từ 10 lên 30 tài nguyên)
  };
  // 4 Ô Túi Đồ Tạm Thời (Pocket)
  pocketSlots: [
    { type: 'RATION'; count: number; max: 3 },     // Ô 1: Lương khô dắt lưng tự ăn khi đói
    { type: 'RESOURCE'; count: number; max: 30 },  // Ô 2: Gỗ/Đá đang vác về kho
    { type: 'RESOURCE'; count: number; max: 30 },  // Ô 3: Tài nguyên vác thêm
    { type: 'MISC'; count: number; max: 5 }        // Ô 4: Thảo dược / Vật phẩm cứu hộ
  ];
}
```

### Quy tắc Auto-Equip (Tránh bấm tay thủ công):
* Khi Kho làng có công cụ phù hợp nghề (ví dụ: Rìu Đá cho thợ chặt gỗ), NPC sẽ **tự động chạy đến kho nhặt trang bị**.
* Người chơi vẫn có quyền click vào ô trang bị để gán thủ công nếu muốn ưu tiên cho cá nhân cụ thể.

---

## 4. HỆ THỐNG CHỈ SỐ NPC 3 TẦNG

### Tầng 1: Nhu Cầu Sinh Học (Biến động từng giờ)
* **Đói (0–100%)**: Tăng $+3\%$/giờ làm việc. Đạt $100\%$ trừ $-5\%$ Máu/giờ.
* **Mệt mỏi (0–100%)**: Tăng theo độ nặng công việc. Chạm $100\%$ giảm $50\%$ tốc độ di chuyển.
* **Sức khỏe (0–100%)**: Mất máu khi đói kiệt, rét buốt, hoặc bị thú dữ tấn công.
* **Hạnh phúc (0–100%)**: Tổng hợp từ: Ăn no + Ngủ ấm + Có bạn bè tán gẫu bên lửa.

### Tầng 2: Thuộc Tính Cốt Lõi (Thang điểm 1 – 20)
* **Thể lực (STR)**: Tăng tốc độ chặt cây/đập đá ($+3\%$/điểm), tăng sức vác tải trọng và sức mạnh chiến đấu.
* **Khéo léo (DEX)**: Tăng tốc độ hái lượm/câu cá ($+4\%$/điểm), may vá và né đòn.
* **Trí tuệ (INT)**: Tăng tốc độ nghiên cứu Tech Tree ($+5\%$/điểm), làm Bô lão truyền dạy kinh nghiệm.

### Tầng 3: Tính Cách 5 Trục (Giá trị từ -50 đến +50, Di truyền)
1. **Cần cù (+50) $\leftrightarrow$ Lười biếng (-50)**: Quyết định ngưỡng nghỉ ngơi.
2. **Dũng cảm (+50) $\leftrightarrow$ Nhát gan (-50)**: Phản xạ khi gặp thú dữ (chiến đấu vs tháo chạy).
3. **Hòa đồng (+50) $\leftrightarrow$ Khép kín (-50)**: Nhu cầu giao tiếp bên lửa trại, tốc độ kết hôn.
4. **Rộng lượng (+50) $\leftrightarrow$ Tham lam (-50)**: Chia sẻ đồ ăn hay ăn trộm kho khi túng quẫn.
5. **Tò mò (+50) $\leftrightarrow$ Bảo thủ (-50)**: Tốc độ mở bản đồ và tỉ lệ phát hiện tàn tích.

---

## 5. HỆ THỐNG NGHỀ NGHIỆP & THUẬT TOÁN TỰ NHẬN NGHỀ

Ở Kỷ nguyên 0 chỉ có **4 nghề sinh tồn + 1 vị trí Trưởng lão**:

| Nghề | Nhiệm vụ chính | Tài nguyên tạo ra | Tiêu chí tuyển chọn tự động |
|---|---|---|---|
| **🌿 Người Hái Lượm** | Hái quả rừng, đào củ, bắt cá ven bờ | Thức ăn (Food) | Điểm $\text{DEX}$ cao nhất làng. |
| **🪓 Tiều Phu** | Đốn gỗ, chặt cành giữ lửa trại | Gỗ (Wood) | Điểm $\text{STR}$ cao nhất làng. |
| **🪨 Thợ Gom Đá** | Nhặt sỏi cuội, ghè đá mồ côi | Đá (Stone) | Điểm $\text{STR}$ khá, cần cù. |
| **🛡️ Người Canh Gác** | Đi tuần, mở sương mù, xua thú hoang | An ninh / Tầm nhìn | Điểm Dũng cảm $\ge +20$, $\text{STR} \ge 10$. |
| **🟣 Trưởng Lão (Elder)** | Ngồi giữ lửa, kể chuyện, suy ngẫm | Điểm Tri Thức / Hạnh phúc | Tuổi $\ge 45$ hoặc $\text{INT}$ cao nhất (Tối đa 1–2 người). |

### Thuật toán Dân Tự Nhận Nghề (Auto-Claim Logic):
```text
IF Thức ăn kho < 2 ngày tiêu thụ:
    Gán 70% dân số lao động làm [Hái Lượm]
ELSE:
    Cân đối hạn ngạch: 40% Hái lượm | 30% Tiều phu | 20% Nhặt đá | 10% Canh gác
Duyệt qua danh sách dân:
    So khớp (Job Fit Score = Attribute * 2 + Personality Trait)
    Gán việc tốt nhất cho từng người -> Tự động nhặt công cụ tương ứng.
```

---

## 6. CÔNG TRÌNH & TÀI NGUYÊN KỶ NGUYÊN 0

Mọi công trình đều được làm bằng tay không từ vật liệu nhặt được trên mặt đất:

| Công trình | Chi phí | Địa hình đặt | Tác dụng cốt lõi |
|---|---|---|---|
| **🔥 Lửa Trại Khởi Nguyên** | **MIỄN PHÍ** *(hoặc 5 Gỗ)* | Đất trống bất kỳ | Trái tim bộ tộc: Sưởi ấm, xua thú dữ, nơi ăn tối lúc 18:00. |
| **⛺ Chòi Lá / Lều Cỏ** | **15 Gỗ + 5 Đá** | Đất cỏ (*grass*) | Chỗ ngủ ấm áp cho 3–4 người, tránh cảm lạnh ban đêm. |
| **📦 Bãi Chứa Ngoài Trời** | **10 Gỗ + 10 Đá** | Gần lửa trại | Tăng sức chứa kho từ 100 lên 300 món tài nguyên. |
| **🎣 Bến Câu Gỗ Nhỏ** | **15 Gỗ + 5 Đá** | Mép nước nông (*shallow water*) | Tăng $+30\%$ sản lượng bắt cá biển an toàn. |
| **🌉 Cầu Gỗ Sơ Khai** | **20 Gỗ** | Ô sông/suối (*river*) | Đi qua suối khai thác cánh rừng và mỏ đá bờ bên kia. |
| **⭐ Bàn Nghiên Cứu Thô Sơ** | **25 Gỗ + 20 Đá** | Cạnh Lửa Trại | **Cột mốc tối hậu: Cho phép Trưởng lão nghiên cứu để mở khóa Kỷ nguyên 1!** |

---

## 7. MỐI ĐE DỌA SINH TỒN (EARLY-GAME HAZARDS)

1. **Lửa Trại Bị Tắt (Nguy hiểm nhất)**:
   * Nếu hết củi $\rightarrow$ Lửa tắt $\rightarrow$ Sợ hãi $100\%$, hoảng loạn, rét buốt trừ $-10\%$ Máu/đêm.
   * *Khắc chế:* Luôn duy trì tiều phu và dự trữ tối thiểu 15 Gỗ trong kho.
2. **Thú Dữ Săn Mồi (Sói rừng, lợn lòi)**:
   * Tấn công dân đi thu thập quá xa làng một mình. Thú dữ sợ ánh sáng lửa trại.
   * *Khắc chế:* Cử Người Canh Gác đi tuần tra bảo kê.
3. **Giông Bão Nhiệt Đới**:
   * Giảm $80\%$ sản lượng câu cá, có nguy cơ dập tắt lửa trại.
   * *Khắc chế:* Dựng Lều cỏ để dân trú ẩn, bảo quản củi trong kho.
4. **Ngộ Độc & Chấn Thương**:
   * Xác suất $5\%$ ăn nhầm quả độc/nấm độc hoặc bị đá đè chân.
   * *Khắc chế:* Nghỉ ngơi trong lều cỏ + dùng Thảo dược (*Herbs*) chữa trị.

---

## 8. CÁC Ý TƯỞNG TƯƠNG TÁC SÂU SẮC

* **Chú Sói Con Bị Thương (Companion Event)**: Bắt gặp sói con lạc bầy. Nếu tốn 2 thức ăn + 1 thảo dược cứu chữa $\rightarrow$ Trở thành Thú cưng bảo vệ bộ tộc, báo động trước khi có nguy hiểm.
* **Bích Họa Hang Động (Cave Paintings)**: Ghi lại các cột mốc lịch sử đầu tiên lên vách đá $\rightarrow$ Khởi đầu của hệ thống Biên Niên Sử (*Chronicle*).
* **Bia Đá Cổ Trong Rừng Sâu (Ancient Monolith)**: Dấu tích của kỷ trước, chạm vào mở khóa ngay $+50$ Điểm Tri Thức.
* **Linh Vật Bộ Tộc (Tribal Totem)**: Chọn 1 trong 4 Totem (Chim Lạc, Thần Lửa, Sóng Biển, Gấu Rừng) nhận buff vĩnh viễn cho đảo.

---

## 9. ĐẶC TẢ KỸ THUẬT: HỆ THỐNG MANA NIỀM TIN (FAITH) & THẦN LỰC

### 9.1 Tài nguyên Mana Niềm Tin (Faith Resource)
* **Thanh hiển thị HUD**: Thanh vàng kim phát sáng `Niềm Tin: [Hiện tại] / [Tối đa] (+X.X/s)`.
* **Công thức hồi phục theo thời gian thực (Regen Formula)**:
  $$\text{Tốc độ hồi Faith/s} = (\text{Dân số} \times 0.1) \times \left(1 + \frac{\text{Hạnh Phúc \%}}{100}\right) \times \left(1 - \frac{\text{Sợ Hãi \%}}{200}\right) + \text{Bonus Đền Thờ}$$

### 9.2 Danh mục Thần Lực & Chi Phí (Divine Powers)

| Tên Thần Lực | Mức tiêu hao | Cooldown | Tác dụng chính |
|---|:---:|:---:|---|
| **Ban Phước (Blessing)** | 50 Faith | 45 giây | Tăng $+50\%$ tốc độ làm việc cho toàn bộ lao động trong 30 giây. |
| **Cầu Mưa (Rainfall)** | 40 Faith | 60 giây | Dập tắt đám cháy, tăng $+30\%$ năng suất nông nghiệp trong 45 giây. |
| **Thần Dũ (Divine Shield)** | 70 Faith | 90 giây | Tạo khiên bảo vệ kho lương trước cướp bóc / thú dữ đột kích. |
| **Khích Lệ (Incite)** | 30 Faith | 30 giây | Giảm Sợ hãi, tăng tinh thần chiến đấu cho Chiến binh. |

### 9.3 Cơ Chế Chống Spam & Tác Dụng Phụ (Backlash & Exhaustion)
* **A. Leo thang chi phí (Scaling Cost)**: Dùng lại cùng 1 phép trong vòng 2 phút: Chi phí nhân đôi ($50 \rightarrow 100$), lần ba nhân ba ($150$).
* **B. Hiệu ứng "Kiệt Sức Thần Thánh" (Divine Exhaustion Debuff)**:
  * Ngay khi hiệu ứng buff 30s kết thúc:
    * Năng suất lao động **giảm $50\%$** trong 60 giây tiếp theo.
    * Sợ hãi / Căng thẳng tăng nhẹ $+10\%$.
    * Hiện icon mồ hôi 💦 trên đầu NPC.
  * **Hậu quả lạm dụng (Burnout)**: Nếu người chơi cố tình cast phép tiếp khi dân đang kiệt sức $\rightarrow$ Dân rơi vào **Sụp đổ tinh thần (Burnout)**: bỏ việc, bạo loạn, Hạnh phúc rớt đáy!

---

## 10. CHECKLIST TRIỂN KHAI MÃ NGUỒN

| File Mã Nguồn | Hạng mục cần code | Độ ưu tiên |
|---|---|:---:|
| `src/core/types.ts` | Thêm thuộc tính `STR, DEX, INT`, `NPCInventory`, `DivinePower`, `statusDebuff` | 🔴 P0 |
| `src/core/engine.ts` | Triển khai nhịp sinh hoạt (18:00 ăn tối), logic ngắt khẩn cấp Đói $\ge 80\%$ | 🔴 P0 |
| `src/core/FaithManager.ts` | **Tạo mới:** Quản lý điểm Faith, công thức regen, cooldown, hiệu ứng buff/debuff | 🔴 P0 |
| `src/ui/HUD.ts` | Bổ sung thanh màu vàng kim `Niềm Tin: X/Y (+rate/s)` cạnh đồng hồ | 🟡 P1 |
| `src/ui/InspectorPanel.ts` | Bố trí 3 ô Trang bị + 4 ô Túi đồ dắt lưng dưới avatar nhân vật | 🟡 P1 |
| `src/renderer/NPCRenderer.ts` | Render icon kiệt sức 💦 và hào quang vàng khi được Ban phước | 🟡 P1 |
| `src/renderer/BuildingManager.ts` | Khởi tạo 6 công trình Era 0 (Lửa trại, lều cỏ, bãi chứa, bến câu, cầu, bàn NC) | 🟡 P1 |
