# Biến thể Công Nghệ Cao: hỗ trợ tự nguyện vòng đầu

Đã chạy/test vòng lắp–sử dụng–bảo dưỡng–gỡ–lắp lại cho một người trưởng thành. Đây là thiết bị hỗ trợ nhỏ, chưa phải toàn bộ Cyborg/hạt nhân/endgame. Linh Mạch và Quỷ Dị chưa có biến thể cư dân trong đợt này.

## Cơ chế đã có

- Nghiên cứu Thiết bị hỗ trợ tự nguyện: cần nhánh Công Nghệ Cao đã chốt, Điều khiển công nghiệp; trả 1 vi mạch + 3 linh kiện và chi phí cơ bản/thời gian nghiên cứu.
- Lắp: 1 vi mạch + 2 linh kiện, 10 nhịp cư dân và thợ tại viện có 2 công suất. Sẵn sàng/đồng ý được mô phỏng qua người lớn, HP≥80, đói/mệt<80, sợ<60, trung thành≥−20 và can đảm≥−30. Trẻ không được đăng ký. Khi không còn sẵn sàng, giữ tiến độ và có thể hủy.
- Vòng tay và đầu nối nhỏ trên hình chibi; phụ kiện đi theo chuyển động tay, nhiều hướng/tư thế. Chỉ người được đăng ký thay hình. Giữ tên/nghề/thuộc tính/tính cách/quan hệ; tuổi vẫn tăng tự nhiên trong mô phỏng.
- +15% tiến độ công nghiệp cho thợ làm thực ở xưởng đủ nguyên liệu/chỗ thành phẩm/điện. Công thức tiêu đủ đầu vào, không tặng hàng, không tăng sản lượng ăn hoặc quân lực.
- 100 lượt hỗ trợ cho công việc công nghiệp thực. Đi lại, ngủ, thiếu đầu vào, kho thành phẩm đầy, tắt điện không tiêu lượt. Hết bảo dưỡng chỉ ngừng lợi ích, không gây chết.
- Bảo dưỡng: 1 linh kiện/4 nhịp tại viện, chỉ khi còn≤80 lượt. Gỡ: miễn phí/5 nhịp tại viện. Dừng điện/vắng người/ăn-ngủ giữ tiến độ. Hủy hoàn vật tư một lần; kho đầy giữ khoản đã giữ, hủy bảo dưỡng không nạp lại lượt miễn phí.
- Lưu/tải và chống yêu cầu lặp; chặn phân công bảo vệ/viện/nghiên cứu/chế công cụ chồng lên người đang xử lý. Nghề, hàng đang giữ và việc cũ tạm dừng.
- Có xem trước từng người, phí/thời gian/giới hạn, bảo dưỡng/gỡ; truy cập từ tab Dân cư sang Nhiệm vụ. Người đã hỗ trợ đứng đầu danh sách; số sau tên giúp phân biệt người trùng tên.
- Xưởng vi mạch chỉ đặt một mẻ đầu vào (2 linh kiện/1 đồng), thay vì giữ ba mẻ. Không thu hồi hay cấp lại vật tư đã nằm tại xưởng. Mục đích là tránh khóa hết linh kiện kho dùng cho việc chăm sóc/nghiên cứu.

## Lượt kiếm hàng và trả phí thật

Đọc bản Hightech gốc artifacts/anomaly-played-save.json, xuất checkpoint augmentation-* mới; không sửa ba save nhánh gốc và không ghép hàng.

- 6 chuyến nhập than trả 48 vải, sản xuất/giao 3 vi mạch mới từ đầu vào thật.
- Trả phí nghiên cứu, lắp; kiểm tra hủy/hoàn và lắp lại; làm đủ 100 lượt công nghiệp (chế 92 ván gỗ), bảo dưỡng 1 linh kiện, gỡ miễn phí rồi lắp lại.
- Tổng 931 bước, 50 người sống; Food từ742,4, mức thấp theo theo dõi618,4, cuối1735,4. Không có cấp tài nguyên miễn phí trong lượt này.
- artifacts/augmentation-played-save.json: Bảo#16 còn100 lượt; kho0 linh kiện/0 vi mạch/3 thép/53 than/374 vải/1 đồng. Viện/máy phát vẫn bật ở checkpoint cuối; nên tắt khi chưa có nhu cầu xử lý tiếp.
- Các mốc: augmentation-ready, paused, equipped, empty, serviced, removed, played. Không dùng augmentation-waiting-save.json của lần thử thiếu nhiên liệu.

## Bằng chứng kiểm tra

- test:augmentation qua: phí/replay/refund/outage/save, nguyên vẹn danh tính/thuộc tính, thực sự cạn100 lượt/bảo dưỡng/gỡ/lắp lại.
- Fixture riêng: so sánh cùng80 lượt ở nhà máy có/không thiết bị; có thêm mẻ và tiêu đúng2 thép/mẻ. Đầu vào40 thép/40 đồng là fixture, không tính vào lượt earned. Hết điện/bị chặn/thiếu hàng/đầy60 thành phẩm giữ lượt; dữ liệu lượt101/trẻ/sợ cao bị từ chối; hoàn phí bảo dưỡng khi kho đầy giữ khoản, hủy không nạp lượt.
- test:augmentation-ui qua: thao tác công khai xem trước/trả phí/pause/tải/hủy, bật điện và chạy lắp thật một người, làm ván gỗ/tiêu bảo dưỡng, bảo dưỡng/gỡ qua nút, điện thoại/no errors/no overflow.
- test-augmentation-texture-ui.ts xác nhận sprite vòng tay được vẽ thật qua canvas game, không chỉ ảnh chân dung.
- test:microchips-ui qua với định mức đầu vào mới: chế vi mạch thật, phí nghiên cứu4 vi mạch/tải/điều khiển/bật-tắt/mobile.
- test:three-branches-save (13 checkpoint chỉ đọc), test:session, test:equipment, kiểm tra kiểu dữ liệu và build qua; game.js477,0KB.
- Ảnh đã xem: augmentation-equipped-desktop.png, augmentation-mobile.png, augmentation-world-desktop.png, augmentation-texture-in-game.png. Các ảnh khác: augmentation-preview-desktop.png, augmentation-working-desktop.png, augmentation-empty-mobile.png.

## Tiếp theo

Biến thể Linh Mạch trên artifacts/mystic-played-save.json riêng: tinh luyện/chuyển hàng thật trước phí, có lợi ích/chăm sóc/đường gỡ và hình chibi riêng. Sau đó Quỷ Dị tương ứng nếu đủ thời gian. Chưa nhận hai biến thể này hoặc toàn bộ nhân loại chuyển dạng đã xong. Giữ thời hạn03:27 ngày07/10; từ02:57 chỉ sửa lỗi và kiểm tra bàn giao.
