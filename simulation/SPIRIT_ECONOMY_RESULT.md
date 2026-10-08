# H4D1 — Kinh tế Linh Mạch thử nghiệm

Đã nối nguồn → khai thác → tinh luyện → nơi dùng thật trong Hiện Đại. Chưa mở chuyển nhánh chủ đạo Linh Mạch; Công Nghệ Cao của lượt trước được giữ nguyên.

## Chuỗi chơi

Nền tảng Linh Mạch trả 4 linh kiện và làm 60 nhịp tại viện. Nghiên cứu dẫn mạch mở trạm đặt trong 2 ô quanh điểm đã khảo sát/phân tích. Mạch có trữ lượng tối đa 24, ổn định tối đa 100: mỗi mẻ lấy 2 linh thạch, giảm 2 trữ lượng và 6 ổn định; dưới 30 ổn định hoặc thiếu trữ lượng thì dừng. Nguồn hồi 1 trữ lượng/10 nhịp và 1 ổn định/5 nhịp. Người chơi có thể ngừng trạm để hồi phục; nguồn không tự cấp hàng vào kho.

Nghiên cứu tinh luyện trả 4 linh thạch/4 vải. Xưởng riêng dùng 2 linh thạch + 1 thảo dược → 1 tinh chất, cần thợ, vận chuyển và 2 công suất điện. Nghiên cứu chăm sóc trả 3 tinh chất; tháp xây trả thêm 2 tinh chất/6 đá xây cùng nguyên liệu thường. Tháp cần thợ tại chỗ, 2 công suất, ổn định ≥40 và tinh chất đã giao tới. Một tinh chất cấp 10 nhịp làm; trong bán kính 4 ô, mỗi nhịp tăng tối đa 1 sức khỏe và giảm 1 mệt mỏi cho người sống. Mất điện, ngủ/vắng thợ hoặc nguồn yếu giữ nhiên liệu và ngừng tác dụng. Không tự biến đổi dân.

Ba công trình có texture vector riêng; linh thạch/tinh chất có icon riêng. Có bảng nguồn/ổn định, nút nghỉ/khai thác, thông tin điện, nhiên liệu và nhịp chăm sóc trên desktop/mobile. Công trình hiện một cấp; nhãn nêu rõ mẫu Linh Mạch trong Hiện Đại.

## Lượt kiếm hàng và trả phí

Context thử thay thế bắt đầu từ artifacts/analysis-played-save.json: giữ viện và 3 hồ sơ đã phân tích, không làm lại. Chọn nền tảng Linh Mạch mới, không sửa nhánh Công Nghệ Cao đã chốt hoặc cộng hàng giữa hai lượt. Đây là chuỗi tiếp nối earned trong bản đồ thử sẵn có, không phải tuyên bố một chiến dịch mới từ đảo ngẫu nhiên.

1531 bước, 4 chuyến than trả tổng 32 vải, khai thác/giao thêm 50 đá thường, trả nghiên cứu/xây thật. Đã chế tạo 46 linh thạch, tinh luyện/giao 9 tinh chất; 3 trả nghiên cứu, 2 trả xây tháp, phần còn lại cấp chăm sóc. Tháp có 21 nhịp tác dụng. Cuối lượt 50 người sống, lương thực 1791,4. Kho 20 linh thạch/944 vải/23 đá xây; 0 tinh chất/linh kiện/thép/than trong kho. Xưởng giữ 4 linh thạch/2 thảo dược đầu vào; tháp còn 1 tinh chất đã giao và 9 nhịp nhiên liệu. Mạch hồi về 24/24, ổn định 100/100. Viện tắt/không thợ, chứng nhận điện riêng về 0 đúng luật.

Điểm tiếp tục: **artifacts/spirit-played-save.json**. Đây là lượt Linh Mạch thay thế, vẫn Hiện Đại/chưa nhánh chủ đạo. Lượt Công Nghệ Cao giữ tại artifacts/anomaly-played-save.json.

Các lần thử riêng ban đầu hết nhiên liệu khi chờ hàng, không dùng làm điểm tiếp tục. Đợt cuối bố trí xưởng/tháp gần làng, thêm hai người vận chuyển, chờ đầu vào rồi mới chạy máy phát; cho trạm nghỉ khi ổn định thấp. Không cấp miễn phí thành phẩm. Đã sửa giảm mệt mỏi đúng chiều và kiểm tra bộ đệm nhiên liệu tháp khi lưu.

## Kiểm tra

- test:spirit qua: chuỗi trả phí/kiếm hàng, nguồn thiếu hoặc yếu ngừng, hồi nguồn, recipe đủ vật tư, giao thành phẩm, chăm sóc, giữ nhiên liệu khi ngủ/nguồn yếu, save và khóa chuyển nhánh.
- Fixture riêng xác nhận người bị thương tăng 1 sức khỏe/mệt mỏi giảm 1, người ngoài vùng không đổi; không gây thương tích trong lượt earned để tạo kết quả đẹp. Save có trữ lượng vượt 24 bị từ chối.
- test:spirit-ui qua trên trình duyệt riêng: nghỉ/chạy trạm, lưu/tải, khai thác live; bật xưởng và sản xuất tinh chất live; tắt/bật tháp, giữ nhiên liệu, tải lại và chăm sóc live; 50 người sống. Mobile không tràn khung, không lỗi console.
- Typecheck/build qua (417,3 KB); hồi quy session, era, 5 checkpoint save Công Nghệ Cao qua. Bộ hiện có 36 công trình/324 texture và 88 icon riêng.
- Đã xem ảnh spirit-tower-desktop.png và spirit-mobile.png. Các ảnh bổ sung: spirit-extractor-desktop.png, spirit-refinery-desktop.png, spirit-tower-mobile.png.

## Chưa xong / tiếp theo

H4D1 xong; H4D2 chuyển nhánh Linh Mạch còn làm. Cần dự án chủ động trả phí/thời gian/lưu/hủy một lần, 5 ngày điện riêng cùng viện/thợ, nền tảng và bằng chứng kinh tế/chăm sóc. Kho hiện không có linh kiện/thép nên phải kiếm bằng luyện/lắp ráp/giao thương trả phí thật trước phí chuyển đổi 50 linh kiện + 20 thép nếu giữ thiết kế. Không mượn proof hay hàng của lượt Công Nghệ Cao. Quỷ Dị, biến thể tự nguyện, hạt nhân, dầu/y tế vẫn chưa triển khai; không tự mở nhánh thiếu kinh tế.
