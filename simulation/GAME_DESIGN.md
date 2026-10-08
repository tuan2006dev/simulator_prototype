> **Hiện trạng 07/10/2026:** Đã có đường chơi cục bộ từ Đồ Đá qua Đồ Đồng/Đồ Sắt tới công nghiệp Hiện Đại và ba nhánh Dị Tượng đầu tiên; có y tế vòng đầu và ba dạng cư dân tự nguyện với vật tư, chăm sóc, đường gỡ và phụ kiện chibi. Xem [đối chiếu hiện trạng và phần còn thiếu](GAME_DESIGN_AUDIT.md), [UX và kiểm tra ổn định](ADAPTATION_UX_STABILITY_RESULT.md). Các ghi chú ngày05–06/10 bên dưới phản ánh lịch sử từng đợt; chưa toàn bộ game design, hạt nhân/dầu/vận tải/bệnh lây/di truyền/đổi nhánh/endgame/online.

> Cập nhật 2026-10-05: đã có đột kích nhỏ và Khiên Thần trong chơi cục bộ; quy tắc, kiểm tra và giới hạn tại [RAIDS_RESULT.md](RAIDS_RESULT.md).

# 🏝️ STRATEGY SETTLEMENT & MANAGEMENT GAME
### Tài liệu Thiết kế Tổng hợp (Game Design Document)

> **Điều hành làng 2026-10-05:** mục tiêu dự trữ chỉnh được, ngưỡng tiếp tục 80%, mức tối thiểu sinh tồn/đầu vào, danh sách cảnh báo mở đúng công trình/camera và lưu chính sách đã chạy cục bộ. Giữ phân công tay và tiến độ mẻ/chuyến. Test làng 5/15/25 dân, bản đã chơi và trình duyệt tại [báo cáo](MANAGEMENT_RESULT.md).

> **Nhân lực công trình 2026-10-05:** dân ở chế độ Tự động nhận công trình sản xuất hoàn thành, ưu tiên ăn/vận chuyển/vật liệu; có cảnh báo thiếu đầu vào, nguồn cạn, đầy kho và đường bị ngăn. Giữ thợ chỉ định tay, giữ mẻ/chuyến/tiến độ lẻ; bật/tắt riêng xưởng và lưu/tải. Phạm vi và test 5/15/25 dân tại [báo cáo](PRODUCTION_WORKFORCE_RESULT.md).

> **Thời tiết/Cầu Mưa 2026-10-05:** đã chạy cục bộ trời quang/mưa/khô hạn, cháy tối đa 8 cây/vụ và dân rảnh tới dập; Cầu Mưa 40 Niềm tin, hồi 60 giây, tăng ruộng 30% trong 45 giây. Các con số cháy/thời tiết là cân bằng thử; đặc tả gốc giữ nguyên. Phạm vi, lưu/tải và kiểm tra tại [báo cáo](WEATHER_RESULT.md).
> *Cảm hứng từ WorldBox — Tập trung vào mô phỏng định cư chiến lược, kinh tế vĩ mô & hệ thống tâm lý xã hội*

> **Tích hợp đặc tả mới 2026-10-05:** đã đối chiếu [Era 0 và hệ thống thần lực](ERA0_AND_DIVINE_SYSTEMS_SPEC.md) với thiết kế và bản game hiện tại. Xem [bản tổng hợp và thứ tự triển khai](ERA0_INTEGRATION_PLAN.md). Đã triển khai đợt 1 cục bộ: lửa trại, nhịp ăn/ngủ, HP, đồ ăn mang theo và giữ nhiệm vụ khi ngắt. Phạm vi, cân bằng tạm thời và kiểm thử tại [báo cáo đợt 1](ERA0_PHASE1_RESULT.md); toàn bộ công trình Era 0, trang bị và Faith chưa triển khai.

---

> **Cập nhật định cư sơ khai 2026-10-05:** đã có lều ba chỗ ngủ, bãi chứa, vận chuyển hàng hái lượm, nhiên liệu lửa với ba ngày chuẩn bị, hướng dẫn năm bước và hình ảnh riêng. Xem [luật hiện chạy và kết quả kiểm tra](ERA0_PHASE2_RESULT.md). Các công trình Era 0 còn lại, hậu cần giữa xưởng, trang bị và Faith tiếp tục nằm trong lộ trình.

## I. TẦNG NỀN TẢNG (FOUNDATION LAYER)

> **Niềm tin và Ban Phước 2026-10-05:** đã triển khai cục bộ công thức mới, trần 300/khởi đầu 0, đền +0,2/cấp/giây; Ban Phước 50 điểm, +50% tốc độ 30 giây rồi −50% 60 giây/căng thẳng +10. Có phí tăng tuyến tính theo cửa sổ 120 giây, khóa kiệt sức, pause/×2, lưu thời hạn và giao diện. Không cộng cùng danh sách phép lịch sử ở mục VI; xem [phạm vi/cân bằng và test](FAITH_RESULT.md).

> **Hậu cần xưởng 2026-10-05:** kho đầu vào/đầu ra 60 đơn vị, chuyến 30 đơn vị, nghề vận chuyển tay/tự động và đồ chế biến trên túi. Xưởng chỉ tiêu thụ nguyên liệu đã giao; thành phẩm chờ người đưa vào kho làng. Chi tiết/phạm vi và test tại [báo cáo hậu cần](LOGISTICS_RESULT.md).

> **Túi và dụng cụ 2026-10-05:** thêm giao diện túi vận chuyển, chế tạo/lấy/trả rìu, cuốc và cần câu, giữ lựa chọn tay và bảo toàn đồ khi lưu/tải. Bonus cá nhân không nhân trùng Công cụ đá. Phạm vi/công thức tại [báo cáo trang bị](EQUIPMENT_RESULT.md).

> **Nghề tự động 2026-10-05:** đảo mới có tự nhận nghề khi rảnh, ưu tiên thức ăn/vật liệu và giữ nghề tay; thêm STR/DEX/INT với bonus tối đa 20%. Bản cũ giữ nghề cũ và mặc định tắt tự động. Chi tiết tại [báo cáo phân công](WORKFORCE_RESULT.md).

> **Chặng Khởi nguyên 2026-10-05:** thêm bến câu có người mang cá về kho, bàn nghiên cứu với đường đi thật và sáu mốc mở đầu trong Đồ Đá. Giá cân bằng, bản lưu và phạm vi tại [báo cáo Khởi nguyên](ERA0_OPENING_RESULT.md).

