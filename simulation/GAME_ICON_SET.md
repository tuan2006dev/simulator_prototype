# Bộ biểu tượng Đảo Thiên Nguyên

76 SVG riêng được vẽ bằng đường nét trong `src/ui/GameIcons.ts`, xuất ra `web/assets/icons/`. Không dùng thư viện icon hay emoji để vẽ giao diện. Các hình có nền trong suốt, viền nâu và bảng màu giấy, đất nung, xanh ngọc, vàng rơm; giữ nét rõ khi thu nhỏ.

## Phạm vi

- Thanh tài nguyên, điều khiển thời gian, thanh bên và các tab dưới.
- Thẻ công nghệ, chi phí, trạng thái khóa/hoàn thành, các bảng cư dân và sinh vật, nhật ký, màn hình tạo đảo.
- Dấu tài nguyên, lửa trại, chuyến hàng, trạng thái cư dân và động vật trên bản đồ.
- Icon đồng khác đồ gốm; thảo dược khác sợi lanh; quặng khác kim loại thành phẩm. Nghiên cứu chọn biểu tượng theo nội dung công nghệ.
- Hình công trình hiện có vẫn dùng bộ texture riêng theo loại, cấp và kỷ nguyên.

Trang `web/icon-gallery.html` trưng bày toàn bộ mẫu ở 64 / 32 / 20 px trên cả nền giấy và nền tối. Chạy `npm run icons` để xuất lại từ nguồn. Thêm mẫu mới tại `ICON_ART`, dùng `iconHTML` trong DOM và `drawGameIcon` trên canvas.

Lớp trình bày chuyển ký hiệu trong nhãn/nhật ký cũ sang SVG mà vẫn giữ nút và sự kiện gốc. Bản lưu vẫn là dữ liệu thuần; không chèn HTML vào mô phỏng. Các lựa chọn trong ô chọn dùng tên chữ, không dùng emoji. Đồng hồ chỉ thay icon khi đổi buổi; ảnh canvas được giữ trong bộ nhớ để dùng lại.

## Kiểm tra

`npm run test:icons-ui` kiểm tra tải toàn bộ tài sản, emoji còn sót trên UI, mở các tab, hình tài nguyên/công nghệ đúng loại, lưu game, điều khiển mô phỏng và tràn ngang trên màn hình 1440 × 1000 / 390 × 844. Kết quả ảnh ở `artifacts/game-icons-*.png`.

Kết quả 2026-10-05: kiểm tra kiểu dữ liệu và build qua; 76 tài sản tải thành công, không có lỗi trình duyệt hoặc tài sản bị thiếu. Test icon, sinh hoạt cư dân và Đồ Đá → Đồ Đồng trên trình duyệt đều qua, gồm lưu/tải, nghiên cứu, nâng cấp công trình và giao diện điện thoại.
