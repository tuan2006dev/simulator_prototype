# Chuẩn bị Hiện Đại — đợt N4A

Đã có bảng điều kiện trong Lộ trình khi đang Đồ Sắt: 50 dân định cư, giường thực, ba nghiên cứu, 30 thép đã sản xuất, một xưởng có điện liên tục 3 ngày, người vận chuyển có chuyến đã giao, kho đủ 7 ngày và thức ăn đã về kho. Tính cả khẩu phần vật nuôi đã thuần hóa. Không tính 15 chỗ tiếp nhận khởi đầu là giường, lúa mì thô hay hàng trên đường là dự trữ kho. Hiện Đại vẫn khóa; phí 30 thép +40 đá xây +20 vải/5 ngày chưa trừ.

## Sửa điểm nghẽn sinh tồn và vận chuyển

- Khi kho hết thức ăn, dân đói đi thật tới công trình còn thức ăn thành phẩm và ăn đúng số lượng tại chỗ. Giữ công việc/hàng/tiến độ; không cộng kho, thành tích sản xuất hoặc chuyến giao từ bữa ăn.
- Khi thiếu dự trữ, tiếp nguyên liệu lò bánh trước khi dọn hàng công nghiệp/lúa mì dư. Thức ăn thành phẩm vẫn được đưa về trước.
- Người đang đi lấy hàng giữ một phần mẻ đó, giúp đội chọn nguồn khác thay vì tất cả đuổi cùng mẻ nhỏ rồi về tay không. Không tạo hàng, vẫn lấy và giao ở các bước khác nhau.
- Lưu/tải số chuyến thật; từ chối số âm, phân số, chuỗi và vượt số nguyên an toàn. Save cũ không được tự tặng lịch sử chuyến.

## Bằng chứng chơi và kiểm tra

`test:modern-preparation` đã qua từ industry-upgraded-save.json của lượt Đồ Sắt có nguồn gốc sản xuất/giao thương thật: xây thêm 7 nhà, 3 kho, 2 nông trại và 2 lò bánh; đổi lao động và mời 25 người bằng phí thật. Đạt 50 dân sống/50 giường/kho 1900, Food 1840 sau 5469 bước; tiếp tục 30 ngày giữ đủ 50 người sống, Food 1900, 2725 chuyến giao tính từ khi thêm bộ đếm. Không sửa kho, nhu cầu, nguồn, hoàn thành công trình hay mở khóa để đạt ngưỡng. Các lượt thử thất bại được giữ riêng, không tính là thành công. Một lỗi chính là nhiều người cùng chọn mẻ thức ăn nhỏ, bỏ phí vận chuyển và làm các xưởng đói; sửa phân chia chuyến đã khép lượt mở rộng này.

`test:emergency-meals` qua đường đi/bữa ăn ở bước sau, giảm buffer chính xác, không ăn qua đường bị chặn, khẩu phần thiếu phục hồi tương ứng, giữ hàng gỗ/công việc dở, ưu tiên nguyên liệu bánh, phân chia nguồn và kiểm tra save.

`test:modern-preparation-ui` qua desktop/390×844 trong browser context riêng: 10 điều kiện, 25/50 dân và 15/25 giường ở làng cũ; làng 50 dân thật hiện đủ giường và 7 ngày ăn; mở đúng mục còn thiếu, pause không trả phí/đổi vật tư; Hiện Đại vẫn khóa. Fixture khan hiếm riêng chạy nhịp game thực, dân tới thức ăn tại xưởng rồi giảm đói, vẫn sống. Không ghi đè bản lưu người dùng.

Ảnh: artifacts/modern-preparation-desktop.png, modern-preparation-mobile.png, modern-50-preparation-desktop.png, modern-50-island.png, emergency-meal-browser-fixture.png. Save thành công: modern-50-expanded-save.json, modern-50-stable-save.json. Fixture browser có tên riêng, không dùng để chứng minh kinh tế 50 dân.

Kiểu dữ liệu/build qua. Hồi quy daily-life/faith/weather/logistics/production-workforce/raids/session qua. Kiểm tra lặp lại industry/industry-ui qua, với thêm 2 chuyến than trả bằng đồng và tắt máy lúc chờ nâng cấp. Modern-preparation chạy lại từ đầu vào vừa tái tạo qua: 50 người/50 giường/kho 1900/Food 1840 sau 4832 bước, thêm 30 ngày vẫn đủ 50 người, Food 1900, 3365 chuyến. Production-workforce và management chạy lại qua. HTTP local 4173 trả 200.

## Còn phải làm

N4 chưa hoàn thành. Làng 50 dân đang tắt máy phát/xưởng trong giai đoạn mở rộng; chưa tích 30 thép phí, đủ 20 vải và khôi phục bằng chứng điện. Tiếp theo sản xuất/giao thương thật để đủ phí, nối tiến cấp 5 ngày, rồi nhà máy linh kiện dùng kim loại +điện với nơi dùng sản phẩm. Chỉ mở Hiện Đại sau khi chuỗi này chạy và test được. Dị Tượng vẫn chưa mở.
