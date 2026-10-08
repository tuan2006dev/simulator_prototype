> Cập nhật đợt sau: đã có tự nhận công trình/xưởng và cảnh báo chuỗi sản xuất; xem [kết quả hiện tại](PRODUCTION_WORKFORCE_RESULT.md). Các phần chưa có dưới đây ghi phạm vi tại thời điểm đợt nghề ban đầu.

# Nghề tự động và STR / DEX / INT

Triển khai cục bộ ngày 2026-10-05, tiếp nối Khởi nguyên.

## Hành vi

Đảo mới bật tự nhận việc. Người trưởng thành đã đặt lên đảo nhận nghề khi rảnh, ưu tiên thức ăn; dự trữ dưới 1,5 ngày tăng mục tiêu người kiếm thức ăn từ khoảng 60% lên 80% nhu cầu dân cư quy đổi. Người ở nông trại/bến câu được tính vào nguồn cung. Sau thức ăn là gỗ để xây/tiếp củi và đá xây dựng; nếu dự trữ đủ hoặc không có nguồn có đường đi thì chờ việc.

Mục tiêu vật liệu Đồ Đá là 60 gỗ/40 đá, Đồ Đồng 100/60, Đồ Sắt 180/100; vẫn chịu giới hạn kho. Đây là mục tiêu kiếm dự trữ, không cấp vật liệu và không cam kết sản lượng hằng ngày. Chưa tự vận hành chuỗi luyện kim/xưởng: người chơi tiếp tục phân công công trình.

Không đổi nghề giữa lượt thu hoạch, khi mang hàng, làm lệnh trực tiếp, nghỉ sinh tồn, xây/nâng cấp, nghiên cứu hoặc giao thương. Công trình do bạn phân công được giữ nguyên. Công trình không cần thợ sau xây tự trả người về; nếu người đó ở chế độ tự động, họ nhận nghề tiếp khi rảnh. Nghiên cứu hoàn tất cũng trả người về theo chế độ của họ.

Chọn nghề bằng tay khóa nghề đó. Chọn chế độ “Bạn chọn nghề” giữ nghề hiện tại. Chọn “Tự động” giao lại quyền phân công nhưng giữ lượt đang dở/hàng mang. Tắt công tắc chung dừng phân công mới và giữ nhiệm vụ/ưu tiên hiện có. Tự động không vượt khóa nghề tay dù kho thiếu thức ăn.

## Thuộc tính

Ba chỉ số 1–10, dân mới trong hệ thống được sinh ổn định từ ID (4–10). STR tăng gỗ/đá ngoài bản đồ và tại trại gỗ/mỏ đá. DEX tăng hái lượm/câu cá, gồm bến câu. INT tăng tiến độ nghiên cứu khi thực sự làm tại bàn. Chỉ số 5 trở xuống không giảm hiệu quả; mỗi điểm trên 5 thêm 4%, tối đa 20%. Không tăng tốc đi bộ và không thêm bonus cho nông trại/xưởng trong đợt này.

Công cụ đá nhân 1,5 đúng một lần cho gỗ/đá, sau đó mới nhân STR. Hàng thu vẫn trừ nguồn thực tế và chịu giới hạn 30 đơn vị mang. Ví dụ lệnh chặt 3 gỗ với công cụ đá và STR 10 tạo 5,4 gỗ, trừ đúng 5,4 từ cây. INT 10 tạo 2,4 bước nghiên cứu trong ca ngày thay vì 2; giờ ăn/ngủ vẫn tạm ngắt.

Tab Dân cư có công tắc chung, chế độ từng người, nghề thực tế, lý do tự nhận/chờ việc và ba chỉ số. Chi tiết cư dân giải thích tên chỉ số bằng tiếng Việt. Màn hình nhỏ dùng bố cục từng người, không ép bảng rộng.

## Bản lưu và phạm vi

Giữ phiên bản 5. Lưu công tắc, chế độ, chỉ số và hàng đang mang; kiểm tra chế độ/chỉ số không hợp lệ. Khi mở bản cũ chưa có hệ thống, mặc định tắt tự nhận, giữ nghề cũ ở chế độ tay và gán chỉ số trung tính 5. Người chơi bật công tắc và chọn người tự động trong tab Dân cư. Không tự đổi nghề hoặc tăng hiệu suất bản cũ.

Chỉ triển khai giao diện cục bộ; chế độ online thử nghiệm chưa bật các điều khiển mới. Chưa triển khai tự nhận chỗ làm trong mọi xưởng, tính cách ảnh hưởng lựa chọn nghề, tăng cấp thuộc tính, túi/trang bị hoặc Faith.

## Kiểm tra

Test luật mới: làng 5/10/15 người tự nhận nghề trong 30 ngày, ưu tiên thiếu ăn, khóa tay, không lấy người xây/nghiên cứu/mang hàng/lệnh trực tiếp, bật/tắt, chuyển chế độ, bảo toàn lượt dở, chỉ số/bonus thực tế, lưu/tải và chuyển bản cũ. Cả ba làng giữ đủ dân và có thức ăn/vật liệu.

Lượt trình duyệt từ đảo mới năm người đã qua: không phân công nghề ban đầu, tự sống 30 ngày; bật/tắt, khóa nghề đá bằng tay và bật lại; dựng bàn bằng tài nguyên tự kiếm, nghiên cứu Lửa, trả người về lao động và lưu/tải. Lượt cuối đến ngày 44 vẫn đủ năm dân, khoảng 140 Food, 27 gỗ và 42,5 đá, đã có công nghệ Lửa. Không cấp thêm tài nguyên/công nghệ trong lượt chơi. Ảnh desktop/390×844 và bản lưu tại `artifacts/workforce-*`; không có lỗi chạy/tải tài nguyên hoặc tràn ngang. Kiểm tra icon trình duyệt qua.

Hồi quy luật sinh tồn/định cư, lao động, đường đi, công trình và sinh vật qua. Đường kinh tế Đồ Đá → Đồ Đồng → Đồ Sắt qua với bản lưu cũ giữ chế độ tay. Kiểm tra kiểu dữ liệu và build qua.

Hồi quy trình duyệt Đồ Đá → Đồ Đồng qua: điều kiện/phí, tải giữa tiến cấp, nghiên cứu, nâng cấp dùng vật liệu và bố cục máy tính/điện thoại.
