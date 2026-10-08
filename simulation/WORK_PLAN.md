> **Điểm tiếp tục09:50:** H4B1 viện/điện riêng/phân tích đã qua earned/browser;3 hồ sơ xử lý,50 dân sống. Tiếp H4B2 lựa chọn/dự án từ artifacts/analysis-played-save.json; đọc ANALYSIS_RESULT.md. H4 tổng chưa xong/Dị Tượng chưa mở.

> **Điểm tiếp tục09:01:** H4A khảo sát sơ bộ đã trả phí và đi thực địa,3 hồ sơ về/50 dân sống. Tiếp H4B cơ sở đo đạc/phân tích/điện/lựa chọn từ artifacts/surveys-played-save.json, đọc FIELD_SURVEYS_RESULT.md. H4 tổng chưa xong, Dị Tượng chưa mở.

> **Điểm tiếp tục08:40:** H3 nguồn cung/điều phối nhiều xưởng đã qua lượt thật và browser; tiếp H4 khảo sát Dị Tượng từ artifacts/modern-dispatch-played-save.json. Đọc MODERN_DISPATCH_RESULT.md. Hiện Đại mới có phần công nghiệp đã kiểm chứng, Dị Tượng chưa mở.

> **07:38:** H3A hợp đồng cung ứng đã trả phí thật và test browser; nghiên cứu dùng linh kiện, vải đổi than/đồng,50 dân sống. Tiếp H3B từ modern-supply-played-save.json; xem MODERN_SUPPLY_RESULT.md. Hiện Đại mở phần đầu, Dị Tượng vẫn khóa.

> **06:36 ngày 06/10:** chuyển cấp public và chuỗi linh kiện/nâng cấp nhà máy đã qua mô phỏng/trình duyệt, mở phần đầu Hiện Đại; Dị Tượng vẫn khóa. Xem MODERN_FACTORY_RESULT.md. Tiếp H3 nguồn cung/vận hành từ modern-factory-upgraded-save.json; thông tin khóa Modern ở các đợt cũ bên dưới là lịch sử.

> 04:38: lõi phí/thời gian chuyển Hiện Đại và UI tiến độ đã qua test staging; game vẫn khóa Modern đến khi chuỗi nhà máy linh kiện hoàn thiện. Tiếp H2 theo MODERN_INVESTMENT_RESULT.md; không làm lại lõi chuyển cấp.

> **Gia hạn 24 giờ:** làm đến 03:27 ngày 07/10/2026 Asia/Bangkok, thay mốc 08:00 cũ. Kế hoạch đang áp dụng: WORK_24H_PLAN.md; điểm tiếp tục modern-ready-save.json, ưu tiên chuyển cấp/chuỗi nhà máy Hiện Đại.

> Đợt 03:20: đã kiểm chứng làng 50 dân đủ cả 10 điều kiện, phí thép/đá xây/vải và 3 ngày điện; UI phí có icon riêng, test browser qua. Tiếp từ modern-ready-save.json để làm chuyển cấp và chuỗi linh kiện. Hiện Đại vẫn khóa. Chi tiết MODERN_READINESS_RESULT.md.

> Đợt N4A đêm 06/10: đã có bảng điều kiện Hiện Đại và làng 50 dân/50 giường/kho 1900 vượt 7 ngày ăn, giữ đủ dân qua 30 ngày; sửa ăn khẩn cấp và phân chia chuyến. Hiện Đại vẫn khóa, còn phí/thời gian chuyển cấp và chuỗi nhà máy. Xem MODERN_PREPARATION_RESULT.md và NIGHT_WORK_REPORT.md.

> Đợt tiếp 06/10: N3 tiền công nghiệp đã hoàn tất và qua test mô phỏng/trình duyệt. Thép, đá xây, bộ phận máy, máy phát/ưu tiên điện/nâng cấp có vòng chơi thật. Hiện Đại vẫn khóa; tiếp theo N4. Xem [INDUSTRY_RESULT.md](INDUSTRY_RESULT.md) và [NIGHT_WORK_REPORT.md](NIGHT_WORK_REPORT.md).

> Đợt đêm 06/10: đã khép kiểm tra nhiều đợt đột kích và làm cư dân chibi riêng theo chỉnh sửa dễ thương của người dùng. Xem [CHARACTERS_RESULT.md](CHARACTERS_RESULT.md) và [NIGHT_WORK_PLAN.md](NIGHT_WORK_PLAN.md); tiếp theo tiền công nghiệp thép/cơ giới/điện.