> **Tổng hợp Master ngày 08/10/2026:** [Master Era 0](MASTER_GAME_DESIGN_DOCUMENT_ERA0.md) bổ sung quần đảo ba đảo, hai bộ tộc AI, khám phá/sương mù, thủy triều, ngoại giao và hướng dẫn sáu hồi. Xem [mục XI](#master-era0-integration) để biết nội dung được chọn, phần trùng, các mâu thuẫn và thứ tự triển khai. Đây là cập nhật thiết kế; không phải xác nhận các tính năng mới đã có trong game.

### 1.1 Thể loại & Vai trò Người chơi
| Thông số | Giá trị |
|---|---|
| **Thể loại** | Cozy Survival Colony Simulator + Social Simulation + God-Game/Tribal Strategy; phát triển thành quản lý nền văn minh qua các kỷ nguyên |
| **Góc nhìn** | Top-down 2D Pixel Art |
| **Vai trò** | Ý Niệm Khởi Thủy — thế lực vô hình dẫn dắt cộng đồng; cư dân tự sinh hoạt, người chơi điều phối, xây dựng và can thiệp bằng thần lực |
| **Mục tiêu** | Phát triển từ Đồ Đá đến Hiện Đại rồi mở các nhánh Công Nghệ Cao, Linh Khí / Huyền Bí và Quỷ Dị |

### 1.2 Phong cách Đồ họa
- **Pixel Art 16x16**: Tilemap địa hình, tài nguyên, công trình
- **NPC sprite**: Chibi mềm, dễ thương theo yêu cầu người chơi; phụ kiện/trang bị đi theo trạng thái thật, tối ưu hiển thị mật độ cao. Prompt pixel/Ghibli trong Master là tham khảo mỹ thuật, không thay thế phong cách cư dân đã chọn.
- **Layering System** (từ dưới lên):
  ```
  Ocean -> Ground -> Resources -> Buildings -> Entities (NPCs) -> UI/Emotes
  ```

---

## II. HỆ THỐNG NHÂN VẬT (NPC SYSTEM)

### 2.1 Cấu trúc NPC (đã có trong source)
```
NPC {
  id, name, age, gender

  needs: { hunger, rest, safety, social }   // 0 = ok, 100 = khủng hoảng
  health                                  // 0–100; bản cục bộ có hồi phục và mất HP khi đói
  privateFood, survival, lastDinnerDay     // thức ăn mang theo và nhịp ăn/nghỉ có lưu
  personality: { courage, greed, loyalty, piety, sociability }  // -100 to +100

  occupation, status, isAlive
  partnerId, motherId, fatherId, isPregnant, pregnancyDaysLeft
  attackCooldowns, stealCooldowns, attacksThisDay, hungerTicks
}
```

### 2.2 Nghề nghiệp (Occupation)

> Bảng sản lượng dưới đây thuộc mô hình AI cũ. Bản chơi cục bộ hiện dùng lao động trên bản đồ, người xây/nghiên cứu/vận chuyển và sản xuất theo mẻ; không cộng thêm sản lượng nghề cũ. Đặc tả mới bổ sung STR/DEX/INT, sức khỏe, trang bị và tự phân công; xem ERA0_INTEGRATION_PLAN.md để chuyển dữ liệu và tránh công việc trùng.
| Nghề | Vai trò | Sản xuất/tick |
|---|---|---|
| farmer | Nông dân | 8-14 food |
| gatherer | Thợ hái lượm | 4-9 food |
| warrior | Chiến binh | 0-2 food + phòng thủ |
| elder | Trưởng lão | 2-5 food + buff xã hội |
| craftsman | Thợ thủ công | 2-5 food + crafting |
| child | Trẻ em | Không làm việc, trưởng thành tuổi 18 |

> **Mở rộng Phase 3+**: Thêm `scholar` (Học giả), `miner` (Thợ mỏ), `trader` (Thương nhân)

### 2.3 Hành động AI (Utility AI — đã có)
| Hành động | Trigger chính | Personality Weight |
|---|---|---|
| eat | hunger cao | greed+ |
| sleep | rest cao | courage- |
| work | trạng thái bình thường | loyalty+ |
| chat | social cao | sociability+ |
| court | độc thân, tuổi trưởng thành | sociability+ |
| steal | greed cao + đói | loyalty- |
| fight | có kẻ thù, courage cao | courage+ |
| flee | safety cao, coward | courage- |
| pray | piety cao hoặc sợ hãi | piety+ |

---

## III. HỆ THỐNG TÀI NGUYÊN THEO 5 KỶ NGUYÊN

> Cập nhật 2026-10-05: giữ hướng phát triển gốc theo yêu cầu người chơi. Chi tiết gameplay là **Đề xuất**, chưa triển khai đầy đủ.
> Xem [Hệ thống kỷ nguyên và dị tượng](ERA_SYSTEM_DESIGN.md) để biết điều kiện tiến cấp, nghiên cứu, công trình, texture và biến thể.

**Đồ Đá → Đồ Đồng → Đồ Sắt → Hiện Đại → Dị Tượng (3 nhánh).** Định cư, thuần hóa và quản trị là các nhóm công nghệ bên trong tiến trình, không thay thế các thời đại vật liệu. Công nghiệp hóa là chặng cuối Đồ Sắt dẫn vào Hiện Đại.

### Kỷ nguyên 1: Đồ Đá (Stone Age)

| Tài nguyên | Nguồn | Dùng cho |
|---|---|---|
| Lương thực (Food) | Nông dân, thợ hái lượm | Nuôi dân |
| Gỗ thô (Raw Wood) | Thợ gỗ từ rừng | Công trình cơ bản |
| Đá vụn (Stone Chips) | Thợ mỏ thủ công | Tường, lều |
| Thảo mộc (Herbs) | Hái lượm | Chữa bệnh cơ bản |

Lao động tự động cơ bản có từ đầu; nhà, kho, nông nghiệp và thuần hóa mở theo nghiên cứu. Không bắt buộc già làng hoặc thế hệ con cháu để tiến cấp.

**Chặng Khởi nguyên (Era 0 trong đặc tả mới) — đề xuất tích hợp:** nhóm 5–15 người mất ký ức sau Đại Hồng Thủy được Ý Niệm Khởi Thủy dẫn đến đảo. Chặng sinh tồn đầu nằm bên trong Đồ Đá: giữ lửa, dựng lều/bãi chứa, kiếm thức ăn và sinh hoạt theo ngày đêm trước khi mở rộng định cư. Bàn nghiên cứu là mốc phát triển của chặng này, không tự mở Đồ Đồng. Trưởng lão hỗ trợ cộng đồng; người trưởng thành khác vẫn có đường nghiên cứu. Chưa thay mã kỷ nguyên hoặc điều kiện của bản lưu đang chơi.

Master mở rộng chặng này thành kịch bản ba đảo và sáu hồi, có lựa chọn liên minh/chư hầu/hòa giải. Bàn nghiên cứu mở đường nghiên cứu luyện kim; tốt nghiệp hướng dẫn và trả phí tiến cấp là hai mốc riêng. Không tự lên Đồ Đồng chỉ vì đặt bàn hoặc thắng Krock. Cách gọi Era 0 được thống nhất ở mục XI, không tạo thêm một kỷ nguyên vào trục năm thời đại hiện có.

### Kỷ nguyên 2: Đồ Đồng (Bronze Age)

| Tài nguyên | Nguồn | Dùng cho |
|---|---|---|
| Gỗ xẻ (Lumber) | Xưởng gỗ | Nhà ở nâng cấp |
| Quặng đồng (Copper Ore) | Mỏ đồng | Luyện đồng cho vũ khí, công cụ |
| Đất sét (Clay) | Bờ sông | Gạch, đồ gốm |
| Lúa mì (Wheat) | Ruộng lúa | Bánh mì |

Các hàng chế biến như đồng, gạch/gốm và bánh mì cần công trình, đầu vào và người làm thực tế. Không cộng hàng tự động khi chỉ nghiên cứu xong.

Đã có trong bản cục bộ: nghiên cứu **Gạch và đồ gốm**, **Lúa mì và làm bánh**; hố đất sét, lò gạch, xưởng gốm, ruộng lúa mì, lò bánh. Đất sét có trữ lượng hữu hạn ven sông hoặc bờ nước. Gạch/gốm được dùng xây lò bánh; gốm trong kho hỗ trợ sức chứa. Bánh nhập thẳng kho thức ăn theo giá trị dinh dưỡng, không ghi thêm một kho bánh riêng để tránh tính trùng. Xem công thức và trạng thái triển khai tại ERA_SYSTEM_DESIGN.md.

### Kỷ nguyên 3: Đồ Sắt (Iron Age)

Đã có chặng đầu trong bản cục bộ: mỏ sắt, mỏ than, lò luyện sắt, ruộng lanh, xưởng dệt và trạm giao thương. Cấp 3 cần nghiên cứu Kiến trúc Đồ Sắt và vật liệu thật. Trao đổi NPC có cư dân vận chuyển hai chiều; sản xuất vẫn dùng kho chung. Hơi nước/thép/điện nguyên mẫu là chặng tiếp theo. Xem IRON_IMPLEMENTATION_RESULT.md.

| Tài nguyên | Nguồn | Dùng cho |
|---|---|---|
| Sắt thô (Iron) | Mỏ sắt và lò luyện | Giáp, vũ khí, thiết bị |
| Than đá (Coal) | Mỏ than | Luyện kim loại và cơ giới |
| Đá xây dựng (Cut Stone) | Xưởng đá | Tường thành, công trình |
| Vải sợi (Textile) | Nguồn sợi và xưởng dệt | Quần áo, buồm |

Mở thành thị, giao thương, phòng vệ và quản trị. Cuối thời đại có cơ giới, thép và phát điện nguyên mẫu để chuẩn bị vào Hiện Đại.

### Kỷ nguyên 4: Hiện Đại

| Tài nguyên | Dùng cho |
|---|---|
| Thép (Steel) | Công nghiệp nặng |
| Dầu mỏ (Oil) | Nhiên liệu |
| Điện năng (Power) | Máy móc và đô thị; mô phỏng mạng cung/cầu |
| Linh kiện (Components) | Chế tạo tiên tiến |

Nền văn minh vận hành nhà máy, điện, vận tải, y tế và viện nghiên cứu. Niềm tin vẫn tồn tại song song khoa học. Người chơi bắt đầu khảo sát dị tượng và có thể tiếp tục lối chơi hiện đại mà không nhận biến thể.

### Kỷ nguyên 5: Dị Tượng — Endgame (3 nhánh)

| Nhánh | Tài nguyên gốc | Phong cách |
|---|---|---|
| Công Nghệ Cao | Vi mạch, Nguyên tử | Sci-fi |
| Linh Khí / Huyền Bí | Linh thạch, Tinh chất | Fantasy |
| Quỷ Dị | Xương cốt, Huyết thạch | Dark Fantasy |

Dị tượng được phát hiện, khảo sát, phân tích rồi người chơi chọn khai thác, thích nghi, phong tỏa hoặc bỏ qua. Ba nhánh có công nghệ, công trình, kinh tế và biến thể riêng; cùng tồn tại trong thế giới dai dẳng. Đây là hướng phát triển chính, không chuyển sang trạng thái Hoãn.

Biến đổi cư dân/công trình phải có xem trước, chi phí, cảnh báo rủi ro và luật chăm sóc/chuyển đổi. Không ngẫu nhiên biến toàn bộ dân, không bắt buộc hiến tế hoặc chiến thắng người chơi khác để mở nhánh. Các ví dụ biến thể cụ thể trong tài liệu chi tiết là đề xuất bổ sung cần cân bằng.

---
## IV. HỆ THỐNG HUD & UI/UX

Mục tiêu trình bày Era 0 mới: HUD có ngày/giờ, Hạnh phúc/Sợ hãi và Faith; hồ sơ có trang bị/túi thật; thẻ nhiệm vụ theo hồi và hội thoại lựa chọn với Mộc/Krock. Đây là đích thiết kế từ Master, không phải toàn bộ bố cục đã triển khai. Chi tiết ở mục XI.7.

### 4.1 Top Bar Layout
```
LEFT: [Dân số: Nông/Thợ/Lính] [Food] [Wood] [Stone] [Iron] [Knowledge]
CENTER: [Dual-arc Gauge: Happiness% | Fear%]
RIGHT: [Era Name] [PAUSE] [x1] [x2]
```

**Dual-arc Circular Gauge:**
- Nửa trái (xanh lá): Hạnh phúc 0-100%
- Nửa phải (đỏ): Sợ hãi 0-100%
- Đồng bộ real-time với simulation engine

### 4.2 Bottom Toolbar (5 nút chính)
| Nút | Panel | Chức năng |
|---|---|---|
| Xây dựng | Building Drawer | Chọn công trình, đặt lên bản đồ |
| Sắc lệnh | Decree Drawer | Ban hành luật, chính sách |
| Nghiên cứu | Research Tree | Tech tree qua các kỷ nguyên |
| Giao thương | Trade Drawer | Mua bán với các đảo |
| Nhật ký | Chronicle Viewer | Biên niên sử sự kiện |

### 4.3 Inspector Panel (click NPC)
```
[Avatar] Tên NPC
Nghề: Nông dân | Tuổi: 25

NHU CẦU:
  Đói:    [████░░] 60%
  Mệt:    [██░░░░] 35%
  Sợ:     [█░░░░░] 15%
  Cô đơn: [███░░░] 50%

TÍNH CÁCH:
  Can đảm: +45    Lòng tham: -20
  Trung thành: +70  Sùng đạo: +10
  Hòa đồng: +55

TRẠNG THÁI: Đang làm việc
BẠN ĐỜI: Lan#3 (kết hôn)
HIỆU ỨNG: [Hăng hái] [Đói]
```

---

## V. HỆ THỐNG QUẢN LÝ VĨ MÔ

### 5.1 Phân công Lao động (Labor Management)
- Click vào ô dân số → dropdown chọn nghề
- Chuyển dân rảnh rỗi sang các nhóm nghề cụ thể
- Giới hạn tối đa theo slot công trình (Farm slot, Mine slot...)

### 5.2 Vòng lặp Cung - Cầu

> Sơ đồ sau là mô hình cũ, không dùng để cân bằng bản mới. Chế độ cũ chết sau 30 tick liên tiếp đói 100%; bản cục bộ đã có bữa tối, ăn khẩn cấp từ 80%, nghỉ và mất HP khi đói. Đợt 1 giữ kinh tế Food và khoảng đệm chết đói cũ; chưa áp toàn bộ tốc độ đói/mất máu trong đặc tả mới. Xem ERA0_PHASE1_RESULT.md.
```
Dân số → Tiêu thụ Food mỗi tick
  Thiếu hụt → Hunger tăng → Happiness giảm → Fear tăng
           → Starvation (12 tick đói ≥95) → Chết
  Thặng dư → Happiness tăng → Faith tích lũy
```

### 5.3 Hệ thống Raid (Phase 3+)
- Định kỳ: Hạm đội cướp biển tấn công đảo
- Warriors tự động phản ứng
- Thất bại: Kho bị cướp, dân thương vong → Fear tăng vọt
- Thắng lợi: Happiness tăng, nhận loot

### 5.4 Sắc lệnh (Decree)
| Loại | Ví dụ | Ảnh hưởng |
|---|---|---|
| Kinh tế | "Tăng ca sản xuất" | +30% output, +Fear |
| Xã hội | "Lễ hội mùa màng" | +Happiness, -Food |
| Quân sự | "Tổng động viên" | +Warriors, -Economy |
| Tôn giáo | "Ngày cầu nguyện" | +Faith, +Happiness |

---

## VI. HỆ THỐNG THẦN LỰC (Divine Power)

### 6.1 Tài nguyên Niềm Tin (Faith)

> **Đề xuất, chưa triển khai đầy đủ.** Đền và niềm tin có từ cộng đồng Đồ Đá, phát triển song song khoa học theo [thiết kế kỷ nguyên](ERA_SYSTEM_DESIGN.md); không phải điều kiện bắt buộc tiến cấp hoặc mở mọi nhánh dị tượng. [Đặc tả Era 0 mới](ERA0_AND_DIVINE_SYSTEMS_SPEC.md) là nguồn thiết kế mới cho công thức Faith và bốn phép Ban Phước/Cầu Mưa/Khiên/Khích Lệ. Các mục 6.2–6.4 dưới đây được giữ làm **ý tưởng lịch sử**, không cộng cùng bộ phép mới. Xem [đối chiếu cân bằng](ERA0_INTEGRATION_PLAN.md) trước khi triển khai: trần Faith, đồng hồ, leo thang chi phí và hậu quả còn cần thống nhất; ưu tiên Ban Phước tác động lao động thật.

Master bổ sung ba tiểu thần lực gắn với khám phá/mệt mỏi/giữ lửa và đổi đề xuất Khích Lệ. Chúng được ghi riêng ở mục XI.6; không cộng thành phép đã chạy, không tự thay giá/hiệu lực hiện tại. Các mâu thuẫn trần Faith, leo thang phí và hồi phục được đối chiếu ở XI.9.
```
Faith tăng: Dân hạnh phúc + Có đền thờ + Lễ nghi cầu nguyện
Faith giảm: Dân đói + Bất mãn + Không có đền thờ
```

### 6.2 Cooldown Mechanics
- Cooldown riêng cho từng phép
- Global Cooldown: 3 tick sau mỗi can thiệp
- Escalating Cost: Dùng cùng 1 phép liên tục → chi phí Faith x2 mỗi lần

### 6.3 Hậu quả ngược (Backlash)
| Hành vi | Hậu quả |
|---|---|
| Spam Buff | NPC bị Kiệt sức: -50% năng suất + Fear tăng |
| Spam Trừng phạt | Happiness rớt đáy → Bạo loạn hoặc dân bỏ trốn |
| Tầm ảnh hưởng rộng | Chi phí Faith tăng theo khoảng cách Đền thờ |

### 6.4 Danh sách Thần lực
| Phép | Faith | Cooldown | Hiệu ứng |
|---|---|---|---|
| Phước lành | 20 | 5t | +Happiness, +Food |
| Trừng phạt | 15 | 3t | +Fear, NPC debuff |
| Mưa lương thực | 50 | 20t | +sharedFood lớn |
| Bình an | 30 | 10t | -Fear toàn đảo |
| Bão | 80 | 30t | Phá hủy công trình |
| Hồi sinh | 100 | 50t | Hồi sinh 1 NPC |

---

## VII. BUFF/DEBUFF VISUAL SYSTEM

### Floating Icons trên NPC
| Icon | Trạng thái | Trigger |
|---|---|---|
| 💚 | Hồi phục | Vừa ăn đủ / được chữa lành |
| ☠️ | Ngộ độc | Ăn thức ăn hỏng |
| 🍺 | Say rượu | Tiêu thụ rượu |
| 😡 | Cuồng nộ | Safety > 90 + Courage cao |
| 😴 | Kiệt sức | Spam buff / rest = 100 |
| ⭐ | Hăng hái | Happiness > 80 |
| 😨 | Khiếp sợ | Safety > 80 + Courage thấp |

---

## VIII. TECH STACK

### Simulation Engine (hiện tại - TypeScript/Node)
```
types.ts      — Type definitions
engine.ts     — Tick loop + Utility AI dispatcher
actions.ts    — 9 NPC actions (eat, sleep, work, chat, court, steal, fight, flee, pray)
factory.ts    — NPC/Island factory, Vietnamese names, personality system
chronicle.ts  — Event logging
utils.ts      — Math helpers, relationship system
run.ts        — CLI entry point + analysis reports
```

### Web Game Target Stack
```
HTML5 + Vanilla CSS + TypeScript (-> JS)
  Canvas 2D API          — Pixel art rendering, tilemap, sprites
  Simulation Engine      — Port từ TypeScript hiện tại
  UI System              — HUD, Inspector Panel, Drawers
  Asset Pipeline         — Pixel sprites (16x16), tilemap sheets
```

---

## IX. KẾ HOẠCH PHASE CODE

| Phase | Tên | Nội dung chính | Ưu tiên |
|---|---|---|---|
| **1** | Web Foundation | HTML skeleton, Canvas renderer, tilemap 16x16, NPC dot render | 🔴 Critical |
| **2** | Simulation Bridge | Port engine.ts vào web, HUD real-time, Inspector Panel | 🔴 Critical |
| **3** | Building & Labor | Building placement, labor assignment, resource bars | 🟡 High |
| **4** | Economy & Research | Tech tree, multi-resource, era progression | 🟡 High |
| **5** | Divine & Raids | Faith system, divine powers, cooldowns, backlash, raid waves | 🟢 Medium |

> Xem chi tiết từng phase trong file **PROGRESS.md**

---

## X. HỆ THỐNG TẠO MAP & PHÂN BỐ TÀI NGUYÊN

> **Thiết kế đã xác nhận** — 2026-10-02

### 10.1 Kiến trúc Map (Layered System)

```
Layer 3: Entity Layer       ← NPC, Building sprites
Layer 2: Resource Layer     ← Cây gỗ, mỏ đá, cây thuốc... (MỚI)
Layer 1: Terrain Layer      ← Loại tile (grass, water...) — Mở rộng
```

### 10.2 Cấu trúc dữ liệu mới

```typescript
// Tile terrain — thêm 'river'
type TileType = 'deep_water' | 'shallow_water' | 'sand' | 'grass'
              | 'forest' | 'mountain' | 'river';

// Resource node trên Layer 2
type ResourceType =
  | 'wood_tree'      // Cây gỗ
  | 'stone_deposit'  // Mỏ đá
  | 'herb_patch'     // Bụi thảo dược
  | 'fish_spot'      // Điểm câu cá (trên shallow_water)
  | 'clay_pit'       // Hố đất sét (gần sông)
  | 'copper_vein'    // Quặng đồng (trong núi cao)
  | 'fertile_soil';  // Đất màu mỡ (buff tile Farm)

interface ResourceNode {
  type:      ResourceType;
  amount:    number;    // hiện tại (0 = cạn kiệt)
  maxAmount: number;    // ban đầu
  regenRate: number;    // +amount mỗi tick (0 = không regen)
}

interface Tile {
  terrain:   TileType;
  resource:  ResourceNode | null;
  building:  string | null;    // ID công trình đặt lên
  elevation: number;            // 0.0–1.0
  moisture:  number;            // 0.0–1.0
}

// Hình dạng đảo
type IslandShape = 'circle' | 'elongated' | 'archipelago' | 'crescent' | 'custom';
```

### 10.3 Bốn hình dạng đảo

| Shape | Đặc điểm | Phong cách chơi |
|---|---|---|
| 🔵 `circle` | Đảo tròn cân bằng | Dễ chơi, beginner-friendly |
| 📏 `elongated` | Ellipse dài 2:1, trục Bắc-Nam | Phòng thủ tuyến tính |
| 🏝️ `archipelago` | 3–4 đảo nhỏ cách nhau | Khó, buộc phải giao thương |
| 🌙 `crescent` | Lưỡi liềm, vịnh lớn ở giữa | Trade / Naval focus |

### 10.4 Pipeline sinh map (8 bước)

```
[1] Chọn IslandShape + Seed
[2] Sinh heightmap (Multi-octave Fractal Noise)
[3] Áp Island Mask (theo Shape)
[4] Sinh moisturemap (Moisture Noise riêng)
[5] Biome Matrix: height × moisture → TileType
[6] River generation (mountain → sea, path of least resistance)
[7] Resource Spawner (cluster-based, theo biome rules)
[8] Validate → auto-retry nếu fail (tối đa 5 lần)
```

### 10.5 Biome Matrix (Height × Moisture → Terrain)

| Height \ Moisture | Thấp (0–0.35) | Trung (0.35–0.65) | Cao (0.65–1.0) |
|---|---|---|---|
| **> 0.82** | mountain | mountain | mountain |
| **0.60–0.82** | forest thưa | forest | forest rậm |
| **0.35–0.60** | grass khô | grass | grass + herb |
| **0.25–0.35** | sand | sand damp | clay |
| **0.10–0.25** | shallow_water | shallow_water | shallow_water |
| **< 0.10** | deep_water | deep_water | deep_water |

### 10.6 Bảng Phân bố Tài nguyên

| Tài nguyên | Terrain | Điều kiện | Spawn% | Amount | Regen/tick |
|---|---|---|---|---|---|
| 🌲 `wood_tree` | forest | — | 80% | 40–120 | 0.5 |
| 🌲 `wood_tree` | grass | moisture > 0.5 | 25% | 15–50 | 0.2 |
| 🪨 `stone_deposit` | mountain | — | 70% | 80–200 | ❌ |
| 🪨 `stone_deposit` | grass | elevation > 0.5 | 15% | 30–80 | ❌ |
| 🌿 `herb_patch` | grass | moisture > 0.4 | 30% | 20–60 | 1.0 |
| 🌿 `herb_patch` | sand | moisture > 0.55 | 15% | 10–30 | 0.5 |
| 🐟 `fish_spot` | shallow_water | — | 40% | 50–150 | 2.0 |
| 🏺 `clay_pit` | sand/grass | ≤ 3 tile từ sông | 60% | 60–120 | ❌ |
| 🔶 `copper_vein` | mountain | elevation > 0.75 | 25% | 100–300 | ❌ |
| 🌾 `fertile_soil` | grass | moisture > 0.6 | 35% | — (buff) | — |

### 10.7 Cluster Distribution (Cụm tài nguyên)

Resource spawn theo cụm — không rải đều — tạo **vùng chiến lược**:

| Tài nguyên | Số cụm (80×50 map) | Bán kính |
|---|---|---|
| 🌲 Wood | 4–7 cụm | 5–8 tiles |
| 🪨 Stone | 3–5 cụm | 3–5 tiles |
| 🌿 Herb | 5–8 cụm | 2–4 tiles |
| 🐟 Fish | 4–6 cụm | 2–3 tiles |
| 🏺 Clay | 2–3 cụm | 2–3 tiles |
| 🔶 Copper | 1–3 cụm | 2–4 tiles |
| 🌾 Fertile | 3–5 cụm | 4–6 tiles |

### 10.8 Balance Targets (Map 80×50)

| Chỉ số | Min | Target | Max |
|---|---|---|---|
| Land tiles | 800 | 1200 | 1800 |
| % forest/land | 20% | 30% | 45% |
| Tổng wood | 2000 | 4000 | 8000 |
| Tổng stone | 1500 | 3000 | 6000 |
| Tổng fish | 1000 | 2500 | 5000 |
| Copper veins | 1 | 3 | 6 |
| Sông | 0 | 1–2 | 3 |

### 10.9 Vẽ tay Map (Paint Mode)

| Tool | Phím tắt | Chức năng |
|---|---|---|
| Terrain Brush | `T` | Vẽ terrain (grass/water/sand...) |
| Resource Brush | `R` | Đặt/xóa resource node |
| Erase | `E` | Xóa về deep_water |
| Fill | `F` | Flood fill vùng |
| Eyedropper | `I` | Lấy loại tile đang trỏ |

- **Brush size**: 1×1, 3×3, 5×5, 7×7
- **Undo/Redo**: 10 bước (history stack)
- **Save**: Serialized RLE JSON → localStorage

### 10.10 Random Map UI

```
[Hình dạng]: 🔵 Tròn | 📏 Dài | 🏝️ Cụm | 🌙 Lưỡi
[Kích cỡ]:  Nhỏ 50×35 | Vừa 80×50* | Lớn 120×80
[Tài nguyên]: Nghèo ─●──── Giàu
[Seed]:  [ 12345 ]  [🎲 Random]
[Preview minimap 160×100px]
[↩️ Vẽ tay]   [✅ Tạo Map]   [🔗 Copy Link]
```

### 10.11 Quyết định thiết kế đã xác nhận

| Vấn đề | Quyết định |
|---|---|
| Resource hết | Cây regen tự động; đá/đồng hết vĩnh viễn |
| Tile `river` | NPC **không qua được** — phải xây Cầu (30 gỗ + 20 đá) |
| Archipelago | NPC không đi giữa đảo — cần Bến tàu (Phase 3+) |
| Minimap | Thường trực góc dưới-phải (160×100px) + Preview lớn trong panel |
| Share map | URL params: `?seed=12345&shape=crescent&size=80x50` |

### 10.12 Files cần tạo/sửa

| File | Action | Mô tả |
|---|---|---|
| `src/renderer/WorldMap.ts` | **Rewrite** | Pipeline sinh map mới hoàn toàn |
| `src/renderer/ResourceSpawner.ts` | **Tạo mới** | Cluster-based resource spawner |
| `src/renderer/TilemapRenderer.ts` | **Sửa** | Vẽ resource icons lên tile |
| `src/ui/MapGenPanel.ts` | **Tạo mới** | UI Random Map + Seed + Preview |
| `src/ui/MapEditor.ts` | **Tạo mới** | Paint Mode + Undo/Redo |
| `src/ui/Minimap.ts` | **Tạo mới** | Minimap thường trực + click teleport |
| `src/core/types.ts` | **Sửa nhỏ** | Thêm ResourceType vào Island |
| `web/index.html` | **Sửa** | Thêm panels, minimap element |
| `web/style.css` | **Sửa** | Style cho MapEditor, Minimap |


<a id="master-era0-integration"></a>

## XI. TÍCH HỢP MASTER ERA 0 — NGÀY 08/10/2026

Nguồn: [MASTER_GAME_DESIGN_DOCUMENT_ERA0.md](MASTER_GAME_DESIGN_DOCUMENT_ERA0.md), đối chiếu với [đặc tả Era 0 trước](ERA0_AND_DIVINE_SYSTEMS_SPEC.md), [kế hoạch tích hợp](ERA0_INTEGRATION_PLAN.md), [thiết kế kỷ nguyên](ERA_SYSTEM_DESIGN.md) và [hiện trạng game](GAME_DESIGN_AUDIT.md).

Master là đầu vào mới cho thiết kế Khởi nguyên. Các câu tự nhận “đã thống nhất 100%/quy chiếu cao nhất” trong file không giải quyết những số liệu mâu thuẫn nội bộ, không chứng minh đã triển khai và không tự mở thêm phạm vi online. Mục này giữ ý mới có giá trị, tránh chép lại toàn bộ tài liệu hoặc lập lại các sprint đã hoàn thành.

### XI.1 Nội dung mới và nội dung kế thừa

| Nhóm | Kết luận sau đối chiếu |
|---|---|
| Quần đảo ba đảo có danh tính | Mới: đảo người chơi, Thần Ngư và Răng Nanh; seed liên kết, tài nguyên bổ trợ, bãi cạn tranh chấp. Hình dạng `archipelago` cũ chưa thay thế hệ bộ tộc này. |
| Ngoại giao và cốt truyện láng giềng | Mới: Bô Lão Mộc/Krock, khói báo hiệu, viện trợ, nghĩa vụ an ninh, liên minh/chư hầu/hòa giải và hệ quả. |
| Hướng dẫn sáu hồi/10 ngày | Mới: nối sinh tồn, thời tiết, khám phá và lựa chọn ngoại giao thành một trải nghiệm mở đầu. |
| Sương mù/thám hiểm/thủy triều | Mới: ba cách khám phá, tầm nhìn theo ngày/đêm/đuốc/độ cao; lịch rút nước và đường đi thay đổi. |
| Chế tác tay, nấu nướng, mộ đá | Bổ sung cụ thể cho Era 0: rìu tay/gậy/đuốc, thức ăn sống/nướng, an táng và tưởng niệm. |
| Đồng hồ 120 giây/ngày và ba tiểu thần lực | Đồng hồ120giây/ngày đã triển khai08/10, xem WORLD_TIME_RESULT.md. Ba tiểu thần lực vẫn là đề xuất chưa triển khai. |
| Lore/intro, ăn-ngủ/ngắt khẩn cấp, chỉ số ba tầng, túi 3+4, auto-equip, sáu công trình, công thức Faith | Chủ yếu đã có trong đặc tả trước. Giữ một định nghĩa chung; không coi là toàn bộ tính năng mới hoặc đã xong. |
| Sinh sản, bảo quản, sói con, lễ hội, thảo dược, cháy rừng | Master mục 11 giữ ở khu vực thảo luận. Game đã có một phần gia đình/vật nuôi/chữa trị/cháy, nhưng chưa đúng toàn bộ ví dụ và thông số này. |

### XI.2 Trải nghiệm Khởi nguyên và quy ước kỷ nguyên

Giữ bối cảnh Đại Hồng Thủy, Kỷ Hoàng Hôn đã chìm, nhóm 5–15 người mất ký ức và vai trò Ý Niệm Khởi Thủy. Intro gồm ba đoạn 10 giây: đảo trỗi dậy → cập bến/nhóm lửa → dựng làng/camera nối vào game. Khi triển khai cần bỏ qua/xem lại; không bắt xem phim mỗi lần tải bản lưu.

Khởi nguyên có áp lực sinh tồn dễ hiểu nhưng hạn chế điều khiển vi mô: người dân tự ăn/ngủ/giữ lửa; người chơi chọn vị trí, ưu tiên nguồn lực, nghiên cứu và cách ứng xử với láng giềng. Quyết định phải có thông tin về phí, lợi ích và rủi ro trước khi chọn.

Quy ước thiết kế mới: **Era 0 Đồ Đá/Khởi nguyên → Era 1 Đồ Đồng → Era 2 Đồ Sắt → Era 3 Hiện Đại → Era 4 Dị Tượng**, vẫn là năm thời đại. Các tiêu đề “Kỷ nguyên 1–5” ở mụcIII là cách đánh số cũ. Không đổi ID trong code/save trong đợt tổng hợp tài liệu; không dùng enum 0–5 của Master để tự thêm thời đại thứ sáu. Cần bảng ánh xạ khi triển khai/migrate.

### XI.3 Quần đảo, bộ tộc AI và thủy triều

Đây là **kịch bản mở đầu ba đảo** dành cho chơi cục bộ với AI, không đồng nghĩa đã có thế giới online, giao thương người chơi hoặc PvP.

| Vùng | Danh tính và vai trò |
|---|---|
| Đảo Thiên Nguyên | Đảo người chơi ở trung tâm; giữ lựa chọn kích cỡ/hình dạng và nguồn sinh tồn khả dụng. |
| Đảo Thần Ngư | Phía Đông Nam, đầm lầy/chài lưới, Bô Lão Mộc; khói tím; cá/cây dồi dào, viện trợ và cảnh báo bão. |
| Đảo Răng Nanh | Phía Tây Bắc, đá đen, Krock; khói đen; nhiều đá/thiếu thức ăn, tạo động lực tranh chấp. Không biến thiếu ăn thành cớ sinh tài nguyên vô hạn. |
| Bãi đá cạn | Tính từ vùng bờ đối diện giữa người chơi và Răng Nanh; xuất hiện theo triều, là điểm tranh chấp và tuyến tiếp cận. |

Sinh thế giới từ MasterSeed và seed con độc lập cho từng đảo (`_HARMONY`, `_FANG`); cùng seed/cấu hình phải tái tạo cùng thế giới. Khoảng nước nông 12–15 ô là mục tiêu giữa bờ, không phải khoảng cách hai tâm. Các góc 120–160°/đối trọng±30° của Master cần thống nhất hệ trục trước khi áp; kết quả phải đúng hướng Đông Nam/Tây Bắc, không chỉ đúng số góc.

Các kích thước 50×35/80×50/120×80 hiện thuộc lựa chọn bản đồ; chưa chốt đó là kích thước riêng đảo chính hay toàn quần đảo. Không đặt vệ tinh ngoài biên hoặc cắt bớt đảo để giữ đúng bảng kích thước. Cần kiểm tra biên, chống chồng đảo, bờ tiếp cận, nguồn ăn/gỗ/đá đầu game và đường đi theo trạng thái triều.

Đề xuất bãi cạn lộ 09:00–15:00. Thủy triều phải tác động đường đi thật; khi nước lên cần dự báo/đường quay về, xử lý dân và hàng đang qua, không để NPC kẹt vô hạn hoặc xuyên nước sâu. Nếu bãi cạn và việc đi bộ giữa đảo chưa chạy được, quà/đột kích không được giả lập bằng cách dịch chuyển người qua biển. Thuyền/cảng là hệ thống riêng cần nguồn lực và vận chuyển.

### XI.4 Khám phá, trang bị và sinh tồn bổ sung

**Khám phá sương mù:** chỉ định cư dân tới mốc đất, tuần tra tự động bằng người canh gác/trinh sát, hoặc dùng Ngọn Gió Dẫn Lối. Thần lực chỉ gợi hướng; phần khám phá vẫn cần người đi thật. Lưu vùng đã khám phá; phân biệt đất chưa biết với đất tạm ngoài tầm nhìn.

Tầm nhìn mục tiêu: tay không ban ngày 4 ô, ban đêm 1–2 ô; đuốc 6 ô; điểm cao cộng 3 ô. Đuốc cần chế tạo/trang bị và nguồn sáng hoạt động, không chỉ icon. Trinh sát quay về trước bữa tối; đói/thương/mệt và đường về nguy hiểm phải ưu tiên hơn mốc khám phá. Thú dữ và phần thưởng khám phá chỉ mở khi có luật gặp/xử lý thật. Bia cổ+50 tri thức cần cơ chế nhận một lần/lưu lại để tránh nhận lặp.

**Chế tác tay:** Master đề xuất `hand_axe`1 đá/+30%đốn gỗ, `pointed_stick`1 gỗ, `torch`1 gỗ. Đây là vật phẩm mới, không đổi miễn phí rìu/cuốc/giáo hiện có hoặc cộng bonus trùng. Mỗi món cần hành động chế tác, thời gian, kho/túi, người sử dụng và nơi dùng trước khi mở.

**Nấu nướng:** bổ sung phân biệt ăn sống/nướng bên lửa. Đích thiết kế là ăn nướng an toàn và hiệu quả hơn; chỉ số Đói phải **giảm**, không tăng khi “hồi+15/+35”. Master đề xuất 10%đau bụng khi ăn sống,0%khi nướng, hạnh phúc+10%; cần định nghĩa khẩu phần, trạng thái bệnh/thời hạn và cân bằng với Food hiện tại. Không thêm kho thức ăn nướng rồi đồng thời cộng cùng lượng vào Food.

**An táng:** đề xuất mộ đá 5 đá cho người qua đời, có hành động mang/đắp/tưởng niệm, giảm sợ và ghi Chronicle. Không buộc người chết để qua hướng dẫn; chưa chốt lượng giảm sợ. Cần xử lý mỗi người một lần và đồ/hàng còn lại, không làm mất hoặc nhân đôi vật phẩm.

**Túi và auto-equip:** mục tiêu 3 ô trang bị/4 ô túi kế thừa đặc tả trước; giỏ/gùi có tác dụng tải trọng thật, tự lấy công cụ theo nghề nhưng giữ lựa chọn tay. Đuốc và giáo cùng được ghi vào ô tool trong Master; cần quyết định quy tắc thay/giữ từng món, không cho một ô đồng thời mang nhiều hiệu lực. Khi chuyển schema phải giữ công cụ, cargo/freight, lương thực và trang bị phòng vệ đang có.

### XI.5 Liên minh, chiếm đóng và chư hầu

| Quan hệ | Chủ quyền | Lợi ích mục tiêu | Nghĩa vụ/hệ quả |
|---|---|---|---|
| Liên minh | Hai bộ tộc độc lập, thỏa thuận tự nguyện | Thần Ngư hỗ trợ 5 Food/ngày | Người chơi hỗ trợ an ninh; thất hứa có thể khiến đồng minh rút hòa bình. |
| Chiếm đóng | Kiểm soát một vùng đất như bãi cạn | Quyền tiếp cận vùng/tuyến/tài nguyên | Cần duy trì hiện diện; không tự đổi cả chủ quyền đảo hay biến mọi dân thành chư hầu. |
| Chư hầu | Krock còn cộng đồng riêng nhưng chịu lệ thuộc | Cống 20 đá mỗi 3 ngày | Cần uy tín/quân lực và giữ thỏa thuận; suy yếu có nguy cơ phản trắc. |
| Hòa giải | Quan hệ hòa bình/thỏa thuận mới | Đường kết thúc xung đột thay thế | Không nhận cùng lúc toàn bộ lợi ích liên minh và cống cưỡng bức. |

15 cá khô ban đầu là quà một lần của hồi 2. Viện trợ/cống có nguồn từ cộng đồng gửi, hạn giao, sức chứa và chuyến đi thật; không chỉ cộng tài nguyên theo đồng hồ. Khi chưa có phân loại cá khô, quy đổi vào hệ Food một lần, không giả vờ đã có bảo quản/ôi thiu.

Lựa chọn với Krock không được mặc định ép chư hầu. Chiến thắng đột kích, chiếm bãi cạn và ký hàng ước là ba sự kiện riêng. Không yêu cầu chiến tranh/hiến tế để phát triển kỷ nguyên; các tuyến hòa giải và tự sản xuất vẫn phải có đường học/tích vật tư. Chỉ số quan hệ, nghĩa vụ, uy tín và lịch chuyến cần lưu/tải, không phát quà/cống lại khi tải hoặc bỏ qua thoại.

### XI.6 Thần lực: giữ bộ đang chạy, ghi đề xuất mới riêng

Công thức Faith theo dân sống, hạnh phúc, sợ hãi và bonus đền được kế thừa. Hiện game có trần 300; bốn phép Ban Phước/Cầu Mưa/Khích Lệ/Khiên Thần có đường dùng thật. Không lấy các phép lịch sử ở mụcVI để cộng vào checklist mới.

| Tiểu thần lực mới từ Master | Giá/CD đề xuất | Đích tác dụng và điều kiện mở |
|---|---|---|
| Ngọn Gió Dẫn Lối |15 Faith/45 giây| Gợi hướng tới vùng/nguồn chưa biết; cần sương mù, mục tiêu hợp lệ và người khám phá. |
| Mây Mát Lành |25 Faith/90 giây| Giảm 50%tốc độ tăng mệt vào trưa hè; cần thời tiết/nhiệt và nhu cầu mệt thật. |
| Tia Lửa Linh Thiêng |45 Faith/180 giây| Thắp lại lửa bị dập; cần vị trí lửa hợp lệ và nhiên liệu, không tạo củi miễn phí. |

Ba phép này chưa được nhận là đã triển khai. Mỗi phép cần preview, lý do khóa, phí một lần, cooldown/hiệu lực cùng đồng hồ mô phỏng, pause/tốc độ và lưu/tải. Không áp kiệt sức lao động của Ban Phước vào mọi phép chỉ vì chúng cùng dùng Faith. “Bạo loạn vì cast đè” là đề xuất chưa chạy; hiện Ban Phước đang khóa dùng khi kiệt sức, không tự thêm bạo loạn vào code hay hiện trạng.

### XI.7 Hướng dẫn sáu hồi và giao diện kể chuyện

10 ngày là nhịp mục tiêu cho một lượt mở đầu, không hạn bắt buộc khiến người mới thất bại. Chỉ đạt khoảng 20 phút ở×1 nếu mô hình 120 giây/ngày được triển khai; không tính từ tick của bản hiện tại. Hướng dẫn cần lưu hồi/mốc/lựa chọn, tiếp tục sau tải, có bỏ qua/xem lại, không tạo quà hay lệnh trùng.

| Hồi/ngày gợi ý | Nội dung cần học | Điều kiện thực và lựa chọn |
|---|---|---|
|1/ngày 1| Nhóm lửa, chọn vị trí; phát hiện hai cột khói | Lửa tồn tại, nguồn sinh tồn có thể tiếp cận; camera không mở hết bản đồ ngoài luật tầm nhìn. |
|2/ngày 2| Nhận 15 cá khô và vận chuyển, ăn tối | Người gửi/chuyến giao/kho và bữa ăn thực; quà nhận một lần. |
|3/ngày 3–4| Khói tím báo bão, trú rét/dự trữ củi | Lều/chỗ ngủ đủ số dân đang có, không cố định 3 lều cho mọi startPop. Bão cần luật riêng, không coi mưa thường là bão đã hoàn chỉnh. |
|4/ngày 5–6| Triều rút, tranh chấp, đề nghị của Mộc | Xem nghĩa vụ rồi ký/từ chối/để sau; không tự cưỡng chế liên minh. |
|5/ngày 7–8| Phòng vệ và Khích Lệ, quyết định với Krock | Có hộ vệ/phí Faith/hiệu lực thật; chư hầu hoặc hòa giải, không mặc định chiến thắng chỉ sau bấm phép. |
|6/ngày 9–10| Bàn nghiên cứu, luyện kim và tổng kết | Bàn và nghiên cứu mở đường tiến cấp; vẫn phải đủ điều kiện/vật tư/phí. Đêm Hội Tam Tộc chỉ xảy ra khi quan hệ/lựa chọn cho phép, không ép mọi lượt phải thống nhất ba tộc. |

UI mục tiêu: ngày/giờ và tài nguyên trên HUD; cung trên Hạnh phúc/cung dưới Sợ hãi; Faith có số/trần/tốc độ hồi; thẻ nhiệm vụ theo hồi và hội thoại có avatar Mộc/Krock/lựa chọn/hệ quả. Hồ sơ giữ nhu cầu, tuổi/nghề,3 ô trang bị/4 ô túi; các ô phản ánh dữ liệu thật. Màu giấy ấm, nhấn xanh đậm/vàng và bộ icon riêng phù hợp game hiện tại. Prompt AI là tham khảo bố cục/mỹ thuật, không tự coi carousel/glassmorphism là yêu cầu đã triển khai. ×4 là mục tiêu mới cần kiểm tra đồng bộ, không nhận là đã có chỉ vì xuất hiện trong mockup.

### XI.8 Ý tưởng mở rộng chưa đưa thành luật core

Giữ mục 11 của Master ở backlog thảo luận: sinh con sau 3 ngày/trẻ trưởng thành sau 5 ngày, hun khói/ôi thiu 2–3 ngày, cứu sói con thành chó, lễ trăng tròn 7 ngày/x 2 Faith, thảo dược/rắn cắn và cháy do sét. Không tự áp các số này hoặc hoãn những hệ gia đình/vật nuôi/chữa trị/cháy đã có. Đặc biệt, “trẻ trưởng thành 5 ngày” không được âm thầm thay mốc 18 tuổi của game đang chạy.

### XI.9 Mâu thuẫn và quyết định cần chốt trước khi code

| Điểm | Master/khác biệt | Cách tổng hợp vào thiết kế |
|---|---|---|
| Nhịp một ngày |120 giây/5 giây mỗi giờ, nhưng các đoạn 50+15+45 chỉ 110 giây và không khớp khung giờ| Áp dụng120giây/ngày ở1×: lao động06–18=60giây, bữa tối18–20=10giây, đêm20–06=50giây. Nhịp kinh tế/bản lưu vẫn10bước/ngày để giữ tiến độ và cân bằng theo ngày; phần thời gian lẻ có lưu. Xem WORLD_TIME_RESULT.md. |
| Thời gian hiện tại |10bước/ngày,12giây thực mỗi bước ở1×; đồng hồ hiển thị chạy liên tục5giây/giờ | Hiệu ứng/hồi chiêu cũ giữ số bước và quy đổi hiển thị thời gian thực; không cộng thêm tài nguyên hoặc tiến độ khi tải. Test150ngày cũ là hồi quy kinh tế, không thay cho phép đo120giây browser mới. |
| TrầnFaith | HUD Master 300, task 4.1 lại 100 | Giữ 300 của bản hiện tại làm baseline;100 chỉ là đề xuất mâu thuẫn cần cân bằng, chưa áp. |
| Khích Lệ | Master 35 Faith/xóa toàn bộ sợ; bản hiện tại 30/giảm 20 sợ/+20%sát thương 20 giây | Ghi Master là đề xuất đổi cân bằng, giữ luật đang chạy cho tới đợt triển khai được kiểm tra. |
| Cầu Mưa | Master tăng hái lượm, đặc tả trước và code tăng ruộng 30% | Không cộng cả hai; chọn phạm vi khi cân bằng cơ chế sinh tồn mới. Code hiện tại vẫn tăng ruộng. |
| Leo thang phí | Ví dụ 50→100→150 là tuyến tính, chữ “nhân đôi/x 2” dễ hiểu thành 50→100→200 | Diễn giải ví dụ thành phí cơ bản×(1+số lần trong 120 giây). Hiện áp cho Ban Phước/Khích Lệ; chưa áp cho mọi phép. |
| Trinh sát | Mục 3.3 yêu cầu tò mò 20/dũng cảm 10, mục 4.3 đổi thành dũng cảm 20/tò mò 10 | Vai trò được chọn; ngưỡng chưa chốt. Không ép tính cách từ schema mới vào dân cũ bằng đổi tên trường. |
| Bữa ăn/công cụ | Food 1–2/người, rìu tay 30% và rìu đá 50%; code có hệ khẩu phần/công cụ khác | Không thay số độc lập; phải kiểm tra toàn vòng sản lượng/tiêu thụ, recipe/trang bị và tải hàng. |
| Cầu/Lều/Lửa | Cầu 20 gỗ so với 30 gỗ 20 đá cũ; lều 3–4 chỗ; lửa miễn phí hoặc 5 gỗ | Giữ là thông số thiết kế cần chốt, không ghi cả hai giá cùng hoạt động. Tính lều theo dân/chỗ thực; tránh khóa khởi đầu vì chưa có công cụ/lửa. |
| Lên Đồ Đồng | Master đặt bàn rồi tốt nghiệp, enum 0–5; game có điều kiện/chi phí tiến cấp và năm thời đại | Tốt nghiệp tutorial mở đường nghiên cứu, không tự trả phí/chuyển nhãn; dùng quy ước năm thời đại ở XI.2. |
| Mỹ thuật và phạm vi | Master nói pixel/Ghibli và thế giới ba bộ tộc | Giữ cư dân chibi mềm/icon riêng người chơi đã chọn; láng giềng là AI cục bộ, không kéo theo online/PvP. |

### XI.10 Thứ tự triển khai sau tổng hợp

1. Chốt đồng hồ/khẩu phần/trang bị/tính cách và các mâu thuẫn ở XI.9. Giữ tương thích save, trạng thái nghiên cứu, hàng đang mang và chuỗi kỷ nguyên hiện có.
2. Làm khám phá/sương mù/đuốc/đường về thành vòng chơi thật; có hướng dẫn sinh tồn độc lập trước khi phụ thuộc ngoại giao.
3. Làm bộ sinh ba đảo và thủy triều với validate seed/đường đi/nguồn lực; sau đó nối chuyến giao và AI Mộc/Krock.
4. Làm sáu hồi, liên minh/chư hầu/hòa giải và hội thoại; cung cấp đường không buộc chiến tranh để phát triển, không phát viện trợ/cống miễn phí hoặc lặp khi tải.
5. Bổ sung HUD/túi, tiểu thần lực khi hệ nhận tác dụng đã hoạt động. Nấu nướng/chế tác tay/mộ đá triển khai theo nguồn–vật tư–thời gian–nơi dùng, không chỉ thêm ô/icon.
6. Chọn từng ý mở rộng mụcXI.8 sau khi vòng mở đầu ổn định; không coi chúng là core đã được xác nhận.

Kế hoạch sprint 1–6 của Master được dùng như nhóm công việc tham khảo. Đã có engine, Faith, nhiều công trình, lao động và renderer; không viết lại hoặc đánh dấu chưa làm toàn bộ các nhóm đó. Thay đổi nhịp sống/túi/save phải kiểm tra hồi quy các kỷ nguyên và ba nhánh hiện có. Đợt tổng hợp Master08/10 chỉ cập nhật tài liệu; đợt tiếp theo được người chơi giao đã triển khai vòng khám phá đầu tiên như ghi chú bên dưới.

**Triển khai khám phá08/10:** Đảo mới có sương mù và vùng đã biết được lưu; bản đồ chính/minimap phản ánh tầm nhìn. Cử một người trưởng thành đặt mốc, đi bộ/tìm nguồn/tự về theo nhu cầu và trời tối, giữ nghề/tiến độ công việc. Đuốc chế1gỗ/2nhịp tại kho, lấy/trả thực, có30nhiên liệu hao ban đêm, tầm nhìn6ô và phụ kiện chibi; lấy lại không nạp miễn phí. Nhiệm vụ mở vùng/tìm thức ăn/trở về đã qua một lượt browser8người/3mốc/lưu giữa đường/mobile. Bản lưu cũ giữ vùng đã biết; đã bổ sung tuần tra tự động trong đợt tiếp; đã có vòng thú hoang khi khám phá; chưa gió/thủy triều/ba đảo hoặc120giây/ngày. Chi tiết luật và bằng chứng tại [EXPLORATION_RESULT.md](EXPLORATION_RESULT.md).

---

### Ghi chú triển khai ngày06/10/2026 (sau H4E2)

Các mô tả chưa triển khai ở phần lịch sử cần đọc cùng báo cáo hiện trạng: Hiện Đại đã có công nghiệp/cung ứng/khảo sát-phân tích và chặng xưởng thuốc/phòng khám; cả3nhánh có đường chơi đầu tiên kiếm-vận chuyển-trả phí-thời gian thật. Quỷ Dị có di tích→xương/huyết thạch→sinh chất→cách ly và lọc mẫu sau tiến cấp. Xem GAME_DESIGN_AUDIT.md, MODERN_CARE_RESULT.md và ELDRITCH_TRANSITION_RESULT.md. Chưa biến thể tự nguyện, hạt nhân, đổi/pha nhánh, dầu/vận tải/bệnh lây/y tế đầy đủ/toàn bộ endgame hoặc online; không coi mở tên kỷ nguyên là hoàn thiện toàn bộ thiết kế.


## 22:50 ngày06/10 — Biến thể Linh Mạch vòng đầu

Nghiên cứu2tinh chất2vải; cộng hưởng2tinh chất1vải/10nhịp viện2power/thợ/người lớn sẵn sàng. Ngọc/lá chibi riêng;100lượt +20% tiến độ tinh luyện/dệt/xay/nướng trong4ô tháp có thợ/điện/tinh chất/nguồn≥40, đủ đầu vào/chỗ hàng; ngoài vùng/yếu/tắt/thiếu hàng không buff/tiêu lượt, không cộng dồn. Chăm sóc1tinh chất4nhịp sau dùng lượt/gỡ miễn phí5nhịp/giữ tiến độ và hoàn1lần. Thợ tháp/điều khiển xử lý trước xưởng để tác dụng đúng nhịp. Không đổi nghề/quan hệ/tính cách/cả dân.

Earned4chuyến than32vải/11tinh chất mới chế/619bước/cộng hưởng-hủy-hoàn-lắp/5lượt sản xuất được hỗ trợ+1mẻ/chăm sóc-gỡ-lắp lại/50sống/Food1438,3 thấp1364,3. artifacts/mystic-adaptation-played-save.json100lượt/2essence4components10steel19coal484cloth23cutStone/0spiritStone; gen/lab/refineryOFF, thợ tháp vềFood. Không sửa ba save gốc/ghép hàng. Không dùng waiting thất bại.

Core earned+fixture60lượt/đúngrecipe/zone40/ngừng/khôngstack/save sai nhánh và browser public desktop-mobile/preview/phí/pause-load-outage-refund/live1adult/livefactory/service/remove/no errors qua; sprite ngọc/lá draw thực trong canvas. Hồi quy augmentation/13save3nhánh/microchips-ui/type/build480,7KB qua; xem MYSTIC_ADAPTATION_RESULT.md và ảnhmystic-adaptation-*.png. Mới vòng đầu Hightech/Mystic; Quỷ Dị cư dân chưa có.

Tiếp dạng cư dân Quỷ Dị trêneldritch-transition-played-save riêng, sản xuất/giao bio thật trước phí, chăm sóc/đường gỡ/ngưỡng an toàn và phụ kiện chibi; sauUX/check cuối. Hạn03:27 ngày07/10, từ02:57 chỉfix/check; chưa hạt nhân/endgame đầy đủ.


## 23:50 ngày06/10 — Thích nghi sinh chất Quỷ Dị vòng đầu

Nghiên cứu2bio2cloth; đăng ký2bio1cloth/10labwork/2power/thợ/người lớn sẵn sàng/exposure<15. Patch mềm chibi;100mẻ thu giảm exposure thường5→3/lọc2→1, giữnhiễm nguồn8/4/ngưỡng60-30/yield2bone1blood/charge nguồn. Không miễn nhiễm/giết/hiến tế/lây toàn đảo/tự đổi dân/di truyền. Chăm sóc1bio4work/gỡ miễn phí5work/lưu-outage-refund1lần; lượt chỉ tiêu thu mẫu thành công.

Earned8chuyến than trả64cloth/8bio chế-giao/582steps/1adult/1mẻ thật2bone1blood+3exposure/1lượt/chăm sóc-gỡ-lắp lại/50sống/Food1891,4 thấp1570,9. artifacts/eldritch-adaptation-played-save.json100lượt/1bio1components2steel48coal528cloth6bone3blood25cutStone; gen/lab/xưởngOFF/trạm nghỉ/lọcOFF, thợ trảFood. Viện gốc trống đã phân công thợ thật; không dùng waiting thất bại/không sửa ba save gốc/ghép hàng.

Core earned+fixture cap/filtered1/charge0/exposure15/foreignkind và publicbrowser desktop-mobile/phí-pause-load-refund-outage-live1adult-harvest-service-remove/noerrors qua; patchdraw thựccanvas. Hồi quy augmentation/Mystic/13save3nhánh/care/clinic/era/session/type/build482,9KB qua. Lỗi ghi Unicode ở nghiên cứu đã khôi phục và đối chiếu43node cũ nguyên phí/điều kiện với bảnbuild trước, chỉthêm node44; xem ELDRITCH_ADAPTATION_RESULT.md và ảnheldritch-adaptation-*.png.

TiếpUX thiếu thợ/điện/vật tư trước trả phí, dễ phân công viện trống; cảnh báo upkeep/người mới/cân bằng và kiểm tra dài ngày. Ba dạng đầu xong, chưa toàn bộendgame/genetics/hạt nhân/dầu/vận tải/y tế. Hạn03:27 ngày07/10,02:57 chỉfix/check.


**Đợt tuần tra và điểm khám phá08/10:** Trong Nhiệm vụ có chọn tuần tra tự động hoặc đến điểm đã thấy. Một chuyến/ngày, ưu tiên điểm hữu hạn rồi vùng chưa biết gần làng; ăn/ngủ, trả hàng, an toàn và đường về trước tối giữ ưu tiên. Dừng tuần tra đi bộ về, giữ nghề/công việc; không tự chế hoặc tiếp đuốc miễn phí. Có cảnh báo số nhịp về làng/đuốc gần cạn. Bụi quả/vạt thảo dược lấy tối đa8Food/2herbs từ node thảo dược thật, trừ nguồn, đưa vào cargo rồi giao kho; nguồn cạn không phát hàng. Bia cổ cần2nhịp tại điểm, cộng1trí tuệ cho người đọc (trần10 theo thuộc tính hiện có), lưu nhận một lần. Đây là lợi ích nghiên cứu cá nhân dùng được trong game hiện tại; chưa triển khai kho50tri thức theo Master. Điểm sinh tối đa3 tùy địa hình/nguồn thực, không lộ tên hoặc biểu tượng trước khi nhìn thấy. Xem [PATROL_DISCOVERY_RESULT.md](PATROL_DISCOVERY_RESULT.md) cho phạm vi và kiểm thử.


**Đợt thú hoang08/10:** Sói/lợn rừng có lãnh địa riêng ngoài lửa trại, đi quanh vùng thật và chỉ hiện khi thấy. Trinh sát nhận cảnh báo/rút về, không thu điểm sau khi quay đầu; đuốc còn cháy xua sói, giáo/áo giảm thương tích khi áp sát. Tự dừng tuần tra khi bị áp sát, đi bộ về và mở bảng phòng vệ/chữa thảo dược hiện có; không cấp nghiên cứu/vật tư hoặc đổi nghề. Thú không truy đuổi vào làng; phiên đầu giới hạn sát thương ở sàn20HP khi đường thoát kẹt, cooldown5nhịp giữ qua lưu. Chưa thú săn toàn bộ dân/vật nuôi, săn bắn/loot/rắn/độc hoặc toàn bộ thiên tai. [WILDLIFE_RESULT.md](WILDLIFE_RESULT.md) phân biệt lượt gặp sói thật với fixture thương tích/chữa trị, có ảnh trong game và mobile.


**Đợt bộ sinh ba đảo08/10:** Tạo thế giới cục bộ có lựa chọn **Ba đảo** riêng; các kiểu cũ và bản lưu cũ giữ nguyên. Thiên Nguyên ở giữa, Thần Ngư phía Đông Nam xanh/nhiều cá, Răng Nanh phía Tây Bắc đá nhiều/ít thức ăn; ba seed con độc lập từ MasterSeed. Nhỏ/Vừa/Lớn chọn kích thước nền đảo chính50×35/80×50/120×80, khung biển tự mở rộng để chứa cả quần đảo. Bờ đất chính–phụ cách12–15ô theo khoảng cách thẳng giữa các ô bờ gần nhất, không phải khoảng cách tâm. Có bãi định cư và mỏ thức ăn/gỗ/đá gần bãi, đây là nguồn khai thác trong thế giới, không cộng vật tư vào kho người chơi. Dân bắt đầu/đón mới trên Thiên Nguyên; chưa vượt biển. Lưu danh tính, vùng địa lý và seed trong bản đồ; vùng này chưa phải chủ quyền bộ tộc.60bản đồ/3kích thước, mô phỏng10ngày8sống và lượt browser tạo-thả dân-kiếm hàng-lưu/mobile đã kiểm; xem [THREE_ISLANDS_RESULT.md](THREE_ISLANDS_RESULT.md). Chưa bãi cạn/thủy triều/thuyền/Mộc/Krock/AI hoặc ngoại giao.


**Bãi cạn Răng Nanh08/10 — vòng đầu:** Tuyến địa lý Thiên Nguyên–Răng Nanh có lịch nước rút09:00–15:00 trên đồng hồ chung; địa hình gốc và nguồn không tái sinh khi nước đổi. Trinh sát đi bộ tối đa6ô mỗi nhịp, chỉ xuống bãi khi đủ nhịp để tới bờ trước15h. Do hiện vẫn10nhịp/ngày (chưa120giây/ngày của Master), khứ hồi cần hai đợt nước rút; mang20Food đã giao ở kho, lấy hành trang tại lửa trại, ăn/nghỉ trên đất, trả phần dư khi về. Chuyến thu tối đa3đá từ mỏ thật gần bờ Răng Nanh, chưa quyền khai thác/chủ quyền hoặc giao thương. Đuốc/giáo và thú trên đường bộ vẫn có tác dụng; gặp nguy hiểm gọi về, không tự cấp hàng. Lưu/hủy-gọi về/giữ nghề và hàng/kho đầy/chờ đường sửa đã kiểm; công nhân thường chưa dùng bãi để tránh tự vượt khi nước lên. Xem [TIDAL_RESULT.md](TIDAL_RESULT.md). Chưa Mộc/Krock, tutorial sáu hồi, thuyền/Thần Ngư hoặc chuyến ngoại giao/đột kích.


**Nhịp120giây/ngày08/10:** Một giờ5giây ở1×;1ngày120giây,2×60giây,4×30giây theo cùng hệ số. Đồng hồ và bãi cạn hiển thị liên tục, phần thời gian trong bước được lưu/tải và dừng cùng game. Giữ10bước kinh tế/ngày để không làm mất hoặc nhân20 tiến độ/tuổi/công thức trong bản lưu cũ. Các phép cũ giữ thời lượng theo số bước; giao diện quy đổi sang thời gian thực ở1× (ví dụ Ban Phước10phút, hồi15phút; đây là5ngày/7,5ngày, giữ luật cũ theo ngày). Sửa vòng lặp bỏ thời gian khi render chậm; server dùng thời gian thực trôi qua. Xem [WORLD_TIME_RESULT.md](WORLD_TIME_RESULT.md) cho phép đo và phạm vi kiểm tra. Ba tiểu thần lực/cân bằng khẩu phần mới của Master chưa nằm trong đợt đổi đồng hồ này.
