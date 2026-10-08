# Bãi cạn Răng Nanh — vòng đầu 08/10/2026

> Cập nhật sau đợt này: đã đổi nhịp120giây/ngày và đồng hồ chạy liên tục; xem [WORLD_TIME_RESULT.md](WORLD_TIME_RESULT.md). Câu “chưa120giây/ngày” dưới đây ghi thời điểm nghiệm thu tuyến bãi cạn trước khi đổi đồng hồ.

Đã nối tuyến khảo sát Thiên Nguyên–Răng Nanh bằng đường bãi cạn thật. Đường lộ 09:00–15:00, nước lên đóng đường. Đồng hồ hiện vẫn 10 nhịp/ngày; lịch được xét trên giờ chung và các nhịp mô phỏng, chưa chuyển sang 120 giây/ngày của Master.

## Cách chơi

Chọn thế giới **Ba đảo** (thế giới Ba đảo đã lưu cũng dùng được), định cư trên Thiên Nguyên. Vào **Nhiệm vụ → Bãi cạn Răng Nanh**, chọn người trưởng thành rảnh, khỏe/đã ăn-nghỉ; nên chế/lấy đuốc hoặc chuẩn bị giáo. Chọn **Khảo sát bờ Răng Nanh · mang 20 thức ăn**. Có nút **Xem bãi cạn** chỉ đổi camera.

Chuyến giữ 20 thức ăn đã kiếm/giao về kho; cư dân tới lửa trại lấy hành trang rồi đi tới bờ. Chỉ xuống bãi khi đủ thời gian tới bờ đối diện trước 15h. Khứ hồi cần hai đợt nước rút; người chờ/nghỉ trên đất, ăn từ hành trang thật, không ăn từ kho xa. Người khảo sát mỏ gần bờ, thu tối đa 3 đá, trừ đúng nguồn; hàng giữ theo chuyến và chỉ cộng kho sau khi đi bộ về làng. Thức ăn dư được trả tại làng.

**Gọi về an toàn** không xóa người/hàng hoặc dịch chuyển qua biển: trên đảo chính quay về làng; ở giữa bãi đi hết tới bờ, từ Răng Nanh chờ đợt nước rút rồi về. Không thu phí thêm khi gọi về. Kho đầy giữ phần chưa giao, mở chỗ kho rồi tiếp tục; không cộng thưởng lặp. Đường bị sửa/chặn giữ chuyến, cần khôi phục lối — không xuyên nước hoặc dịch chuyển. Việc ăn/ngủ/chế tạo và phân công không kéo trinh sát sang công việc khác; nghề và tiến độ cũ giữ nguyên. Thú trên đoạn đường bộ vẫn cảnh báo/gây thương tích, đuốc xua sói; gặp nguy hiểm dừng thu đá và trở về.

Bãi cạn có lớp cát/đá vẽ riêng, màu nước khi ngập, sương mù giữ vùng chưa thấy. HUD báo trạng thái và thời gian đóng/mở; điện thoại đã kiểm tra nút/chữ/không tràn ngang.

## Bằng chứng

- [Mô phỏng và các vị trí từng nhịp](artifacts/tides-core-result.json): 30 bản đồ/3 kích thước có tuyến nối thật khi nước rút, không đường xuyên biển khi nước lên. Lượt kiếm hàng từ checkpoint Ba đảo thật: **22 nhịp chuyến, 8 người sống, Food130,4**, trừ đúng 3 đá từ mỏ Răng Nanh, đi bộ qua/lại, chờ triều, lưu giữa bãi và giữ công việc. Trước chuyến đã trả gỗ thật để chế/lấy đuốc; không cấp miễn phí vật tư.
- [Kết quả trình duyệt](artifacts/tides-browser-result.json): thao tác công khai trả20Food, đi/chờ/thu đá/về giao, lưu-tải giữa bãi, gọi về, mobile; **8 người sống, Food116,24**, không lỗi JavaScript hoặc tải tài nguyên. Đây là lượt tiếp diễn riêng từ checkpoint đã kiếm hàng, không cộng hàng/proof giữa hai lượt.
- Fixture độc lập: thiếu19Food không nhận phí; bắt đầu13:12 khi cần2nhịp phải chờ; kho đầy giữ khoản rồi giao đúng một lần; đường nước bị sửa giữ vị trí/hành trang và đi tiếp sau khôi phục; bản lưu hành trang>20 hoặc tuyến không liên tục bị từ chối. Fixture không được coi là vật tư/chuyến kiếm thật.
- Hồi quy: `test:session`, `test:wildlife`, `test:three-branches-save` (13 checkpoint cũ chỉ đọc) qua. Kiểm tra kiểu và build qua; bản build cuối550,1KB. Không cài phụ thuộc, publish hoặc thay bản lưu người dùng.

## Ảnh và điểm tiếp tục

- [Xem trước hành trang](artifacts/tides-preview-desktop.png).
- [Cư dân chibi thật giữa bãi, đang mang đá về](artifacts/tides-crossing-world.png).
- [Đã trở về/giao hàng](artifacts/tides-returned-desktop.png).
- [Giao diện điện thoại](artifacts/tides-mobile.png).
- [Checkpoint sẵn sàng — vật tư kiếm thật/đuốc đã chế](artifacts/tides-ready-save.json).
- [Lưu mô phỏng giữa đường](artifacts/tides-midcrossing-save.json).
- [Lưu browser giữa đường về — tick122, người ở35,26](artifacts/tides-browser-midcrossing-save.json).
- [Lượt mô phỏng hoàn tất](artifacts/tides-played-save.json).
- [Lượt browser hoàn tất](artifacts/tides-browser-played-save.json).

## Phạm vi còn lại

Đây là tuyến **trinh sát bờ Răng Nanh**; công nhân thường chưa tự dùng bãi cạn, tránh tự chọn nguồn ở đảo khác rồi mắc nước lên. Địa hình/nguồn gốc giữ nguyên khi nước đổi, tuyến là lớp riêng có lưu. Các kiểu thế giới cũ không tự thêm bãi cạn.

Chưa giao thương/đột kích qua bãi, khai thác định kỳ bởi đội công nhân, đường thuyền tới Thần Ngư, Mộc/Krock/chủ quyền/ngoại giao hoặc tutorial sáu hồi. Bước sau hợp lý là dựng Krock và một chuyến giao tiếp/giao hàng có nguồn, phí và hành trình thật trên tuyến đã kiểm tra.