# Checklist triển khai Đồ Đá → Đồ Đồng

> Bắt đầu 2026-10-05 theo yêu cầu người chơi. Làm lần lượt và tự kiểm thử; kết quả được cập nhật trong file này.

## Phạm vi lần này

- [x] 1. Dùng mã kỷ nguyên ổn định; giữ lộ trình Đồ Đá → Đồ Đồng → Đồ Sắt → Hiện Đại → Dị Tượng. Các thời đại sau chưa triển khai phải có nhãn rõ.
- [x] 2. Nối cây nghiên cứu Đồ Đá, bỏ điều kiện già làng và khóa AI theo kỷ nguyên.
- [x] 3. Nối quyền xây/nâng cấp và bảng điều kiện tiến cấp; người chơi chủ động bắt đầu, trừ phí một lần, tiến độ có lưu.
- [x] 4. Ghi bộ đếm mẻ sản xuất thật, dân sống/sức chứa/dự trữ; kiểm tra không có vòng khóa.
- [x] 5. Đồ Đồng: khai thác quặng đồng, luyện đồng bằng quặng + gỗ, xưởng gỗ chế biến gỗ xẻ; có kho hàng, giới hạn sức chứa và báo thiếu nguyên liệu.
- [x] 6. Tạo hình ảnh riêng cho mỏ đồng, lò luyện, xưởng gỗ và nhà/kho Đồ Đồng; thể hiện thời đại trên bản đồ.
- [x] 7. Lưu/tải thế giới, cư dân, công trình, tài nguyên, nghiên cứu và tiến kỷ nguyên. Giữ dữ liệu của bản lưu cũ nếu đọc được.
- [x] 8. Kiểm thử luật kinh tế và lệnh trùng, giới hạn kho, tải lại giữa tiến trình, đường đi và lao động.
- [x] 9. Kiểm thử trình duyệt ở máy tính và màn hình nhỏ; chụp kết quả để người chơi xem.
- [x] 10. Build và kiểm tra hồi quy; ghi báo cáo cuối, hạn chế và bước làm tiếp.

## Các đợt sau

### Đợt đã hoàn thành: mở rộng Đồ Đồng

- [x] Nghiên cứu và công trình đất sét, gạch, gốm, lúa mì, bánh; công thức có đầu vào và lao động thật.
- [x] Gạch/gốm dùng xây lò bánh; gốm hỗ trợ sức chứa kho, lúa mì thô chưa tính là thức ăn.
- [x] Texture, danh mục, kho hàng và hướng dẫn chuỗi sản xuất.
- [x] Tiếp tục được bản lưu Đồ Đồng cũ, bổ sung đất sét mà không làm lại tài nguyên đang có.
- [x] Test kinh tế, trường hợp kho đầy/hết nguồn, build và test trực tiếp trình duyệt máy tính/điện thoại.

### Đợt đã hoàn thành: Đồ Đồng → Đồ Sắt

- [x] Điều kiện 25 dân, nghiên cứu Chữ viết/Khảo sát sắt, sản lượng và dự trữ; phí và tiến độ chủ động.
- [x] Nguồn sắt/than hữu hạn, mỏ/lò luyện, lanh/vải và nghiên cứu tương ứng.
- [x] Kiến trúc cấp 3 và hình ảnh Đồ Sắt trên bản đồ/danh mục/chi tiết.
- [x] Trạm trao đổi với thương nhân NPC, cư dân vận chuyển hai chiều, hàng nhập không tính là sản xuất.
- [x] Lưu/tải giữa tiến kỷ nguyên, nâng cấp và vận chuyển; kiểm thử luật và trình duyệt.

### Ưu tiên đề xuất sau đặc tả Era 0 (2026-10-05)

Đọc [bản tổng hợp Era 0/Faith](ERA0_INTEGRATION_PLAN.md). Nhịp sống và vòng định cư sơ khai đã triển khai cục bộ. Phạm vi tại [báo cáo đợt 1](ERA0_PHASE1_RESULT.md) và [báo cáo định cư](ERA0_PHASE2_RESULT.md); các mục còn lại làm trước tiền công nghiệp.

