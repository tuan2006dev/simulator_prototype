# Y học thảo dược, phòng vệ và Khích Lệ — 06/10/2026

Đã triển khai ba mục người dùng chọn sau đợt đối chiếu game design, cùng cảnh báo dự trữ và kiểm tra vận hành công nghiệp. Không thay bản lưu người dùng; dùng các context/save thử riêng. Đây chưa phải toàn bộ y tế, trang phục, quân đội hoặc hệ thống Faith của thiết kế.

## Cơ chế hiện chạy

- Y học thảo dược đã mở thành nghiên cứu dùng vật tư thật, cần Quan sát tự nhiên. Trong Quân sự → Phòng vệ làng, chọn cư dân trưởng thành dưới90 sức khỏe để chữa. Cư dân đi tới kho/lửa theo đường thật; tới nơi mới trừ2 thảo dược, đắp thuốc4 bước làm việc, hồi5 sức khỏe/bước (tối đa20). Ăn/ngủ khẩn cấp được ưu tiên; nghề và hàng mang được giữ. Hủy trước dùng thuốc không mất herbs; hủy sau dùng không hoàn thuốc. Tải giữa liệu trình không trả thuốc lần hai. Thuốc không được cấp từ xa hoặc sinh thành phẩm miễn phí.
- Giáo đá:6gỗ+4đá/cần Công cụ đá; người trưởng thành rảnh chế tạo tại kho trong5 bước. Có giáo tăng sát thương cơ bản6→8. Áo phòng vệ dệt:4vải/cần Dệt vải, phản công nhận vào3→2. Mỗi món có stock/crafted và một ô thực trên người. Lấy/trả phải tới kho, giữ công cụ cũ và hàng mang. Chỉ một đơn chế tạo phòng vệ; hủy hoàn phí một lần, nếu kho đầy giữ đơn và yêu cầu giải phóng chỗ. Dụng cụ/giáp/vũ khí không hao mòn trong bản này.
- Khích Lệ:30 Niềm tin/hồi30giây; người bảo vệ hiện tại giảm20 sợ hãi và +20% sát thương trong20giây. Cố định danh sách được hưởng khi dùng, không buff thêm người vừa bật canh gác sau đó. Dùng lại trong120giây tăng phí30/lần:30→60→90… Hồi chiêu và thời hạn lưu theo đồng hồ mô phỏng, pause đóng băng. Có nút trong Quân sự và Niềm tin. Không chữa máu, không bỏ qua ăn/ngủ và không miễn sát thương.
- HUD có cảnh báo dễ thấy khi thức ăn dùng được còn dưới2ngày, gợi ý thêm người trồng trọt/vận chuyển hoặc rút đội ở xưởng đã tắt. Không tự lấy quyền điều khiển khỏi thợ người chơi phân công tay.

Có hai icon riêng mới (90 icon tổng), giáo/áo hiện đúng trên hình chibi và ô trang bị. Thẻ cư dân trong bảng phòng vệ có chân dung, HP, đồ thật và nút tách rõ trên desktop/mobile. Đã xem ảnh, sửa nút sát nhau rồi chạy lại test trình duyệt.

## Bằng chứng và phạm vi test

### Lượt vật tư/nghiên cứu/trang bị thực

Tiếp từ artifacts/mystic-played-save.json trong context riêng. Thu/giao đá thiếu, trả nghiên cứu Quan sát tự nhiên/Y học thảo dược, chế tạo một giáo/một áo bằng vật tư earned, lấy/trả thực và dùng Khích Lệ trả30 điểm. 222 bước,50 sống/Food1887,4, stock0/0 vì người giữ đủ giáo và áo, crafted1/1. Bản artifacts/care-played-save.json; checkpoint trước các thao tác trả/lấy lại là care-equipped-earned-save.json.

### Ca chữa và chiến đấu dàn dựng riêng

Không báo thương tích dàn dựng là thương tích kiếm tự nhiên. Bản care-injured-fixture-save.json lấy trạng thái/vật tư đã có, đặt một cư dân ở nơi chữa với60HP/nhu cầu an toàn để đo tác dụng. Fixture xác nhận đúng2herbs/4bước/+20HP, không thu lần hai sau tải, đường bị ngăn không thu thuốc/không tăng tiến độ. Fixture tiếp xúc chiến đấu xác nhận giáo/Khích Lệ tăng sát thương thực, áo giảm phản công3→2, hết Khích Lệ thì mất bonus. Save nhân đôi đồ/tiến độ thuốc sai bị từ chối. Hủy chế tạo khi kho đầy không mất đơn/không hoàn lặp; không có người bảo vệ thì Khích Lệ không thu phí.

### Trình duyệt

Test:care-ui qua trên Edge riêng: phí chế giáo6+4/hủy/tải/live chế tạo; trả/lấy áo qua đường thật; chữa thảo dược public/tải/live đủ liều; Khích Lệ hồi chiêu và dùng lại trả60/tải giữ thời hạn. 50 người sống; mobile không tràn hoặc lỗi console; HUD nhận biết điểm food thấp. Đã chạy lại sau sửa giao diện.

Ảnh đã xem: care-herbal-desktop.png, care-mobile.png, care-food-warning-mobile.png. Thêm care-equipment-desktop.png và care-incite-desktop.png. Bản lưu thật của người dùng không bị thay bằng fixture.

### Cân bằng công nghiệp

Test:care-industry dùng hàng đã kiếm trong care-played-save: phân công một người vào nhà máy, bật điện/sản xuất/giao đúng6 linh kiện mới, dừng máy rồi trả người về lương thực. Tổng759bước, sau pha công nghiệp theo dõi thêm300nhịp/30ngày. 50người sống; Food đầu1887,4, tối thiểu ghi nhận1464,9 trong cửa sổ theo dõi, cuối1746,3. Bản care-industry-stable-save.json.

Đây là một phương án điều phối trong bản đồ thử kế thừa, không chứng minh mọi phân công hoặc mọi seed đều cân bằng. Không tuyên bố300nhịp sản xuất liên tục: chỉ chế/giao6linh kiện rồi kiểm tra làng30ngày. Trường foodMinimum đo từ sau trả đội xưởng, không phải mức thấp nhất toàn759bước.

### Hồi quy

Test thảo dược/phòng vệ mới, Faith/Ban Phước, đột kích, công cụ cũ, phiên lệnh, khảo sát và5checkpoint Công Nghệ Cao qua; icons-ui90 qua. Typecheck/build433,8KB qua. Chưa cần thay giới hạn/rate sinh tồn toàn game vì lượt này không cho thấy lỗi chung đủ bằng chứng.

## Còn thiếu

Bệnh/thuốc/bệnh viện/y tế trẻ em, độ bền/giáp nâng cao, túi/gùi tăng tải, công cụ kim loại, thu hồi đồ người chết và toàn bộ chính sách văn hóa chưa làm. Ba mục vừa giao đã có vòng đầu, không coi hệ thống y tế/trang bị đầy đủ. Hiện Đại dầu/vận tải cơ giới/bảo dưỡng, Quỷ Dị và biến thể vẫn còn trong lộ trình.
