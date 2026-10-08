# Kiểm tra ổn định 150 ngày và quy trình thích nghi

Đợt kiểm tra ngày 07/10/2026, trước hạn bàn giao 03:27. Tiếp diễn các checkpoint thử đã kiếm vật tư/trả phí thật; không sửa bản lưu người dùng hoặc ba bản gốc đã chốt nhánh.

## Mô phỏng dài ngày

Từ bốn mốc 30 ngày, chạy thêm 1.200 nhịp (120 ngày), tổng 150 ngày. Có lưu/tải giữa đợt ở ngày bổ sung thứ 60. Các xưởng và viện nghỉ, đội công nghiệp được trả về lương thực như mốc trước; đây là kiểm tra duy trì làng, không phải sản xuất công nghiệp liên tục.

| Lượt | Cư dân sống cuối | Food thấp nhất trong 120 ngày thêm | Food cuối | Lượt hỗ trợ còn |
|---|---:|---:|---:|---:|
| Công Nghệ Cao | 50 | 1.434,9 | 1.743,1 | 100 |
| Linh Mạch | 50 | 1.392,9 | 1.706,9 | 100 |
| Quỷ Dị nghỉ khai thác | 50 | 1.442,3 | 1.900,0 | 100 |
| Quỷ Dị sau 5 mẻ lọc đã trả 1 sinh chất | 50 | 1.458,3 | 1.828,9 | 95 |

Mỗi nhịp kiểm tra số người sống, nhánh, lượt hỗ trợ và không có dự án thích nghi treo. Không phát sinh linh kiện/sinh chất miễn phí; lượt lọc không tiếp tục thu xương sau hết sinh chất lọc. Nhánh và lượt hỗ trợ giữ đúng sau lưu/tải. Không chứng minh toàn bộ bệnh lây/di truyền/endgame hoặc vận hành công nghiệp không cần tiếp tế.

Bằng chứng: scripts/test-variants-150day.ts; artifacts/variants-150day-result.json; bốn bản variants-*-150day-save.json. Bản 30 ngày và các bản variant gốc vẫn giữ nguyên.

## Trình duyệt và giao diện

scripts/test-variants-150day-ui.ts đã mở cả bốn bản 150 ngày, xác nhận 50 người sống, nhánh/lượt hỗ trợ, lưu lại, bảng chuẩn bị viện, desktop/mobile không tràn ngang và không lỗi trang/tài nguyên. Có ảnh variants-*-150day-browser.png; đã xem ảnh Linh Mạch.

Sau thay đổi UX, chạy lại đầy đủ test:augmentation-ui, test:mystic-adaptation-ui và test:eldritch-adaptation-ui: trả đúng vật tư, hủy hoàn, tải giữa tiến trình, bật lại điện rồi hoàn thành trực tiếp, chỉ một người thích nghi, làm việc thật tiêu lượt, chăm sóc/gỡ, đường vào từ Dân cư và mobile. Cả ba qua. Đã xem ảnh mobile Linh Mạch/Quỷ Dị: phụ kiện chibi giữ mềm, nút và số lượt đọc được.

Hai lượt thử đồng thời ban đầu hết thời gian chờ tải/thao tác ở Hightech/Quỷ Dị. Chạy lại riêng từng phiên đã qua đầy đủ; không tăng thời gian chờ hay bỏ điều kiện kiểm tra để nhận kết quả. Không ghi các lượt bị timeout là thành công.

Sửa khoảng cách một số nhãn chữ dính số trong thích nghi Quỷ Dị; không đổi phí/luật. Kiểm tra kiểu dữ liệu và build 487,5 KB qua. Test chuẩn bị viện của bản build cuối được ghi ở checklist sau khi hoàn tất.

## Đối chiếu thiết kế

Cập nhật bảng chính GAME_DESIGN_AUDIT.md: ba nhánh/dạng cư dân vòng đầu và bốn phép Era0 không còn bị ghi là chưa triển khai. Đặt ghi chú hiện trạng đầu GAME_DESIGN.md/ERA_SYSTEM_DESIGN.md để người đọc phân biệt ghi chú lịch sử với bản hiện chạy; giữ tầm nhìn thiết kế.

Chưa hoàn thành toàn bộ Cyborg/hạt nhân, dầu/vận tải, bệnh lây/y tế đầy đủ, di truyền biến thể/biến thể động vật, đổi/pha nhánh, endgame hoặc online. Đợt kế tiếp chỉ kiểm tra/sửa lỗi có bằng chứng và chuẩn bị bàn giao; từ 02:57 không mở tính năng lớn, 03:27 dừng phát triển và xóa lịch.

Test:adaptation-readiness-ui của bản build cuối đã qua: thiếu thợ/hàng không trừ phí, phân công/bật điện/trả đúng/hủy hoàn, khóa viện đang xử lý, mobile và không lỗi.
