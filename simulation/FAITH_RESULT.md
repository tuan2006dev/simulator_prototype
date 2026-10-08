# Niềm tin và Ban Phước — 2026-10-05

> Cập nhật đợt sau: Cầu Mưa, thời tiết và cháy rừng đã có; [báo cáo hiện tại](WEATHER_RESULT.md). Các đoạn "chưa triển khai" dưới đây ghi phạm vi tại thời điểm hoàn thành Ban Phước.

## Luật hiện chạy

Đối chiếu mục 9 của `ERA0_AND_DIVINE_SYSTEMS_SPEC.md` và `ERA0_INTEGRATION_PLAN.md`. Giữ đúng các mốc Ban Phước trong đặc tả: 50 Niềm tin, hồi chiêu 45 giây, tốc độ làm việc +50% trong 30 giây, sau đó −50% trong 60 giây và căng thẳng/sợ hãi thêm 10 điểm một lần. Phép áp dụng toàn bộ lao động trưởng thành sống và đã đặt trên bản đồ; trẻ nhỏ không nhận hiệu ứng lao động.

Niềm tin khởi đầu **0**, tối đa **300**. Đây là hai giá trị khởi tạo của đợt này vì đặc tả chưa chốt. Đền hoàn thành thêm **0,2 Niềm tin/giây mỗi cấp**; không cần đền để hồi điểm hoặc tiến kỷ nguyên. Công thức:

`dân sống đã đặt × 0,1 × (1 + hạnh phúc/100) × (1 − sợ hãi/200) + bonus đền`.

Hạnh phúc/sợ hãi được lấy từ nhu cầu thực, dùng chung với HUD. Cầu nguyện có tác dụng tinh thần hiện có, qua đó ảnh hưởng công thức; không cộng thêm một khoản Niềm tin riêng hoặc tạo điểm trùng. Không có dân định cư thì không hồi điểm.

## Đồng hồ, chi phí và chống lặp

Một bước mô phỏng là **600 ms**, dùng cùng hằng số với vòng game. Niềm tin/buff/kiệt sức/hồi chiêu chỉ tiến khi mô phỏng tiến. Tạm dừng đóng băng mọi thời hạn; ×2 tăng đồng bộ; thời gian đóng game không hồi điểm hoặc trừ thời hạn.

Mỗi lần dùng trong 120 giây gần nhất tăng giá thêm 50: 50 → 100 → 150… Giá trên nút là giá thực của lần tiếp theo. Lịch sử ngoài cửa sổ bị loại; không dùng cơ chế x2 liên tiếp trong ý tưởng GDD cũ. Chặn dùng khi thiếu điểm, chưa có lao động, đang Ban Phước, hồi chiêu hoặc kiệt sức. Hồi chiêu 45 giây có thể hết trước kiệt sức, nhưng nút vẫn khóa đến khi dân hồi phục. Lệnh phát lại cùng số thứ tự không trừ phí thêm.

Burnout/bạo loạn chưa có luật xã hội hoàn chỉnh, vì vậy không cho người chơi kích hoạt phép trong kiệt sức. Không thêm hậu quả giả hoặc bỏ việc vĩnh viễn.

## Tác dụng vào công việc

Hệ số tăng/giảm **tiến độ**, không nhân sản lượng mỗi mẻ hoặc cộng thức ăn miễn phí. Áp dụng thu hoạch có thời gian làm, sản xuất tại công trình, xây/nâng công trình, chế tạo công cụ và nghiên cứu. Tiến độ lẻ được giữ qua các bước và bản lưu. Đường đi, giao/lấy hàng, ăn/ngủ và phát triển kỷ nguyên không được tăng tốc riêng bởi phép. Công thức, phí vật liệu, nguồn hữu hạn, túi/kho và lao động tại nơi vẫn giữ.

Giữ nguyên hậu quả gốc nên Ban Phước là tăng tốc trước mắt đổi tổn thất sau đó: trên 90 giây làm liên tục, công lý thuyết là `30×1,5 + 60×0,5 = 75`, so với 90 nếu không dùng (giảm 16,7%). Giao diện ghi rõ lợi ích và hậu quả; chưa tự áp dụng đề xuất giảm nhẹ kiệt sức trong tài liệu tổng hợp.

