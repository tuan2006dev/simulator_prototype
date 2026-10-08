# Thích nghi sinh chất tự nguyện Quỷ Dị — vòng đầu

Đã có dạng cư dân Quỷ Dị đầu tiên, trả vật tư và chạy khai thác/chăm sóc/gỡ thật trong lượt riêng. Ba hướng có vòng thích nghi từng người; chưa toàn bộ endgame/genetics/chủng loài.

## Cơ chế đã kiểm tra

- Nghiên cứu Thích nghi sinh chất tự nguyện cần Quỷ Dị đã chốt/kiểm soát sinh chất; trả2sinh chất2vải cùng chi phí cơ bản/thời gian.
- Đăng ký2sinh chất1vải/10nhịp tại viện/thợ/2công suất. Người lớn sẵn sàng như hai nhánh trước; thêm phơi nhiễm<15. Không ép trẻ hoặc thay toàn dân.
- Lớp bảo vệ mềm có đường may/ngọc nhỏ trên hình chibi. Giữ nghề/tên/thuộc tính/tính cách/quan hệ, không tự di truyền hoặc tăng quân lực.
- 100mẻ khai thác thành công: phơi nhiễm cá nhân thường5→3, khi lọc2→1. Vẫn cần lọc/nghỉ/cách ly. Nhiễm nguồn vẫn8 hoặc4, ngưỡng nguồn60/người30, giá charge/yield2xương1huyết thạch giữ nguyên. Không miễn nhiễm/giết/hiến tế/lây cả đảo.
- Chỉ dùng lượt khi thu mẫu thành công. Nguồn chặn/đầy đầu ra/trạm nghỉ/thiếu nhiên liệu lọc giữ lượt. Hết lượt trở về phơi nhiễm thường; không làm chết ngay.
- Chăm sóc1sinh chất/4nhịp sau khi dùng lượt; gỡ miễn phí/5nhịp tại viện. Outage/ăn-ngủ/vắng giữ tiến độ; save/idempotent/hủy hoàn1lần như hai nhánh trước, không nạp miễn phí khi hủy.
- Bảng thích nghi dùng cấu hình riêng từng nhánh, có phí/hiệu quả/đường gỡ và phơi nhiễm hiện tại. Metadata kỷ nguyên đã cập nhật cả3dạng vòng đầu, còn thiếu hạt nhân/đổi nhánh.

## Lượt earned riêng

Tiếp artifacts/eldritch-transition-played-save.json; không ghi đè ba save nhánh gốc/không ghép hàng. Bản gốc viện không còn thợ, đã phân công người lớn thật sau nghiên cứu để xử lý.

8chuyến than trả64vải; chế/giao8sinh chất từ xương/huyết thạch/thảo dược thật. Trả nghiên cứu/đăng ký, kiểm tra mất điện/tải/hủy/hoàn; thích nghi1người, đi tới di tích và thu1mẻ thật (2xương1huyết thạch), phơi nhiễm3 thay5, tiêu đúng1lượt. Cho trạm nghỉ; chăm sóc trả1sinh chất/gỡ/đăng ký lại trả2sinh chất1vải thật.

582bước,50người sống, Food1744,6→1891,4, thấp1570,9. artifacts/eldritch-adaptation-played-save.json: Bảo#16 dạngeldritch/100lượt; kho1sinh chất1linh kiện2thép48than528vải6xương3huyết thạch25đá xây. Gen/lab/xưởngOFF, trạmnghỉ/lọcOFF, thợ xử lý đã trả vềFood; không cấp hàng miễn phí. Các mốc ready/paused/equipped/care-ready/cared/serviced/removed/played. Không dùng waiting thất bại.

## Bằng chứng

- test:eldritch-adaptation qua earned phí/tải/outage/hủy/một người/thu thật99lượt/phơi nhiễm3/chăm sóc/gỡ/lắp lại.
- Fixture riêng: thường5/thích nghi3/lọc+thích nghi1; giữsourcecharge/yield/ngưỡng, nguồn60/đầy đầu ra không tiêu lượt, charge0 về mức5. Phơi nhiễm15 bị từ chối không mất phí; dạng sai nhánh bị từ chối. Không tính fixture vào hàng kiếm được.
- test:eldritch-adaptation-ui qua public preview/phí2bio1cloth/refund/pause/load/bật viện/live1adult/liveharvest/tiêu lượt/chăm sóc1bio/gỡ/mobile/noerrors/nooverflow.
- test-eldritch-adaptation-texture-ui.ts xác nhận patch mềm được vẽ thực qua canvas game và ảnh tổng quan. Đã xem equipped-desktop/mobile; ảnh khác preview/working/world/texture-in-game/overview.
- Hồi quy augmentation/Mystic toàn vòng,13save3nhánh chỉ đọc,care/clinic/era/session qua. Type/build482,9KB qua.

Trong đợt ghi mã đã có lỗi Unicode làm rỗng file nghiên cứu. Đã khôi phục cây công nghệ từ bản build đã kiểm tra và nguồn map, bổ sung lại khóa người đang chăm sóc/thích nghi; đối chiếu toàn bộ43công nghệ cũ về trường dữ liệu/phí/hiệu ứng/điều kiện giống bản đã kiểm tra (test-research-recovery.ts), chỉ thêm biological_adaptation là node44. Hồi quy cả nghiên cứu/kỷ nguyên, ba vòng thích nghi và y tế đã chạy lại. Không đụng bản lưu người dùng.

## Checklist tiếp

- [x] Ba dạng tự nguyện vòng đầu với vật tư thật, hiệu quả riêng, chăm sóc/gỡ, chibi và browser.
- [ ] UX rõ thiếu thợ/điện/vật tư trước đăng ký; viện trống phải có bước phân công dễ thấy, tránh trả phí rồi chờ vô hạn.
- [ ] Cảnh báo upkeep/phân công/người mới, sửa nhãn/độ dài văn bản.
- [ ] Kiểm tra dài ngày các lượt có dạng mới, phân biệt chỉ duy trì sống và sản xuất liên tục.
- [ ] Kiểm tra bàn giao cuối, tổng hợp mục chưa làm/ảnh/save trước03:27; từ02:57 không mở tính năng lớn.

Cyborg đầy đủ/hạt nhân/dầu/vận tải/bệnh lây/y tế đầy đủ/di truyền/biến thể động vật/đổi-pha nhánh/endgame/online còn thiếu.
