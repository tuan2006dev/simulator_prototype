# Cư dân chibi riêng — 06/10/2026

Theo chỉnh sửa của người dùng: hình người dễ thương, tránh gồ ghề. Mẫu pixel vuông ban đầu đã thay bằng nét mềm, đầu tròn hơi lớn, mắt sáng, má hồng và tay chân nhỏ. Màu đất/vàng rơm/xanh ngọc phù hợp giao diện đảo.

- Có trang phục Đồ Đá, Đồ Đồng, Đồ Sắt; Hiện Đại và Dị Tượng hiện là mẫu ngoại hình, không tự mở gameplay. Dị Tượng chưa tách ngoại hình theo ba nhánh.
- Sáu biến thể tóc/da dựa trên ID ổn định, dáng trẻ nhỏ và tóc bạc cho người lớn tuổi; nhận biết người nghiên cứu/người bảo vệ, túi đang mang và công cụ thực sự đã trang bị. Trang phục chỉ là hình ảnh, không tự tạo giáp hoặc vũ khí trong kho.
- Bốn hướng, dáng đứng/đi/làm/ngủ/giao chiến và hai khung động. Bộ xuất xem hình có 1.200 tổ hợp góc/dáng/khung, 30 mẫu giới thiệu; không phải 1.200 trang phục khác nhau.
- Nối vào renderer bản đồ, bảng dân số và chân dung chi tiết. Hình vẽ lấy từ trạng thái thật, không thêm dữ liệu trang bị/ngoại hình vào save. Cache hình dùng lại theo bộ thuộc tính; không tạo ảnh mới mỗi frame. Giữ vòng chọn, báo đói, trạng thái và thần lực.
- Bấm/hover theo thân và đầu đang được vẽ; tránh lỗi hình lớn nhưng vùng bấm vẫn chỉ là chấm nhỏ. Tạm dừng hiển thị vị trí hiện tại, không lùi về đầu bước di chuyển; hướng nhìn giữ khi dừng.

Trang xem: http://127.0.0.1:4173/character-gallery.html . Đổi dáng/hướng để xem.

## Kiểm tra

`test:characters-ui` đã qua: 30 mẫu/hướng/dáng tải được, ba bản làng thật Đồ Đá/Đồ Đồng/Đồ Sắt, chân dung khác nhau và giữ nguyên sau tải, không thay vật tư/trang bị (save rất cũ chỉ bổ sung kho công cụ rỗng theo cơ chế đã có), pause đóng băng canvas, tiếp tục 25 dân sống, máy tính và 390×844 không tràn/lỗi. Kiểm tra chọn đầu ở zoom cao mở đúng cư dân/chân dung và trình duyệt đột kích với bộ hình mới đều qua; kết quả ghi tại NIGHT_WORK_REPORT.md.

Ảnh: artifacts/characters-gallery-desktop.png, characters-gallery-mobile.png, characters-stone/bronze/iron-people.png, characters-stone/bronze/iron-island.png, characters-people-mobile.png. Ảnh nhóm chibi: characters-cute-sample.png; chọn người: characters-selected-desktop.png.

Chưa có chân dung vẽ tay nhiều biểu cảm hoặc lớp quần áo/vũ khí tùy chỉnh. Trang bị phòng vệ và trang phục ba nhánh Dị Tượng tiếp tục theo checklist.
