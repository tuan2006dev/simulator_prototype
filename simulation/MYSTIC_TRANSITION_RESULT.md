# H4D2 — Chuyển nhánh chủ đạo Linh Mạch

Đường Linh Mạch đã chuyển cấp bằng dự án thực, độc lập với lượt Công Nghệ Cao. H4/Dị Tượng toàn bộ chưa hoàn thành: Quỷ Dị, biến thể tự nguyện và hạt nhân còn làm.

## Dự án và điều kiện

Hiện Đại có 3 hồ sơ phân tích, nền tảng Linh Mạch, đã khai thác ít nhất 12 linh thạch/tinh luyện 9 tinh chất/nghiên cứu chăm sóc, có xưởng thực và tháp đã chăm sóc ít nhất 20 nhịp, nguồn ổn định ≥40. Viện được chọn phải có thợ và đủ điện liên tiếp 50 nhịp (5 ngày). Điều kiện Công Nghệ Cao vẫn dùng riêng vi mạch/điều khiển, không lấy chứng nhận Linh Mạch thay thế.

Xem trước → xác nhận trả 50 linh kiện +20 thép trong kho → 50 nhịp thợ làm tại viện (5 ngày công). Ngủ/vắng/mất điện giữ tiến độ; mất điện reset chứng nhận riêng, cần phục hồi 5 ngày trước làm tiếp. Hủy dự án chưa xong hoàn đúng phí một lần và xóa tiến độ. Lưu/tải không thu lại phí; lệnh lặp không trả/thu thêm. Hoàn tất mới chốt `mystic`/Dị Tượng. Nghề, tên và danh tính 50 cư dân giữ nguyên; không tự nhận biến thể. Đổi nhánh sau khi chốt và Quỷ Dị vẫn bị chặn.

Giao diện có hai lựa chọn riêng, mỗi lựa chọn hiển thị điều kiện của mình; thông báo Quỷ Dị chưa sẵn sàng/không thu phí. Sau chốt, bảng nguồn và công trình hiện đúng Linh Mạch. Chuỗi nguồn/tinh chất/chăm sóc vẫn cần người, điện, vận chuyển và vật tư sau chuyển cấp.

## Kiếm phí và ổn định làng

Tiếp từ **artifacts/spirit-played-save.json**, không làm lại viện/3 phân tích/nền tảng/nghiên cứu/xưởng/tháp. 64 chuyến trả tổng 424 vải: 28 quặng, 30 than, 6 đồng. Luyện/lắp ráp/giao thêm đúng 54 linh kiện; dừng theo thành phẩm đã chế tạo, không chờ kho rồi sản xuất quá mức. Lượt vật tư 2217 bước/50 sống, còn 54 linh kiện/30 thép/52 than/520 vải. Lương thực xuống 64,7, nên chưa coi bản này là điểm bàn giao ổn định.

Trước dự án đã trả đội xưởng đang tắt/trạm đang nghỉ/tháp/mỏ cạn sang nông trại thật để khôi phục thức ăn; không cấp thêm thức ăn. Kế tiếp 391 bước bao gồm hồi lương thực, chứng nhận điện mới, trả/hủy/thử mất điện/khôi phục điện/trả lại phí và hoàn tất. Cuối lượt 50 sống, thức ăn 1688,9; kho4 linh kiện/10 thép/25 than/520 vải/2 đồng/20 linh thạch/23 đá xây. Chứng nhận viện186 nhịp. 0 tinh chất trong kho, tháp vẫn có phần đã giao/nhiên liệu giữ, cần cấp tiếp khi chạy dài ngày.

Điểm tiếp **artifacts/mystic-played-save.json** là lượt Linh Mạch earned thay thế đã chốt. Công Nghệ Cao giữ độc lập tại artifacts/anomaly-played-save.json. Không ghép tài nguyên/chứng nhận giữa hai lượt. Bản đồ thử kế thừa từ các checkpoint trước; không tuyên bố một ván mới trên đảo ngẫu nhiên từ đầu.

## Test và ảnh

- test:mystic-preparation qua: giao thương trừ phí từng chuyến, luyện/lắp ráp/giao thật, đúng54 linh kiện mới, 50 sống.
- test:mystic qua: trả50+20, idempotent, dự án lặp bị chặn, mất điện giữ tiến độ/reset chứng nhận, tải giữa dự án, hủy hoàn đúng một lần, hoàn tất/chốt và giữ danh tính/nghề. Fixture proof49/care19/essence8/thiếu nền tảng/ổn định39/Quỷ Dị bị chặn không thu phí. Save nhánh sai/thiếu bằng chứng tinh chất hoặc chăm sóc bị từ chối.
- test:mystic-ui qua: xem trước/trả/hủy/phí/lưu, tải dự án mất điện rồi phục hồi 5 ngày và chạy đủ50 nhịp trực tiếp trên trình duyệt. Sau chốt phân công thợ/bật tháp qua UI, chăm sóc live tăng từ21 lên40 nhịp có tác dụng; nhiên liệu cạn thì dừng. 50 người sống; mobile không tràn khung/không lỗi.
- Hồi quy test:anomaly-ui qua nguyên đường Công Nghệ Cao: trả/hủy/phục hồi điện/live chuyển cấp/quota3→9linh kiện/tựOFF/mobile. test:anomaly-save 5 checkpoint, session và era qua. Typecheck/build419,1KB qua.
- Đã xem ảnh mystic-entered-desktop.png, mystic-entered-mobile.png, mystic-tower-after-transition.png; thêm ảnh mystic-investment-preview.png. Texture cư dân chibi giữ nguyên.

## Tiếp theo

H4D2 xong. Tiếp H4E1 Quỷ Dị bằng context thay thế khác từ analysis-played-save.json trước quyết định, giữ 3 phân tích/viện; chọn nền tảng Quỷ Dị mới. Cần nguồn di tích/vật chất biến chất → xương cốt/huyết thạch → vật liệu hữu cơ → công trình dùng thật, cùng kiểm soát nhiễm/cách ly/thợ/vận chuyển/điện và texture riêng. Không bắt giết dân/hiến tế. Chưa mở lựa chọn Quỷ Dị trước kinh tế được kiểm tra và dự án chuyển cấp thật. Không sửa nhánh đã chốt của hai lượt trước. Sau đó mới cân nhắc biến thể tự nguyện/niềm tin/trang bị/UX; dầu/y tế/hạt nhân và toàn bộ kinh tế cuối game vẫn chưa xong.
