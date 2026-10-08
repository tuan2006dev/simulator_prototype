# Chuẩn bị viện và kiểm tra30ngày

## UX đã sửa

Trước đăng ký/chăm sóc, bảng hiển thị số vật tư trong kho so với phí, viện có thợ hay chưa và trạng thái2công suất. Thiếu thợ/vật tư thì nút trả phí bị khóa ở UI, có lý do; nghiên cứu/đồng ý vẫn bắt buộc. Backend giữ khả năng queue/pause/lưu/hủy, không tự cấp vật tư.

Có nút Phân công/xem viện và Xem nhiên liệu máy phát đưa tới chi tiết công trình, cùng nút bật/tắt viện/máy phát. Phân công người lớn thật qua giao diện hiện có, sau đó trở về Nhiệm vụ. Không tự chọn/đổi người. Viện chọn được giữ trong UI; khi đang xử lý hiển thị/khóa đúng viện của dự án. Người đang xử lý không còn xuất hiện trong danh sách phân công công trình.

Cư dân đã thích nghi/đang xử lý/người sẵn sàng đứng đầu; người chưa sẵn sàng gom trong mục mở rộng, có sức khỏe/đói/mệt/sợ và lý do. Có cảnh báo hết lượt/lợi ích tạm ngừng và cách chăm sóc/gỡ trong bảng; hồ sơ cư dân hiển thị dạng/lượt còn và đường tới Nhiệm vụ/Dân cư. Gỡ miễn phí vẫn có thể xếp lịch, nhưng cần thợ/điện để hoàn tất.

Nút có khung nâu theo giao diện giấy, vùng bấm≥42px và toàn chiều ngang ở điện thoại; khung chuẩn bị viện nổi rõ, không còn chữ nút dính nhau. Không đổi phí/công thức/hiệu quả của ba dạng.

## Test UI

test:adaptation-readiness-ui qua sau xem ảnh và sửa kiểu nút: public mở viện/rút thợ → nút trả phí khóa/không trừ hàng → phân công lại → bật viện/máy phát/đủ2power → đăng ký đúng2bio1cloth → viện chọn bị khóa/actor không thể phân công chồng → hủy hoàn; Hightech thiếuvi mạch/linh kiện khóa trước trả phí; charge0 hiển thị cảnh báo; lý do chưa sẵn sàng mở được; desktop/mobile/noerrors/nooverflow.

Ảnh đã xem adaptation-preparation-desktop.png và adaptation-preparation-mobile.png. Type/build487,5KB qua. Chỉ thay UX/hiển thị, backend queue và các phí giữ nguyên.

##30ngày mô phỏng thật trên các lượt đã có dạng

Đọc riêng augmentation-played/mystic-adaptation-played/eldritch-adaptation-played, không sửa gốc hoặc ghép hàng. Tắt điện/công nghiệp, trả đội xưởng/lab vềFood trước kiểm tra,300bước=30ngày. Chăm sóc ăn/ngủ/đột kích còn hoạt động.

| Lượt | Sống | Food đầu | Thấp | Cuối | Lượt hỗ trợ |
|---|---:|---:|---:|---:|---:|
| Hightech nghỉ công nghiệp |50|1735,4|1512,9|1662,9|100|
| Mystic nghỉ công nghiệp |50|1438,3|1435,7|1735,4|100|
| Eldritch nghỉ công nghiệp |50|1891,4|1418,9|1840,9|100|

Không có thêm linh kiện/sinh chất trong ba lượt nghỉ; không tiêu lượt vì chưa làm việc đặc biệt. Đây là kiểm tra duy trì cư dân, không phải30ngày sản xuất công nghiệp liên tục.

Thêm một lượt Eldritch độc lập từ eldritch-adaptation-played: lấy1sinh chất kiếm được trong kho để lọc tại trạm, phân công cư dân thích nghi đi thu thật.300bước/30ngày/50sống, Foodthấp1413,7/cuối1797,4; đúng5mẻ lọc tạo10xương5huyết thạch, tiêu1bio, charge100→95; hết nhiên liệu trạm dừng và giữ người an toàn, cuối exposure0 qua nghỉ tự nhiên. Không cấp hàng hoặc khai thác liên tục sau hết đầu vào.

Các checkpoint variants-hightech-30day/variants-mystic-30day/variants-eldritch-30day/variants-eldritch-filtered-30day-save.json và bảng variants-long-run.json. test:variants-long-run qua, test-variants-long-run-ui.ts mở4mốc trên browser:50alive/đúng nhánh/charge100hoặc95/lưu/tải/portrait/readiness/mobile/noerrors, có ảnh variants-*-browser.png.

## Tiếp kiểm tra

Kiểm tra thêm vận hành dài hơn/UX và hồi quy trước bàn giao; từ02:57 ngày07/10 chỉfix/check,03:27 dừng và tổng hợp/xóa lịch. Không mở hạt nhân/dầu/online/genetics hoặc nhận toàn bộ game design đã xong. Nếu kiểm tra dài phát hiện thiếu nguồn/nhân lực, xử lý bằng thao tác/sản xuất thật; không cấp hàng hoặc ghép save.
