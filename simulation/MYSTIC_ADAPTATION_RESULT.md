# Cộng hưởng tự nguyện Linh Mạch — vòng đầu

Đã hoàn thành dự án cộng hưởng/chăm sóc/gỡ/lắp lại cho một người trưởng thành trong lượt Linh Mạch riêng. Không chuyển toàn dân và không ghép hàng với Hightech/Quỷ Dị.

## Cơ chế

- Nghiên cứu Cộng hưởng tự nguyện cần Linh Mạch đã chốt và Chăm sóc cộng hưởng; trả2 tinh chất2 vải cùng chi phí cơ bản/thời gian.
- Đăng ký2 tinh chất1 vải/10 nhịp tại viện có thợ và2 công suất. Dùng điều kiện sẵn sàng/đồng ý người lớn như Hightech; giữ tiến độ nếu cần ăn/ngủ/mất điện/không sẵn sàng. Hủy hoàn phí một lần, lưu/tải chống trả lặp.
- Cư dân nhận ngọc nhỏ/dấu cộng hưởng/lá mềm trên hình chibi. Giữ nghề/tên/thuộc tính/tính cách/quan hệ, không tự di truyền.
- Có100 lượt hỗ trợ +20% tiến độ tinh luyện/dệt/xay/nướng khi làm thực, đủ đầu vào/chỗ hàng/điện, trong4 ô tháp có thợ tại chỗ/điện/tinh chất và nguồn ổn định≥40. Tiêu đầy đủ công thức; không tặng hàng.
- Ngoài vùng, nguồn yếu, tháp ngừng, ngủ/đi lại/thiếu đầu vào/đầy hàng thì không hưởng lợi hoặc tiêu lượt. Không cộng dồn nhiều tháp. Hết lượt chỉ dừng lợi ích.
- Chăm sóc1 tinh chất/4 nhịp tại viện sau khi đã dùng lượt; gỡ miễn phí/5 nhịp. Không tăng quân lực hoặc thêm hồi máu ngoài chăm sóc nền của tháp.
- Sửa thứ tự xử lý: thợ tháp/điều khiển được xử lý trước xưởng phụ thuộc trong cùng nhịp. Trước đó trạng thái thợ cập nhật muộn làm xưởng không nhận cộng hưởng ở lượt thực. Hightech/vi mạch đã kiểm tra hồi quy.
- Mô tả kỷ nguyên/UI được cập nhật: Hightech/Linh Mạch có vòng thích nghi tự nguyện, dạng cư dân Quỷ Dị/hạt nhân/đổi nhánh chưa có.

## Lượt kiếm hàng thật

Đọc artifacts/mystic-played-save.json, xuất mystic-adaptation-* mới; không sửa ba save nhánh gốc.

4 chuyến than trả32 vải; tinh luyện thêm11 tinh chất bằng linh thạch/thảo dược/vận chuyển thật,10 tinh chất chuẩn bị đã giao kho. Trả nghiên cứu/đăng ký, kiểm tra mất điện/lưu/hủy-hoàn, cộng hưởng đúng một người, chạy5 lượt công việc hưởng lợi và một mẻ tinh chất mới; chăm sóc/gỡ/đăng ký lại trả phí thật. Không cấp vật tư miễn phí.

619 bước,50 người sống, Food1688,9→1438,3, thấp1364,3. Checkpoint cuối artifacts/mystic-adaptation-played-save.json: Bảo#16 dạngmystic/100lượt, kho2tinh chất4linh kiện10thép19than484vải23đá xây/0linh thạch. Gen/lab/refineryOFF, thợ tháp đã rút vềFood; nguồn nghỉ. Thiếu linh thạch cho sản xuất tiếp phải khai thác lại nguồn, không cấp miễn phí.

Các mốc ready/paused/equipped/care-ready/cared/serviced/removed/played. care-ready/cared là mốc vận hành tháp+xưởng và tiêu lượt, không phải thương tích hay trị bệnh. Không dùng mystic-adaptation-waiting-save.json thất bại.

## Test

- test:mystic-adaptation qua lượt earned trên; giữ danh tính, phí/hoàn/outage/lưu/cộng hưởng/chăm sóc/gỡ/lắp lại.
- Fixture riêng cùng60 lượt xưởng: thêm mẻ với hệ số1,2, tiêu đúng2 linh thạch/mẻ và60 lượt hỗ trợ.40 linh thạch20 thảo dược là fixture, không tính earned. Ngoài vùng/thápOFF/nguồn39/charge0 không tăng tốc; nhiều tháp không cộng dồn; dạngHightech trongsaveMystic bị từ chối.
- test:mystic-adaptation-ui qua thao tác công khai phí2tinh chất1vải/refund/pause/reload/bật điện/live cộng hưởng1người/chế tinh chất thực/tiêu lượt/chăm sóc1tinh chất/gỡ/tải/mobile/noerrors/không tràn.
- test-mystic-adaptation-texture-ui.ts xác nhận phụ kiện thực sự được vẽ qua canvas game, ảnh tổng quan mới sau sửa mô tả.
- Hồi quy test:augmentation toàn vòng Hightech, test:three-branches-save13checkpoint chỉ đọc và test:microchips-ui qua. Type/build480,7KB qua.
- Đã xem mystic-adaptation-equipped-desktop.png, mystic-adaptation-mobile.png, mystic-adaptation-overview-desktop.png. Có ảnh working/world/texture-in-game/preview; ảnh empty-mobile thực chất là còn95 lượt sau làm5 lượt, không nhận là đã cạn100.

## Tiếp theo

Biến thể Quỷ Dị từ artifacts/eldritch-transition-played-save.json riêng: phải chế/giao sinh chất thật, preview/chi phí/cơ sở-thợ-điện/chăm sóc/đường gỡ và giảm rủi ro khai thác có giới hạn; không tự giết/hiến tế/lây đảo/đổi dân. Sau đó UX và kiểm tra cuối theo thời hạn03:27 ngày07/10, từ02:57 chỉ sửa lỗi/kiểm tra. Chưa toàn bộ endgame/Cyborg/hạt nhân/dầu/vận tải/y tế đầy đủ.
