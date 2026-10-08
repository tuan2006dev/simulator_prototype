# 🌟 MASTER GAME DESIGN DOCUMENT (GDD) — ĐẢO THIÊN NGUYÊN
## TỔNG HỢP TOÀN DIỆN THIẾT KẾ KỶ NGUYÊN 0 & HỆ THỐNG THẦN LỰC
> **Tài liệu Thiết Kế & Đặc Tả Kỹ Thuật Toàn Diện (All-in-One Master Document)**  
> **Dự án**: Đảo Thiên Nguyên (The Genesis Island)  
> **Kỷ nguyên trọng tâm**: Kỷ Nguyên 0 (Era 0: Đồ Đá - Khởi Nguyên)  
> **Thể loại**: Cozy Survival Colony Simulator, Social Simulation, God-Game & Tribal Strategy  
> **Trạng thái**: Đã thống nhất thiết kế 100% — Sẵn sàng phát triển & mở rộng  

---

## 📌 MỤC LỤC TỔNG QUAN
1. [Cốt Truyện Mở Đầu & Kịch Bản Intro (Narrative Lore)](#1-cốt-truyện-mở-đầu--kịch-bản-intro)
2. [Thế Giới Quần Đảo 3 Đảo Thủ Tục (Procedural Archipelago)](#2-thế-giới-quần-đảo-3-đảo-thủ-tục)
3. [Nhịp Sinh Hoạt 24 Giờ & Cơ Chế Sinh Tồn Vi Mô (Micro-Survival)](#3-nhịp-sinh-hoạt-24-giờ--cơ-chế-sinh-tồn-vi-mô)
4. [Hệ Thống Dân Cư (Chỉ Số 3 Tầng, Túi Đồ & Tự Nhận Nghề)](#4-hệ-thống-dân-cư-chỉ-số-3-tầng-túi-đồ--tự-nhận-nghề)
5. [Hệ Thống Tài Nguyên & Công Trình Kỷ Nguyên 0](#5-hệ-thống-tài-nguyên--công-trình-kỷ-nguyên-0)
6. [Hệ Thống Thần Lực & Mana Niềm Tin (Faith & Miracles)](#6-hệ-thống-thần-lực--mana-niềm-tin-faith--miracles)
7. [Hệ Thống Ngoại Giao: Phân Biệt LIÊN MINH vs CHIẾM ĐÓNG & CHƯ HẦU](#7-hệ-thống-ngoại-giao-phân-biệt-liên-minh-vs-chiếm-đóng--chư-hầu)
8. [Kịch Bản Hướng Dẫn Chi Tiết 10 Ngày (6 Hồi Tutorial Arc)](#8-kịch-bản-hướng-dẫn-chi-tiết-10-ngày-6-hồi-tutorial-arc)
9. [Bản Vẽ Thiết Kế Giao Diện (UI System & Prompts Tạo UI)](#9-bản-vẽ-thiết-kế-giao-diện-ui-system--prompts-tạo-ui)
10. [Kế Hoạch Phân Chia Sprint Lập Trình (Sprint Code Tasks 1.1 – 6.2)](#10-kế-hoạch-phân-chia-sprint-lập-trình)
11. [Các Ý Tưởng Cơ Chế Tiềm Năng Mở Rộng (Dành Cho Thảo Luận — Chưa Đưa Vào Core Gameplay)](#11-các-ý-tưởng-cơ-chế-tiềm-năng-mở-rộng-dành-cho-thảo-luận--chưa-đưa-vào-core-gameplay)

---

# 1. CỐT TRUYỆN MỞ ĐẦU & KỊCH BẢN INTRO

### 1.1 Đại bối cảnh (Cosmic Lore)
* **Vòng Lặp Tái Sinh & Đại Hồng Thủy Tẩy Trần**: Nền văn minh cổ xưa (Kỷ Hoàng Hôn) sụp đổ vì chiến tranh tàn khốc và lòng tham vô độ, bị một trận Đại Hồng Thủy nhấn chìm hoàn toàn xuống đáy biển sâu.
* **Những Kẻ Sống Sót (5 – 15 người đầu tiên)**: Trôi dạt trên một chiếc thuyền gỗ vỡ, bị sóng biển và sương mù đại dương **xóa sạch toàn bộ ký ức** (không nhớ quá khứ, không công cụ, tâm trí thuần khiết như trang giấy trắng).
* **Người Chơi — "Ý Niệm Khởi Thủy" (The Primal Will)**: Bạn không phải người phàm mà là linh hồn của trời đất thức tỉnh trước lời khẩn cầu tuyệt vọng của con người, nâng đỉnh núi cổ đại ngập nước nhô lên khỏi mặt biển tạo thành **Đảo Thiên Nguyên**.

### 1.2 Kịch bản 3 Video Intro (30 giây)
1. **Clip 1 (0s – 10s) — Sự Thức Tỉnh**: Thuyền vỡ trôi dạt giữa biển đêm sương mù $\rightarrow$ Cột sáng thần linh chiếu rọi $\rightarrow$ Hòn đảo nhiệt đới trỗi dậy từ lòng đại dương.
   * *Voiceover*: *"Khi kỷ nguyên cũ chìm sâu vào tro tàn dưới đáy biển... từ trong hư vô, Đất Mẹ thức giấc theo lời khẩn cầu."*
2. **Clip 2 (10s – 20s) — Cập Bến & Đốm Lửa**: Thuyền dạt vào bãi cát trắng $\rightarrow$ Dân làng bước xuống, ghè hai hòn đá nhóm ngọn lửa trại đầu tiên.
   * *Voiceover*: *"Những đứa con sống sót bước lên bờ hoang với hai bàn tay trắng... Hãy nhóm lại ngọn lửa đầu tiên, thắp sáng niềm hy vọng."*
3. **Clip 3 (20s – 30s) — Khởi Đầu Kỷ Nguyên**: Dân bắt đầu làm việc, dựng lều $\rightarrow$ Camera zoom out toàn cảnh đảo khớp hoàn toàn vào giao diện game.
   * *Voiceover*: *"Từ hoang dã, một nền văn minh mới chính thức ra đời. Chào mừng Người đến với... Đảo Thiên Nguyên!"*

---

# 2. THẾ GIỚI QUẦN ĐẢO 3 ĐẢO THỦ TỤC

Bản đồ được sinh ngẫu nhiên hoàn toàn theo **Master Seed**, không dùng tọa độ cứng:

```text
       [ĐẢO RĂNG NANH (Tộc Trưởng Krock)]
                 ▲
                / \  [BÃI ĐÁ CẠN TRANH CHẤP] (Midpoint: lộ ra khi triều rút 09:00 - 15:00)
               /   \
              ▼     ▼
  [ĐẢO THIÊN NGUYÊN (Bạn)] ◄────────► [ĐẢO THẦN NGƯ (Bô Lão Mộc)]
  (Trọng tâm bản đồ)                   (Khoảng cách an toàn: 12-15 ô nước nông)
```

### 2.1 Thuật toán Định vị Vệ tinh (Polar Satellite Positioning)
1. **Đảo Người Chơi**: Neo tại trọng tâm bản đồ. Kích thước theo lựa chọn người chơi (Nhỏ: 50x35, Vừa: 80x50, Lớn: 120x80).
2. **Đảo Thần Ngư (Đông Nam)**: Đặt tại góc ngẫu nhiên $\theta_1 \in [120^\circ, 160^\circ]$, cách bờ người chơi một khoảng đệm an toàn $12 \sim 15$ ô nước nông.
3. **Đảo Răng Nanh (Tây Bắc)**: Đặt tại góc đối trọng $\theta_2 = \theta_1 + 180^\circ \pm 30^\circ$, chống va chạm địa hình.
4. **Bãi Đá Cạn Tranh Chấp**: Tự động tính tại **Trung điểm (Midpoint)** giữa bờ Đảo Bạn và Đảo Răng Nanh.
5. **Deterministic Seed Chaining**:
   * `Seed_Player = MasterSeed`
   * `Seed_Harmony = Hash(MasterSeed + "_HARMONY")`
   * `Seed_Fang = Hash(MasterSeed + "_FANG")`
6. **Sinh Tài Nguyên Bù Trừ Thông Minh**: Thuật toán thống kê tài nguyên đảo người chơi: Đảo Thần Ngư luôn sinh nhiều cá/cây để cứu trợ; Đảo Răng Nanh luôn mang trọng số nhiều đá và thiếu ăn để tạo động lực tranh chấp bãi cạn.

### 2.2 Hồ Sơ 2 Bộ Tộc AI Láng Giềng
* **Tộc Thần Ngư (Đảo Đầm Lầy)**:
  * **Thủ lĩnh**: **Bô Lão Mộc** (hiền từ, thông tuệ, chài lưới).
  * **Đặc trưng**: Cột **khói màu tím** bốc lên từ ngọn tháp đầm lầy.
  * **Hành vi**: Đồng minh tự nhiên, sống hòa thuận, tặng 15 cá khô ở Hồi 2, đốt khói tím báo bão ở Hồi 3, đề nghị ký Hiệp ước Liên minh bảo an ở Hồi 4.
* **Tộc Răng Nanh (Đảo Đá Đen)**:
  * **Thủ lĩnh**: **Tộc Trưởng Krock** (hung hãn, hiếu chiến, coi trọng sức mạnh).
  * **Đặc trưng**: Cột **khói màu đen** đặc bốc lên từ núi đá lửa.
  * **Hành vi**: Cắm cọc đe dọa ở Hồi 4, đột kích bãi biển ở Hồi 5, bị đánh bại bằng phép Khích Lệ và quy phục làm Chư Hầu cống nạp đá.

---

# 3. NHỊP SINH HOẠT 24 GIỜ & CƠ CHẾ SINH TỒN VI MÔ

Giải quyết triệt để lỗi logic *"Kho đầy thức ăn nhưng dân vẫn chết đói"* và loại bỏ thao tác bấm tay vi mô (micromanagement).

### 3.1 Quy chuẩn Thời Gian Chuẩn (Chuẩn Cozy Simulation)
* **1 Ngày Game = 120 giây thực (2 phút đời thực ở tốc độ 1x)**.
* **1 Giờ Game = 5 giây đời thực**.
* **Phân bổ nhịp sinh học**:
  * ☀️ **06:00 – 18:00 (50s thực — Giờ lao động)**: Dân tự động làm việc theo vai trò. Đói và Mệt tăng dần.
  * 🌅 **18:00 – 20:00 (15s thực — Bữa tối tập thể tự động)**:
    * Toàn bộ dân làng **tự động buông việc**, quay về quây quần quanh **Lửa Trại Khởi Nguyên**.
    * Kho chung tự động trừ $1 \sim 2$ thức ăn/người. Cư dân hồi phục thanh Đói về mức an toàn, xua tan sợ hãi.
  * 🌙 **20:00 – 06:00 (45s thực — Nghỉ ngơi & Đêm ấm áp)**: Dân ngồi sưởi ấm, trò chuyện tăng Hạnh phúc, sau đó vào Lều Cỏ ngủ hồi phục thể lực.

### 3.2 Cơ Chế "Ngắt Khẩn Cấp" (Threshold Interrupt)
* **Khi Đói $\ge 80\%$ (bất kể ngày đêm)**:
  1. NPC lập tức dừng việc, tự ăn **Lương khô dắt lưng** trong túi (mất 3 giây).
  2. Nếu túi hết, tự chạy về Kho chung lấy thức ăn. Ăn xong mới quay lại làm việc.
* **Khi Máu $< 40\%$ (Bị thương / Kiệt sức)**:
  * Tự động ngừng lao động nặng, quay về Lều cỏ / Lửa trại nằm nghỉ ngơi. Hồi phục $+5\%$ Máu/giờ khi Đói $< 50\%$.

### 3.3 Năm Cơ Chế Vi Mô Sống Còn
1. **🔥 Thanh Củi Giữ Lửa (Fuel Bar: 0–100%)**:
   * Tiêu hao $1$ Gỗ mỗi 2 giờ (4 củi/đêm). Khi củi $< 30\%$ $\rightarrow$ Dân rảnh/Tiều phu tự động vác củi ra tiếp lửa.
   * Nếu lửa tắt ban đêm: Sợ Hãi vọt lên $100\%$, dính rét buốt trừ $-10\%$ Máu/đêm.
2. **🍖 Nấu Nướng Sơ Khai**:
   * Ăn sống: Hồi $+15$ Đói, $10\%$ đau bụng 🤢.
   * Ăn nướng bên lửa (18:00): Hồi $+35$ Đói, $+10\%$ Hạnh phúc, $0\%$ đau bụng.
3. **🛠️ Chế Tác Tại Chỗ (Handcrafting Không Cần Xưởng)**:
   * Ghè đá tay: Tốn 1 Đá cuội $\rightarrow$ Rìu tay ghè đá (`hand_axe`) tăng $+30\%$ tốc độ đốn gỗ.
   * Vót cành cây bên lửa: Tốn 1 Gỗ $\rightarrow$ Gậy gỗ nhọn (`pointed_stick`) cho Hộ vệ làng.
   * Vót cành quấn cỏ khô: Tốn 1 Gỗ $\rightarrow$ Đuốc soi đường (`torch`) cầm tay ban đêm.
4. **🪦 Mộ Đá An Táng (Burial Cairn)**:
   * Khi có người qua đời: Tốn 5 Đá cuội đắp một Đống Mộ Đá ven biển. Dân cúi đầu tưởng niệm $\rightarrow$ Giảm Sợ hãi toàn làng, Chronicle ghi trang sử tiễn biệt.
5. **🗺️ Khám Phá & Mở Sương Mù (Fog of War & Exploration)**:
   * **Ba phương thức điều khiển**:
     * *Cách 1 (Chỉ định trực tiếp)*: Chọn dân làng $\rightarrow$ Click vào tọa độ đất bất kỳ ở rìa sương mù tối để cắm mốc khám phá. Dân sẽ nhận lệnh tiến tới và vòng tầm nhìn (Line of Sight) sẽ tự động quét sạch sương mù.
     * *Cách 2 (Trinh sát tự động)*: Dân được gán nghề *Người Canh Gác / Trinh Sát* (ưu tiên tính cách `Tò mò >= +20` và `Dũng cảm >= +10`) sẽ tự động tuần tra mở dần các ô sương mù đen quanh lãnh địa vào ban ngày.
     * *Cách 3 (Thần lực "Ngọn Gió Dẫn Lối" - 15 Faith)*: Quét luồng gió mang lá cây phát sáng về hướng sương mù $\rightarrow$ Dân tò mò sẽ thốt lên *"Thần linh chỉ đường!"* và chạy theo mở đất.
   * **Bảng bán kính tầm nhìn (Line of Sight - LOS)**:
     * *Đi tay không ban ngày*: Bán kính **4 ô** xung quanh nhân vật.
     * *Đi ban đêm không có đèn*: Bán kính chỉ **1 – 2 ô** (sợ hãi tăng nhanh, dễ vấp ngã).
     * *Cầm Đuốc Lửa (Torch)*: Bán kính **6 ô** (kể cả ban đêm), xua đuổi thú dữ.
     * *Đứng trên Mỏm Đá / Đồi Cao*: **Tăng thêm +3 ô** tầm nhìn toàn cảnh.
   * **Quy tắc an toàn & Rủi ro khi thám hiểm**:
     * *Luật bữa tối 18:00*: Đúng 17:00 – 18:00, trinh sát tự động quay về Lửa Trại ăn tối; nếu đi quá xa bị kẹt lại trong đêm sẽ dính lạnh và sợ hãi.
     * *Nguy cơ trong sương mù*: Sói hoang, rắn độc ẩn nấp. Dân nhút nhát sẽ tháo chạy; chỉ có Trinh sát cầm gậy nhọn mới dám chiến đấu xua thú.
     * *Phần thưởng thám hiểm*: Phát hiện tổ chim, bụi thảo dược quý, hoặc Bia Đá Cổ Kỷ Hoàng Hôn (+50 Điểm Tri Thức).

---

# 4. HỆ THỐNG DÂN CƯ (CHỈ SỐ 3 TẦNG, TÚI ĐỒ & TỰ NHẬN NGHỀ)

### 4.1 Cấu Trúc Chỉ Số 3 Tầng
```typescript
interface NPCStats {
  // Tầng 1: Nhu cầu Sinh học (0 - 100)
  needs: {
    hunger: number;     // Đói: +3%/h làm việc; >=80% ngắt ăn lương khô; =100% trừ HP
    fatigue: number;    // Mệt mỏi: tăng khi lao động; =100% giảm 50% tốc độ di chuyển
    health: number;     // Máu: (0-100); <40% tự về lều dưỡng thương
    happiness: number;  // Hạnh phúc: tính từ No + Ngủ ấm + Bạn bè tán gẫu bên lửa
  };
  // Tầng 2: Thuộc tính Cốt lõi (1 - 20)
  attributes: {
    str: number;        // Thể lực: Tăng đốn gỗ, đập đá, sức vác, sức mạnh chiến đấu
    dex: number;        // Khéo léo: Tăng hái lượm, câu cá, may vá, né đòn
    int: number;        // Trí tuệ: Tăng tốc độ nghiên cứu, làm Trưởng lão
  };
  // Tầng 3: Tính cách 5 trục (-50 đến +50, Di truyền)
  traits: {
    diligence: number;  // Cần cù (+) vs Lười biếng (-)
    bravery: number;    // Dũng cảm (+) vs Nhút nhát (-)
    sociability: number;// Hòa đồng (+) vs Khép kín (-)
    generosity: number; // Rộng lượng (+) vs Tham lam (-)
    curiosity: number;  // Tò mò (+) vs Bảo thủ (-)
  };
}
```

### 4.2 Túi Đồ & Trang Bị Cá Nhân (Inventory)
```typescript
interface NPCInventory {
  // 3 Ô Trang Bị
  equipment: {
    tool: Item | null;     // Rìu đá (+50% chặt cây), Cuốc đá (+50% đập đá), Cần câu, Giáo mác, Đuốc
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
* **Smart Auto-Equip**: Kho làng có công cụ phù hợp nghề $\rightarrow$ Dân tự động chạy đến kho nhặt trang bị mà không cần người chơi click thủ công.

### 4.3 Phân Công Nghề Tự Động (Auto-Claim Logic)
* **🌿 Người Hái Lượm**: Tuyển người có `DEX` cao nhất làng.
* **🪓 Tiều Phu**: Tuyển người có `STR` cao nhất làng.
* **🪨 Thợ Gom Đá**: Tuyển người có `STR` khá, cần cù.
* **🛡️ Người Canh Gác / Trinh Sát**: Tuyển người có `bravery >= +20`, `curiosity >= +10`, `STR >= 10` (phụ trách mở sương mù, tuần tra bờ biển, xua thú dữ và chống cướp).
* **🟣 Trưởng Lão (Elder)**: Người tuổi $\ge 45$ hoặc `INT` cao nhất (giữ lửa, nghiên cứu, truyền dạy kinh nghiệm).

---

# 5. HỆ THỐNG TÀI NGUYÊN & CÔNG TRÌNH KỶ NGUYÊN 0

### 5.1 Ba Tài Nguyên Cơ Bản
1. **Lương thực thô (Raw Food)**: Hái quả rừng, đào củ dại, bắt cá ven biển.
2. **Gỗ thô (Raw Wood)**: Nhặt cành khô, chặt cây ven rừng.
3. **Đá cuội (Rough Stone)**: Nhặt đá mồ côi ven suối và chân núi.

### 5.2 Sáu Công Trình Sơ Khai
| ID Công trình | Tên Công Trình | Chi phí | Địa hình hợp lệ | Chức năng kỹ thuật |
|---|---|:---:|---|---|
| `primal_campfire` | 🔥 **Lửa Trại Khởi Nguyên** | **Miễn phí** *(hoặc 5 Gỗ)* | Đất trống bất kỳ | Trái tim bộ tộc, nạp củi, nấu nướng, tụ họp 18:00, xua thú dữ. |
| `primitive_shelter` | ⛺ **Lều Cỏ / Chòi Lá** | 15 Gỗ + 5 Đá | Đất cỏ (*grass*) | 3–4 chỗ ngủ; ngủ hồi phục mệt mỏi x2; chống rét khi giông bão. |
| `open_stockpile` | 📦 **Bãi Chứa Ngoài Trời** | 10 Gỗ + 10 Đá | Cạnh Lửa Trại | Mở rộng giới hạn kho từ 100 lên 300 tài nguyên. |
| `fishing_pier` | 🎣 **Bến Câu Gỗ Nhỏ** | 15 Gỗ + 5 Đá | Mép nước nông | Tăng sản lượng cá $+30\%$; an toàn không bị ngấm nước. |
| `wooden_bridge` | 🌉 **Cầu Gỗ Sơ Khai** | 20 Gỗ | Ô suối / sông | Nối 2 bờ suối để khai thác mỏ đá và rừng bên kia. |
| `research_table` | ⭐ **Bàn Nghiên Cứu Thô Sơ** | 25 Gỗ + 20 Đá | Cạnh Lửa Trại | **CÔNG TRÌNH TỐI HẬU: Mở khóa chuyển sang Kỷ nguyên 1.** |

---

# 6. HỆ THỐNG THẦN LỰC & MANA NIỀM TIN (FAITH & MIRACLES)

### 6.1 Giao Diện & Công Thức Hồi Phục Thời Gian Thực
* **Cụm Vòng Cung Kép (Dual-Arc Gauge — Giữa đỉnh HUD)**:
  * Vòng trên màu xanh lá: `🟢 [XX]% HẠNH PHÚC`
  * Vòng dưới màu đỏ: `🔴 [YY]% SỢ HÃI`
* **Thanh Niềm Tin Vàng Kim**: `Niềm Tin: [Hiện tại] / [Tối đa] (+rate/s)`
* **Công thức hồi phục thời gian thực**:
  $$\text{Tốc độ hồi Faith/s} = (\text{Dân số} \times 0.1) \times \left(1 + \frac{\text{Hạnh Phúc \%}}{100}\right) \times \left(1 - \frac{\text{Sợ Hãi \%}}{200}\right) + \text{Bonus Đền Thờ}$$

### 6.2 Danh Mục Phép Thần Lực
1. **✨ Ban Phước (Blessing) — 50 Faith / CD 45s**: Tăng $+50\%$ tốc độ làm việc cho toàn bộ lao động trong 30 giây.
2. **🌧️ Cầu Mưa (Rainfall) — 40 Faith / CD 60s**: Dập tắt cháy rừng/khô hạn, tăng $+30\%$ năng suất hái lượm trong 45 giây.
3. **⚡ Khích Lệ (Incite) — 35 Faith / CD 30s**: Xóa sạch $100\%$ sợ hãi, tăng $+20\%$ sức chiến đấu cho Hộ vệ làng.
4. **🛡️ Khiên Thần (Divine Shield) — 70 Faith / CD 90s**: Tạo khiên bảo vệ kho lương trước thú dữ và cướp bóc.
5. **Tiểu thần lực sơ khai**:
   * *🌬️ Ngọn Gió Dẫn Lối (15 Faith / CD 45s)*: Thổi lá cây dẫn đường đến bụi quả ẩn trong sương mù.
   * *☁️ Mây Mát Lành (25 Faith / CD 90s)*: Giảm $50\%$ tốc độ mệt mỏi vào trưa hè.
   * *⚡ Tia Lửa Linh Thiêng (45 Faith / CD 180s)*: Đánh tia sét nhỏ thắp lại đống lửa trại bị mưa dập tắt.

### 6.3 Cơ Chế Chống Lạm Dụng (Backlash & Burnout)
* **Leo thang chi phí (Scaling Cost)**: Dùng lại cùng 1 phép trong 2 phút $\rightarrow$ Chi phí nhân đôi ($50 \rightarrow 100$), lần ba nhân ba ($150$).
* **Kiệt Sức Thần Thánh (Divine Exhaustion)**: Sau khi hết buff 30s $\rightarrow$ Dính debuff **Kiệt sức 60s**: Giảm $50\%$ năng suất, hiện icon mồ hôi 💦 trên đầu.
* **Sụp Đổ Tinh Thần (Burnout)**: Nếu người chơi cố tình cast phép đè lên lúc dân đang kiệt sức $\rightarrow$ Dân bỏ việc, bạo loạn, Hạnh phúc tụt đáy!

---

# 7. HỆ THỐNG NGOẠI GIAO: PHÂN BIỆT LIÊN MINH VS CHIẾM ĐÓNG & CHƯ HẦU

| Tiêu chí so sánh | 🤝 LIÊN MINH (Alliance) | 👑 CHIẾM ĐÓNG & CHƯ HẦU (Occupation & Vassalage) |
|---|---|---|
| **Bản chất quan hệ** | Bình đẳng, tự nguyện, đối tác cùng có lợi (Win-Win). | Bất bình đẳng, kẻ thắng áp đặt lên kẻ bại bằng vũ lực. |
| **Đối tượng áp dụng** | **Tộc Thần Ngư (Bô Lão Mộc)**. | **Tộc Răng Nanh (Tộc Trưởng Krock)**. |
| **Lợi ích nhận được** | Định kỳ nhận viện trợ **+5 Thức ăn/ngày** từ Thần Ngư. | Nhận cống nạp cưỡng bức **20 Đá cuội mỗi 3 ngày** từ Krock. |
| **Nghĩa vụ của bạn** | Đảm bảo an ninh, bảo vệ Đảo Thần Ngư khi có biến cố. | Phải duy trì quân lực/uy danh đè nén, canh gác bãi cạn. |
| **Cơ chế rủi ro** | Nếu bạn thất hứa $\rightarrow$ Thần Ngư chỉ rút lui trong hòa bình. | Nếu uy tín giảm $\rightarrow$ **Bạo loạn (Rebellion)**, Krock xua quân phản trắc! |
| **Cách vận hành** | Ký hiệp ước qua đối thoại ngoại giao ở Hồi 4. | Đánh bại toán quân Krock tại Bãi Cạn ở Hồi 5 rồi ép ký hàng ước. |

---

# 8. KỊCH BẢN HƯỚNG DẪN CHI TIẾT 10 NGÀY (6 HỒI TUTORIAL ARC)

Chuỗi kịch bản kéo dài đúng **10 Ngày game** (tương đương 20 phút ở tốc độ 1x, 10 phút ở 2x, 5 phút ở 4x):

```text
[HỒI 1: Ngày 1]   Nhóm Lửa Trại ──▶ Camera lia phát hiện 2 đốm khói láng giềng.
                         │
[HỒI 2: Ngày 2]   Sáng hôm sau ──▶ Thuyền Thần Ngư tặng 15 cá khô ──▶ Dạy nhặt đồ về kho & ăn tối 18:00.
                         │
[HỒI 3: Ngày 3-4] Mưa bão tới ──▶ Thần Ngư đốt khói tím báo bão ──▶ Dạy dựng 3 Lều Cỏ tránh rét.
                         │
[HỒI 4: Ngày 5-6] Triều rút lộ đá ──▶ Krock cắm cọc đe dọa ──▶ Bô Lão Mộc sang cầu viện.
                         │                     Ký HIỆP ƯỚC LIÊN MINH (+5 cá/ngày).
                         ▼
[HỒI 5: Ngày 7-8] Krock tràn sang ──▶ Dùng phép Khích Lệ đánh bại ──▶ Chiếm đóng Bãi Cạn.
                         │                     Ép Krock làm CHƯ HẦU (Cống nạp đá mỗi 3 ngày).
                         ▼
[HỒI 6: Ngày 9-10] Nhận cống nạp ──▶ Tích đủ 25W + 20S ──▶ Dựng BÀN NGHIÊN CỨU.
                                               Đêm Hội Tam Tộc ──▶ TỐT NGHIỆP BƯỚC SANG KỶ NGUYÊN 1!
```

### Chi tiết diễn biến từng Hồi:
* **Hồi 1 (Ngày 1) — Ngọn Lửa Khởi Nguyên**:
  * Người chơi nhóm Lửa Trại Khởi Nguyên tại tâm đảo.
  * Ngọn lửa bốc khói $\rightarrow$ Camera lia mở sương mù phát hiện 2 cột khói: khói đen Tây Bắc (Đá Đen) và khói tím Đông Nam (Đầm Lầy).
* **Hồi 2 (Ngày 2) — Món Quà Từ Đầm Lầy & Bữa Tối Đầu Tiên**:
  * Thuyền nan của Bô Lão Mộc cập bờ tặng 15 cá khô.
  * Dạy cơ chế: Nhấp chọn dân, gánh cá về kho, và trải nghiệm bữa tối tập thể lúc 18:00 bên ngọn lửa trại.
* **Hồi 3 (Ngày 3 – 4) — Bão Nhiệt Đới & Lều Cỏ Tránh Rét**:
  * Thần Ngư đốt khói tím báo bão lớn kéo đến.
  * Dạy cơ chế: Chặt gỗ dựng **3 Lều Cỏ** (cung cấp 9 chỗ ngủ cho 8 dân) để dân trú ẩn, không bị ngấm lạnh trừ máu.
* **Hồi 4 (Ngày 5 – 6) — Triều Rút & Căng Thẳng Ngoại Giao**:
  * Thủy triều rút để lộ rạn đá cạn nối liền 3 đảo.
  * Tộc Trưởng Krock vượt bãi cạn sang cắm cọc đe dọa đòi cống nạp $\rightarrow$ Bô Lão Mộc sang cầu viện $\rightarrow$ Ký **HIỆP ƯỚC LIÊN MINH** (+5 cá khô/ngày từ Thần Ngư, bạn lo an ninh).
* **Hồi 5 (Ngày 7 – 8) — Đột Kích Đá Đen & Phép Khích Lệ**:
  * Toán cướp Răng Nanh tràn sang bãi biển cướp lương thực.
  * Dạy cơ chế: Kích hoạt phép thần lực **[⚡ Khích Lệ]** buff hộ vệ đánh lui Krock $\rightarrow$ Quyết định số phận Krock:
    * *Lựa chọn A*: Ép Krock làm **CHƯ HẦU** (Cống nạp 20 đá mỗi 3 ngày).
    * *Lựa chọn B*: Khoan dung hòa giải lập liên minh hòa bình.
* **Hồi 6 (Ngày 9 – 10) — Đêm Hội Tam Tộc & Tốt Nghiệp Kỷ Nguyên 0**:
  * Cụm 3 đảo thống nhất. Dân 3 tộc tụ họp quanh Lửa Trại Khởi Nguyên ăn mừng.
  * Tích lũy đủ 25 Gỗ + 20 Đá $\rightarrow$ Dựng **Bàn Nghiên Cứu Thô Sơ** $\rightarrow$ Các bô lão tìm ra bí quyết luyện quặng $\rightarrow$ **Mở khóa Thời Kỳ Đồ Đồng (Era 1)!**

---

# 9. BẢN VẼ THIẾT KẾ GIAO DIỆN (UI SYSTEM & PROMPTS TẠO UI)

### 9.1 Bố Cục UI Trong Game (In-game HUD Architecture)
1. **Top Bar Header**:
   * Biểu tượng Đảo 🏝️ + Tên đảo + Huy hiệu Kỷ nguyên (`Đồ Đá - Era 0`).
   * Các chip tài nguyên: 👥 Dân số (8), 📅 Ngày, 🍗 Thức ăn, 🪵 Gỗ, 🪨 Đá.
   * **Cụm Vòng Cung Kép ở trung tâm**: Cung trên xanh (Hạnh phúc %), Cung dưới đỏ (Sợ hãi %).
   * **Thanh Niềm Tin Vàng Kim**: `Niềm tin: 60/300 (+X.X/s)`.
   * Đồng hồ thế giới (`08:00`) và cụm phím tốc độ (`Pause`, `1x`, `2x`, `4x`).
2. **Inspector Panel (Bên phải)**:
   * Avatar lớn, tên, tuổi, danh hiệu.
   * **3 ô Trang bị** (Tool, Clothing, Bag).
   * **4 ô Túi đồ** (Lương khô, 2 ô tài nguyên gánh, 1 ô thảo dược).
   * 4 thanh nhu cầu: Đói, Mệt, Máu, Sợ hãi.
   * Grid nút gán nghề thủ công (Hái lượm, Tiều phu, Gom đá, Hộ vệ).
3. **Mission Card (Góc dưới trái)**:
   * Thẻ nhiệm vụ cốt truyện theo từng Hồi, hiển thị tiến độ và mục tiêu rõ ràng.
4. **Story Dialogue Modal (Visual Novel)**:
   * Khung thoại cốt truyện với avatar lớn của Bô Lão Mộc (`🧙‍♂️`) và Tộc Trưởng Krock (`👹`), đi kèm các lựa chọn mang tính quyết định số phận tam tộc.

### 9.2 Prompts AI Để Tạo UI Concept Art
* **Prompt Tạo UI Màn Hình Chọn Đảo (Island Selection Screen)**:
  > *"A cozy warm game UI interface for selecting starting island in an archipelago strategy game. Warm cream parchment panels, dark navy accents, modern typography Nunito and Inter. Carousel showing 3 distinct procedural islands: Center Genesis Island with lush green forests, golden sandy beaches, small stone campfire; Northwest Black Rock Island with sharp volcanic rocks and dark smoke totem; Southeast Marsh Island with mangrove swamps, reed huts and mystic purple smoke pillar. High quality 2D game UI, sleek buttons, map seed preview, difficulty tags, cozy Ghibli art style."*
* **Prompt Tạo UI Màn Hình Menu Đầu Game (Main Menu Screen)**:
  > *"Stunning cozy main menu UI for an island god-game and settlement simulation titled 'Đảo Thiên Nguyên'. Warm tropical sunset ocean background, ancient stone monolith with faint glowing divine runes. Elegant glassmorphism menu panel with options: 'Bắt Đầu Kỷ Nguyên Mới' (New Game), 'Tiếp Tục' (Resume), 'Tự Vẽ Bản Đồ' (Map Paint), 'Cài Đặt' (Settings). Golden firefly particles rising from a sacred beach campfire, soft aesthetic lighting, modern game UI design."*

---

# 10. KẾ HOẠCH PHÂN CHIA SPRINT LẬP TRÌNH (SPRINT CODE TASKS)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        KẾ HOẠCH SPRINT CODE ERA 0                      │
├──────────────────┬─────────────────────────────────────────────────────┤
│ SPRINT 1 (P0)    │ Core Data Types & Procedural Map Generation         │
│ SPRINT 2 (P0)    │ Survival Engine, Schedules, Fire & Handcrafting     │
│ SPRINT 3 (P0)    │ Tutorial Manager, Neighbor AI & 6-Act State Machine │
│ SPRINT 4 (P1)    │ Faith Manager & Divine Powers                       │
│ SPRINT 5 (P1)    │ HUD Dual-Arc, Inspector Inventory & Dialogues      │
│ SPRINT 6 (P1)    │ Pixel Renderer & Visual Status Feedback             │
└──────────────────┴─────────────────────────────────────────────────────┘
```

### 🚀 SPRINT 1: CORE DATA TYPES & PROCEDURAL MAP GENERATION
* **TASK-1.1 (`src/core/types.ts`)**: Khai báo `NPCStats` (Needs, Attributes `STR/DEX/INT`, Traits 5 trục), `NPCInventory` (3 ô Equipment, 4 ô Pocket), enum `Era` (0 – 5), enum `NeighborTribeId`.
* **TASK-1.2 (`src/core/factory.ts`)**: Cập nhật `createNPC()` gieo ngẫu nhiên chỉ số `STR, DEX, INT` (thang 1–20), Traits (-50 đến +50) và 1 ô lương khô dắt lưng.
* **TASK-1.3 (`src/renderer/WorldMap.ts`)**: Cài đặt thuật toán Polar Satellite Positioning: sinh Đảo Thần Ngư ($\theta_1$) và Đảo Răng Nanh ($\theta_2 = \theta_1 + 180^\circ$); Midpoint bãi đá cạn tranh chấp; Hash Seed Chaining.

### 🚀 SPRINT 2: SURVIVAL ENGINE, SCHEDULES, FIRE & HANDCRAFTING
* **TASK-2.1 (`src/core/engine.ts`)**: Vòng lặp 24h: 18:00 toàn bộ dân tự về Lửa Trại ăn tối; Logic Ngắt Khẩn Cấp: Đói $\ge 80\% \rightarrow$ tự ăn lương khô; Máu $< 40\% \rightarrow$ về lều nằm ngủ dưỡng thương ($+5\%$/h).
* **TASK-2.2 (`src/core/actions.ts`)**: Thêm hành động `cook_food` bên lửa trại; `handcraft` (ghè rìu tay, vót gậy nhọn); `refuel_campfire` nạp củi khi fuel $< 30\%$.
* **TASK-2.3 (`src/renderer/BuildingManager.ts`)**: Khai báo 6 công trình Era 0; quản lý tiêu hao gỗ giữ lửa theo giờ.

### 🚀 SPRINT 3: TUTORIAL MANAGER & NEIGHBOR AI STATE MACHINE
* **TASK-3.1 (`src/core/TutorialNeighborManager.ts`)**: State Machine cho Tộc Thần Ngư (gửi quà cá khô, báo bão tím, ký liên minh); State Machine cho Tộc Răng Nanh (lấn bãi cạn, rút lui khi thấy lính canh, thần phục chư hầu).
* **TASK-3.2 (`src/core/TutorialNeighborManager.ts`)**: Quản lý chuỗi 6 Hồi Tutorial; cơ chế LIÊN MINH (nhận $+5$ cá/ngày) và CHƯ HẦU (nhận 20 đá mỗi 3 ngày).

### 🚀 SPRINT 4: FAITH MANAGER & DIVINE POWERS
* **TASK-4.1 (`src/core/FaithManager.ts`)**: Tính toán tốc độ hồi Faith/s theo công thức thời gian thực: $(\text{Pop} \times 0.1) \times (1 + \text{Happy}/100) \times (1 - \text{Fear}/200)$. Quản lý thanh Faith tối đa 100 ở Era 0.
* **TASK-4.2 (`src/core/FaithManager.ts`)**: Thực thi các phép: Ban Phước, Cầu Mưa, Khích Lệ; leo thang chi phí x2 nếu spam trong 2 phút; áp dụng debuff Kiệt Sức 60s (icon 💦).

### 🚀 SPRINT 5: HUD DUAL-ARC, INSPECTOR & DIALOGUES
* **TASK-5.1 (`src/ui/HUD.ts`)**: Vẽ Canvas Cụm Vòng Cung Kép giữa đỉnh HUD: Cung trên xanh (Hạnh Phúc %), Cung dưới đỏ (Sợ Hãi %); Thanh Niềm Tin vàng kim phát sáng.
* **TASK-5.2 (`src/ui/InspectorPanel.ts`)**: Hiển thị 3 ô Trang bị (Tool, Clothing, Bag) và 4 ô Túi đồ (Pocket Slots) dưới avatar nhân vật.
* **TASK-5.3 (`src/ui/QuestCard.ts`)**: Hộp thoại tương tác cốt truyện góc dưới trái; hiển thị thoại Bô Lão Mộc và Krock với avatar và nút lựa chọn chiến lược.

### 🚀 SPRINT 6: PIXEL RENDERER & VISUAL STATUS FEEDBACK
* **TASK-6.1 (`src/renderer/NPCRenderer.ts`)**: Vẽ icon mồ hôi 💦 khi Kiệt Sức; hào quang vàng khi Ban Phước; icon lửa ấm khi ăn tối 18:00.
* **TASK-6.2 (`src/renderer/TilemapRenderer.ts`)**: Sprite cho 6 công trình Era 0; thể hiện mực nước thủy triều lên/xuống (lộ bãi đá cạn từ 09:00 đến 15:00).

---

# 11. CÁC Ý TƯỞNG CƠ CHẾ TIỀM NĂNG MỞ RỘNG (DÀNH CHO THẢO LUẬN — CHƯA ĐƯA VÀO CORE GAMEPLAY)
> ⚠️ **LƯU Ý QUAN TRỌNG**:  
> Đây là khu vực lưu trữ các ý tưởng cơ chế nguyên thủy có tiềm năng cao được đưa ra để **đội ngũ bàn bạc, cân nhắc và đánh giá độ phức tạp**.  
> Các tính năng này **CHƯA ĐƯA VÀO CORE GAMEPLAY** và **CHƯA NẰM TRONG SPRINT CODE HIỆN TẠI**, nhằm giữ cho Kỷ Nguyên 0 luôn nhẹ nhàng, dễ tiếp cận và đúng chuẩn Cozy Simulation.

### 11.1 ❤️ Sinh Sản Sơ Khai & Thế Hệ Mới (Romance & Generation G1 → G2)
* **Ý tưởng**: 8 cư dân ban đầu không thể sống mãi. Họ có thể kết đôi khi đạt Điểm Tình Cảm (Affection $\ge 80$) nhờ tán gẫu bên Lửa Trại mỗi đêm (20:00 – 22:00).
* **Vận hành**: Khi có một chiếc Lều Cỏ riêng, đôi vợ chồng sinh ra đứa trẻ đầu tiên của thế hệ G2 sau 3 ngày game.
* **Đặc tính**: Trẻ em tiêu thụ ít thức ăn (0.5/ngày), chạy nhảy quanh đống lửa tăng $+15\%$ Hạnh Phúc toàn làng, sau 5 ngày sẽ trưởng thành và thừa hưởng chỉ số di truyền (`STR, DEX, INT`) từ cha mẹ.
* **Câu hỏi thảo luận**: Có nên đưa vào Kỷ nguyên 0 không, hay dời sang Kỷ nguyên 1 (Đồ Đồng) khi làng đã có nhà ở kiên cố và nông nghiệp ổn định?

### 11.2 🥓 Bảo Quản Thực Phẩm: Hun Khói & Phơi Khô (Food Spoilage & Preservation)
* **Ý tưởng**: Thức ăn tươi (cá bắt từ biển, thịt thú rừng) sẽ bị ôi thiu sau 2–3 ngày nếu trời nóng ẩm.
* **Vận hành**: Bổ sung giàn hun khói bằng cành cây bên Lửa Trại để chế biến Thịt/Cá tươi thành "Cá Khô / Thịt Hun Khói", giữ được 10 ngày game không hỏng (chính là món quà Tộc Thần Ngư tặng ở Hồi 2).
* **Câu hỏi thảo luận**: Cơ chế ôi thiu có gây thêm áp lực vi mô (micromanagement) cho người mới chơi không, hay chỉ cần giữ kho chung đơn giản như hiện tại?

### 11.3 🐺 Thuần Hóa Sơ Khai: Sói Rừng → Chó Canh Gác (Early Domestication)
* **Ý tưởng**: Sự kiện ngẫu nhiên gặp một chú sói con bị thương hoặc lạc mẹ ven bờ suối.
* **Vận hành**: Tiêu tốn 2 cá khô + 1 thảo dược cứu chữa $\rightarrow$ Thuần hóa thành Chó Canh Gác đầu tiên của bộ tộc, đi theo Người Canh Gác để sủa báo động thú dữ từ cự ly 8 ô và giảm 30% nguy cơ bị cướp bóc.
* **Câu hỏi thảo luận**: Đưa sự kiện này vào như một mini-quest thưởng thêm ở Hồi 3–4, hay để dành cho hệ thống Chăn Nuôi Thú ở Kỷ nguyên sau?

### 11.4 🪘 Tín Ngưỡng Nguyên Thủy & Đêm Vũ Điệu Trăng Tròn (Tribal Dance & Cave Art)
* **Ý tưởng**: Đêm trăng tròn (mỗi 7 ngày một lần), toàn bộ dân làng cùng nắm tay nhảy múa quanh Lửa Trại Khởi Nguyên theo nhịp gõ của Trưởng Lão.
* **Vận hành**: Tăng gấp đôi tốc độ hồi Mana Niềm Tin (Faith Regen x2) và xóa tan kiệt sức; Trưởng Lão dùng đất son vẽ bích họa hang động (Cave Painting) để lưu lại dấu ấn lịch sử.
* **Câu hỏi thảo luận**: Rất phù hợp với không khí Cozy / God-game, có thể kích hoạt tự động mà không cần người chơi phải điều khiển phức tạp.

### 11.5 🌿 Thảo Dược Học Dân Gian & Chữa Trị Thương Bệnh (Folk Herbalism)
* **Ý tưởng**: Dân đi rừng có rủi ro bị rắn cắn, trượt chân bong gân hoặc cảm lạnh sau bão.
* **Vận hành**: Người hái lượm thu gom Lá Thảo Dược (`herbs`), khi có người bị thương (Máu $< 40\%$) sẽ mang thảo dược nhai nát đắp lên vết thương để hồi máu gấp 3 lần.
* **Câu hỏi thảo luận**: Hiện tại game đã có cơ chế tự động về lều ngủ hồi máu ($+5\%$/h); việc thêm thảo dược có cần thiết ngay lúc này không hay chỉ là phụ trợ?

### 11.6 🔥 Thiên Tai Nguyên Thủy: Sấm Sét Khô & Cháy Rừng (Wildfire & Drought)
* **Ý tưởng**: Vào những ngày khô hạn gắt gao, sấm sét khô có thể đánh bốc cháy 1–2 cây rừng gần làng.
* **Vận hành**: Dân làng phải bẻ cành dập lửa thủ công, hoặc người chơi tiêu hao 40 Niềm Tin để cast phép [🌧️ Cầu Mưa] dập tắt hỏa hoạn.
* **Câu hỏi thảo luận**: Tạo đất diễn cực tốt cho phép Cầu Mưa, nhưng cần cân đối tỷ lệ xuất hiện thấp để tránh ức chế cho người chơi mới.

---

*Tài liệu Master GDD này là bản quy chiếu cao nhất, thống nhất toàn bộ tư tưởng thiết kế, kinh tế, xã hội, cốt truyện và kỹ thuật cho Kỷ Nguyên 0 của dự án Đảo Thiên Nguyên.*
