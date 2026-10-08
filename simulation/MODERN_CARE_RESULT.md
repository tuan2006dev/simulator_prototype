# Y tế Hiện Đại — xưởng thuốc và phòng khám

Đợt 06/10/2026, tiếp từ care-industry-stable-save.json earned. Không thay save người dùng, không cộng vật tư giữa hai nhánh; lượt này giữ nhánh Linh Mạch đã chốt. Y tế mới có chặng chăm sóc thương tích, không phải toàn bộ hệ bệnh viện/bệnh truyền nhiễm.

## Gameplay đã nối

- Nghiên cứu Y tế cộng đồng: cần herbalism và industrial_assembly, Hiện Đại trở lên; trả 4 linh kiện + 6 vải và 15 gỗ/10 đá/20 thức ăn/5 thảo dược; có người nghiên cứu/thời gian thật.
- Xưởng thuốc: 20 gỗ/10 đá/15 thức ăn + 3 linh kiện/4 vải, công trình và texture riêng. Thợ tại chỗ, 2 công suất; 2 thảo dược + 1 vải → 1 thuốc băng bó. Nguyên liệu và thành phẩm được vận chuyển thật.
- Phòng khám: 25 gỗ/10 đá/15 thức ăn + 3 linh kiện/4 đá xây/4 vải, texture riêng; một người chữa trưởng thành tại chỗ và 2 công suất. Bệnh nhân đi tới cơ sở; một liệu trình dùng 1 thuốc đã giao tới phòng khám, 5 bước chăm sóc, +8HP/bước tới tối đa100. Nhận cả trẻ em; mỗi cơ sở chỉ chăm sóc một người trong mỗi nhịp. Không chữa từ xa khi bệnh nhân vừa rời nơi do tránh hiểm.
- Trong Quân sự có chọn phòng khám, đăng ký/hủy, tiến độ/lý do chờ/tồn thuốc cập nhật trực tiếp. Công trình và điện hiện rõ trong bảng xây dựng/điều phối. Hiện một cấp, không hiển thị phí nâng cấp giả.
- Ăn/ngủ, người chữa vắng hoặc mất điện giữ liệu trình. Dùng thuốc một lần, lưu/tải giữa chừng không trả phí lại; hủy sau dùng không hoàn thuốc. Người có lịch khám không được đồng thời nhận nghiên cứu/chuyến khảo sát/chế tạo phòng vệ mới.
- Cân bằng nghỉ thường: +2HP/bước nghỉ khi đã ăn đủ, hồi tới90%; sức khỏe đang trên90 không bị kéo xuống. Trước đây một bước ngủ hồi12–16HP tới100, khiến thuốc thường không kịp dùng. Phòng khám chữa tới100; nghỉ vẫn cứu người yếu tới mức trở lại lao động.

## Lượt vật tư earned

artifacts/clinic-played-save.json: từ checkpoint công nghiệp ổn định, thu thêm đá, 6 chuyến than trả48vải thật, trả nghiên cứu và xây hai cơ sở, cấp điện/chế/giao 6 thuốc. Tổng951bước,50người sống, Food1811,4. Thuốc kho3/tại phòng khám3; linh kiện0/vải446/than36. Máy và thợ vẫn giữ trong checkpoint để tiếp tục test; nên tắt cơ sở khi chưa cần để giữ than và trả thợ xưởng về food nếu đủ thuốc.

artifacts/clinic-production-ready-save.json là trước mẻ thuốc, dùng kiểm tra live. Không dùng clinic-waiting-save.json của lần thử thiếu than. Chưa tuyên bố có thương tích/trẻ em mới sinh tự nhiên trong lượt sản xuất; không dùng fixture thay chứng cứ earned.

## Test và bằng chứng

- test:clinic: sản xuất/giao6thuốc, phí nghiên cứu/xây thật,50sống; fixture trẻ12tuổi/60HP có vị trí và nhu cầu kiểm soát, dùng thuốc kiếm được từ lượt trên. Đúng1thuốc/5bước/+40HP, người chữa đi xa không chữa, mất điện giữ liều/tiến độ; lưu giữa liệu trình; từ chối timer sai và lịch đã dùng thiếu ghi nhận liều.
- test:clinic-ui: Edge riêng, thao tác hủy/đăng ký/lưu/tải, live chế thuốc và chăm sóc trẻ, tắt điện giữa liệu trình/lưu/tải/bật lại không trừ hai lần, mobile390px/không tràn ngang/không lỗi trình duyệt/50sống. Trẻ trong test là fixture, không nhận là sinh con hoặc bệnh tự nhiên.
- test:daily-life: nghỉ hồi chậm/giới hạn90, thoát nghỉ khẩn cấp khi ổn, ăn và công việc ngắt/lưu/tải, làng5/10/15dân30ngày qua. test:raid-stability:5/15/25dân150ngày/4đợt/12tải mỗi lượt qua. care/equipment/session/anomaly-save và kiểm tra kiểu dữ liệu qua.
- 38 công trình/342 texture và91icon riêng. Bản dựng cuối khoảng443,7KB.
- Ảnh artifacts/clinic-production-desktop.png, clinic-building-desktop.png, clinic-child-care-desktop.png, clinic-mobile.png. Đã xem desktop/mobile, sửa trạng thái phòng khám, phản hồi lịch khám và phần nâng cấp rồi chạy lại.

## Phần còn thiếu và bước tiếp

Chưa có bệnh lây, chẩn đoán, vaccine, bệnh viện nâng cấp, vận tải/dầu/hạt nhân hoặc toàn bộ y tế Hiện Đại. Chăm sóc hiện đăng ký thủ công; chưa có chính sách tự đưa bệnh nhân, chuỗi bác sĩ chuyên môn hay đánh giá cân bằng nhiều seed từ đầu.

Tiếp ưu tiên kinh tế Quỷ Dị ở lượt thay thế thứ ba từ analysis-played-save.json theo thiết kế: nền tảng mới → nguồn di tích → vật liệu hữu cơ → công trình tiêu thật/an toàn/cách ly. Giữ các nhánh Hightech/Mystic đã chốt riêng, không ghép hàng/proof. Chưa mở Quỷ Dị hoặc tự biến đổi dân. Hạn03:27ngày07/10; từ02:57 chỉ sửa lỗi/kiểm tra bàn giao.