## Giao diện và lưu

Bấm **thanh Niềm tin màu vàng** trên màn hình chính để mở **Niềm tin & Thần lực**. Có lượng điểm/trần/tốc độ hồi, giá thực, trạng thái, thời gian còn lại, hồi chiêu và lý do nút khóa. Cư dân có hào quang vàng/icon khi Ban Phước và icon giọt mồ hôi riêng lúc kiệt sức; bảng cư dân ghi trạng thái tương ứng. Bộ icon tăng từ 78 lên 79.

Cầu Mưa, Khiên Thần và Khích Lệ chỉ hiển thị là chưa triển khai, không có nút tiêu điểm. Chờ thời tiết/cháy, đột kích và chiến đấu để có hiệu ứng thực.

Giữ bản lưu phiên bản 5: lưu điểm, đồng hồ mô phỏng, lịch sử dùng, hồi chiêu và thời hạn buff/kiệt sức/cờ đã áp dụng hậu quả. Bản cũ thêm trạng thái rỗng, không cấp điểm. Tải lại không hoàn phí, gia hạn hiệu ứng hoặc tăng sợ hãi lần nữa; kiểm tra số âm, trần, thời hạn và lịch sử sai. Thế giới online chưa khởi tạo Faith, thanh/nút được khóa/ẩn để không lệch trạng thái máy chủ.

## Kiểm thử

- Công thức theo nhu cầu, dân chưa đặt/người chết, bonus đền, trần 300 và khởi đầu 0.
- Thiếu điểm không đổi trạng thái; lệnh hợp lệ trừ đúng 50; lệnh phát lại và dùng khi còn buff/kiệt sức không trừ thêm.
- Biên 30/60/45/120 giây, sợ hãi +10 chỉ một lần, tăng phí và reset cửa sổ.
- Lưu/tải giữa buff, kiệt sức và chế tạo có tiến độ 1,5; từ chối điểm/thời hạn sai.
- So sánh sản xuất thực cùng 150 bước/90 giây: bình thường 150 đơn vị tiến độ/15 mẻ, Ban Phước 125 đơn vị/12 mẻ còn tiến độ dở. Riêng 30 giây đầu, tiến độ tương đương 7,5 mẻ so với 5 mẻ, đúng +50%. Chênh lệch số mẻ trọn là do giữ tiến độ lẻ.
- Thu hoạch trừ đúng nguồn và giữ sản lượng/mẻ; xây/nghiên cứu/chế tạo nhận tốc độ, không nhận vật liệu miễn phí.
- Trình duyệt dùng làng đã chơi thật: tự tích đủ điểm, Ban Phước bằng điểm thật, tạm dừng/×2, tải trong buff và kiệt sức, hồi phục và nút tăng giá 100. Hết chu kỳ vẫn đủ 5 dân, khoảng **196 thức ăn**. Không cấp Faith/tài nguyên/công nghệ cho luồng chơi.
- Desktop/390×844, thanh vàng và vị trí tránh che hướng dẫn; không tràn ngang hoặc lỗi chạy/tải hình. 79 icon, kiểu dữ liệu/build, trang bị, công trình, phiên mô phỏng, sinh hoạt, làng tự động 5/10/15 người và hậu cần Đồ Đồng/Đồ Sắt đều qua.

Ảnh/bản lưu: `artifacts/faith-*`. Test: `test:faith`, `test:faith-ui`, `test:faith-review-ui`.

## Bước còn lại

Chưa làm Burnout/bạo loạn, các phép còn lại, thời tiết/cháy/đột kích, nguồn Faith nghi lễ riêng, chính sách offline hoặc Faith online. Cần thử cân bằng với người chơi trước khi đổi hậu quả gốc. Bước tiếp theo hợp lý là thời tiết/mưa và nguy cơ cháy để mở Cầu Mưa có tác dụng thật.
