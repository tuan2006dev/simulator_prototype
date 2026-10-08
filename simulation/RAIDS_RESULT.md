# Đột kích nhỏ và Khiên Thần

Triển khai ngày 2026-10-05, chế độ chơi cục bộ. Mở **Phòng vệ làng** từ mục Quân sự, hoặc dùng Khiên trong tab Niềm tin.

## Quy tắc bản đầu

- Đồng hồ riêng chạy theo bước mô phỏng 600 ms; tạm dừng và tải lại giữ nguyên. Không tính thời gian khi đóng game. Bản lưu cũ được bổ sung khi mở game, không cấp Niềm tin hay hàng.
- Lần đầu xét sau 180 giây mô phỏng; sau mỗi đợt chờ 180 giây. Chỉ báo động khi ít nhất 5 dân đã định cư, đủ giường, có điểm kho/lửa trại và kho chung đủ 3 ngày ăn. Thiếu điều kiện xét lại sau 30 giây. Đây là giới hạn tránh đánh vào làng đang thiếu ăn, chưa phải độ khó hoàn chỉnh.
- Báo trước 20 giây, sau đó 2 kẻ đột kích xuất hiện ở đất đi được cách kho 8–24 ô, có đường thật đến kho. Không tìm được hai vị trí thì bỏ cuộc. Đợt đánh kéo dài tối đa 30 giây.
- Kẻ đột kích có 36 sức khỏe, đi 1 ô/bước. Đến cách kho tối đa 1 ô mới lấy hàng, mỗi kẻ một lượt tối đa 20 thức ăn rồi rời đi. Tổng đợt không vượt 40 hoặc 20% thức ăn lúc báo động; giữ lại một ngày ăn theo nhu cầu hiện tại. Chỉ trừ kho chung, không lấy túi, hàng vận chuyển hay đệm xưởng. Không phá công trình.
- Chỉ định cư dân trưởng thành làm người bảo vệ. Họ vẫn làm nghề cũ ngoài đột kích. Khi đột kích, họ đi theo đường thật đến kẻ gần nhất, đánh ở khoảng cách tối đa 1 ô. Sát thương 6, STR tăng tối đa 20%; phản công 3 sức khỏe/lượt, dừng giảm ở 20. Ăn, nghỉ và chữa khi khẩn cấp được ưu tiên; người yếu không giao chiến. Bản đầu không gây chết dân do đột kích.
- Dân thường trong 5 ô tránh xa kẻ đột kích tới nơi trú/đất an toàn có đường đi. Hành động phòng vệ chiếm trọn bước, không đồng thời sản xuất hoặc vận chuyển. Giữ nghề, quyền phân công thủ công, mục tiêu lao động, hàng mang và phần tiến độ; đường công việc tính lại từ vị trí mới.
- Khiên Thần: **70 Niềm tin, bảo vệ kho 30 giây, hồi chiêu 90 giây**. Phí và hồi chiêu từ đặc tả Era 0; 30 giây là lựa chọn cân bằng thử vì đặc tả chưa định thời lượng. Khiên bảo vệ tất cả điểm của kho thức ăn dùng chung. Kẻ tới kho trong thời gian khiên sẽ bỏ cuộc; không chữa hoặc miễn sát thương cho người bảo vệ. Độc lập với Ban Phước/Cầu Mưa, không thêm kiệt sức.
- Có vòng khiên trên kho, icon riêng cho kẻ đột kích, dấu người bảo vệ, báo động trên bản đồ, trạng thái trong bảng phòng vệ và nhật ký. Bản lưu kiểm tra số lượng/HP/tọa độ kẻ đột kích, phí/thời hạn khiên, giới hạn cướp và cờ người bảo vệ.

## Kiểm tra

`test:raids`: báo động/xuất hiện tự nhiên theo đồng hồ, cướp đúng khi tiếp xúc, giới hạn 40, đường chặn, điều kiện thiếu ăn, phí/idempotency Khiên và hồi chiêu, dân tránh và người bảo vệ đánh, không mất túi/tiến độ, lưu ở báo động/đánh/khiên và từ chối dữ liệu hỏng. Kiểm tra phiên mô phỏng thật xác nhận không làm hai hành động/bước và tiếp tục phần khai thác còn dở. Hai bản làng đã chơi 12 và 25 dân tiếp tục 60 ngày vẫn đủ người sống, thức ăn 29,0 / 578,9. Hai lượt này không đạt điều kiện mở đột kích (0 đợt); không coi chúng là bằng chứng giao chiến tự nhiên ở làng thực.

`test:raids-ui`: trình duyệt Edge thật, bản lưu riêng từ làng 12 dân đã chơi. Dàn dựng báo động để lặp lại được, giữ hàng và Niềm tin thực. Kiểm tra chỉ định người bảo vệ/lưu, đợi sinh kẻ đột kích, tải giữa đợt, trả 70 Niềm tin, tạm dừng, kết thúc không cướp được, hết bảo vệ và hồi chiêu 90 giây ở tốc độ ×2. Giao diện máy tính và 390×844 không tràn trang. Có lượt tiếp xúc riêng đặt kẻ đột kích cạnh người bảo vệ đủ sức trong buổi sáng; giữ nguyên sức khỏe/nhu cầu/hàng để kiểm tra giao chiến trực tiếp. Không ghi đè bản lưu đang chơi của người dùng.

Kiểm tra kiểu dữ liệu, build và hồi quy phiên mô phỏng, Niềm tin, ăn/ngủ, vận chuyển, nghề tự động. 81 icon riêng.

Ảnh: `artifacts/raids-warning-desktop.png`, `raids-shield-desktop.png`, `raids-shield-mobile.png`, `raids-faith-mobile.png`, `raids-combat-desktop.png`. Bản lưu thử: `raids-shield-save.json`, `raids-played-save.json`, `raids-combat-save.json`.

## Giới hạn và bước tiếp theo

Chưa có vũ khí/giáp, phe địch, chiến tranh, chết trận, phá công trình, loot xác, đội hình hoặc chọn độ khó. Kẻ rời đợt được xóa, chưa có hoạt cảnh rút lui. Dân đang ăn/ngủ không bị sát thương trong bản này. Báo động không làm camera tự nhảy. Hệ thống chơi mạng chưa mở phần phòng vệ/thần lực.

Nên chơi vài đợt để cân bằng ngưỡng dự trữ và tần suất; sau đó mở trang bị phòng vệ Đồ Đá và tác động tinh thần cho Khích Lệ trước khi mở chiến đấu mạnh hơn.