- [x] 1. Đồng hồ chung, đơn vị khẩu phần, ăn/nghỉ tự động, HP và lửa trại trung tâm; ngắt việc rồi tiếp tục đúng nhiệm vụ. Đồng hồ hiện có 10 bước/ngày; hoạt cảnh ăn 3 giây chưa bật.
- [x] 2A. Lều ba chỗ, bãi chứa, hàng hái lượm mang về kho, nhiên liệu/cảnh báo lửa, hướng dẫn năm bước và texture riêng; test làng 5/10/15 người và lượt chơi từ đảo mới.
- [x] 2B. Bến câu có mang cá về kho, bàn nghiên cứu với đường đi thật, sáu mốc Khởi nguyên và texture; giữ đường phát triển không bắt buộc Trưởng lão. Xem [luật/cân bằng và test](ERA0_OPENING_RESULT.md).
- [ ] 2C. Đối chiếu tiếp cầu sơ khai và các biến thể công trình còn lại; cầu hiện có vẫn cần Mộc và bảo quản.
- [x] 3A. STR/DEX/INT và tự nhận nghề khi rảnh, ưu tiên sinh tồn, khóa phân công tay, không lấy người xây/nghiên cứu/vận chuyển; UI, lưu/tải và test. Xem [kết quả nghề tự động](WORKFORCE_RESULT.md).
- [x] 3B. Tự nhận vị trí ở công trình/xưởng, quyền phân công tay, cảnh báo đình trệ, điều chỉnh vận chuyển và giữ tiến độ lẻ; test 5/15/25 dân và trình duyệt. Xem [kết quả](PRODUCTION_WORKFORCE_RESULT.md).
- [x] 3C. Mục tiêu dự trữ tùy chỉnh, ngưỡng tiếp tục 80%, bảng cảnh báo và nút tới công trình, lưu/tải/UI và test mục tiêu thấp/0/cao. Xem [kết quả điều hành](MANAGEMENT_RESULT.md).
- [x] 3C+. Đột kích nhỏ, dân tránh nguy hiểm, người bảo vệ, Khiên Thần, lưu/tải và test trình duyệt; xem [RAIDS_RESULT.md](RAIDS_RESULT.md).
- [ ] 3D. Tính cách ảnh hưởng nghề, ghim cảnh báo HUD, lịch sử kho và ưu tiên dây chuyền.
- [x] 4A. Túi vận chuyển 30 đơn vị, một ô công cụ, chế tạo rìu/cuốc/cần câu có người/phí/tiến độ, lấy/trả đồ, chọn tay/tự động và bảo toàn khi lưu/tải; không cộng trùng Công cụ đá. Xem [báo cáo trang bị](EQUIPMENT_RESULT.md).
- [x] 4B. Kho đầu vào/đầu ra xưởng, nghề vận chuyển tay/tự động, túi hàng chế biến, giao trực tiếp xưởng hoặc kho và bảo toàn khi ngắt/lưu; xem [báo cáo hậu cần](LOGISTICS_RESULT.md).
- [ ] 4C. Công cụ nâng cao/độ bền, kho làng tách riêng theo vị trí, thu hồi đồ và hậu cần công trường.
- [x] 5. Faith và Ban Phước cục bộ: công thức/trần, chi phí tăng theo cửa sổ, +50% rồi −50%, hồi chiêu/khóa kiệt sức, lưu/tải và UI; xem [báo cáo thần lực](FAITH_RESULT.md).
- [x] 5B. Thời tiết, cháy cụm cây giới hạn, dân dập và Cầu Mưa 40/60/+30% trong 45 giây; lưu/tải, icon riêng và test mô phỏng/trình duyệt. Xem [báo cáo thời tiết](WEATHER_RESULT.md).
- [ ] 6. Nguy hiểm/văn hóa và các phép có tác dụng tương ứng; intro có bỏ qua sau khi vòng chơi ổn.
- [ ] Mỗi đợt: test sinh tồn/kinh tế/bản lưu, hồi quy Đồ Đá → Đồ Đồng → Đồ Sắt và test trình duyệt máy tính/màn hình nhỏ.

### Lộ trình còn lại

- [x] Đất sét, gạch/gốm và chuỗi lúa mì (mở rộng Đồ Đồng).
- [x] Đồ Sắt: sắt, than, vải, giao thương NPC và vận chuyển hai chiều.
- [ ] Tiền công nghiệp Đồ Sắt: hơi nước, thép, điện nguyên mẫu và mở rộng mạng hậu cần (đã có vận chuyển xưởng cục bộ).
- [x] Hiện Đại đợt đầu: phí/5 ngày tiến cấp, thép/đồng/điện →linh kiện, nâng cấp nhà máy bằng sản phẩm (MODERN_FACTORY_RESULT.md).
- [ ] Hiện Đại mở rộng: cung ứng bền vững, dầu/viện nghiên cứu và chuỗi gameplay kế tiếp.
- [ ] Dị tượng: khảo sát, ba nhánh, biến thể và kiểm soát rủi ro.
- [ ] Faith và nghi lễ: thiết kế kinh tế riêng, không chặn tiến kỷ nguyên.
- [ ] Nối toàn bộ lệnh mới với chế độ online và lưu máy chủ dai dẳng.

