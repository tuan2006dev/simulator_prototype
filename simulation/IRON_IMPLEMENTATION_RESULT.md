# Đồ Đồng → Đồ Sắt — 2026-10-05

## Phạm vi bản chơi cục bộ

Đã nối điều kiện tiến kỷ nguyên, chuỗi sắt/than, lanh/vải, kiến trúc cấp 3 và giao thương NPC với cư dân vận chuyển thật. Đây là chặng đầu của Đồ Sắt trong thiết kế; hơi nước, thép, phát điện nguyên mẫu và mạng kho nội bộ còn ở đợt tiếp theo.

### Điều kiện và chi phí

- 25 cư dân sống đã định cư; sức chứa đủ.
- Hoàn thành Luyện đồng, Chữ viết và Khảo sát sắt. Chữ viết/Khảo sát sắt mở ngay trong Đồ Đồng để không có vòng khóa.
- Đã sản xuất tổng cộng 50 đồng và 30 gỗ xẻ; có kho hoàn thành và dự trữ thức ăn dùng được ít nhất 5 ngày.
- Chủ động bấm phát triển; phí 30 gỗ xẻ +20 đồng +20 gạch, trừ một lần. Làm trong 30 tick có dân trưởng thành. Có thể lưu/tải giữa tiến trình. Đủ điều kiện không tự nhảy kỷ nguyên.

### Công trình và nghiên cứu mới

| Công trình | Sản xuất mỗi thợ/10 tick tại nơi làm việc, cấp 1 |
|---|---|
| Mỏ sắt | Thu 4 quặng sắt từ nguồn hữu hạn trong 3 ô |
| Mỏ than | Thu 6 than đá từ nguồn hữu hạn trong 3 ô |
| Lò luyện sắt | 4 quặng sắt +2 than →2 sắt |
| Ruộng lanh | 12 sợi lanh; đất màu mỡ +25% |
| Xưởng dệt | 6 sợi lanh →3 vải |
| Trạm giao thương | Chuyến hai chiều tới thương nhân ven nước theo gói người chơi chọn |

Luyện sắt mở ba công trình kim loại; Trồng lanh và dệt vải mở hai công trình sợi/vải. Kiến trúc Đồ Sắt cần nghiên cứu Luyện sắt và Kiến trúc Đồ Đồng, cùng 10 sắt +12 gạch, rồi cho nâng lên cấp 3. Nâng cấp từ cấp 2 dùng 10 sắt +20 gỗ xẻ +20 gạch ngoài gỗ/đá/thức ăn; cần thợ đến nơi và trả chi phí một lần.

Trạm cần nghiên cứu Giao thương và vận chuyển, gỗ/đá/thức ăn, 5 sắt và 4 vải. Tổng danh mục hiện có 21 loại công trình và 189 texture SVG (3 cấp ×3 phong cách Đồ Đá/Đồ Đồng/Đồ Sắt).

### Giao thương và vận chuyển

Phân công người cho trạm rồi chọn một chuyến:

- 8 đồng →10 than đá.
- 4 vải →10 quặng sắt.
- 10 gạch →12 sợi lanh.

Hàng xuất được giữ khi đặt chuyến. Cư dân đi từng ô tới điểm thương nhân có đường tới/đường về, trao đổi 10 tick rồi quay về trạm. Bản đồ hiển thị điểm gặp, hướng tuyến và biểu tượng xe hàng. Ăn/nghỉ, lệnh trực tiếp và đường bị chặn làm chuyến tạm ngừng. Hàng nhập chỉ vào kho sau khi về đủ chỗ nhận toàn bộ chuyến; không cộng vào bộ đếm sản xuất.

Hủy chuyến hoàn đúng số hàng đã giữ, không tạo sản lượng mới. Khi người vận chuyển chết hoặc rút khỏi trạm, chuyến bị hủy và hoàn hàng. Nâng cấp trạm cần hoàn tất/hủy chuyến trước. Không tự lặp chuyến hoặc tự tiêu hàng khi chỉ phân công nhân công.

Vận chuyển hiện áp dụng cho chuyến giao thương NPC. Các công trình sản xuất vẫn dùng kho chung; chưa có mạng kho khu vực, phân quyền/PvP hoặc trao đổi giữa người chơi. Các gói NPC dùng tỷ giá cố định và chưa mô phỏng hạn mức hàng của thương nhân.

### Lưu cũ và tài nguyên

Bản lưu cũ nhận năm hàng mới ở mức 0; nguồn sắt/than được bổ sung vào ô đất trống nếu thế giới chưa có loại đó. Dân, kho, công trình, tài nguyên và tiến độ cũ được giữ. Nguồn kim loại đã cạn không được sinh lại. Hàng/chuyến đang đi, tiến kỷ nguyên và nâng cấp đều được lưu.

## Kiểm tra

Test mô phỏng đã qua: tiếp tục từ bản Đồ Đồng đã chơi thật, đón thêm dân có trả phí lên 25, nghiên cứu, đạt sản lượng/dự trữ, tiến Đồ Sắt, khai thác/luyện/dệt, nâng cấp 3 và chuyến giao thương đi/về. Kiểm tra chi phí lệnh trùng, thiếu than, kho đầy, nguồn cạn, đường chặn, hủy chuyến, kế toán hàng nhập, mỏ theo seed và lưu/tải.

Test trình duyệt đã qua: tiến Đồ Sắt với phí một lần, tải lại tiến trình 0/30, khóa Hiện Đại, nghiên cứu/lưu, 21 texture tải được, nâng nhà cấp 3, đặt chuyến và quan sát di chuyển, tải lại giữa chuyến, nhận hàng và hủy hoàn hàng. Kiểm tra máy tính và màn hình 390 × 844 không tràn bảng; không ghi nhận lỗi chạy. Kiểm tra kiểu dữ liệu/build và test hồi quy lao động, phiên mô phỏng, bản đồ, sinh vật, công trình, server, cùng bốn luồng giao diện cũ đều qua.

Ảnh: [nhà cấp 3](artifacts/iron-house-level3.png), [chuyến giao thương trên bản đồ](artifacts/iron-trade-on-map.png), [danh mục điện thoại](artifacts/iron-catalogue-mobile.png), [kho hàng điện thoại](artifacts/iron-goods-mobile.png).

Chạy luồng kiểm thử: `npm run test:era` →`npm run test:bronze-economy` →`npm run test:iron` →`npm run test:iron-ui` (bước trình duyệt cần Playwright/Edge).
