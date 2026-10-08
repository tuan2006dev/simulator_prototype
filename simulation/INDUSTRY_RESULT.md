# Tiền công nghiệp cuối Đồ Sắt — 06/10/2026

Đã hoàn tất N3 trong lượt làm đêm. Đối chiếu GAME_DESIGN.md và ERA_SYSTEM_DESIGN.md; không sửa hai đặc tả gốc. Hiện Đại và Dị Tượng vẫn khóa. Điện học ở đây là nguyên mẫu trong Đồ Sắt, chưa phải lưới đô thị, dây điện hay công nghiệp Hiện Đại.

## Cơ chế đã có

- Nghiên cứu Cơ giới sơ khai → Luyện thép → Điện học nguyên mẫu, có điều kiện, phí hàng hóa và thợ nghiên cứu thật.
- Lò thép: 4 sắt +2 than →2 thép. Xưởng cắt đá: 4 đá →3 đá xây. Xưởng máy: 2 thép +2 gỗ xẻ +2 công suất →2 bộ phận máy. Mỗi mẻ cần hàng giao tới công trình; hàng làm ra nằm tại xưởng đến khi được chuyển đi.
- Máy phát: 1 than cấp điện trong 1 ngày mô phỏng (10 bước); chạy cả đêm, tạm dừng game không tiêu nhiên liệu. Than phải giao tới máy; than còn trong kho làng không phát điện từ xa. Công suất cấp 1/2/3 là 4/6/8; xưởng máy cần 2. Điện không nằm trong kho, không là hàng hóa.
- Bật/tắt và ưu tiên thấp/thường/cao trong Lộ trình & Nhiệm vụ. Thiếu công suất chọn xưởng theo ưu tiên; cùng mức giữ thứ tự ổn định. Tắt xưởng ngừng yêu cầu nguyên liệu mới; chuyến hàng đã mang vẫn giữ/giao thật.
- Thép dùng nghiên cứu, xây máy và nâng cấp; bộ phận máy dùng nâng cấp máy phát/xưởng máy; đá xây dùng nâng cấp bốn công trình công nghiệp mới. Nâng cấp cấp 2 trả 4 bộ phận máy +4 thép +10 đá xây bên cạnh phí gỗ/đá/thức ăn/đồng/gỗ xẻ; cấp sau tăng phí. Máy phát nâng cấp ngừng cấp điện, hoàn thành trả thợ xây và tự chạy trở lại.
- Chứng minh cấp điện: theo dõi từng xưởng riêng sau khi xưởng đã làm ra mẻ hàng, còn ít nhất một thợ sống/đã đặt được phân công. Đủ công suất liên tục 30 bước =3 ngày. Ban đêm/ăn/nghỉ vẫn kiểm tra khả năng cấp điện. Đây là chuỗi cấp đủ điện, không yêu cầu sản xuất hàng trong mọi bước. Mất điện, tắt máy, nâng cấp hay bỏ toàn bộ thợ của xưởng đó đặt lại chuỗi, kể cả lệnh khi đang pause. Không cộng thời gian giữa xưởng, không xóa lịch sử sản lượng.
- Sửa điểm nghẽn hậu cần phát hiện bằng lượt chơi: khi dự trữ thức ăn dùng được đủ 2 ngày, tiếp than máy phát trước chuyến thức ăn dư; dưới ngưỡng này thức ăn vẫn ưu tiên. Không xóa/đổi hàng cư dân đang mang.
- Bản lưu cũ thêm ba loại hàng ở 0, không thưởng vật tư/điện. Lưu nhiên liệu, lựa chọn ưu tiên, công suất và chuỗi liên tục. Kiểm tra dữ liệu hỏng, đầu vào/kho hợp lệ.

## Texture và giao diện

Bốn hình công trình riêng: lò thép có ống khói/gạch chịu nhiệt/thanh thép; xưởng cắt đá có bàn cắt và bánh cưa; máy phát có nồi hơi/đồng hồ/bánh truyền động; xưởng máy có bàn cơ khí và bộ điều khiển. Nối catalogue, bản đồ, chi tiết, bảng điện. Ba icon hàng mới riêng; tổng 84 icon và 261 texture công trình (29 loại ×3 cấp ×3 phong cách). Cư dân chibi mềm giữ nguyên, đã kiểm tra lại.

