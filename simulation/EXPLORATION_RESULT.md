# Khám phá Đồ Đá — kết quả đợt 08/10/2026

> Đợt tiếp đã bổ sung tuần tra tự động/điểm khám phá/cảnh báo; xem [PATROL_DISCOVERY_RESULT.md](PATROL_DISCOVERY_RESULT.md). Các số liệu dưới đây giữ riêng cho lượt thử vòng đầu.

Đã triển khai vòng đầu: sương mù, lệnh đặt mốc khám phá, đuốc chế tạo thật và nhiệm vụ mở đầu. Giữ đồng hồ hiện tại; chưa đổi sang 120 giây/ngày.

## Cách chơi

Mở Nhiệm vụ → Khám phá quanh làng, chọn một người trưởng thành đã giao xong hàng, không trực công trình/bảo vệ/chăm sóc. Có thể vào từ nút Khám phá/đuốc trong hồ sơ cư dân.

Chế đuốc tốn 1 gỗ đã giao kho và 2 nhịp làm tại kho/lửa trại; sau đó chọn Lấy đuốc để cư dân đi tới nhận. Đặt mốc trên đất xa lửa trại ít nhất 6 ô. Esc hủy thao tác đặt mốc; Gọi về yêu cầu đi bộ về, không dịch chuyển người.

Người đi tự về khi trời tối (từ 18:00), đói/mệt hoặc sức khỏe thấp; ăn/ngủ vẫn ưu tiên. Chỉ một chuyến khám phá hoặc một đơn đuốc tại một thời điểm. Tiến độ công việc cũ và nghề được giữ, đường tới công việc được tính lại khi quay về. Đường bị chặn giữ chuyến và báo lý do; mở lại lối về để tiếp tục.

## Sương mù và đuốc

Vùng đã khám phá được lưu; vùng ngoài tầm nhìn hiện tại được làm tối, vùng chưa biết bị che cả bản đồ chính/minimap. Tầm nhìn: 4 ô ban ngày, 2 ô lúc tối; đuốc có nhiên liệu là 6 ô. Tầm nhìn hiện là bán kính tròn, chưa có địa hình che khuất hoặc bonus đồi cao.

Đuốc có 30 nhiên liệu, hao 1 mỗi nhịp ban đêm khi mang. Đuốc có phụ kiện chibi và icon riêng, có thể mang cùng công cụ/giáo. Lấy/trả tại kho giữ đúng nhiên liệu; không lấy lại được đuốc đầy miễn phí. Đuốc cạn có thể tiếp bằng 1 gỗ tại kho. Hủy đơn chế hoàn đúng 1 gỗ một lần; kho đầy giữ đơn tới khi có chỗ hoàn.

Nguồn chưa biết không được dùng làm mục tiêu lao động mới hoặc xây công trình ở vùng chưa khám phá. Các dân thường cũng mở tầm nhìn nơi họ thực sự đi tới; chưa có nghề tuần tra/trinh sát tự động riêng.

Đảo mới bắt đầu với sương mù. Bản lưu cũ không có dữ liệu khám phá giữ toàn bộ bản đồ đã biết, không bị che lại hoặc mất tiến trình; chuyến đầu thay mục tiêu mở đất bằng tới một vùng xa làng.

## Một lượt chơi thử trên trình duyệt

Seed20810, bản đồ50×35, 8 cư dân. Chuẩn bị từ 0 gỗ/0 đá và 40Food khởi đầu như game; gỗ được khai thác và mang về thật. Không cấp vật tư hoàn thành hay tự đánh dấu nhiệm vụ.

Trong browser riêng: chọn người → trả đúng 1 gỗ chế đuốc → tới kho lấy → đặt mốc bằng click bản đồ → đi thực tế → mở vùng/tìm nguồn → trở về. Lưu/tải lúc đang đi giữ đúng chuyến và vùng đã mở.

- 8 người còn sống; hoàn thành 3/3 mục tiêu.
- Số ô đã biết tăng143→238 (95 ô địa hình tổng cộng; báo cáo người đi ghi86 ô đất mới).
- Chỉ chế1đuốc; nhiên liệu25→15 trong đoạn tiếp tục tới ban đêm.
- Food cuối lượt hoàn thành163,8, từ lao động/sinh hoạt thật; nhiệm vụ không cộng vật tư thưởng.
- Desktop/mobile không tràn ngang; không lỗi trang hoặc tải tài nguyên.

Bằng chứng: exploration-browser-result.json, exploration-browser-ready-save.json, exploration-midtrip-save.json, exploration-played-save.json; ảnh exploration-midtrip-world.png, exploration-complete-desktop.png, exploration-mobile.png trong artifacts.

## Các kiểm tra bổ sung

test:exploration: chuẩn bị kiếm/giao/trả vật tư thật; fixture riêng kiểm tra lấy-trả nhiên liệu, ngày/đêm, đói ngắt chuyến, chặn đường, giữ tiến độ việc cũ, lưu sai nhiên liệu bị từ chối, hủy/hoàn đúng một lần và đơn đuốc có người chết vẫn tải/hủy được. Những tình huống dựng riêng này không được tính là diễn biến của lượt chơi thật.

test:equipment và test:session qua; test-three-branches-save qua13checkpoint đã có, không sửa bản gốc. Kiểm tra browser bản cuối tải giữa chuyến, mục tiêu3/3/mobile và bản Hightech cũ50người: giữ bản đồ đã biết, số dư vật tư giữ nguyên; loại hàng chưa có trong schema cũ chỉ được thêm với số0 như cơ chế tải trước đó. Kiểu dữ liệu và build508,0KB qua; bộ icon hiện95món.

Browser ban đầu bị sandbox chặn thư mục tạm; phiên thử riêng được chạy với quyền cho phép, dùng thư mục tạmD để tránh đầy ổC. Không nhập checkpoint thử vào bản lưu người dùng.

## Chưa làm trong đợt này

Chưa ba đảo/Mộc/Krock, thủy triều, hội thoại sáu hồi, tuần tra tự động, thú dữ, gió dẫn lối, bonus độ cao hoặc nhịp120giây/ngày. Đây là vòng khám phá đầu tiên của thiết kế Master, không phải toàn bộ Era0 đã hoàn thành.
