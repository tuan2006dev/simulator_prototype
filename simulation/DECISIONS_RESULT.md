# H4B2 — Quyết định điểm lạ và hồ sơ nền tảng

Ngày06/10/2026, tiếp từ `artifacts/analysis-played-save.json`. Không sửa bản lưu người dùng.

## Đã thực hiện

- Sau phân tích, xem trước lợi ích/chi phí/hệ quả rồi xác nhận: nghiên cứu / phong tỏa / bỏ qua.
- Nghiên cứu trả4 linh kiện, giữ một dự án tại cơ sở đo đạc:60 nhịp thợ làm tại chỗ,2 công suất. Đi tới làm, nghỉ ăn/ngủ, thiếu điện giữ tiến độ; hủy hoàn4 một lần và xóa tiến độ. Hồ sơ nền tảng riêng theo ba hướng: giải mã cấu trúc / cộng hưởng linh mạch / kiểm soát mẫu sinh khối.
- Phong tỏa trả4 vải+2 đá xây, khép nghiên cứu/khai thác điểm đó. Quyết định cố định được báo trước, không hại dân và không khóa kinh tế công nghiệp. Hiện chưa có sự cố dị tượng cần triệt tiêu; không giả lập lợi ích phòng tránh tai họa chưa tồn tại.
- Bỏ qua miễn phí, không nhận lợi ích, có thể quay lại nghiên cứu/phong tỏa. Không ép chọn nhánh.
- Lệnh lặp không thu thêm phí; hoàn thành không thể hủy lấy lại vật tư. Lưu/tải kiểm tra quyết định, hồ sơ hoàn tất và tiến độ hợp lệ; không cho hai dự án phân tích/nền tảng trùng nhau.
- Giữ chi tiết xem trước, cơ sở được chọn và cuộn khi bảng cập nhật trong lúc game chạy. Bảng công trình hiển thị dự án nền tảng/60.

## Bằng chứng thực và giới hạn

Mô phỏng từ bản đã sản xuất/trả phí: nhập2 chuyến than, mỗi chuyến trả8 vải và vận chuyển tới bờ/trao đổi/trở về; không cấp vật tư. Dùng4 linh kiện còn lại cho nền tảng Công nghệ; phong tỏa Linh Mạch, tạm bỏ qua vùng Quỷ Dị.221 bước,50 sống/Food1869,7. Kho0 linh kiện/0 phần máy/0 thép/0than; máy phát còn3than tại buffer+10 nhịp nhiên liệu,6 cấp/2 cầu. Điện viện146 nhịp, steadyTicks xưởng0. Các lựa chọn trong save thử này là đường kiểm tra, không đổi save người dùng.

`test:decisions` qua: trả phí/replay/idempotent, giữ mẻ khi outage, lưu giữa dự án và chạy tiếp bằng session mới, hủy một lần/xóa tiến độ,60 nhịp tại chỗ hoàn tất, phong tỏa cố định, bỏ qua có thể xét lại (fixture riêng), từ chối save hỏng,50 người sống, Hiện Đại giữ nguyên/Dị Tượng khóa.

Trình duyệt Edge context riêng kiểm tra public preview/xác nhận/phí/pause/tải/hủy/phục hồi điện/chạy thật hoàn tất nền tảng; phong tỏa/bỏ qua/lưu/mobile/no overflow/no lỗi. Ảnh: `artifacts/decisions-preview-desktop.png`, `decisions-island.png`, `decisions-mobile.png`. Kiểm tra lại giữ preview mở qua các nhịp cập nhật khi mô phỏng chạy đã qua. Typecheck/build385,3KB/session/era qua. Lần chạy lại trên ổ C gặp ENOSPC khi chụp ảnh; đã dùng thư mục tạm thử riêng D:\codex-game-tests-h4b2, chạy lại trọn bộ browser qua, không xóa dữ liệu người dùng.

## Chưa hoàn thành / việc tiếp theo

H4B2 lựa chọn và nền tảng đã có; **H4 tổng chưa xong**. Nền tảng là hồ sơ kiến thức đã trả phí, **chưa mở kinh tế nhánh, chưa là chuyển kỷ nguyên**, chưa nhận biến thể. Không tuyên bố chuỗi Dị Tượng chơi được hoặc Hiện Đại dầu/y tế đã xong.

Tiếp từ `artifacts/decisions-played-save.json` (earned), bổ sung linh kiện/thép/than qua sản xuất và giao thương thật trước chi phí lớn. Nối hồ sơ Công nghệ với nguồn và nơi dùng sản phẩm nhánh (ví dụ linh kiện→vi mạch→công trình điều khiển dùng vi mạch, cần điện/vận chuyển). Duy trì cấu trúc ba hướng; chỉ chốt nhánh chủ đạo khi xác nhận chuyển đổi. Chưa bật `ERAS.anomaly.implemented` cho đến chuỗi tương ứng chạy/test được, đủ3 phân tích/5ngày điện riêng cùng viện, dự án nền tảng và phí/thời gian tiến cấp thực. Phong tỏa/bỏ qua không mở nhánh hoặc phá đảo.
