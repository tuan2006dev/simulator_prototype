# Túi vận chuyển và công cụ cá nhân

Triển khai cục bộ ngày 2026-10-05, tiếp nối nghề tự động.

## Túi và trang bị

Túi hiện có bốn loại hàng: thức ăn, gỗ, đá, thảo dược; tổng tối đa 30 đơn vị. Tab Dân cư và chi tiết cư dân hiển thị lượng đang mang, trần túi và trạng thái đi về/chờ kho. Khẩu phần riêng giữ cơ chế cũ và tách khỏi túi vận chuyển; mỗi người có thêm một ô công cụ. Đây chưa phải túi cho mọi loại hàng giữa các xưởng.

Chọn “Tự lấy theo nghề”, một dụng cụ cụ thể hoặc “Không dùng · trả vào kho”. Người đi lấy/trả tại kho hoặc lửa trại có đường đi; chỉ đổi khi rảnh hoặc ở ranh giới mẻ làm tại trại gỗ/mỏ đá/bến câu. Không đổi giữa lượt thu hoạch, khi mang hàng, xây/nâng cấp, nghiên cứu hoặc giao thương. Hết công cụ vẫn làm bằng hiệu quả nền. Lựa chọn bằng tay giữ nguyên dù nghề tự động đổi.

Rìu/cuốc tự chọn theo nghề gỗ/đá hoặc công trình tương ứng. Cần câu tự chọn cho người ở bến câu hoặc người vừa làm câu cá; không cấp cần câu cho tất cả người hái lượm. Đổi nghề khi còn hàng giữ cả hàng và công cụ hiện tại. Giao xong mới trả dụng cụ cũ và lấy dụng cụ mới. Nếu nhiều người cùng muốn một món, chỉ người thực sự đến lấy khi kho còn mới nhận được; không cấp trùng.

## Chế tạo

Cần nghiên cứu Công cụ đá và một người trưởng thành rảnh đã giao xong hàng. Người chơi đặt một đơn trong tab Dân cư; trả phí một lần, người chế tạo đi tới điểm chứa và làm năm bước ban ngày. Ăn/ngủ hoặc chuyển công việc tạm ngắt, giữ tiến độ. Có thể chọn người rảnh khác để tiếp tục khi người cũ bận/chết. Hủy đơn trả đúng gỗ/đá đã trả; nếu kho không đủ chỗ hoàn vật liệu thì giữ đơn và báo cần chỗ trống.

| Công cụ | Giá | Tác dụng |
|---|---|---|
| Rìu đá | 4 gỗ + 3 đá | Gỗ hiệu quả 1,75 lần |
| Cuốc đá | 4 gỗ + 3 đá | Đá hiệu quả 1,75 lần |
| Cần câu | 5 gỗ + 1 đá | Cá +20% |

Công cụ không hao mòn trong đợt này. Một người giữ một món, dụng cụ cũ trả về kho để tái sử dụng. Chế tạo/lấy đồ không tạo hoặc trừ Food.

## Bonus và bảo toàn

Khai thác ngoài bản đồ dùng `max(bonus Công cụ đá, bonus dụng cụ cá nhân)`, sau đó nhân STR/DEX một lần. Rìu/cuốc 1,75 **thay** 1,5 của nghiên cứu; không thành 1,5×1,75. Ví dụ lệnh chặt cơ bản 3 gỗ với rìu và STR trung tính thu 5,25 gỗ, giảm đúng 5,25 từ cây. Khi chưa có dụng cụ, bonus nghiên cứu cũ vẫn giữ. Trại gỗ/mỏ đá giữ sản lượng nền cũ và chỉ tăng bằng dụng cụ cá nhân đang dùng đúng loại. Cần câu chỉ áp dụng với cá, không tăng hái lượm/nông trại.

Sản lượng vẫn bị giới hạn nguồn, kho và sức mang. Bến với DEX 10 và cần câu có sản lượng lý thuyết 34,56, nhưng chỉ lấy 30 cá vào túi, trừ đúng 30 khỏi nguồn và phải giao về kho mới cộng Food.

