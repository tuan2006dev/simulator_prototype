# Bàn giao đợt phát triển 24 giờ

Bản chuẩn bị ngày 07/10/2026. Hạn kết thúc: 03:27 (giờ Việt Nam/Thái Lan); từ 02:57 chỉ sửa lỗi và kiểm tra. Thời điểm dừng thực tế sẽ được bổ sung ở cuối đợt.

## Những phần đã có đường chơi

- Hình cư dân chibi mềm, dễ thương; bộ icon/công trình riêng và phụ kiện của ba dạng hỗ trợ đi theo người thật.
- Từ Đồ Đá qua Đồ Đồng/Đồ Sắt tới công nghiệp Hiện Đại: luyện thép, cơ giới, điện cung/cầu, trả phí tiến cấp, sản xuất/vận chuyển linh kiện, cung ứng quặng/đồng/than trả vải, ưu tiên điện và định mức xưởng.
- Khảo sát đi tới điểm lạ rồi mang hồ sơ về; viện có thợ/điện phân tích; chọn nghiên cứu/phong tỏa/bỏ qua và dự án nền tảng.
- Ba hướng Dị Tượng có đường chơi đầu tiên riêng: vi mạch→điều khiển; linh thạch→tinh chất→tháp chăm sóc; xương/huyết thạch→sinh chất→cách ly/lọc mẫu. Chuyển nhánh chủ động, có điều kiện, phí thật và thời gian tại viện.
- Ba dạng cư dân tự nguyện vòng đầu: thiết bị hỗ trợ công nghiệp, cộng hưởng trong vùng tháp, thích nghi giảm phơi nhiễm. Có phí vật tư, 100 lượt lợi ích, chăm sóc/gỡ, lưu/tải/hủy; không tự đổi toàn dân/nghề/quan hệ/tính cách.
- Thảo dược, giáo đá/áo dệt, Khích Lệ, cảnh báo thiếu thức ăn; chuỗi chế thuốc→phòng khám có người chữa/điện/vật tư. Trẻ bị thương dùng trong test là tình huống dựng riêng, không nhận là bệnh/sinh con tự nhiên của lượt đã chơi.
- Bảng thích nghi hiển thị thợ, điện và vật tư trước khi trả phí; có nút mở viện phân công, bật nguồn, lý do dừng và cảnh báo cần chăm sóc. Máy tính/điện thoại đã kiểm tra.

Chi tiết từng phạm vi ở [bản đối chiếu thiết kế](GAME_DESIGN_AUDIT.md). “Có đường chơi” không có nghĩa đã hoàn thiện toàn bộ kỷ nguyên hoặc game design.

## Kiểm tra và bằng chứng

| Kiểm tra | Kết quả/giới hạn |
|---|---|
| Tiến cấp/kinh tế ba nhánh | Dùng vật tư kiếm, chế và giao thật trong ba lượt độc lập; không ghép kho giữa nhánh. Có trả phí, thời gian tại viện, điện, lưu/tải/hủy và kiểm tra trực tiếp trình duyệt. |
| Ba dạng cư dân | Trình duyệt làm từ trả phí tới hoàn thành, làm việc tiêu lượt, chăm sóc/gỡ và mobile; mô phỏng đối chiếu công thức/ngưỡng/lưu/idempotent. |
| Duy trì làng 150 ngày | Bốn context, mỗi lượt vẫn 50 người sống, lưu/tải giữa đợt. Xưởng nghỉ và đội công nghiệp về lương thực; không nhận là 150 ngày sản xuất liên tục. |
| Quỷ Dị lọc mẫu | 1 sinh chất đã kiếm trả đúng 5 mẻ/10 xương/5 huyết thạch rồi dừng khi hết nhiên liệu lọc; hỗ trợ còn95 lượt, không miễn nhiễm hoặc khai thác miễn phí. |
| Giao diện cuối | Thợ/hàng thiếu khóa trước trả phí, phân công/bật điện/phí-hủy, khóa viện đang xử lý, không phân công chồng; mobile không tràn và không lỗi trang. |
| Kiểm tra mã | Kiểu dữ liệu/build qua; bản chạy487,5KB. Các báo cáo ghi rõ fixture và lượt đã chơi thật. |

