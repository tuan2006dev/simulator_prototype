# Quỷ Dị — tiến cấp trả phí và lọc mẫu (H4E2)

06/10/2026. Tiếp artifacts/eldritch-played-save.json H4E1 earned, không làm lại nền tảng/ba phân tích/xưởng/cách ly. Hightech và Mystic giữ hai lượt độc lập; các kiểm tra hồi quy chỉ đọc checkpoint rồi dùng bản sao trong bộ nhớ/trình duyệt riêng. Không thay save người dùng.

## Đường chơi đã kiểm tra

- Ba hướng có gate riêng. Quỷ Dị cần3hồ sơ phân tích/nền tảng eldritch, thu20xương10huyết thạch/chế9sinh chất/nghiên cứu kiểm soát/xưởng đã làm9mẻ, khu cách ly đã kiểm soát20nhịp, nhiễm nguồn<40 và không cư dân chạm30phơi nhiễm. Cùng viện có thợ, ON/đủ2công suất và50nhịp điện liên tiếp riêng; không mượn proof xưởng hoặc thời gian nền tảng cũ.
- Xem trước rồi xác nhận trả50linh kiện20thép đã giao kho một lần, dự án50nhịp người thực sự làm ở viện (5ngày công). Ăn/ngủ/mất điện giữ tiến độ, mất điện đặt lại proof viện; cần phục hồi5ngày trước tiếp tục. Lưu giữa chừng không trả phí lại; hủy xóa tiến độ/hoàn một lần; đã xong không hủy/đổi nhánh.
- Sau chốt Quỷ Dị, trạm có nút Lọc mẫu chủ động:1sinh chất giao tại trạm cho5mẻ; mỗi mẻ vẫn tiêu1charge và ra2xương1huyết thạch, nhiễm nguồn8→4/phơi nhiễm thợ5→2. Chỉ tiêu nhiên liệu khi có nguồn/đầu ra còn chỗ và mẻ thực sự thành công. Thiếu nhiên liệu thì dừng an toàn; cho trạm nghỉ hoặc tắt lọc giữ phần còn lại. Không cộng bonus cho tất cả nghề/quân lực/sức khỏe, không tự biến đổi dân.
- Cơ chế lọc là nơi dùng sinh chất mới sau chuyển nhánh, không chỉ đổi nhãn kỷ nguyên. Công nghiệp/cách ly hiện tại tiếp tục dùng được. UI/renderer gọi đúng Quỷ Dị; cư dân vẫn chibi và giữ danh tính/nghề/thuộc tính.

## Kiếm phí và tiến cấp earned

1. Từ0components/0steel:24chuyến quặng(240),20chuyến than(200),5chuyến đồng(30),49chuyến trả316vải. Luyện thật60thép, lắp ráp17mẻ51linh kiện, giao đủ kho, dừng theo hàng vừa chế rồi chờ giao. Rút các xưởng/công trình OFF và trả người về Food sớm.
2. 1799bước/50sống/Food1799,4, kho51components22steel19coal596cloth25cutStone,0parts; việnproof0 đúng reset. artifacts/eldritch-prepared-save.json là tiền đã kiếm, chưa mở dự án, không cộng đồ tại xưởng/đang giao vào phí kho.
3. Tiếp239bước: phục hồi viện50proof mới, trả50+20/replay không trừ lần hai, làm tới5nhịp/đứt điện5nhịp/lưu/hủy hoàn/lấy lại proof/khởi động lại/tải/hoàn50nhịp. Chốteldritch/50sống/Food1719,4, kho1components2steel/0coal; proof viện173 lúc chốt. artifacts/eldritch-entered-save.json.
4. Tiếp69bước: tắt viện/máy phát, rút nhà khoa học về Food, phân công người tới trạm, giao1sinh chất kiếm được và bật lọc; thu đúng5mẻ mới10xương5huyết thạch/tiêu đúng1sinh chất. Không cấp sinh chất hoặc lấy từ lượt Mystic/Hightech. artifacts/eldritch-transition-played-save.json:50sống/Food1744,6, nguồn23/15nhiễm, người thu5phơi nhiễm; kho1components2steel0coal596cloth22xương11huyết thạch0sinh chất25đá xây/0parts. Trạm còn2xương1huyết thạch chờ giao, lọcON/fuel0/trạm nghỉ; cách ly còn1bio input/OFF, máy phátOFF còn4than tại máy+9nhịp fuel. ViệnOFF/proof0 sau khi chốt là hợp lệ, không bắt giữ máy chạy mãi.

