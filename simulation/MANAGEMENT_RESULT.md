# Điều hành làng và mục tiêu dự trữ — 2026-10-05

## Đã triển khai

Nút **Điều hành** ở thanh bên mở bảng mục tiêu và danh sách công trình cần xử lý. Bảng Tài nguyên trước đó trùng lộ trình kỷ nguyên; lộ trình vẫn ở Nhiệm vụ và có nút mở từ bảng mới.

Người chơi chỉnh thức ăn, gỗ, đá và 12 hàng Đồ Đồng/Đồ Sắt; áp dụng toàn bộ bằng một lệnh, số nguyên 0–10.000. Mục tiêu không mất tài nguyên và không tạo hàng. Có nút dùng mức mặc định, mở Phân công dân và mở Lộ trình kỷ nguyên. Chỉ người ở chế độ Tự động được điều chỉnh khi tự nhận việc toàn làng bật; trạng thái bật/tắt ghi rõ trên bảng.

Bản lưu cũ không có mục tiêu tùy chỉnh tiếp tục cơ chế điều phối trước; chỉ mở bảng không đổi kho, phân công hoặc tự bật điều phối. Dùng mức mặc định xóa chính sách tùy chỉnh. Mặc định hiển thị: thức ăn theo sức chứa kho, gỗ 60/100/180 và đá 40/60/100 theo thời đại; hàng chế biến 30. Khi chưa áp dụng chính sách, điều phối cũ vẫn giữ các ngưỡng và ưu tiên đã có, không chuyển bản cũ sang quy tắc mới một cách ngầm định.

## Quy tắc điều phối

Mục tiêu đã áp dụng tính **kho làng + đầu ra tại công trình + hàng dân đang mang**; thức ăn tính thêm khẩu phần riêng. Nguyên liệu trong đầu vào xưởng không tính là dự trữ vì đã dành cho chế biến. Đây là mục tiêu tổng hàng hiện có, không phải cam kết lượng hàng đã ở kho làng; vẫn cần người vận chuyển.

Đạt 100% mục tiêu thì ngừng nhận thêm việc tích hàng. Khi xuống 80% hoặc thấp hơn mới nhận lại; trong khoảng 80–100% giữ trạng thái trước. Áp dụng lại cùng giá trị giữ trạng thái đó, tải lại cũng giữ. Cập nhật số lượng trực tiếp không ghi đè ô số đang nhập. Cảnh báo và trạng thái đọc lượng hàng mới nhất, không đợi một bước mô phỏng khi vừa chạm mục tiêu.

Người tự động ở công trình có thể rời tại ranh giới mẻ khi đã đủ mục tiêu. Giữ mẻ/chuyến đang dở, phần tiến độ số lẻ, nghiên cứu/chế tạo, nhu cầu sinh tồn và công nhân bạn chỉ định. Người thu thập chỉ chuyển nghề khi xong nhiệm vụ/giao hàng. Không dịch chuyển dân hoặc ghi hàng vào kho từ xa.

Mức tối thiểu có chủ đích:

- Thức ăn ít nhất lượng tương ứng 1,5 ngày nhu cầu ăn hiện tại. Nếu thức ăn dùng được quá thấp, ưu tiên sinh tồn vẫn có thể tiếp tục dù tổng hàng gồm đồ chờ vận chuyển đã cao.
- Gỗ 16 khi làng có lửa trại, để tiếp củi.
- Nguyên liệu của xưởng hoàn thành còn cần đạt mục tiêu đầu ra: ít nhất 3 mẻ mỗi loại đầu vào. Xưởng tắt tự nhận hoặc đang nâng cấp không tạo mức tối thiểu này.

Bảng ghi mục tiêu hiệu lực nếu cao hơn số người chơi chọn. Mức 0 là ngừng tích dư loại hàng đó, không vô hiệu hóa ăn uống hoặc đầu vào còn cần cho chuỗi sản xuất. Mục tiêu cao không tự tăng sức chứa; bảng nhắc khi vượt sức chứa kho làng.

## Danh sách cảnh báo

