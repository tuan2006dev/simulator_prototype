# Hiện Đại đợt đầu — kết quả 06:36 ngày 06/10/2026

H1/H2 và N4 đã hoàn thành trong phạm vi **tiến cấp + lắp ráp linh kiện + nâng cấp nhà máy**. Hiện Đại được mở công khai sau khi chuỗi mô phỏng chạy được; đã kiểm tra lại nút public và thao tác trình duyệt. Dị Tượng vẫn khóa. H3/H4 chưa hoàn thành; không coi đây là toàn bộ kinh tế Hiện Đại trong thiết kế gốc.

## Cơ chế đã có

- Đồ Sắt → Hiện Đại kiểm tra đủ điều kiện/nguồn thật, trừ một lần 30 thép +40 đá xây +20 vải, tiến độ 50 nhịp/5 ngày. Pause không tiến thời gian; lưu/tải giữ tiến độ; gọi lặp không trả phí lần hai. Không trừ Food cho chuyển cấp.
- Lắp ráp công nghiệp cần Hiện Đại, Cơ giới và Điện học; phí 20 gỗ/15 đá/20 thức ăn +4 bộ phận máy/8 gỗ xẻ, 4 ngày nghiên cứu tại bàn.
- Nhà máy linh kiện xây với 30 gỗ/20 đá/20 thức ăn +4 thép/10 đá xây/4 bộ phận máy. Hai thợ tối đa ở cấp 1; đầu vào/thành phẩm tại xưởng, buffer 60, chuyến vận chuyển 30.
- Mỗi mẻ 2 thép +2 đồng →3 linh kiện, cần 2 công suất đang cấp. Thiếu điện/đầu vào hoặc đầy đầu ra giữ vật tư/mẻ. Tắt xưởng ngừng xin đầu vào mới; hàng đang mang không mất. Ưu tiên điện chung với xưởng máy; điện không tích kho.
- Nâng cấp cấp 2 tiêu 6 linh kiện cùng vật tư thường, tăng số thợ thật lên 3; cấp 3 tăng lên 4 và cần 12 linh kiện cùng vật tư cấp 3. Đã kiểm chứng cấp 2; chưa tuyên bố đã chơi qua nâng cấp cấp 3.
- Texture nhà máy riêng, icon linh kiện/nghiên cứu riêng; tổng 30 loại công trình/270 texture theo cấp và biến thể, 85 icon. Cư dân Hiện Đại dùng chibi dễ thương hiện có. Lộ trình hiện sản xuất/kho/mục tiêu cấp 2; HUD và chi tiết công trình ghi đúng Hiện Đại.

## Lượt mô phỏng có vật tư thật

`test:modern-chain` tiếp từ modern-ready-save.json đã kiếm đủ điều kiện/phí ở đợt trước. Test **khẳng định cờ public đã mở, không ghi đè cờ**; chuyển cấp bằng lệnh public, trả phí thật, gọi lặp, lưu ở 20/50, 49 vẫn Đồ Sắt và 50 lên Hiện Đại. Nghiên cứu trả phí, thợ xây tới vị trí xây nhà máy; quặng sắt mới lấy từ chuyến đổi vải, thép được luyện; đồng khai thác/luyện từ mạch còn lại; than từ chuyến đổi đồng trả phí. Tắt máy khi chờ, nạp kim loại trước khi bật để tránh hết than.

Kết quả: **1.018 bước tiếp từ bản sẵn sàng; 50 người sống, Food 1751,4; sản xuất 6 linh kiện và giao về kho, trả đúng 6 nâng cấp cấp 2; phân công thật đủ 3 thợ sau nâng cấp.** Lưu/tải giữ dữ liệu. Không thêm vật tư, công trình hoàn thành, unlock hay sửa nhu cầu để qua lượt này.

Bản thử thành công: artifacts/modern-factory-prepower-save.json (đã có đầu vào), modern-factory-played-save.json (6 linh kiện trong kho), modern-factory-upgraded-save.json (đã trả phí/cấp 2/3 thợ). Bản modern-chain-waiting-save.json là chẩn đoán các lượt thất bại, không dùng làm thành tích. Bản lưu người dùng không bị ghi đè.

Fixture riêng chỉ kiểm tra công thức/bảo toàn khi thiếu điện/đầy đầu ra/tắt xin hàng/giới hạn thợ. Phân biệt rõ với lượt sản xuất thật ở trên.

## Trình duyệt và hồi quy

`test:modern-chain-ui` qua trên context riêng: tải bản ready đã kiếm vật tư → bấm nút tiến cấp public/trả đúng phí → 50 nhịp chạy thật → Hiện Đại/50 dân. Phần thao tác nhà máy tiếp từ bản played đã sản xuất thật: texture tải được, đổi ưu tiên lúc pause không tiêu hàng, bấm nâng cấp trừ 6 linh kiện, lưu/tải giữa nâng cấp, phân công thợ đi xây, đạt cấp 2/50 người sống. Desktop 1440×1000 và điện thoại 390×844 không lỗi JS, tải hỏng hoặc tràn ngang; tắt máy/lưu/tải giữ đúng. Đây là hai đoạn dùng bản earned có nguồn gốc kiểm chứng, không phải một lượt browser mới từ Đồ Đá làm mọi công đoạn liên tục.

Ảnh: modern-public-investment.png, modern-public-era.png, modern-factory-power-desktop.png, modern-factory-upgrade-desktop.png, modern-factory-island.png, modern-factory-mobile.png trong artifacts/. Đã xem ảnh desktop/mobile; sửa nhãn nhà máy bị ghi Đồ Đá và chụp lại.

Kiểu dữ liệu/build qua (game.js ~355,3 KB). Hồi quy modern-investment/readiness UI, icons-ui (85 ảnh), emergency-meals, era, equipment, logistics, daily-life, production-workforce, faith, weather và raids qua. Phát hiện trạng thái ngủ/ăn/giao lưu cũ còn giữ sau khi hết nhu cầu có thể cản thợ; đã giải phóng trạng thái tại đầu ngày, giữ công việc/hàng, có kiểm tra dawn riêng. Test cũ so kho/save bổ sung components:0 đúng migration, cập nhật kỳ vọng public Modern được mở. HTTP 4173 trả 200.

## Chưa xong và đợt kế tiếp

H3 cần nguồn đồng/than trả phí bền vững khi mỏ cạn, lựa chọn cung ứng công nghiệp và kiểm chứng vận hành dài ngày; hiện mạch đồng hữu hạn, trao đổi than còn tiêu đồng. Không tuyên bố làng này tự duy trì công nghiệp vô hạn. Tiếp từ **modern-factory-upgraded-save.json**, không làm lại tích phí/50 dân/tiến cấp. Có thể thêm nghiên cứu hợp đồng cung ứng dùng linh kiện thật, mở trao đổi vải lấy đồng/than với phí và vận chuyển thật; kiểm tra cả giữ/hủy/chặn đường/kho đầy và nguồn vải có sản xuất. Cân bằng cụ thể ghi đợt H3, chưa coi gợi ý này đã có gameplay.

Sau H3 ổn mới H4 khảo sát/phân tích/lựa chọn nghiên cứu/phong tỏa/bỏ qua. Chưa có viện/dầu/y tế/ba nhánh Dị Tượng; không mở cờ Dị Tượng chỉ vì texture có mẫu. Thời hạn gia hạn vẫn 03:27 ngày 07/10; 02:57 bắt đầu kiểm tra cuối.
