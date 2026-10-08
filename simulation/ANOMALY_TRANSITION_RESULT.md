# H4C2 — Tiến vào Dị Tượng/Công Nghệ Cao và định mức tự dừng

Ngày06/10/2026. Tiếp từ `artifacts/microchips-played-save.json` earned, không sửa save người dùng.

## Chuyển nhánh có điều kiện và phí thực

- Chỉ Công Nghệ Cao được chọn trong phiên bản đã kiểm tra. Cần3hồ sơ phân tích, nền tảng Công nghệ,6vi mạch đã chế tạo, nghiên cứu điều khiển/xưởng và trung tâm có thợ, cùng một viện có thợ và5ngày điện liên tiếp. Input còn tại xưởng không tính là kho phí.
- Người chơi xem trước50linh kiện20thép và xác nhận. Dự án50nhịp làm tại viện, tương đương5ngày công; có thể dài hơn5ngày lịch do ăn/ngủ. Mất điện/nghỉ giữ tiến độ; outage reset proof điện riêng nên phải nối đủ5ngày lại. Không mượn proof trung tâm/xưởng.
- Không chạy chồng nghiên cứu/phân tích/nền tảng/tiến cấp khác. Lệnh lặp không trừ phí lần nữa; lưu giữa dự án, tải rồi làm tiếp. Hủy trước hoàn tất hoàn50+20 một lần và xóa tiến độ. Hoàn tất chốt `anomalyBranch=hightech`, không hoàn lại đầu tư/đổi nhánh trong bản hiện tại.
- Cờ Dị Tượng chỉ mở sau chuỗi nguồn/nơi dùng vi mạch và lượt earned đủ điều kiện/chuyển dự án/kiểm tra đã qua. Metadata và UI nói rõ chỉ Công Nghệ Cao; Linh Mạch/Huyền Bí, Quỷ Dị, hạt nhân còn chưa làm. Không tự biến đổi cư dân.

## Cơ chế mới sau tiến cấp

**Định mức tự dừng xưởng**: trung tâm có điện/người đang làm tại chỗ trong6ô cho phép lập3/5mẻ mới (lệnh hỗ trợ1–100). Máy đếm ngay mẻ chế tạo, gồm hàng còn tại xưởng/đang giao. Hết mẻ tự dừng, tắt công suất cho xưởng điện, giữ input và hàng đang vận chuyển. Không cộng output miễn phí và không cần chờ đủ hàng về kho mới dừng.

Định mức lưu/tải, chống âm/phân số/sai nhánh. Có thể bỏ định mức rồi chủ động bật xưởng; lập lại là chương trình số mẻ mới. Các mẻ vẫn cần recipe/thợ/điện thật, trung tâm hỗ trợ25% tốc độ khi hoạt động. Lò thép có thể dừng theo định mức nhưng không bị tính điện vì recipe nền không cần điện.

## Lượt kiếm hàng/trả phí, không fixture

40chuyến mới trả248vải:14quặng/20than/6đồng. Luyện thật, chế tạo và giao42linh kiện mới để đạt kho phí; khôi phục điện cùng viện có thợ ≥50nhịp. Trả50linh kiện20thép, thử giữ mẻ khi tắt viện và hủy hoàn, trả lại để chạy tiếp qua save/session mới. Hoàn tất nhánh rồi lập3mẻ ở nhà máy trong vùng điều khiển: đúng3mẻ/9linh kiện mới, máyOFF, input giữ và9hàng đã về kho.

1938bước/50sống/Food742,4. Kho10linh kiện3thép28than422vải4đồng25đá xây,0parts0vi mạch. Proof viện324nhịp tại bản cuối. Điểm tiếp tục **`artifacts/anomaly-played-save.json`**. Định mức nhà máy0/đã dừng, viện/trung tâm/genON; nhiên liệu tiếp tục cần kiểm soát khi chạy dài ngày.

Lưu thử riêng: `anomaly-ready-save.json`, `anomaly-paused-save.json` (proof0/dự án giữ), `anomaly-entered-save.json`, `anomaly-quota-ready-save.json`, bản played. Nghiên cứu/viện/3phân tích/nền tảng/6vi mạch/46chuyến cũ không làm lại.

## Kiểm tra đã qua

- `test:anomaly`: mọi phí nhập/nguồn thép-linh kiện/50+20/replay/giữ mẻ/hoàn một lần/recovery proof5ngày/save-session mới/50nhịp onsite/chốt nhánh/định mức3mẻ đúng9hàng/tựOFF/giữ input/giao kho/50sống. Fixture riêng từ chối nhánh chưa có kinh tế,proof49,quota trongModern và save hỏng.
- `test:anomaly-save`:5checkpoint earned load/encode, pending outage0 vẫn hợp lệ; thiếu nền tảng,quota phân số,thiếu phí/3phân tích/lab lạ bị từ chối, không thu hàng.
- `test:anomaly-ui`: Edge context riêng public preview/fee50+20/pause/reload/cancel/refund, bật lại viện và chạy thật hồi proof/hoàn50nhịp/50sống/CôngNghệCao; public quota3/lưu/tải/chạy đúng3mẻ+9/tựOFF/bỏ định mức/mobile/no lỗi/no overflow. Ảnh `artifacts/anomaly-investment-preview.png`, `anomaly-entered-desktop.png`, `anomaly-quota-programmed.png`, `anomaly-quota-mobile.png`.
- Typecheck/build404,1KB/session/era qua. Các test trước sửa kiểm tra nhánh của lượt cụ thể còn chưa mở, không còn buộc cờ toàn ứng dụng luôn false sau chức năng mới.

## Phạm vi hoàn thành và việc tiếp

H4C2 và **đường chơi Công Nghệ Cao đầu tiên** đã hoàn tất và qua kiểm tra. **Chưa hoàn tất toàn bộ Dị Tượng/H4**: chưa có kinh tế Linh Mạch/Quỷ Dị,hạt nhân,biến thể,đổi nhánh; Hiện Đại dầu/y tế vẫn chưa xong.

Chặng hợp lý tiếp theo là chuỗi Linh Mạch trong nhánh riêng: nguồn tại điểm khảo sát→linh thạch→tinh chất→công trình tiêu tinh chất có tác dụng thật, cần thợ/vận chuyển/thời gian/ổn định và lựa chọn. Dùng context thử mới từ `artifacts/analysis-played-save.json` (earned trước quyết định, giữ3phân tích/viện), chọn nền tảng Linh Mạch mới; không sửa nhánhHightech đã chốt hoặc mở lại điểm đã phong tỏa ở bản Hightech. Phân biệt hai lượt thay thế, không cộng tài nguyên giữa chúng. Chỉ thêm lựa chọn nhánh sau nguồn/nơi dùng và test được. Sau đó Quỷ Dị/biến thể/niềm tin/trang bị phòng vệ/UX tùy thời gian, không tự biến đổi toàn dân. Giữ hạn03:27ngày07/10 và kiểm tra cuối từ02:57.
