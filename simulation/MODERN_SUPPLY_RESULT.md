# Cung ứng Hiện Đại — H3A, 07:38 ngày 06/10/2026

Đã nối và kiểm tra nghiên cứu Hợp đồng cung ứng, mở đường trả vải lấy than/đồng để người chơi tiếp tục công nghiệp khi mỏ cạn. **H3A xong; H3 tổng vẫn chưa đánh dấu xong** vì còn kiểm tra nhiều xưởng/thiếu công suất và vận hành công nghiệp dài ngày. Dị Tượng vẫn khóa.

## Luật và quyết định cân bằng

Hợp đồng cần Hiện Đại, Lắp ráp công nghiệp và Giao thương; phí15 gỗ/10 đá/20 thức ăn +3 linh kiện/2 bộ phận máy, thời gian3 ngày nghiên cứu tại bàn. Linh kiện có thêm nơi dùng thật ngoài nâng cấp. Hai gói mới: **8 vải →10 than**, **12 vải →6 đồng**. Giữ ba gói cũ cho Đồ Sắt. Gói mới khóa cả trong lệnh và UI trước nghiên cứu; Đồ Sắt không hiện gói Modern. Biểu tượng nghiên cứu dùng icon giao thương riêng đã có, không thêm icon đại trà.

Vải từ ruộng lanh/sợi/xưởng dệt là nguồn trao đổi có lao động/đất/thời gian thật. Giá than mới rẻ hơn vòng đổi đồng lấy than sau khi trả nghiên cứu; người chơi chọn sản xuất vải, cân bằng người làm lương thực và giữ nhiên liệu. Không tăng mỏ hoặc tặng vật tư khi cạn. Nên dành ít nhất3 linh kiện để nghiên cứu trước khi tiêu sạch dự trữ mỏ; có thể tắt máy khi chờ kim loại hoặc giao hàng để tiết kiệm than.

Mỗi chuyến trừ vải vào escrow lúc bắt đầu, thợ đi tới bờ nước/trao đổi/quay về, hàng mới vào kho khi về trạm. Hủy hoàn đúng hàng đã giữ, gọi lặp không trả lần hai. Chặn đường hoặc kho thiếu chỗ giữ chuyến; hàng nhập không tăng sản lượng đã sản xuất. Lộ trình hiện trạng thái hợp đồng, giá và nguồn vải; chi tiết trạm có nút khóa/đủ phí/chuyến đang đi.

## Lượt kiếm hàng thật

`test:modern-supply` tiếp từ modern-factory-upgraded-save.json, không sửa kho/unlock/công trình/nguồn để qua. Dùng đồng còn kiếm từ đợt trước mua **hai chuyến than bằng đồng**, vải mua quặng, luyện thêm thép và sản xuất thêm linh kiện; trả3 linh kiện/2 bộ phận máy nghiên cứu, thợ tới bàn hoàn thành. Sau mở hợp đồng, thực hiện hai chuyến vải lấy than, một chuyến vải lấy đồng và hai chuyến quặng nữa, vật tư về bằng vận chuyển thật. Tổng8 chuyến trả phí mới. Không khai thác thêm mỏ hữu hạn trong lượt này.

Phân công người vào ruộng lanh/xưởng dệt, **sản xuất24 vải mới thật**; sau đó chuyển họ luyện kim, giao thép tới nhà máy, dùng điện sản xuất thêm ít nhất6 linh kiện. Lượt thành công có tổng18 linh kiện từng sản xuất, kho9 sau các phí đã trả; đủ50 dân sống. Trả người về lương thực/tắt máy và chạy thêm30 ngày: Food1883,4 sau **2.071 bước** kể từ bản cấp2. Sản lượng đồng/than không tăng nhờ hàng nhập; lưu/tải đúng cả nghiên cứu và chuyến đang đi. Bản modern-supply-contract-save.json đã trả nghiên cứu/mở hợp đồng; modern-supply-played-save.json là điểm tiếp tục mới. Bản waiting là chẩn đoán thất bại, không thành tích.

Hai lượt trước không qua: thép đã được giao vào buffer nên chờ riêng kho không đạt; một chuyến10 quặng không đủ mẻ4 thép kế tiếp. Đã sửa kịch bản tính cả input và trả thêm chuyến quặng/than thật, không đổi định mức hoặc tặng vật tư. Fixture riêng kiểm tra khóa era/nghiên cứu, kho đầy từ đầu, không nhập tức thời, chặn đích giữ escrow và hủy chỉ hoàn một lần. Kiểm tra kho đầy lúc về trạm có hồi quy Đồ Sắt dùng chung tickTrades, không tuyên bố fixture là lượt chơi thật.

## Trình duyệt và kiểm tra

`test:modern-supply-ui` qua context riêng: gói khóa trên save trước nghiên cứu; save hợp đồng kiếm thật mở gói/Lộ trình. Bấm đổi than khi pause trả đúng8 vải/than chưa tăng, tải giữa chuyến/hủy hoàn toàn bộ. Chạy chuyến mới thật rồi về trạm: **tổng than kho+buffer+túi tăng10**, completedTrades+1, sản lượng than không tăng, vẫn50 sống. Điện thoại390×844 chọn gói đồng trả12 vải, lưu/tải giữa chuyến/hủy, không lỗi JS/tải hỏng/tràn ngang. Đã xem ảnh desktop/mobile.

Ảnh artifacts/modern-supply-goal-desktop.png, modern-supply-shipment-desktop.png, modern-supply-landed-desktop.png, modern-supply-trade-mobile.png. Kiểu dữ liệu/build qua (game.js357,2KB). Hồi quy iron (chuỗi/gói cũ/escrow/kho đầy/chặn đường), modern-investment và session qua. Không cài phụ thuộc/publish/commit/ghi đè save người dùng.

## Tiếp theo

Tiếp từ **artifacts/modern-supply-played-save.json**, kho9 linh kiện/machineParts8/cloth1000, nguồn than/đồng thay bằng chuyến trả vải. H3B kiểm tra nhiều xưởng, quyết định ưu tiên điện khi thiếu công suất và chiến dịch công nghiệp dài ngày có bổ sung vật tư; phân biệt với30 ngày nghỉ máy đã qua. Có thể mở rộng nhà máy/nâng cấp bằng sản phẩm trả phí, không tạo fixture thay lượt thật. Chỉ khi H3 ổn mới H4 cơ sở đo đạc/đội khảo sát/phân tích/lựa chọn Dị Tượng; chưa mở cờ Dị Tượng. Thời hạn03:27 ngày07/10, kiểm tra cuối02:57 giữ nguyên.