## Kết quả kiểm thử

### Niềm tin và Ban Phước — 2026-10-05

Đã có Niềm tin từ trạng thái dân/đền, trần 300, khởi đầu 0; Ban Phước toàn bộ lao động tốn 50, tăng tốc 30 giây rồi kiệt sức 60 giây theo đặc tả. Có phí tăng theo 120 giây, chặn lặp, đồng hồ theo pause/×2, hào quang/mồ hôi và lưu thời hạn/hậu quả. Test so sánh sản xuất thật, công việc/chi phí/bản lưu qua. Trình duyệt tích điểm thật, dùng phép, tải giữa hai giai đoạn và hồi phục qua; đủ 5 dân, khoảng 196 thức ăn. Kiểm tra desktop/điện thoại, 79 icon và hồi quy sinh tồn/trang bị/hậu cần qua. Chi tiết/cân bằng tại [báo cáo](FAITH_RESULT.md).

### Hậu cần xưởng — 2026-10-05

Đã có kho đầu vào/thành phẩm riêng 60 đơn vị, chuyến 30 đơn vị, nghề vận chuyển tay/tự động và số hàng trên túi. Nguyên liệu/sản phẩm phải được giao tại nơi; đổi nghề, nghỉ, đường chặn, kho đầy và lưu/tải giữ hàng. Làng Đồ Đồng/Đồ Sắt đã chơi thật chạy thêm 40 ngày giữ đủ 12/25 dân, còn thức ăn và tiếp tục chế biến. Test trình duyệt giữa chuyến, bảng xưởng, màn hình nhỏ và các kiểm tra sinh tồn/trang bị/icon qua. Chi tiết, phạm vi và kết quả tại [báo cáo hậu cần](LOGISTICS_RESULT.md).

### Túi và công cụ cá nhân — 2026-10-05

Hoàn tất túi vận chuyển 30 đơn vị, một ô dụng cụ, rìu/cuốc/cần câu có phí vật liệu và năm bước làm tại kho. Cư dân đi lấy/trả đồ, chọn tay hoặc tự theo nghề; đổi việc giữ hàng đang mang, giao xong mới đổi dụng cụ. Bonus nghiên cứu/công cụ không cộng trùng; số lượng công cụ được kiểm tra khi tải bản lưu.

Lượt trình duyệt chế tạo đủ ba loại bằng tài nguyên thật, lấy rìu, đổi nghề khi mang gỗ, trả rìu/lấy cuốc, lưu/tải và hủy/hoàn vật liệu đều qua. Sau thêm mười ngày, ngày 67 vẫn đủ năm dân và khoảng 209 Food. Test luật công cụ, sinh tồn 5/10/15 người, kinh tế tới Đồ Sắt, icon, kỷ nguyên và desktop/điện thoại qua. Xem [báo cáo trang bị](EQUIPMENT_RESULT.md); ảnh/bản lưu tại `artifacts/equipment-*`.

### Nghề tự động và thuộc tính

Đã có tự nhận nghề, khóa tay, công tắc chung/từng người và STR/DEX/INT với bonus tối đa 20%. Làng 5/10/15 người tự phân công giữ đủ dân sau 30 ngày, có Food/gỗ/đá. Lượt trình duyệt đảo mới năm người tự sống 30 ngày, chuyển nghề tay/tự động, xây bàn/nghiên cứu và lưu/tải qua; ngày 44 còn đủ dân, khoảng 140 Food. Kiểm tra desktop/điện thoại, icon, luật sinh tồn/kinh tế tới Đồ Sắt và kiểu dữ liệu/build qua. Bản cũ giữ nghề tay và chỉ số trung tính. Xem [báo cáo](WORKFORCE_RESULT.md).

### Khởi nguyên — bến câu/bàn nghiên cứu

