# Khởi nguyên — bến câu và nghiên cứu tại công trình

Triển khai cục bộ ngày 2026-10-05, tiếp nối vòng định cư. Khởi nguyên là chặng mở đầu bên trong Đồ Đá; không thêm mã kỷ nguyên và không bắt buộc Trưởng lão.

## Luật đang chạy

- **Bến câu:** 10 gỗ + 2 đá, không cần công nghệ hay thức ăn để xây. Đặt trên cỏ/cát sát nguồn cá còn trữ lượng trong một ô. Sau xây có một người câu; người xây có thể tiếp tục câu hoặc được rút để phân công người khác. Mỗi năm bước làm tại bến lấy tối đa 24 Food từ nguồn cá thật. Người câu mang cá về điểm chứa có đường đi, giao xong rồi quay lại. Kho đầy dừng lấy cá mới; hàng đã lấy được giữ khi đường/kho bị chặn. Cá hồi theo tốc độ nguồn trên bản đồ. Không cộng công cụ đá cho cá.
- **Bàn nghiên cứu sơ khai:** 6 gỗ + 2 đá, xây trước công nghệ đầu tiên. Không cần nhân công xây sau hoàn thành. Khi bắt đầu nghiên cứu, một người trưởng thành rảnh được chọn; cư dân phải đi tới bàn mới có tiến độ. Không có đường thì tạm dừng. Ăn/ngủ, giao hàng đang mang hoặc chuyển công việc giữ nguyên dự án. Tiếp tục đúng tiến độ khi đủ điều kiện. Chi phí nghiên cứu trừ một lần và không cần Trưởng lão.
- **Sáu mốc:** đủ chỗ ngủ; bãi chứa hoàn thành; ít nhất bốn củi; dự trữ một ngày ăn (5 Food/người); bến có mẻ cá; bàn hoàn thành và đã nghiên cứu Lửa. Tab Xây dựng hiển thị từng mục. Mốc dùng trạng thái hiện tại, có thể thiếu lại khi dự trữ giảm; không phát tài nguyên hay khóa nghiên cứu bằng một phần thưởng mới.
- **Hình ảnh:** hai texture SVG riêng, cùng bảng màu với bộ biểu tượng/kiến trúc của game. Tổng danh mục 25 loại, 225 texture cho ba cấp/ba phong cách; bốn công trình sơ khai chỉ dùng cấp một và không cho nâng cấp.

## Cân bằng và bản lưu

Giá bến/bàn là mức cân bằng tạm cho vòng năm người có vận chuyển và nhiên liệu, thấp hơn giá 15/5 và 25/20 trong đặc tả gốc. Giữ tệp đặc tả gốc; giá đang chạy ghi riêng tại đây. Bến tăng hiệu suất thành mẻ 24 so với hái lượm 16, thay vì cộng thêm một bonus 30% lên mẻ sẵn có. Bàn có thể đặt trên cỏ/cát để không tạo vòng khóa khi vùng quanh lửa đông dân; người nghiên cứu vẫn phải đi thật.

Giữ bản lưu phiên bản 5 và khóa lưu hiện có. Dự án đã khởi chạy trong bản cũ không có bàn được tiếp tục; nghiên cứu mới cần xây bàn khi bật cơ chế định cư. Khi đã có bàn, dự án dùng đường đi thực tế. Không cấp miễn phí bàn, tài nguyên, công nghệ hoặc cư dân.

Với làng năm người, chuyển người xây/kiếm đá sang kiếm thực phẩm khi đã đủ vật liệu công trình. Nghiên cứu lấy một người khỏi sản xuất, vì vậy cần tạo dự trữ và giữ đủ người kiếm thức ăn. Bến xa kho/lửa có thời gian vận chuyển lớn hơn.

## Phạm vi kiểm tra

Test mới kiểm tra vị trí bến không hợp lệ không mất phí, bảo toàn nguồn/cá mang/kho, không câu khi đang mang hàng, kho đầy không giảm nguồn, lưu giữa chuyến, bàn bắt buộc, đi tới bàn và đường bàn bị chặn không tạo tiến độ. Các test sinh tồn 5/10/15 người trong 30 ngày và kinh tế từ Đồ Đá đến Đồ Sắt được chạy lại.

Lượt trình duyệt từ đảo mới năm người dùng tài nguyên tự kiếm và thao tác giao diện đã qua: hai lều, bãi chứa, bến câu, bàn, nghiên cứu Lửa và sáu mốc hoàn tất. Ngày 36 còn đủ năm dân, khoảng 144 Food và sáu mẻ cá. Sau tải lại và chạy thêm mười ngày trên trình duyệt: ngày 46 còn đủ năm dân, khoảng 226 Food, 10 gỗ và mười mẻ cá. Không cấp vật liệu/công nghệ cho lượt chơi này. Kiểm tra lưu/tải giữ đúng tick, nhiên liệu và hàng mang; 25 texture tải đủ; không có lỗi chạy/tải tài nguyên hoặc tràn ngang ở desktop và 390×844. Ảnh, bản lưu thật tại `artifacts/opening-*`.

Các lượt hồi quy trình duyệt Đồ Đá → Đồ Đồng, chuỗi gạch/gốm/làm bánh và Đồ Sắt đã qua: nghiên cứu, nâng cấp, lưu giữa tiến trình, giao thương/vận chuyển và màn hình nhỏ. Kiểm tra kiểu dữ liệu/build, test luật mở đầu, sinh hoạt, định cư, lao động, phiên mô phỏng, bản đồ, công trình, sinh vật và máy chủ localhost qua. Đường kinh tế core Đồ Đá → Đồ Đồng với bàn mới hoàn thành ngày 108, tiếp tục mở rộng Đồ Đồng và Đồ Sắt qua.

Chưa triển khai: Faith, thuộc tính/trang bị, Auto-Claim, kho riêng từng công trình, vận chuyển giữa xưởng và thời tiết/nguy hiểm đầy đủ. Hiện Đại/Dị Tượng vẫn chưa mở trong bản chơi.
