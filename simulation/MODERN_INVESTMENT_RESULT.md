> Cập nhật06:36: H2 đã hoàn thành, public Modern mở và test lại cùng chuỗi nhà máy; xem MODERN_FACTORY_RESULT.md. Phần staging04:38 bên dưới giữ làm lịch sử.

# Lõi chuyển cấp Hiện Đại — đợt staging

Trạng thái 04:38 ngày 06/10: **lõi chuyển cấp và UI tiến độ đã qua test; nút bắt đầu Hiện Đại trong game vẫn khóa**. Chưa đánh dấu H1/H2 hoặc N4 hoàn thành, vì nhà máy/chuỗi linh kiện chưa được nối. ERAS.modern.implemented vẫn false. Không coi ảnh staging là người chơi đã mở Hiện Đại.

## Đã làm

`beginModernDevelopment` kiểm tra dân/giường/nghiên cứu/sản lượng/điện/vận chuyển/7 ngày thức ăn, người chưa đặt và nghiên cứu đang làm. Kiểm tra đủ cả ba vật tư trước khi trừ **30 thép +40 đá xây +20 vải** một lần. Không trừ thức ăn. Chuyển cấp 50 nhịp =5 ngày, lưu target modern/workTicks/ticksNeeded; validate đúng nguồn Đồ Sắt và thời lượng 50. Không lấy thời gian ngoài game làm tiến độ. Điều kiện xét lúc bắt đầu; sau đầu tư dân vẫn ăn/ngủ/vận chuyển, có thể tắt xưởng để dành kim loại cho công trình mới. Tiến độ cần ít nhất một cư dân trưởng thành sống đã đặt, theo hai chuyển cấp trước.

UI của save đang chuyển cấp hiện thanh tiến độ, phí đã trả, 5 ngày, nút khóa khi đang làm và nhắc pause/lưu. Nút bắt đầu chỉ được nối khi cờ Hiện Đại được mở sau kiểm chứng toàn bộ chuỗi. Tách COMMODITIES sang commodities.ts (civilization vẫn re-export) để tránh vòng khởi tạo xuất hiện khi nối điều kiện Modern.

## Test và giới hạn bằng chứng

`test:modern-investment` gọi trực tiếp lõi trên bản modern-ready-save.json đã tích phí thật, không sửa kho/unlock: thiếu từng vật tư hoặc hết Food không trừ phí một phần; gọi lặp không trả hai lần; snapshot sau 15 nhịp, decode giữ chính xác; 49 nhịp vẫn Đồ Sắt, nhịp 50 mới hoàn thành trong world test; 50 dân sống. Tổng hàng trong kho +buffer +freight giảm đúng phí dù vận chuyển vẫn tiếp tục. Sai nguồn kỷ nguyên/49 thay 50/tiến độ âm hoặc vượt50 bị từ chối. Public command develop_era của bản ready vẫn bị chặn với cờ Modern false. Đây là test lõi staging, chưa là lượt tiến cấp từ nút người chơi.

`test:modern-investment-ui` qua context browser riêng: load staging đã trả phí 15/50, pause không đổi vật tư/tiến độ, chạy nhịp thật rồi lưu/reload đúng, đủ 50 dân; desktop/390×844 không lỗi/tràn. Bản ready thường vẫn không có nút bắt đầu được mở. `test:modern-readiness-ui` hồi quy qua. Type/build, era (đường Đồ Đá→Đồ Đồng), session và logistics qua. Ảnh modern-investment-staged-desktop/mobile/resume.png; save modern-investment-stage-save.json. Giữ preview local và bản lưu người dùng.

Hai lỗi test được sửa đúng nguyên nhân: mô phỏng giới hạn10 nhịp/lần nên chạy từng nhịp; hàng trong buffer giao tiếp về kho làm số kho tăng sau trả phí, nên kiểm tra bảo toàn tổng hàng thay vì giả định kho đứng yên. Không nới luật để qua test.

## Đợt tiếp theo — H2 rồi mới mở H1/H2

Tiếp từ source/core/UI vừa nối, không làm lại lõi chuyển cấp. Dùng modern-ready-save.json cho lượt đầu-cuối qua public command sau khi chuỗi nhà máy có đủ code/test. Hướng triển khai vừa sức:

- Nhà máy linh kiện (component_factory): 2 thép +2 đồng →3 linh kiện/mẻ, 2 công suất, thợ/đầu vào/thành phẩm đều vận chuyển thật. Texture công trình và icon linh kiện riêng.
- Nghiên cứu lắp ráp công nghiệp trong Hiện Đại, dựa Cơ giới/Điện học; dùng bộ phận máy +gỗ xẻ đã có, thời gian và chi phí thật. Xây nhà máy dùng thép/đá xây/bộ phận máy. Có thể bắt đầu với phí 30gỗ/20đá/20food +4thép/10đá xây/4bộ phận máy, cân bằng ghi báo cáo.
- Nâng cấp nhà máy tiêu ít nhất 6 linh kiện ở cấp2, cộng chi phí thường; tăng số thợ thật. Đây là nơi dùng sản phẩm và mục tiêu chơi trước khảo sát dị tượng. Không thêm hàng linh kiện nếu thiếu sink này.
- Mở rộng PowerManager/SaveSystem/logistics/BuildingManager/productionWorkforce/BuildData/IndustryPanel cho nhà máy, nguyên liệu, lựa chọn ưu tiên/tắt máy. Hiện điện không tích kho. Proof tiến cấp vẫn cùng một prototype_workshop đã làm hàng, không ghép các xưởng.
- Chỉ mở ERAS.modern khi full chain chạy được và kiểm tra; build/browser test public start/5 ngày/nhà máy/linh kiện/nâng cấp, thêm outage và vận chuyển bị chặn/lưu giữa mẻ. Khi mở cờ phải cập nhật các test cũ đang cố ý kiểm tra Modern bị khóa và nội dung EraPanel theo phạm vi thực sự đã có. Dị Tượng vẫn khóa.

Lưu ý: phí lấy khỏi kho, không lấy buffer. Sau đầu tư kho thép còn6, xưởng cũ có4 thép trong input; tắt prototype sau bắt đầu để dành6 cho nhà máy. Nguồn đồng còn56 tại11,8 và8 quặng/2đồng ở buffer cũ; vải đủ đổi thêm quặng sắt. Than có8 kho+8máy, cần quản lý nhiên liệu và mua thêm bằng đồng sản xuất thật khi nghiên cứu/lắp ráp kéo dài. Không cấp miễn phí để đạt chuỗi.