Hoàn tất hai công trình có texture riêng, đường đi nghiên cứu và vận chuyển cá; danh mục 25 loại. Lượt chơi trình duyệt từ đảo mới năm dân hoàn tất sáu mốc ngày 36 bằng tài nguyên tự kiếm, giữ đúng dữ liệu sau tải lại. Sau mười ngày tiếp theo vẫn đủ năm dân, khoảng 226 thức ăn và mười mẻ cá. Đã kiểm tra desktop/390×844, icon, luật kho/nguồn/đường chặn, dự án cũ và hồi quy kinh tế/giao diện tới Đồ Sắt. Test kiểu dữ liệu/build, sinh tồn và máy chủ localhost qua. Chi tiết/cân bằng/ảnh tại [báo cáo Khởi nguyên](ERA0_OPENING_RESULT.md).

### Định cư sơ khai — 2026-10-05

Lều/bãi chứa xây từ tài nguyên thật trước nghiên cứu; có chỗ ngủ giới hạn, vận chuyển hái lượm, trần kho riêng từng loại, củi và thời gian an toàn. Đã sửa kẹt người kiếm thực phẩm khi kho thảo dược đầy. Kiểm tra bảo toàn hàng/củi, đổi việc, đường chặn, kho đầy và lưu/tải qua. Làng 5/10/15 dân giữ đủ dân trong 30 ngày; đường kinh tế mới từ Đồ Đá tới Đồ Sắt qua.

Test trình duyệt từ đảo mới tám dân dựng được ba lều và bãi chứa trước nghiên cứu, ngủ tại lều, nhiên liệu/lưu-tải và bố cục điện thoại qua. Kiểm tra icon, sinh hoạt, kỷ nguyên, chuỗi kinh tế Đồ Đồng, nâng cấp và giao thương Đồ Sắt trên trình duyệt đều qua. Kiểm tra kiểu dữ liệu/build qua. Báo cáo, giới hạn và ảnh tại [kết quả định cư](ERA0_PHASE2_RESULT.md).

### Bộ biểu tượng riêng — 2026-10-05

Đã tạo và tích hợp 76 biểu tượng SVG riêng theo chất liệu giấy/gỗ, màu đất nung và xanh ngọc. Thay emoji trên HUD, các bảng, cây nghiên cứu và dấu trên bản đồ; sửa tiêu đề nhóm nghiên cứu khi chèn hình. Có trang trưng bày `web/icon-gallery.html` và [báo cáo bộ icon](GAME_ICON_SET.md).

Kiểm tra kiểu dữ liệu/build, test icon trình duyệt, test sinh hoạt cư dân và test kỷ nguyên trình duyệt đều qua. Ảnh máy tính/điện thoại lưu tại `artifacts/game-icons-*.png`; không có icon tải lỗi, emoji còn sót trên các tab đã kiểm tra hoặc tràn ngang.

### Cập nhật Era 0 — đợt 1

Đã hoàn thành bản cục bộ: lửa trại, ăn/ngủ theo ngày đêm, HP, ngắt khẩn cấp, chuyển đồ ăn từ kho vào phần mang theo, bữa tối cải thiện quan hệ và giữ nhiệm vụ/tiến độ khi nghỉ. Đã sửa bảng thông tin cư dân và tab Nghiên cứu bị dựng lại nút liên tục; đồng hồ hiện trên màn hình nhỏ.

Kiểm tra kiểu dữ liệu/build và test lao động/phiên mô phỏng/bản đồ/công trình/sinh vật/server đều qua. Test mới kiểm tra bảo toàn Food, ăn không lặp sau tải, đường về bị chặn, giữ mẻ sản xuất, hồi HP/chết đói, dân chưa đặt và làng 5/10/15 người trong 30 ngày. Đường kinh tế Đồ Đá → Đồ Đồng → Đồ Sắt đã qua khi bật nhịp sinh hoạt mới.

Test trình duyệt làng mới, phân công, công trình, tiến kỷ nguyên, kinh tế Đồ Đồng và Đồ Sắt/giao thương đều qua; kiểm tra máy tính và màn hình 390×844 không ghi nhận lỗi chạy. Test Đồ Đồng xác nhận nút nghiên cứu giữ nguyên qua nhiều bước khi nội dung không đổi. Ảnh/bản lưu và giới hạn tại [ERA0_PHASE1_RESULT.md](ERA0_PHASE1_RESULT.md).

