# Era 0 — vòng định cư sơ khai

Triển khai cục bộ ngày 2026-10-05, tiếp nối nhịp ăn/ngủ và bộ icon riêng. Phạm vi lần này: lều, bãi chứa, vận chuyển hàng hái lượm, nhiên liệu lửa và hướng dẫn mở đầu.

## Luật đang chạy

- **Lều sơ khai:** 8 gỗ, không tốn Food, không cần nghiên cứu; cần phân công thợ xây. Có đúng ba chỗ ngủ. Nhà ở có năm chỗ/cấp; công trình chưa hoàn thành không có chỗ. Chỉ nhận nơi ngủ có đường đi, ưu tiên trẻ nhỏ và không cấp trùng chỗ. Ngủ tại chỗ được phân hồi 18 điểm nghỉ/bước, ngoài trời hồi 6; hồi HP tương ứng 16/6 khi không đói. Dân thiếu chỗ vẫn sống được, không bị khóa vào việc dựng lều.
- **Bãi chứa sơ khai:** 6 gỗ + 2 đá, không cần nghiên cứu; cần thợ xây. Thêm 100 sức chứa cho từng loại thức ăn/gỗ/đá/thảo dược và thêm điểm giao hàng. Nền ban đầu có 300 chỗ mỗi loại; kho lương thêm 400/cấp. Không xóa vật tư đã có ở bản lưu cũ nếu vượt trần; chờ có chỗ mới nhận thêm. Lều/bãi chứa có một cấp, về sau xây nhà/kho phát triển riêng, không cộng khả năng hai lần.
- **Hàng hái lượm:** lấy từ nguồn hữu hạn thật, nằm ở người mang trước khi về điểm giao; chưa được cộng vào kho. Giới hạn 30 đơn vị tổng. Giữ hàng khi ăn, nghỉ, đổi ưu tiên, phân công xây hoặc tải lại. Không nhận lệnh khai thác mới khi đang mang hàng. Kho đầy hoặc đường bị chặn thì giữ hàng, ghi rõ lý do. Gỗ/đá/thảo dược đang chờ về chiếm phần sức chứa dự kiến để khai thác mới không lấy mất chỗ của chúng.
- **Thức ăn và thảo dược đi kèm:** kho thảo dược đầy thì ngừng thu phần thảo dược mới; vẫn thu được thức ăn. Không bỏ hàng đã lấy để giải phóng người. Đã thêm kiểm tra riêng cho trường hợp này sau khi phát hiện nó có thể làm làng thiếu ăn ở giai đoạn Đồ Sắt.
- **Lửa trại:** miễn tiêu hao trong 30 bước đầu sau khi đặt lửa, tương đương ba ngày. Sau đó mỗi bước đêm tiêu một củi, bốn củi/đêm; dự trữ tối đa 12. Một củi trả đủ cho bước đêm đó. Khi còn ≤4, người trưởng thành rảnh tự đi tiếp củi vào ban ngày, ưu tiên người kiếm gỗ; không lấy người đang xây, nghiên cứu, giao thương hay mang hàng. Trừ gỗ và cộng củi cùng lúc khi đến lửa; không đốt hai lần cùng bước. Lửa tắt có cảnh báo, hình mờ và ảnh hưởng nhẹ đến cảm giác an toàn, chưa gây sát thương rét.
- **Cân bằng lao động:** một mẻ hái lượm cần năm bước làm tại nguồn, sau đó có đường về và giao hàng. Bản định cư mới cho 16 thức ăn, 10 gỗ hoặc 4 đá/mẻ trước bonus công cụ, bù thời gian vận chuyển và nhiên liệu để làng năm người vẫn có gỗ dựng lều. Đây là sản lượng/mẻ, không phải cam kết mỗi ngày. Luật cũ vẫn giữ số cũ khi chưa bật định cư.
- **Giao diện:** có số chỗ ngủ, trạng thái/củi lửa, hàng đang mang trong bảng cư dân, sức chứa vật liệu và số người đang ngủ ở mỗi lều/nhà. Có texture riêng cho hai công trình; tổng danh mục hiện là 23 loại. Sửa hiển thị nút tạm dừng bị lượt cập nhật nút tốc độ ghi đè.
- **Hướng dẫn:** đặt dân → chia người kiếm thực phẩm/vật liệu → dựng lều → dựng bãi chứa → đủ chỗ ngủ/củi → nghiên cứu và phát triển Đồ Đá. Tiến độ hướng dẫn dựa trên công trình/tài nguyên thật.

## Lưu/tải và phạm vi

Giữ khóa/bản lưu phiên bản 5. Thêm trường định cư, hàng mang theo, fuel/grace/lastBurnTick và chỗ ngủ; kiểm tra số âm, giới hạn hàng/củi và thời điểm không hợp lệ. Bản cũ chưa có cơ chế nhiên liệu được ba ngày chuẩn bị khi chuyển lần đầu; tải lại không gia hạn nếu đã có thời hạn. Không tự biến nhà/kho cũ thành lều/bãi chứa hoặc cấp thêm gỗ.

Đây là vận chuyển **hái lượm và lệnh khai thác ngoài bản đồ**. Sản xuất tại nông trại/xưởng vẫn dùng cơ chế mẻ/kho chung hiện có; vận chuyển thành phẩm giữa các xưởng, bốn ô túi/trang bị và điểm chứa riêng cho từng kho thuộc đợt hậu cần tiếp theo. Hàng của người chết vẫn nằm trong dữ liệu của người đó, không tự cộng vào kho từ xa; nhặt lại hàng sau khi chết chưa triển khai. Bến câu, bàn nghiên cứu như một công trình, thời tiết/rét/thú dữ và Faith đầy đủ cũng chưa nằm trong đợt này.

## Kiểm tra

- `test:settlement`: giường có giới hạn/đường đi, xây thật và phí, bảo toàn hàng, đổi việc/tải lại giữa chuyến, kho đầy/đường chặn, củi/grace/lặp bước, không lấy thợ/người nghiên cứu và thảo dược đầy không chặn thức ăn.
- Làng 5/10/15 người chạy 30 ngày với thực phẩm, gỗ, đá và nhiên liệu thật. Cả ba làng giữ đủ dân, Food không âm/không vượt sức chứa; làng năm người còn gỗ để xây.
- `test:settlement-ui`: đảo mới tám người, tự khai thác và dựng ba lều + bãi chứa trước mọi nghiên cứu; kiểm tra ngủ, nhiên liệu, lưu/tải, hình ảnh và máy tính/điện thoại. Bản chơi lưu ở `artifacts/settlement-played-save.json`; ảnh ở `artifacts/settlement-*.png`.
- Hồi quy kinh tế Đồ Đá → Đồ Đồng → Đồ Sắt khi bật cả sinh hoạt và định cư mới; kiểm tra riêng lao động, công trình, sinh vật, bản lưu, nâng cấp và giao thương.
- Kiểm tra kiểu dữ liệu/build qua. Test trình duyệt định cư, sinh hoạt, 76 icon, chuyển Đồ Đá → Đồ Đồng, kinh tế Đồ Đồng và chuyển/giao thương Đồ Sắt đều qua, không có lỗi chạy hoặc tràn ngang trong các màn hình đã kiểm tra.

Bước tiếp theo trong Era 0: bến câu/bàn nghiên cứu và thiết kế thuộc tính/tự phân công; sau đó nối hậu cần đầy đủ trước khi mở Faith và tiền công nghiệp.
