> **Hiện trạng 07/10/2026:** Đã có đường chơi cục bộ từ Đồ Đá qua Đồ Đồng/Đồ Sắt tới công nghiệp Hiện Đại và ba nhánh Dị Tượng đầu tiên; có y tế vòng đầu và ba dạng cư dân tự nguyện với vật tư, chăm sóc, đường gỡ và phụ kiện chibi. Xem [đối chiếu hiện trạng và phần còn thiếu](GAME_DESIGN_AUDIT.md), [UX và kiểm tra ổn định](ADAPTATION_UX_STABILITY_RESULT.md). Các ghi chú ngày05–06/10 bên dưới phản ánh lịch sử từng đợt; chưa toàn bộ game design, hạt nhân/dầu/vận tải/bệnh lây/di truyền/đổi nhánh/endgame/online.

# Hệ thống kỷ nguyên và dị tượng — Đảo Thiên Nguyên

> **Bổ sung Master 08/10/2026:** Khởi nguyên có thiết kế quần đảo ba đảo, bộ tộc AI Mộc/Krock và hướng dẫn sáu hồi; xem [tổng hợp vào GDD](GAME_DESIGN.md#master-era0-integration). Quy ước thiết kế mới là Era 0 Đồ Đá → Era 1 Đồ Đồng → Era 2 Đồ Sắt → Era 3 Hiện Đại → Era 4 Dị Tượng, vẫn năm thời đại; chưa đổi ID/code/save. Bàn nghiên cứu mở đường học luyện kim, không tự tiến cấp hoặc buộc thắng/thu phục Krock. Các thông số120 giây/ngày, Faith và thủy triều chưa áp vào bản hiện chạy.

> Cập nhật: 2026-10-05. Trạng thái: **Đề xuất thiết kế**, chưa triển khai toàn bộ.
> Hướng được người chơi yêu cầu: từ Đồ Đá lên văn minh Hiện Đại, sau đó phát triển các nhánh dị tượng/biến thể theo GAME_DESIGN.md gốc.
> Bản này thay bản đề xuất sáu giai đoạn Nguyên Thủy–Đế Chế trước đó.
> Đã triển khai chơi cục bộ **Đồ Đá → Đồ Đồng → Đồ Sắt**: điều kiện tiến cấp, nghiên cứu, sản xuất đồng/gỗ xẻ/gạch/gốm/bánh/sắt/vải, nâng cấp cấp 2–3 và lưu/tải. Đồ Sắt có giao thương NPC với cư dân vận chuyển hàng. Thép/hơi nước/điện nguyên mẫu, Hiện Đại, Dị Tượng và công cụ có hao mòn vẫn là thiết kế. Chi tiết: [ERA_IMPLEMENTATION_RESULT.md](ERA_IMPLEMENTATION_RESULT.md), [IRON_IMPLEMENTATION_RESULT.md](IRON_IMPLEMENTATION_RESULT.md).

## 1. Trục phát triển chính

**Đồ Đá → Đồ Đồng → Đồ Sắt → Hiện Đại → Kỷ nguyên Dị Tượng.**

Giữ năm kỷ nguyên như tài liệu gốc. Công nghiệp hóa là một chặng bên trong tiến trình lên Hiện Đại, không bỏ qua than, luyện thép, cơ giới và điện để nhảy thẳng từ kiếm sắt sang vi mạch.

Ba nhánh cuối giữ đúng tên và vật liệu đã liệt kê:

| Nhánh gốc | Tài nguyên đặc trưng gốc | Phong cách |
|---|---|---|
| Công Nghệ Cao | Vi mạch, Nguyên tử | Sci-fi |
| Linh Khí / Huyền Bí | Linh thạch, Tinh chất | Fantasy |
| Quỷ Dị | Xương cốt, Huyết thạch | Dark Fantasy |

Các công trình, dị tượng và biến thể cụ thể bên dưới là **đề xuất bổ sung**, không phải danh sách đã được người chơi xác nhận từng mục. “Nguyên tử” được giữ là tên nhóm trong bản gốc; khi triển khai kho hàng nên dùng vật liệu hạt nhân cụ thể để tránh coi nguyên tử nói chung là một loại hàng.

Kỷ nguyên đo khả năng công nghệ và tổ chức. Nhánh dị tượng đo hướng thích nghi của văn minh. Cộng đồng Công Nghệ Cao, Huyền Bí và Quỷ Dị cùng có thể tồn tại trong một thế giới dai dẳng. Đạt cuối tiến trình không đặt lại đảo, không kết thúc ván.

## 2. Mỗi kỷ nguyên phải đổi cách chơi

| Kỷ nguyên | Quyết định chính | Vòng kinh tế mới | Hình ảnh chủ đạo |
|---|---|---|---|
| Đồ Đá | Định cư và phân công người ở đâu? | Thu thập → thức ăn/vật liệu → nhà, ruộng, kho | Lều, gỗ thô, mái rơm, đá đẽo |
| Đồ Đồng | Chế biến nguồn thô thành hàng hữu ích thế nào? | Quặng + nhiên liệu → đồng; đất sét → gạch/gốm; lúa mì → lương thực | Gỗ xẻ, gạch, lò thủ công, mái ngói |
| Đồ Sắt | Tổ chức thành thị, giao thương và phòng vệ ra sao? | Quặng sắt + than → sắt; đá → đá xây; sợi → vải | Nhà đá, xưởng, đường, thành lũy |
| Hiện Đại | Vận hành công nghiệp mà không thiếu điện và hậu cần ra sao? | Thép + dầu + điện → máy móc/linh kiện | Nhà máy, đường vận tải, dây điện, đô thị |
| Dị Tượng | Nghiên cứu, thích nghi hay khai thác hiện tượng mới? | Nền kinh tế hiện đại → chuỗi tài nguyên và biến thể của nhánh | Kiến trúc Sci-fi, linh khí hoặc quỷ dị |

Lao động tự động, ăn/nghỉ, phân công và sinh hoạt xã hội có từ Đồ Đá. Tiến bộ mở nhóm nghề, dây chuyền và chính sách mới; không bắt người chơi thao tác từng cư dân đến thời hiện đại.

## 3. Đồ Đá — sinh tồn và định cư

### Nội dung mở

- Ưu tiên thức ăn/gỗ/đá, thu thập có di chuyển và tài nguyên trên bản đồ.
- Nhà, kho, bãi gỗ, mỏ đá, nông trại cơ bản sau các nghiên cứu tương ứng.
- Lửa, công cụ đá, nông nghiệp, bảo quản, quan sát tự nhiên và thuần hóa cơ bản.
- Nơi nghiên cứu với người trưởng thành được phân công; không bắt buộc già làng.
- Tín ngưỡng sơ khai, đền nhỏ và nghi lễ tự chọn.

Nhà và kho không bị khóa đến thời kim loại. Bò/gà/chó xuất hiện trong chặng định cư của Đồ Đá; thuần hóa là một nhóm công nghệ, không là một kỷ nguyên độc lập.

### Tài nguyên và mục tiêu

Thức ăn, gỗ thô, đá vụn, thảo mộc giữ đúng bảng gốc. Hoàn thành một khu dân cư tự nuôi được, có dự trữ và một hệ thống khai thác thực tế. Các điểm quặng đồng có thể được nhìn thấy trên bản đồ nhưng chưa khai thác/chế biến hiệu quả trước nghiên cứu luyện đồng.

## 4. Đồ Đồng — nền kinh tế chế biến

### Nội dung mở

Mỏ đồng, lò luyện đồng, xưởng gỗ, lò gốm/gạch, ruộng lúa mì và xưởng làm lương thực. Mở thợ luyện, thợ mộc, thợ gốm; mỗi cư dân chỉ có một công việc kinh tế tại một thời điểm.

Các chuỗi thử nghiệm:

| Đầu vào | Công trình | Đầu ra | Nhu cầu |
|---|---|---|---|
| Gỗ thô | Xưởng gỗ | Gỗ xẻ | Nhà và công trình kiên cố |
| Quặng đồng + nhiên liệu gỗ | Lò luyện | Đồng | Công cụ, vũ khí, thiết bị |
| Đất sét + nhiên liệu | Lò gốm/gạch | Gốm / gạch | Bảo quản, xây dựng |
| Lúa mì | Xưởng lương thực | Thức ăn chế biến | Nuôi dân và tạo dự trữ |

**Công thức bản chơi hiện tại:** hố đất sét thu 6 đất sét/thợ/mẻ từ mỏ hữu hạn gần nước; lò gạch dùng 4 đất sét +2 gỗ →4 gạch; xưởng gốm dùng 3 đất sét +1 gỗ →2 đồ gốm. Ruộng tạo 12 lúa mì/thợ/mẻ (đất màu mỡ +25%); lò bánh dùng 8 lúa mì +2 gỗ →bánh tương đương 40 thức ăn trong kho lương. Mẻ dài 10 tick làm việc tại nơi sản xuất; đi đường, ăn/nghỉ không tạo hàng.

Lò bánh cần 8 gạch +2 đồ gốm ngoài gỗ/đá/thức ăn khi xây; xưởng gốm cần 4 gỗ xẻ. Mỗi đồ gốm giữ trong kho tăng 10 sức chứa của mỗi loại hàng, tối đa +100. Gốm đã dùng xây công trình không còn tăng sức chứa; hàng đang vượt sức chứa sau khi dùng gốm được giữ nguyên, nhưng không nhận thêm cho đến khi có chỗ. Thức ăn có sức chứa riêng; lúa mì thô không tính vào dự trữ dinh dưỡng. Mẻ chế biến thiếu đầu vào hoặc thiếu chỗ cho toàn bộ đầu ra không trừ nguyên liệu.

Công cụ đồng tăng năng lực khai thác nhưng cần sản xuất và thay thế. Nhà nâng cấp mở sức chứa; kho và bình chứa cải thiện bảo quản. Không thêm quặng vào HUD nếu chưa có nguồn, nơi cất và nơi dùng.

## 5. Đồ Sắt — thành thị và mạng lưới

> Đã có chặng đầu chơi cục bộ: điều kiện Đồ Đồng →Đồ Sắt, sắt/than, lanh/vải, cấp 3 và chuyến giao thương NPC vận chuyển trên bản đồ. Công nghiệp hơi nước/thép/điện nguyên mẫu và mạng kho nội bộ chưa triển khai. Xem [IRON_IMPLEMENTATION_RESULT.md](IRON_IMPLEMENTATION_RESULT.md).

### Nội dung mở

Mỏ sắt, mỏ than, lò luyện sắt, xưởng đá, xưởng dệt, chợ, cảng, công trình phòng vệ và tổ chức quản trị. Dân sự, thương mại và quân sự đều cần vật liệu nên người chơi phải chia sản lượng.

Tài nguyên gốc: sắt thô, than đá, đá xây dựng, vải sợi. Sắt có chuỗi khai thác/luyện; vải có nguồn sợi và xưởng dệt; không tự phát sinh từ nghề nghiệp.

Có hai chặng nghiên cứu bên trong thời đại:

1. **Thành thị:** luyện sắt, chữ viết, đường, thương mại, vệ sinh và phòng vệ.
2. **Tiền công nghiệp:** máy hơi nước, cơ giới sơ khai, luyện thép và phát điện thử nghiệm.

Công nghệ cuối Đồ Sắt là nguyên mẫu để đạt điều kiện vào Hiện Đại. Nhà máy và lưới điện diện rộng chỉ mở sau đó. Giao thương với thương nhân NPC cho phép tiếp cận vật liệu thiếu trên đảo; không buộc gây chiến để tiến cấp.

## 6. Hiện Đại — điện, công nghiệp và đời sống đô thị

### Nội dung mở

Nhà máy thép, nhà máy linh kiện, khai thác/lọc dầu, nhà máy điện, trạm phân phối, vận tải cơ giới, bệnh viện, trường học và viện nghiên cứu.

| Tài nguyên gốc | Nguồn/chức năng đề xuất |
|---|---|
| Thép | Luyện sắt với nhiên liệu; làm công trình và máy móc |
| Dầu mỏ | Khai thác và tinh chế; nhiên liệu vận tải/công nghiệp |
| Điện năng | Phát điện và phân phối; công suất tức thời cho thiết bị |
| Linh kiện | Nhà máy dùng kim loại và điện; nghiên cứu, sửa chữa, thiết bị |

Điện là mạng cung/cầu, không cộng vào kho như gỗ. Lưới thiếu công suất thì người chơi ưu tiên bệnh viện, thực phẩm hay công nghiệp; mất điện làm giảm/dừng hoạt động tương ứng, không phá toàn bộ đô thị ngay.

Cho phép phát điện bằng than hoặc nhiên liệu tinh chế; không bắt mỗi đảo có dầu mới chơi được Hiện Đại. Thương mại, nguồn trong vùng trung lập hoặc năng lượng thay thế phải tạo đường tiếp cận tài nguyên chiến lược.

Công nghiệp có đánh đổi về nhiên liệu, sửa chữa, chất thải và sức khỏe. Văn minh hiện đại vẫn là một lối chơi đầy đủ; người chơi có thể chọn tiếp tục nghiên cứu và giao thương mà không nhận biến thể quỷ dị hay huyền bí.

## 7. Điều kiện tiến kỷ nguyên

Hai chuyển cấp đầu đã chạy trong bản cục bộ theo các ngưỡng dưới đây; các chuyển cấp lên Hiện Đại/Dị Tượng vẫn là **đề xuất**. Các ngưỡng là khởi điểm cân bằng. Số ngày là ngày mô phỏng, chưa quy đổi thành phút chơi thật.

| Chuyển cấp | Điều kiện bắt buộc đề xuất | Mục đích |
|---|---|---|
| Đồ Đá → Đồ Đồng | Dân sống ≥12; Lửa + Công cụ đá + Nông nghiệp + Khảo sát khoáng sản hoàn tất; có nhà/kho; một nông trại và một cơ sở khai thác đã tạo ít nhất 5 mẻ mỗi nơi; dự trữ ≥3 ngày | Từ thu thập sang sản xuất có tổ chức |
| Đồ Đồng → Đồ Sắt | Dân sống ≥25; Luyện đồng + Chữ viết + Khảo sát sắt hoàn tất; đã sản xuất tổng cộng 50 đồng và 30 gỗ xẻ; có kho chứa hàng chế biến; dự trữ ≥5 ngày | Có nền tảng kim loại và thành thị |
| Đồ Sắt → Hiện Đại | Dân sống ≥50; Cơ giới + Luyện thép + Điện học hoàn tất; xưởng nguyên mẫu đã tạo 30 thép; máy phát thử nghiệm đã cấp đủ điện cho một xưởng trong 3 ngày liên tiếp; có mạng vận chuyển nội bộ; dự trữ ≥7 ngày | Chứng minh công nghiệp có thể vận hành |
| Hiện Đại → Dị Tượng | Có viện nghiên cứu hiện đại và lực lượng nghiên cứu; cơ sở đo đạc đã xử lý 3 đợt khảo sát; duy trì điện đủ cho viện trong 5 ngày liên tiếp; đã phân tích một dị tượng và hoàn tất dự án nền tảng của nhánh chọn | Có năng lực chủ động tiếp cận bước ngoặt mới |

Dân số chỉ tính dân sống đã xuất hiện trên bản đồ. Sức chứa phải đủ cho dân hiện tại. Không cần già làng, thế hệ 2/3 hoặc chiến thắng PvP. Sản lượng tổng cộng là số hàng đã sản xuất thật, không phải hàng mua/nhận miễn phí hoặc lượng phải giữ nguyên trong kho.

Khảo sát sắt là nghiên cứu trong Đồ Đồng; luyện thép/điện học/máy phát nguyên mẫu ở cuối Đồ Sắt. Khảo sát dị tượng và dự án nền tảng đều làm được trong Hiện Đại. Không yêu cầu công nghệ chỉ mở ở kỷ nguyên đích để vào chính kỷ nguyên đó.

Một máy phát đủ điện cho xưởng nghĩa là đủ công suất yêu cầu trong mọi chu kỳ sản xuất của cửa sổ kiểm tra; ngắt điện đặt lại cửa sổ liên tục nhưng không xóa nghiên cứu hoặc sản lượng lịch sử. Giao diện phải hiện nguyên nhân và thời gian đã đạt.

### Chi phí thử nghiệm

| Chuyển cấp | Phí đầu tư | Thời gian |
|---|---|---|
| Đồ Đá → Đồ Đồng | 40 gỗ thô +20 đá vụn | 2 ngày |
| Đồ Đồng → Đồ Sắt | 30 gỗ xẻ +20 đồng +20 gạch | 3 ngày |
| Đồ Sắt → Hiện Đại | 30 thép +40 đá xây dựng +20 vải | 5 ngày |
| Hiện Đại → Dị Tượng | 50 linh kiện +20 thép; điện vận hành viện tính riêng | 5 ngày |

Phí không tiêu thêm thức ăn; dân vẫn ăn khi phát triển. Dự trữ = thức ăn dùng được / nhu cầu chuẩn mỗi ngày của dân và vật nuôi. Không dùng lượng ăn thực tế của cư dân bị đói để giảm mẫu số. Các dạng lương thực được quy về dinh dưỡng dùng được, không tính cả lúa mì chưa chế biến lẫn thành phẩm của nó hai lần.

## 8. Dị tượng là một hệ thống sự kiện, không chỉ một nút chọn nhánh

### Dị tượng đề xuất

| Nhóm | Dấu hiệu | Hướng mở |
|---|---|---|
| Công nghệ | Tín hiệu lạ, vật thể chứa cấu trúc chưa biết, vùng nhiễu điện từ | Công Nghệ Cao |
| Linh khí | Mạch năng lượng, thực vật phát sáng, vật chất kết tinh | Linh Khí / Huyền Bí |
| Quỷ dị | Vùng biến chất, di tích hữu cơ, vật chất huyết thạch | Quỷ Dị |

Lời giải thích cụ thể như nguồn ngoài hành tinh, nghi lễ cổ hay thí nghiệm thất bại là đề xuất cốt truyện; chưa chốt một nguồn duy nhất. Dị tượng có thể được gợi báo trước Hiện Đại nhưng chỉ được nghiên cứu sâu khi đủ năng lực.

### Chu trình xử lý

**Phát hiện → Khảo sát → Phân tích → Lựa chọn phản ứng → Dự án khai thác hoặc phong tỏa → Hệ quả.**

Người chơi chọn nghiên cứu, thu hoạch có kiểm soát, phong tỏa hoặc bỏ qua. Khảo sát cho biết loại vật liệu, lợi ích tiềm năng, chi phí và mức rủi ro trước khi xác nhận dự án. Bỏ qua không tự khóa toàn bộ tiến trình kinh tế.

Mỗi nền văn minh hiện đại có thể chủ động chạy khảo sát cho từng hướng. Nếu bản đồ không có dị tượng phù hợp, mở nhiệm vụ thám hiểm hoặc trao đổi mẫu với thương nhân NPC. Không để tiến trình phụ thuộc vô hạn vào xác suất sự kiện hoặc buộc mua mẫu từ người chơi độc quyền.

Dị tượng cấp đầu ở vùng nghiên cứu được giới hạn hậu quả trong vùng của người sở hữu. Dị tượng nguy hiểm hơn phải có dấu hiệu, thời gian ứng phó và hành động kiểm soát; không ngẫu nhiên xóa đảo, biến đổi toàn bộ dân hoặc phá công trình của người chơi khác.

## 9. Ba nhánh văn minh sau Hiện Đại

| Nhánh | Dự án nền tảng ở Hiện Đại | Chuỗi tài nguyên đặc trưng | Công trình đề xuất | Lối chơi và đánh đổi |
|---|---|---|---|---|
| Công Nghệ Cao | Phân tích mẫu cấu trúc + nghiên cứu bán dẫn tiên tiến | Linh kiện → vi mạch; khoáng vật hạt nhân → nhiên liệu/vật liệu nguyên tử | Nhà máy vi mạch, trung tâm điều khiển, lò phản ứng | Tự động hóa, cảm biến, hiệu suất; cần điện ổn định và sửa chữa |
| Linh Khí / Huyền Bí | Phân tích mạch linh khí + nghiên cứu cộng hưởng | Mạch linh khí → linh thạch → tinh chất | Trạm dẫn linh, xưởng tinh luyện tinh chất, tháp cộng hưởng | Chăm sóc, tái sinh, điều hòa môi trường; cần mạch năng lượng và độ ổn định |
| Quỷ Dị | Phân tích mẫu biến chất + nghiên cứu kiểm soát sinh chất | Di tích/vật chất biến chất → xương cốt, huyết thạch → vật liệu hữu cơ | Khu cách ly, xưởng sinh chất, công trình hữu cơ | Thích nghi, tái cấu trúc và khai thác môi trường khắc nghiệt; cần kiểm soát nhiễm và chăm sóc |

Nguồn xương cốt/huyết thạch có đường thu từ di tích và vật chất dị tượng; không bắt buộc giết dân hoặc người chơi khác để vận hành nhánh. Các công trình cần lao động/vật tư thực tế, không sinh hàng tự động chỉ vì chọn nhánh.

Phiên bản đầu cho chọn **một nhánh chủ đạo** sau khi xem rõ lợi ích và đánh đổi. Có thể trao đổi hàng nhánh khác, nhưng công trình cấp cao vẫn cần chuyên môn riêng. Không khóa ngay khi phát hiện dị tượng; chỉ chốt khi người chơi xác nhận dự án chuyển nhánh.

Đổi nhánh về sau là một dự án chuyển đổi có thời gian: dừng đầu tư công trình chuyên môn cũ, cải tạo thiết bị và bố trí lại người. Không xóa dân hay vật tư đã có. Việc pha trộn hai nhánh là mở rộng sau khi ba nhánh độc lập đã cân bằng.

Không nhánh nào được tăng tất cả sản lượng, tốc độ, sức khỏe và quân lực cùng lúc. Mỗi nhánh cần một ưu thế rõ và một giới hạn có thể nhìn thấy; văn minh Hiện Đại chưa chuyển nhánh vẫn có vai trò kinh tế và giao thương.

## 10. Biến thể cư dân và công trình

Biến thể không phải một kỷ nguyên mới cho từng loài. Mỗi đối tượng giữ nguồn gốc, nghề, quan hệ và ký ức; chỉ nhận thuộc tính thay đổi đã được mô tả.

| Nhánh | Biến thể đề xuất | Lợi ích ví dụ | Chi phí/giới hạn ví dụ |
|---|---|---|---|
| Công Nghệ Cao | Người được tăng cường cơ học, lao động hỗ trợ bởi thiết bị | Làm việc chính xác, chịu môi trường tốt hơn | Cần điện/linh kiện và bảo dưỡng |
| Linh Khí / Huyền Bí | Cư dân cộng hưởng linh khí, thực vật/công trình dẫn linh | Hồi phục hoặc sản xuất tốt trong vùng cộng hưởng | Hiệu quả giảm ngoài vùng; cần tinh chất ổn định |
| Quỷ Dị | Cư dân thích nghi sinh chất, vật nuôi/công trình hữu cơ | Chịu môi trường biến chất, chuyên môn khai thác mới | Cần chăm sóc đặc thù và kiểm soát nhiễm |

Đây là ví dụ thiết kế, chưa chốt tên chủng tộc hay hình dạng. Lần triển khai đầu chỉ cần một biến thể cư dân và một công trình đặc trưng cho mỗi nhánh.

Luật biến đổi:

- Biến đổi có chủ đích cần nghiên cứu, công trình xử lý, vật tư và xác nhận nhóm cư dân chịu tác động. Xem trước lợi ích, nguy cơ và khả năng đảo ngược.
- Phơi nhiễm là một trạng thái cảnh báo trước khi thành biến thể: có thời gian cách ly/chữa/di chuyển. Biến đổi rủi ro không được xảy ra âm thầm ngoài vùng nguy hiểm đã báo.
- Nghề không tự đổi vì biến thể; nhà ở và chăm sóc có thể cần thích nghi. Thiếu vật tư bảo dưỡng làm giảm hiệu quả và có cảnh báo, không giết ngay cư dân.
- Không mặc định di truyền tất cả hiệu ứng cho con cháu. Di truyền và biến thể động vật là phần mở rộng riêng; trẻ em không tự trở thành cửa tạo tài nguyên đặc biệt.
- Không cộng chồng vô hạn tăng cường của nhiều nhánh. Một biến thể chính, số ô nâng cấp giới hạn và quy tắc tương thích rõ.
- Biến thể tự nguyện phải có dự án gỡ/chuyển đổi; dạng nguy hiểm không đảo ngược cần ghi rõ trước khi người chơi xác nhận rủi ro.

## 11. Niềm tin đi xuyên toàn bộ tiến trình

Niềm tin tồn tại từ cộng đồng Đồ Đá, không biến mất khi có khoa học. Nó thể hiện văn hóa, sự gắn kết và cách cư dân giải thích thế giới.

| Giai đoạn | Vai trò niềm tin đề xuất |
|---|---|
| Đồ Đá | Nghi lễ và đền nhỏ hỗ trợ tinh thần |
| Đồ Đồng–Đồ Sắt | Tổ chức tín ngưỡng, lễ hội, chăm sóc cộng đồng |
| Hiện Đại | Tín ngưỡng song song khoa học; chính sách văn hóa và nghiên cứu độc lập |
| Công Nghệ Cao | Niềm tin ảnh hưởng sự chấp nhận công nghệ, không bắt buộc trở thành vô thần |
| Linh Khí / Huyền Bí | Nghi lễ hỗ trợ ổn định cộng hưởng; linh thạch vẫn có nguồn vật chất riêng |
| Quỷ Dị | Gắn kết xã hội và nghi lễ giúp kiểm soát bất ổn; không mặc định dân đều trở thành tà giáo |

Faith không đồng nhất với linh khí hay độ nhiễm. Niềm tin là chỉ số xã hội/tài nguyên nghi lễ; linh khí là nguồn năng lượng; độ nhiễm là trạng thái rủi ro. Không dùng một thanh cho cả ba. Faith không là cửa bắt buộc lên Hiện Đại hoặc mở mọi nhánh. Phép thần cần thiết kế và cân bằng riêng, không thay thế sản xuất/hậu cần.

## 12. Công trình, nâng cấp và texture

Tách **cấp vận hành** khỏi **thế hệ công nghệ**. Cấp 1–3 thể hiện đầu tư trong cùng mẫu công trình; kỷ nguyên/ngành công nghệ quyết định mẫu và dây chuyền. Nhà đá cấp 3 không tự biến thành chung cư hiện đại.

| Vai trò | Đồ Đá | Đồ Đồng | Đồ Sắt | Hiện Đại | Dị Tượng |
|---|---|---|---|---|---|
| Nhà ở | Lều/nhà gỗ | Nhà gạch | Nhà đá/khu phố | Nhà đô thị | Kiến trúc đặc trưng nhánh |
| Kho | Kho thô | Kho gốm/gỗ xẻ | Kho thành thị | Kho cơ giới | Kho kiểm soát vật liệu nhánh |
| Khai thác | Bãi gỗ/mỏ đá | Mỏ đồng | Mỏ sắt/than | Mỏ cơ giới/dầu | Cơ sở khai thác dị tượng |
| Sản xuất | Nông trại | Xưởng thủ công/lò đồng | Lò sắt/xưởng dệt | Nhà máy | Xưởng chuyên môn nhánh |
| Nghiên cứu | Nơi truyền đạt tri thức | Phòng nghiên cứu | Học viện | Viện nghiên cứu | Trung tâm chuyên môn nhánh |

Cải tạo công trình sang mẫu mới cần đủ kỷ nguyên, nghiên cứu, vật liệu, người xây và thời gian dừng hoạt động. Giữ công trình cũ nếu muốn; thông báo trước thay đổi sức chứa/sản lượng và không làm hàng trong kho biến mất khi cải tạo.

Texture cần nhận ra thời đại bằng vật liệu, mái, đường ống, ánh sáng và chuyển động. Ba nhánh cuối có hình khối riêng: máy móc chính xác; vật liệu cộng hưởng phát sáng; cấu trúc hữu cơ biến chất. Không chỉ đổi màu cùng một mái nhà.

Hiện có 189 texture SVG cho 21 loại công trình, 3 cấp hình ảnh và 3 phong cách Đồ Đá/Đồ Đồng/Đồ Sắt. Công trình hiện đại và các nhánh dị tượng cần hình ảnh riêng khi triển khai.

## 13. Giao diện và trạng thái tiến trình

Bảng kỷ nguyên trình bày trục năm thời đại; sau Hiện Đại mở ba nhánh song song. Mỗi thời đại có nội dung mới, điều kiện hiện tại/mục tiêu, chi phí và thời gian. Điều kiện bị khóa có nút dẫn tới nghiên cứu/công trình cần giải quyết.

Tab Nghiên cứu nhóm theo thời đại và ngành: sinh tồn, chế biến, quản trị, công nghiệp, dị tượng. Các nhánh dị tượng có đường phân ranh riêng. Công nghệ chưa triển khai ghi rõ, không cho bấm tiêu tài nguyên.

Bảng dị tượng cho xem vị trí, tiến độ khảo sát, rủi ro, vùng ảnh hưởng và các lựa chọn. Bảng cư dân hiển thị biến thể, nguồn biến đổi, nhu cầu mới và biện pháp chăm sóc. Không giấu hệ quả sau những mô tả như “sức mạnh bí ẩn”.

Luồng chuyển cấp: **Chưa đủ điều kiện → Sẵn sàng → Đang phát triển → Hoàn tất**. Người chơi chủ động bắt đầu; máy chủ kiểm tra/trừ phí một lần, lưu tiến độ và tiếp tục khi offline. Không tự mở dự án nhánh hoặc biến đổi cư dân lúc người chơi vắng mặt.

Điều kiện thành tích được chốt khi bắt đầu chuyển cấp. Mất dân/công trình không hủy toàn bộ thành tích, không tụt kỷ nguyên. Tiến độ phát triển cần người nghiên cứu và điện theo giai đoạn; thiếu thì tạm dừng với lý do rõ. Cộng đồng không còn người sống cũng tạm dừng. Bản đầu không có hủy/hoàn phí để tránh thưởng hoặc hoàn tài nguyên lặp.

## 14. Online và tương thích dữ liệu

Mỗi nền văn minh có kỷ nguyên và nhánh riêng. Đồng hồ, tài nguyên, khảo sát, biến đổi và kết quả giao dịch do máy chủ xác nhận. Không cho client thay đổi kỷ nguyên, tự cấp mẫu dị tượng hay tăng tốc nghiên cứu trong shard chung.

Dị tượng không tự lan vào vùng người chơi khác. Tương tác gây hại phải nằm trong luật PvP/tuyên chiến, có thông báo và khả năng phòng vệ. Không cho một lệnh khảo sát biến thành cách phá người mới.

Thiếu quặng, nhiên liệu hoặc mẫu nhánh phải có đường tiếp cận qua thám hiểm/thương nhân NPC/thương mại; không bắt mỗi bản đồ chứa mọi nguyên liệu nhưng cũng không để một tài nguyên hiếm chặn tiến trình vĩnh viễn.

Hệ thống cũ dùng số 0–5 cho Nguyên Thủy, Công Cụ Đá, Định Cư, Thuần Hóa, Văn Minh, Đế Chế. Bản hiện tại đã dùng mã ổn định `stone`, `bronze`, `iron`, `modern`, `anomaly`. **Không đổi nhãn số 4 của bản lưu cũ thành Hiện Đại và coi dữ liệu đã hiện đại hóa.** Nhánh dị tượng cần trường riêng khi triển khai.

Bản lưu cũ cần chuyển đổi theo công nghệ thực tế: dữ liệu chỉ có thu thập/nông nghiệp/công cụ đá vẫn thuộc Đồ Đá, nhưng giữ toàn bộ dân, công trình, cấp và vật tư đang có. Hiển thị thông báo chuyển hệ thống, giữ quyền dùng công trình đã xây, áp luật mới cho xây mới/cải tạo. Không tự cấp dây chuyền kim loại, điện hay dị tượng từ số kỷ nguyên cũ.

## 15. Thứ tự triển khai

> Cập nhật sau đặc tả Era 0 ngày 2026-10-05: các chặng Đồ Đá/Đồ Đồng và phần đầu Đồ Sắt đã chơi được. Đề xuất hoàn thiện nền sinh tồn Khởi nguyên, đồ mang theo và Faith trước khi tiếp tục tiền công nghiệp; xem [bản tích hợp](ERA0_INTEGRATION_PLAN.md). Bảng dưới giữ lộ trình dài hạn, không có nghĩa mọi đợt đã hoàn tất.

| Đợt | Phạm vi | Điểm kết thúc kiểm thử |
|---|---|---|
| 1 | Thống nhất dữ liệu kỷ nguyên; cây Đồ Đá; điều kiện, giao diện, bộ đếm và bản lưu | Chơi từ khởi đầu tới sẵn sàng vào Đồ Đồng |
| 2 | Quặng đồng/đất sét; khai thác, chế biến, kho hàng, nhà/xưởng và texture Đồ Đồng | Sản xuất và tiêu dùng được đồng, gỗ xẻ, gạch |
| 3 | Sắt/than/vải; chợ, vận chuyển, quản trị và tiền công nghiệp | Vận hành được thành thị và nguyên mẫu thép/điện |
| 4 | Điện, dầu, thép, linh kiện; công trình và texture Hiện Đại | Cân bằng được điện, nhiên liệu, sản xuất và đời sống |
| 5 | Chu trình dị tượng; một công trình và một biến thể cho mỗi nhánh | Chọn, vận hành và kiểm soát rủi ro của cả ba nhánh |
| 6 | Mở rộng dị tượng, ngoại giao nhánh, mạng vùng và biến thể nâng cao | Thế giới lâu dài có nhiều lối phát triển cạnh tranh |

Công Nghệ Cao, Huyền Bí và Quỷ Dị thuộc **tầm nhìn thiết kế chính**. Triển khai sau Hiện Đại là thứ tự làm việc, không có nghĩa loại các nhánh này khỏi game.

## 16. Các kiểm tra bắt buộc khi làm gameplay

- Cây điều kiện không có vòng khóa: công nghệ nguyên mẫu trước cửa chuyển cấp, công nghệ vận hành quy mô lớn sau cửa.
- Chơi được từ Đồ Đá khi không có già làng/con cháu và khi chọn hòa bình.
- Đảo thiếu đồng/sắt/dầu có đường nhập hoặc thám hiểm được, không cần can thiệp chỉnh tài nguyên.
- Chế biến ghi đúng đầu vào/đầu ra; không tạo đồng từ đá hay cộng cả nguyên liệu và thành phẩm vào cùng một thành tích.
- Máy phát, lưới điện, ưu tiên tải và chu kỳ mất điện hoạt động thống nhất cả khi offline.
- Nhấn lặp/tải lại không trừ phí, tính mẻ, cấp mẫu hoặc hoàn tất biến đổi hai lần.
- Mỗi nhánh có đường tiếp cận mẫu đáng tin cậy, không chờ sự kiện ngẫu nhiên vô hạn.
- Biến đổi có cảnh báo, xem trước, giới hạn cộng chồng và đường chăm sóc/chuyển đổi tương ứng.
- Người chơi không chọn nhánh vẫn vận hành được Hiện Đại; người chọn Huyền Bí không bị bắt giết dân để mở Quỷ Dị hoặc ngược lại.
- Texture, tên công trình, chi phí và sản lượng khớp thế hệ công nghệ; bản lưu cũ không được coi là Hiện Đại chỉ vì từng mang mã era 4.

Theo dõi thời gian ở mỗi thời đại, chỗ thiếu vật liệu, tần suất mất điện, tỷ lệ chọn nhánh và thiệt hại do dị tượng. Dùng phiên chơi để cân bằng; không kéo dài game bằng chờ tuổi cư dân hoặc chờ một sự kiện may rủi.


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
