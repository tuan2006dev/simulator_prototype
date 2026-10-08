# Cơ sở đo đạc và phân tích — H4B1, 09:50 ngày 06/10/2026

Đã khép cơ sở đo đạc/điện riêng/phân tích hồ sơ. **H4B1 xong; H4 tổng chưa xong** vì lựa chọn nghiên cứu/phong tỏa/bỏ qua và dự án nền tảng chưa triển khai. Dị Tượng vẫn khóa. Ba hồ sơ đã được xử lý thật tại cơ sở, không chỉ ghi ở bàn sơ khai.

## Vòng chơi mới

Đo đạc hiện đại cần Khảo sát thực địa/Điện học, phí15 gỗ/10 đá/20 thức ăn +6 linh kiện/1 bộ phận máy,3 ngày nghiên cứu. Cơ sở xây bằng25 gỗ/20 đá/20 thức ăn +8 linh kiện/2 bộ phận máy/8 đá xây. Một cấp,1 người vận hành, thợ tới nơi xây thật; không có nâng cấp giả. Texture riêng kiểu trạm khoa học mái xanh/anten/dụng cụ,31 loại công trình/279 texture theo bộ sinh, chỉ cấp1 của cơ sở hiện chơi được. Icon dùng bộ riêng hiện có,85 icon.

Mỗi hồ sơ đã về bàn được chọn để phân tích, trả **2 linh kiện một lần**, cần **40 nhịp làm tại chỗ +2 công suất**. Không chạy ngầm khi pause, thợ đi/ăn/ngủ không tính bước làm, thiếu điện giữ tiến độ. Hủy dự án chưa xong hoàn2 một lần; sau hoàn thành không hoàn, không phân tích lặp cùng hồ sơ. Kết quả là dữ liệu đã phân tích, không tặng vật phẩm/biến thể. Chi tiết công trình hiển thị số hồ sơ đã xử lý.

Mỗi cơ sở có labPoweredTicks riêng. Điện đủ và có thợ sống được phân công thì tăng theo đồng hồ mô phỏng; tắt/mất điện/bỏ thợ reset riêng. UI lấy tối đa của một cơ sở, không cộng nhiều nơi hoặc dùng steadyTicks xưởng máy. Đây là **điện kết nối của cơ sở có nhân sự**, không nói thợ làm24 giờ không nghỉ. Phân tích chỉ tiến lúc thợ thật tới làm. Mục tiêu5 ngày là50 nhịp; điện vẫn cần nhiên liệu đã vận chuyển tới máy phát.

Bảng phân tích trong Lộ trình có chọn cơ sở/hồ sơ, phí/thời gian/điện, tiến độ, hủy/hoàn và mục tiêu riêng. Sau xem ảnh phát hiện workMessage cũ còn nói thiếu điện lúc pause dù đã cấp lại; chi tiết và trạng thái phân tích nay đọc công suất hiện tại, phản hồi ngay khi bật/tắt mà không tăng tiến độ. Bảng khảo sát cập nhật hồ sơ đã phân tích; giao diện máy tính/điện thoại có ranh giới và nút theo màu giấy/gỗ.

## Lượt earned và vật tư

`test:analysis` tiếp từ surveys-played-save.json, không làm lại3 chuyến. Nghiên cứu trả phí thật. Đá thường ban đầu19, nghiên cứu mất10 nên chưa đủ20 xây; đã cho cư dân khai thác/giao thêm đá thật, không nới phí. Xây cơ sở, cùng người đi tới vận hành. Hai chuyến trả8 vải/chuyến lấy10 than được vận chuyển thật trước bật máy để đủ chiến dịch dài. Các xưởng khác tắt để dành công suất/nhiên liệu.

Dự án public trả2/duplicate không trả lại, chạy ít nhất8 nhịp rồi ngắt điện: giữ tiến độ, counter riêng về0; snapshot/tải đúng, hủy/hoàn2 và không hủy lần hai. Bật lại, trả phí/phân tích cả3 hồ sơ. **Sau501 bước:3 hồ sơ xử lý,50 dân sống/Food1705,7**, kho **4 linh kiện/0 bộ phận máy/0 than**, vải984/đá xây41. Counter cùng cơ sở304 nhịp=30,4 ngày (>5), xưởng máy steadyTicks0; không mượn bằng chứng. Không tuyên bố sản xuất vật phẩm hoặc mở nhánh từ dữ liệu này.

Bản riêng earned: analysis-ready-save.json (nghiên cứu/xây/mua than/cấp điện), analysis-paused-save.json (đã trả phí, mất điện ở giữa), **analysis-played-save.json (3 đã xử lý, điểm tiếp tục mới)**. analysis-waiting nếu có là chẩn đoán thất bại. Save người dùng giữ nguyên.

Fixture riêng kiểm tra2 cơ sở nối điện lần lượt25 nhịp mỗi nơi không thành50, bỏ thợ reset cơ sở; timer phân tích sai/counter điện vượt đồng hồ bị từ chối. Không dùng fixture này làm thành tích xây thêm viện hoặc xử lý hồ sơ.

## Trình duyệt và kiểm tra

`test:analysis-ui` qua context riêng trên bản earned mới: texture tải/cấp1 Hiện Đại/công suất đúng; chọn/bấm public trả2 lúc pause/0 nhịp, tải/hủy hoàn; tải snapshot mất điện/counter0, bật lại phản hồi đủ điện ngay, chạy thật tới1 hồ sơ xử lý/50 sống. Điện thoại390×844 tải bản3 hồ sơ đạt5,0/5 ngày, không lỗi JS/tải hỏng/tràn ngang. Đã xem ảnh viện trên đảo và ảnh mobile; giữ chibi mềm.

Ảnh artifacts/analysis-lab-desktop.png, analysis-ready-desktop.png, analysis-outage-desktop.png, analysis-island.png, analysis-mobile.png. Type/build qua (game.js377,6KB). Hồi quy surveys và industry (chuỗi earned25 dân, phí/nhiên liệu/công suất/proof/nâng cấp/lưu) qua; icons-ui85 ảnh/layout/save qua. Không cài phụ thuộc/publish/commit/subagent.

## H4B2 tiếp theo

Tiếp từ **analysis-played-save.json**, không làm lại viện/3 phân tích. Lựa chọn nghiên cứu/phong tỏa/bỏ qua có phí/idempotent/hệ quả giới hạn, cho xem trước và giữ kết quả; nghiên cứu dẫn tới dự án nền tảng tại cơ sở có thời gian/điện, phong tỏa/bỏ qua không tự mở nhánh hay phá đảo. Gắn tài nguyên mới với nguồn/nơi dùng thật trước mở cờ. Bộ đếm điện hiện đạt nhưng kho than0, máy còn ít nhiên liệu tại chỗ; nhập than bằng vải hoặc tắt khi chưa cần (chấp nhận reset và khôi phục5 ngày sau). Có4 linh kiện, nên phí lớn tiếp theo cần sản xuất bổ sung thật qua nguồn cung đã mở, không tạo hàng để vượt.

Giữ3 nhánh GAME_DESIGN/ERA_SYSTEM_DESIGN; chưa có dự án nền tảng hoặc chuỗi kinh tế nhánh thì Dị Tượng vẫn khóa dù3 hồ sơ/điện đã đạt. Hiện Đại mới công nghiệp/cung ứng/khảo sát/phân tích, chưa toàn bộ dầu/y tế. Thời hạn03:27 ngày07/10, kiểm tra cuối02:57 giữ nguyên.