## Kiểm tra đã qua

`test:industry`: thiếu đầu vào/than/điện, kho đầu ra đầy không trừ hàng; giữ mẻ dở; nhiên liệu 10 bước; thiếu công suất 4/6 và đổi ưu tiên; không ghép thời gian giữa xưởng; reset ngay khi bỏ thợ; không hút hàng vào xưởng tắt; ưu tiên thức ăn khi nguy cấp; lệnh trùng không trừ tiếp/nâng thời gian; lưu/tải và dữ liệu hỏng.

Lượt chơi tiếp **bản Đồ Sắt đã chơi thật** `artifacts/logistics-iron-save.json`: không cấp kho miễn phí, không gán unlock, không tạo công trình hoàn thành. Trả phí nghiên cứu và xây; đổi lao động thật sang lúa mì/bánh, thu gỗ và vận chuyển; mỏ sắt cạn thì trả vải lấy quặng bằng 8 chuyến thương nhân, mua thêm than bằng 3 chuyến trả đồng. Dừng lò khi đủ thép, tắt máy trong thời gian xây xưởng. Sau 2.753 bước: đủ 25 dân sống, thức ăn 649,7; sản xuất 32 thép, đã chuyển về kho 20 bộ phận máy và 120 đá xây; điện 4/2, một xưởng cấp liên tục 622 bước. Đã lưu tại `industry-played-save.json`.

Sau đó dùng lệnh thật dừng xưởng cắt đá để giữ đá thô, tắt xưởng máy để dành thép nâng cấp, sản xuất thêm thép, trả vật liệu rồi xây nâng cấp máy phát cấp 2. Máy phát đạt 6 công suất, xưởng phục hồi đủ 3 ngày liên tục; dữ liệu lưu/tải khớp và Hiện Đại vẫn từ chối tiến cấp. Bản cuối `industry-upgraded-save.json`.

`test:industry-ui`: context riêng, bản lưu earned ở trên; ảnh gốc tải đủ; chỉnh ưu tiên/pause không đổi kho hay nhiên liệu; tắt máy reset chuỗi, tải lại giữ lựa chọn; bật và chạy thật phục hồi điện, đủ 25 người sống. Kiểm tra thiếu công suất dùng fixture ghi rõ thêm hai xưởng dựng sẵn, không coi là thành tích chơi. Desktop 1440 và mobile 390×844 không lỗi/tràn; nút và select hoạt động. Tải bản nâng cấp thật và xác nhận Cung 6, chụp ảnh.

Kiểm tra kiểu dữ liệu/build qua. Hồi quy mô phỏng qua: daily-life, faith, weather, equipment, workforce, raids, logistics, management, production-workforce, session. Trình duyệt qua: industry-ui, characters-ui, character-selection-ui, icons-ui (84 icon). Không thay bản lưu thật của người dùng.

Ảnh trong artifacts: `industry-island.png`, `industry-desktop.png`, `industry-upgraded-desktop.png`, `industry-outage.png`, `industry-priority-fixture.png`, `industry-mobile.png`, `industry-build-mobile.png`. `industry-browser-save.json` là lượt thực trên trình duyệt; hai xưởng phụ chỉ xuất hiện trong lượt fixture riêng.

## Chưa làm / lượt kế tiếp

N4: tiến cấp Hiện Đại cần 50 dân sống/đủ giường, ba nghiên cứu mới, 30 thép đã sản xuất, 3 ngày điện, mạng vận chuyển, 7 ngày ăn; phí 30 thép +40 đá xây +20 vải, 5 ngày. Cần rà sức chứa lương thực/nhà/kho và ổn định kinh tế cho 50 người. Chưa có nút tiến cấp hoặc nhà máy linh kiện Hiện Đại; không đổi implemented của Modern. Chưa có dầu, dây điện/kho nội bộ, khảo sát dị tượng hay ba nhánh Dị Tượng. Tiếp tục N4 trước phụ Khích Lệ/trang bị theo NIGHT_WORK_PLAN.md.
