# Thời tiết, cháy rừng và Cầu Mưa — 2026-10-05

## Phạm vi đã chạy

Bản cục bộ có trời quang, mưa tự nhiên và khô hạn. Bắt đầu trời quang, mỗi đợt dài 60 giây mô phỏng; khi đổi đợt, xác suất mưa 25%, khô hạn 25%, trời quang 50%. Hạt ngẫu nhiên và thời hạn lưu trong thế giới; tải lại tiếp tục cùng chuỗi thời tiết, không tính thời gian đóng game. Tạm dừng đóng băng, ×2 tăng đồng bộ. Giá trị thời tiết/cháy dưới đây là cân bằng thử nghiệm của đợt này, không sửa đặc tả người chơi.

Khô hạn giảm 20% sản lượng nông trại, ruộng lúa mì và ruộng lanh. Không giảm nghề hái lượm/câu cá của vòng mở đầu. Mưa tự nhiên dập cháy, không tự cấp bonus nông nghiệp của thần lực.

Cầu Mưa theo mục 9 đặc tả Era 0: **40 Niềm tin**, hồi chiêu riêng **60 giây**, dập tất cả cháy rừng ngay và tăng sản lượng ba loại ruộng **30% trong 45 giây**. Trong thời hạn này, mức +30% thay mức −20% khô hạn. Không tăng lò bánh, xưởng hoặc sản lượng hái/câu; không tạo tài nguyên tức thì trong kho. Dân vẫn canh tác, kho công trình vẫn giới hạn 60 và cần vận chuyển. Không áp dụng kiệt sức/phí leo thang của Ban Phước sang Cầu Mưa; hai phép có hồi chiêu riêng.

## Cháy và lao động dập lửa

Trong mỗi đợt khô hạn, sau ít nhất 20 giây có một lần kiểm tra nguy cơ cháy 25%. Chỉ chọn cây còn gỗ, tránh vị trí công trình. Một vụ lan qua tối đa **8 cây**, theo bốn hướng liền kề, kiểm tra lan mỗi 5 bước. Mỗi cây cháy tối đa **20 bước** (12 giây mô phỏng), mất 2 gỗ/bước, không giảm dưới 0. Gỗ cháy mất tại nguồn, không cộng vào kho. Cây đang cháy không hồi tài nguyên; sau khi dập có thể hồi theo luật nguồn cũ. Dữ liệu `burned` là danh sách cây đã bị chạm tới trong vụ để chặn lan vòng, không phải trạng thái cây bị hủy vĩnh viễn.

Mỗi bước, một người trưởng thành rảnh gần đó đi tới và dập lửa. Chỉ tìm đường tối đa 12 bước; phải đến sát cây, dùng 3 bước dập. Bước đi và bước dập đều ngừng lao động khác. Ưu tiên ăn/ngủ vẫn giữ; không lấy trẻ em, người mang hàng, công nhân đang được phân ở công trình, người nghiên cứu/chế tạo hay có lệnh trực tiếp. Với nhịp sống hằng ngày, chỉ tự dập trong giờ lao động. Không có người phù hợp thì lửa vẫn có giới hạn; mưa tự nhiên và Cầu Mưa dập toàn bộ.

Đợt đầu chỉ cháy cây, chưa gây thương tích hoặc đốt công trình. Lửa trại và nhiên liệu sinh tồn vẫn là hệ thống riêng.

## Giao diện và bản lưu

Có trạng thái thời tiết/cháy trên đảo, icon cháy tại cây, hạt mưa và màu trời khi mưa. Bảng Niềm tin có thẻ Cầu Mưa, giá, thời hạn bonus/hồi chiêu, đếm đợt thời tiết và lý do khóa nút. Icon Cầu Mưa vẽ riêng theo hệ SVG của game; bộ icon hiện 80 hình. Điện thoại đã bố trí lại các trạng thái để tránh chồng Niềm tin.

Bản lưu v5 cũ không có thời tiết vẫn đọc được, mở bằng trời quang mà không đổi kho/dân/Faith. Lưu trạng thái đợt, RNG, thời hạn mưa/hồi chiêu, danh sách cây và tiến độ dập; kiểm tra giới hạn/vị trí/thời hạn khi đọc. Không có hoàn phí hoặc kéo dài phép khi tải lại. Xóa tài nguyên qua công cụ địa hình không làm danh sách cây từng cháy mất khả năng lưu.

## Kiểm tra

- Kiểm tra kiểu dữ liệu và build.
- Luật Cầu Mưa: trừ phí đúng một lần, lệnh trùng không trả thêm, chưa đủ điểm/hồi chiêu bị chặn; hiệu lực 45 giây và hồi chiêu 60 giây, độc lập Ban Phước.
- Mẻ ruộng cùng lao động: nông trại 20 / 16 / 26; lúa mì và lanh 12 / 9,6 / 15,6 theo trời quang / khô hạn / Cầu Mưa. Kho đầu ra đầy vẫn dừng, không có hàng tặng vào kho chung.
- Cháy lan có trần, nguồn không âm, dập tại chỗ và đường bị chặn; người mang hàng không bỏ chuyến. Kiểm tra cháy tự phát bằng RNG cố định và mưa tự nhiên không cấp bonus trả phí.
- Tiếp tục bản làng 5 người đã chơi, 180 ngày qua đủ ba loại thời tiết: 5 sống, 300 thức ăn; mỗi bước lưu/tải hợp lệ. Chuỗi ngẫu nhiên đó không phát sinh cháy; ca cháy được kiểm tra riêng, không tuyên bố là có cháy trong lần chạy dài.
- Trình duyệt Edge: tiếp tục bản lưu thật có Faith tự tích trước đó; dựng một vụ cháy để kiểm tra lặp được, dùng Cầu Mưa với điểm đang có, không cấp điểm/tài nguyên. Kiểm tra trừ 40, dập lửa, pause, tải lại, ×2, hết bonus/hồi chiêu, desktop và 390×844. Đủ 5 người sống, khoảng 244,6 thức ăn; không lỗi tài nguyên/giao diện hoặc tràn ngang.
- Hồi quy Ban Phước, công trình, nhịp sống, trang bị, phiên lệnh và hậu cần Đồ Đồng/Đồ Sắt.

Ảnh ở `artifacts/weather-rain-desktop.png`, `weather-rain-island.png`, `weather-fire-desktop.png`, `weather-rain-mobile.png`, `weather-hud-mobile.png`. Bản lưu trình duyệt ở `weather-played-save.json`; bản mô phỏng dài ở `weather-simulation-save.json`.

## Bước tiếp theo

Quan sát cân bằng khi chơi thật trước khi tăng mức thiên tai. Tiếp theo có thể làm cảnh báo nguồn/kho và tự nhận công nhân ở xưởng; Khiên Thần/Khích Lệ cần hệ đột kích/chiến đấu có luật thực. Chưa triển khai thần lực/thời tiết cho online.