Các checkpoint bổ sung: eldritch-ready-save (đủ gate/phí), eldritch-paused-save (dự án5nhịp/việnOFF/proof0), eldritch-safety-ready-save (đã chốt/lọcON/1bio tại trạm/chưa thu mẻ). Không dùng waiting/failure checkpoint tiếp tục.

## Bằng chứng test

- test:eldritch-preparation và test:eldritch-transition: toàn tuyến earned trên; giữ50dân và danh tính/nghề. Negative fixtures: proof49/care19/bio8/thiếu nền tảng/nhiễm40/phơi nhiễm30/sai hướng không thu phí; chosen save thiếu kinh tế bị từ chối.
- Lọc earned1bio/5mẻ đã chạy. Fixture riêng kiểm tra thiếubio/fuel giữ nguồn, fuel5 giảm đúng20nhiễm/+10exposure sau5mẻ/tiêu5charge, fuel6 bị từ chối; không nhận việc đặt fuel fixture là nguồn nguyên liệu của lượt earned.
- test:eldritch-transition-ui: public preview/phí50+20/pause/tải/hủy/hoàn; tải giữa outage/bật viện/lấy lại5ngày điện/live hoàn50nhịp. Nút lọc tắt/bật/tải/chạy thực/tiêu1bio/ra đúng2+1 theo từngmẻ/giữfuel khi tắt; desktop/mobile390px/50sống/không lỗi/không tràn ngang. Đã xem ảnh/sửa câu chữ và cảnh báo thiếu nhiên liệu rồi chạy lại.
- test:three-branches-save:13checkpoint của3nhánh đọc/tải/roundtrip/50sống, từngnhánh đủgate trả50+20/hủy hoàn1lần; saveQuỷDị thiếufoundation/9bio/20care bị từ chối, lọc trước chốt bị khóa. Không ghi lại hai save chính cũ.
- test:anomaly-ui public Hightech: hồi quy phí/pause/tải/hủy/livechốt/quota3→9linhkiện/tựOFF/clear/mobile qua. anomaly-save/session/type/build qua. Bản463,5KB, giữ41côngtrình369texture94icon.
- Ảnh: artifacts/eldritch-investment-preview.png, eldritch-entered-desktop.png, eldritch-safety-desktop.png, eldritch-entered-mobile.png. Có hình trong game và thao tác, không thay bằng ảnh gallery.

## Chưa hoàn tất

Ba nhánh hiện có đường chơi đầu tiên đã trả phí và kiểm tra, không đồng nghĩa toàn bộ Dị Tượng/endgame xong. Chưa biến thể tự nguyện, hạt nhân, đổi/pha nhánh, dầu/vận tải, bệnh lây/y tế đầy đủ, chơi mạng/ngoại giao/PvP. Phơi nhiễm Quỷ Dị còn là giới hạn lao động có kiểm soát, không phải mô hình bệnh lây/đột biến toàn diện.

Tiếp đề xuất đã trong phạm vi24h: một biến thể tự nguyện có xem trước/vật tư/thời gian tại cơ sở/chăm sóc/đường gỡ, giữ nghề/quan hệ/tính cách và chibi mềm. Làm từng hướng trên lượt earned tương ứng, không ghép save: Hightech dùng linh kiện/vi mạch/bảo dưỡng; Mystic dùng tinh chất/vùng cộng hưởng; Eldritch dùng sinh chất/kiểm soát phơi nhiễm. Thiếu chăm sóc chỉ ngừng lợi ích/cảnh báo, không tự giết hoặc đổi toàn dân. Sau đó UX phân công/cảnh báo/người mới và cân bằng nếu còn thời gian. Hạn03:27ngày07/10, từ02:57 chỉ sửa lỗi/kiểm tra cuối.