Hai lượt browser đồng thời ban đầu hết thời gian chờ; chạy lại riêng đã qua đầy đủ, không bỏ điều kiện hoặc tăng thời gian chờ để nhận thành công. Lỗi ghi Unicode ở nghiên cứu đã được khôi phục và đối chiếu43 công nghệ cũ với bản build trước; công nghệ thứ44 là thích nghi sinh chất. Không còn lỗi này treo ở bản bàn giao.

Xem [kiểm tra150ngày](VARIANTS_150DAY_RESULT.md), [UX và30ngày](ADAPTATION_UX_STABILITY_RESULT.md), [Hightech](HIGHTECH_ADAPTATION_RESULT.md), [Linh Mạch](MYSTIC_ADAPTATION_RESULT.md), [Quỷ Dị](ELDRITCH_ADAPTATION_RESULT.md), [y tế](MODERN_CARE_RESULT.md).

## Ảnh để xem nhanh

![Thích nghi Linh Mạch trên điện thoại](artifacts/mystic-adaptation-mobile.png)

![Chuẩn bị viện sau150ngày](artifacts/variants-mystic-150day-browser.png)

Ảnh khác: [Hightech](artifacts/augmentation-mobile.png), [Quỷ Dị](artifacts/eldritch-adaptation-mobile.png), [chuẩn bị viện](artifacts/adaptation-preparation-desktop.png).

## Bản lưu thử

Bản lưu người dùng và ba bản gốc đã chốt nhánh được giữ nguyên. Các kiểm tra dùng trình duyệt/context riêng, không thay dữ liệu chơi thật. Đây là các checkpoint để thử tiếp, không phải dữ liệu tự nhập vào trình duyệt đang chơi:

| Hướng | Sau thao tác thật | Sau150ngày duy trì làng |
|---|---|---|
| Công Nghệ Cao | [augmentation-played](artifacts/augmentation-played-save.json) | [hightech-150day](artifacts/variants-hightech-150day-save.json) |
| Linh Mạch | [mystic-adaptation-played](artifacts/mystic-adaptation-played-save.json) | [mystic-150day](artifacts/variants-mystic-150day-save.json) |
| Quỷ Dị | [eldritch-adaptation-played](artifacts/eldritch-adaptation-played-save.json) | [eldritch-150day](artifacts/variants-eldritch-150day-save.json) |

Ba lượt thay thế không nằm trong cùng một đảo và không cộng tài nguyên/điều kiện giữa chúng. Khi thử tiếp phải phân công thợ, cấp nguyên liệu/nhiên liệu và điện thật; xưởng tắt không tự sản xuất. Bản lâu ngày đang nghỉ công nghiệp để giữ dân và nhiên liệu.

## Phần còn thiếu và hướng tiếp

Chưa toàn bộ Cyborg/hạt nhân, dầu/vận tải cơ giới, bệnh lây/y tế đầy đủ, di truyền biến thể/biến thể động vật, đổi/pha nhánh, sắc lệnh/văn hóa/nhiệm vụ sâu, quân sự/hàng hải nâng cao và toàn bộ endgame. Online/PvP không nằm trong đợt được phép triển khai.

Đề xuất đợt sau: trước hết để người chơi thử các đường hiện có và chọn điểm khó hiểu/thiếu hấp dẫn; sau đó ưu tiên đời sống Hiện Đại (y tế tự động/vận tải có nguồn và nơi dùng), rồi sắc lệnh/nhiệm vụ/văn hóa hoặc chiều sâu từng nhánh. Không thêm tên tài nguyên/công trình nếu chưa có vòng vận hành thật. Danh sách chi tiết ở GAME_DESIGN_AUDIT.md.