**Bước kế tiếp hiện tại:** cân bằng đột kích qua chơi thử, rồi trang bị phòng vệ Đồ Đá và Khích Lệ. Đột kích nhỏ và Khiên Thần đã có; xem [kết quả](RAIDS_RESULT.md). Bảng điều hành, mục tiêu dự trữ tùy chỉnh và danh sách cảnh báo mở công trình đã có; xem [kết quả](MANAGEMENT_RESULT.md). Ghim từng cảnh báo trên HUD vẫn là mở rộng sau. Tự nhận vị trí ở công trình/xưởng và cảnh báo đình trệ đã triển khai; xem [kết quả](PRODUCTION_WORKFORCE_RESULT.md). Thời tiết, cháy rừng giới hạn và Cầu Mưa đã triển khai; xem [kết quả](WEATHER_RESULT.md). Niềm tin/Ban Phước và vận chuyển hàng chế biến giữa xưởng/kho đã có. Túi và công cụ sơ khai, nghề tự động và STR/DEX/INT đã có; trang bị nâng cao/độ bền, tính cách tác động nghề và cầu sơ khai còn nằm trong checklist. Nhân lực xưởng đã có phạm vi rõ trong báo cáo mới.

### Các đợt trước

Hoàn thành đợt đầu ngày 2026-10-05. Kiểm tra kiểu dữ liệu, build, các test lao động/phiên mô phỏng/bản đồ/sinh vật/công trình/server và giao diện nghiên cứu/xây dựng đều qua.

Test mới đi hết Đồ Đá → Đồ Đồng bằng sản xuất thật, kiểm tra nghiên cứu gián đoạn, lệnh trùng, nguồn quặng cạn, kho đầy, tải giữa tiến trình và bản lưu cũ. Trình duyệt kiểm tra tiến cấp, nghiên cứu, nâng cấp, đặt xưởng gỗ/sản xuất, lưu/tải và thêm dân sau tải trên máy tính và màn hình 390 × 844; không ghi nhận lỗi chạy trong lượt kiểm tra.

Xem [báo cáo hai đợt đầu](ERA_IMPLEMENTATION_RESULT.md) và [báo cáo Đồ Sắt](IRON_IMPLEMENTATION_RESULT.md). Hiện Đại, Dị Tượng và kinh tế niềm tin chưa triển khai; còn trong các đợt sau ở trên. Dữ liệu lưu hiện nằm trong trình duyệt, chưa phải lưu server dai dẳng.

Đợt mở rộng Đồ Đồng cũng đã hoàn thành: hai nghiên cứu, năm công trình mới, bốn loại hàng mới và bánh nhập kho thức ăn; tổng cộng 15 loại công trình/90 texture. Test kinh tế đi từ bản Đồ Đồng đã chơi thật, không cấp thêm vật tư hay công nghệ cho luồng sản xuất. Test kiểm tra chính xác đầu vào/đầu ra, dùng vật liệu xây dựng một lần, kho đầy, thiếu nhiên liệu, mỏ cạn, lúa mì không tính thành thức ăn, và bản lưu cũ.

Test trình duyệt mới đã qua: nghiên cứu hai công nghệ, đặt và vận hành hố đất sét, xem năm công trình sản xuất, xây thêm lò bánh với gạch/gốm, lưu/tải, giao diện máy tính và 390 × 844, không ghi nhận lỗi chạy. Test hồi quy lao động/phiên mô phỏng/bản đồ/sinh vật/công trình cùng các lượt giao diện cũ đều qua.

Đợt Đồ Sắt đã hoàn thành ngày 2026-10-05: điều kiện tiến cấp, sáu công trình mới, năm hàng mới, nghiên cứu, kiến trúc cấp 3 và chuyến giao thương NPC. Tổng danh mục hiện có 21 loại công trình/189 texture. Test mô phỏng đi từ bản Đồ Đồng thật, đón thêm dân có trả phí lên 25, rồi sản xuất/nâng cấp/giao thương; không cấp miễn phí hàng hay nghiên cứu trong luồng chính. Các trường hợp nguồn cạn, thiếu nhiên liệu, kho đầy, lệnh trùng, đường chặn và hoàn hàng đều qua.

Test trình duyệt Đồ Sắt đã qua: điều kiện/phí, tiếp tục tiến cấp 0/30, nghiên cứu/lưu, nâng nhà cấp 3, đặt chuyến/vận chuyển/tải giữa chuyến/giao hàng/hủy và giao diện máy tính/390 × 844. Không ghi nhận lỗi chạy. Test hồi quy lao động, phiên mô phỏng, bản đồ, sinh vật, công trình, server và bốn luồng giao diện trước đó đều qua. Bước kế tiếp: tiền công nghiệp Đồ Sắt để chuẩn bị điều kiện lên Hiện Đại; mạng kho nội bộ vẫn chưa triển khai.