Gom công trình cần thợ xây, thiếu nhân công, thiếu nguyên liệu, chờ vận chuyển, kho đầy, nguồn cạn và đường bị chặn. Không đưa trạng thái sẵn sàng, đang xây bình thường hoặc đã đủ mục tiêu vào danh sách cần xử lý. Cảnh báo giữ nguyên luật phân công tay.

**Tới công trình** đóng bảng, đưa camera tới vị trí và mở đúng bảng chi tiết để chỉnh ngay. Danh sách và số cảnh báo cập nhật khi mô phỏng chạy; nút vẫn hoạt động sau cập nhật. Giao diện 3 cột ở máy tính, 2 cột trên điện thoại, có cuộn và không tràn ngang.

## Lưu và kiểm tra

Bản lưu v5 lưu riêng mục tiêu và trạng thái cần tích/chờ ngưỡng. Kiểm tra phiên bản, loại hàng, số nguyên/giới hạn và boolean; lệnh sai không sửa chính sách cũ, lệnh trùng không áp dụng hai lần. Không có cộng thời gian hay cộng hàng khi tải lại.

Các kiểm tra đã qua:

- Ngưỡng 100%/80%, không đổi nghề qua 50 lần lập kế hoạch cùng lượng hàng trong khoảng chờ; áp dụng giá trị cũ giữ trạng thái.
- Số âm, số lẻ, loại hàng sai và bản lưu hỏng bị từ chối; đổi mục tiêu không trừ/cấp hàng, reset quay về mặc định.
- Mức tối thiểu thức ăn/gỗ/nguyên liệu, bảo vệ phân công tay và cảnh báo có thể xử lý.
- Làng mẫu 5/15/25 dân qua 60 ngày với mục tiêu thấp → 0 → cao: đủ 5/15/25 dân sống, còn khoảng 26,9 / 88,3 / 110 thức ăn trong kho ở lần chạy cuối. Số này là lượng tại kho, không cộng đầu ra công trình/hàng đang mang như mục tiêu tổng. Giá trị thấp là kết quả chọn mục tiêu dự trữ thấp, không phải nguồn đồ ăn miễn phí.
- Tiếp tục hai bản đã chơi trong 60 ngày, đổi mục tiêu giữa chừng: Đồ Đồng 12 sống, khoảng 92 thức ăn; Đồ Sắt 25 sống, khoảng 578,9 thức ăn. Giữ nguyên công nhân thủ công, lưu/tải nhân công và chính sách hợp lệ.
- Trình duyệt Edge tiếp tục bản làng thật: từ chối ô số sai, áp dụng mục tiêu, lưu/tải đúng, không ghi đè số đang nhập khi chạy, bấm cảnh báo mở đúng công trình và camera. Chạy 15 ngày, đủ 12 dân sống, HP ít nhất 90 và đói dưới 80; giữ công nhân phân tay, reset mặc định. Test desktop/390×844 không lỗi chạy/tài nguyên hoặc tràn ngang.
- Kiểm tra kiểu dữ liệu/build; hồi quy nghề và công trình tự động, nhịp sống, phiên lệnh, Ban Phước, hậu cần Đồ Đồng/Đồ Sắt; 80 icon tải đúng và các bảng cũ vẫn hoạt động.

Ảnh: `artifacts/management-desktop.png`, `management-mobile.png`, `management-alerts-mobile.png`, `management-alert-building.png`. Bản mục tiêu đang áp dụng: `management-targets-save.json`; bản kết thúc trình duyệt sau reset: `management-browser-save.json`. Làng mẫu: `management-5-save.json`, `management-15-save.json`, `management-25-save.json`.

## Phạm vi còn lại

Điều hành mới chỉ cho bản cục bộ. Chưa có ghim từng cảnh báo lên HUD, biểu đồ lịch sử kho, ưu tiên từng dây chuyền hoặc tính cách chọn nghề. Số mục tiêu là cấu hình người chơi, không phải chỉ thị tự xây/xóa công trình. Nguồn cạn hoặc đường bị chặn vẫn cần bạn xử lý.

Bước tiếp hợp lý: đột kích nhỏ có cảnh báo/khả năng phòng thủ và Khiên Thần theo đặc tả, giữ đủ thời gian để làng phản ứng.