Giữ bản lưu phiên bản 5. Bản cũ mở kho công cụ rỗng, không cấp đồ. Lưu lựa chọn, công cụ đang giữ, kho/đã chế tạo và đơn đang dở. Khi tải, mỗi loại phải thỏa `trong kho + số cư dân giữ = tổng đã chế tạo`; chỉ số/loại/tiến độ sai bị từ chối. Công cụ của người chết vẫn nằm ở người đó, không tự cộng về kho từ xa; thu hồi đồ người chết thuộc bước sau.

## Kiểm tra

Test luật mới qua: phí một lần, người đi tới nơi trước khi tạo tiến độ, ngắt nghỉ/lưu giữa chế tạo, lấy/trả đồ tại kho, giữ hàng khi đổi dụng cụ, hủy/hoàn phí, phát hiện kho đồ bị nhân đôi, bonus không cộng trùng và bến câu chịu trần túi 30.

Lượt trình duyệt dùng bản làng đã chơi thật: nghiên cứu Công cụ đá, chế tạo đủ ba loại, chọn rìu/lấy tại kho, tải lại giữ đồ, thu gỗ rồi đổi sang đá khi vẫn mang hàng, giao hàng/trả rìu/lấy cuốc tự động. Ngày 57 vẫn đủ năm dân, khoảng 178 Food; mỗi loại đã chế tạo một món và số lượng trong kho/người giữ khớp. Không cấp tài nguyên/công nghệ trong lượt này. Ảnh/bản lưu tại `artifacts/equipment-*`; desktop và 390×844 không tràn ngang hoặc lỗi chạy/tải tài nguyên.

Hồi quy sinh hoạt, định cư 5/10/15 người, nghề tự động 30 ngày, phiên mô phỏng, đường đi, công trình và sinh vật qua. Đường kinh tế core từ Đồ Đá đến Đồ Sắt giữ nguyên và qua. Lượt kiểm tra cuối trên trình duyệt đã qua: hủy chế tạo hoàn đúng vật liệu, không tăng số công cụ đã chế tạo; sau thêm mười ngày (ngày 67), làng vẫn đủ năm dân và còn khoảng 208,9 Food. Túi không vượt 30, số công cụ trong kho/người giữ khớp sau lưu/tải. Hồi quy 76 icon và giao diện tiến Đồ Đá → Đồ Đồng, nâng cấp, lưu/tải và màn hình nhỏ đều qua.

## Giao diện túi theo ảnh tham chiếu

Túi đồ hiển thị bốn ô nền tối/viền gỗ với icon riêng và số lượng gỗ, đá, thức ăn, thảo dược. Hàng trang bị tách riêng phía trên; ô chưa có đồ hiện mờ. Dữ liệu lấy từ hàng cư dân đang mang, không dùng số kho chung. Khẩu phần riêng tách dưới túi. Có ở bảng chi tiết cư dân bên phải và danh sách Dân cư, cập nhật khi mô phỏng chạy. Thêm hai biểu tượng cuốc/cần câu cùng bộ icon hiện có (78 biểu tượng). Chưa có áo/giày nên không hiển thị trang bị giả như ảnh mẫu. Kiểm tra trình duyệt đã xác nhận mỗi ô khớp số hàng của cư dân, hình tải đầy đủ, bảng chi tiết bên phải và màn hình 390×844 không tràn. Hồi quy chế tạo/hoàn phí, lưu/tải, sinh hoạt và 78 icon đều qua; kiểm tra kiểu dữ liệu và build qua.

## Chưa nằm trong đợt này

Độ bền/sửa công cụ, đồ Đồng/Sắt, áo giáp/trang sức, túi hàng của mọi hàng chế biến và vận chuyển giữa xưởng, thu hồi đồ người chết, chế tạo online và Faith. Đợt tiếp theo đã bổ sung túi hàng chế biến và kho xưởng/vận chuyển thật; xem [báo cáo hậu cần](LOGISTICS_RESULT.md).
