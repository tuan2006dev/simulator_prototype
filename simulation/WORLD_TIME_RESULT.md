# Đồng hồ theo Master — 08/10/2026

Đã đổi nhịp chơi sang **120 giây thực/ngày ở tốc độ1×**, **5 giây/giờ**. Đồng hồ chạy liên tục, không nhảy mỗi2,4giờ như giao diện cũ. Tốc độ2× tương ứng60giây/ngày,4×30giây/ngày theo cùng hệ số (browser đã kiểm1× và2×;4× kiểm bằng quy tắc hệ số, chưa đo nguyên ngày riêng).

## Các mốc

| Khoảng giờ | Thời gian thực ở1× |
|---|---:|
| Lao động06–18h |60giây|
| Bữa tối18–20h |10giây|
| Nghỉ đêm20–06h |50giây|
| Bãi cạn09–15h |30giây|

Master ghi120giây/ngày nhưng ghi50+15+45giây cho ba giai đoạn, chỉ tổng110giây và không khớp giờ. Đợt này dùng chuẩn120giây và5giây/giờ, nên các giai đoạn là60/10/50 như GDD đã chắt lọc.

Vòng kinh tế vẫn10bước/ngày, mỗi bước12giây ở1×, để giữ tiến độ nghề/công trình, lượng sản xuất/ăn/ngủ theo ngày, tuổi và các bản lưu. **Lịch hiển thị chạy liên tục; hành động NPC vẫn được giải quyết ở bước kinh tế**, chưa viết lại mọi hành động ăn/ngủ/chế tạo thành thao tác dưới một giây. Bãi cạn hiển thị mở/đóng đúng giờ; kiểm tra an toàn vượt bãi vẫn dùng nhịp kinh tế và kế hoạch đủ thời gian tới bờ.

Phần thời gian trong bước có lưu. Tạm dừng đóng băng, tải lại không đặt lại đầu bước và không cộng thời gian lúc đóng game. Trong giai đoạn chưa thả xong dân, đồng hồ cục bộ chưa chạy. Server dùng cùng12giây/bước và đo thời gian thực đã trôi qua, không phụ thuộc số lần callback.

## Hiệu ứng và bản lưu

Giữ nguyên chi phí, deadline và số bước hiệu lực của các phép cũ để không đổi cân bằng theo ngày hoặc làm mất trạng thái trong bản lưu. Do mỗi bước dài hơn20lần ở thời gian thực, giao diện/phần nhật ký mới quy đổi đúng thời gian ở1×; tốc độ2×/4× tăng đồng bộ. Ví dụ:

| Phép cũ | Hiệu lực thực ở1× | Hồi chiêu thực ở1× |
|---|---:|---:|
| Ban Phước |10phút, sau đó20phút kiệt sức |15phút|
| Cầu Mưa |15phút |20phút|
| Khiên Thần |10phút |30phút|
| Khích Lệ |6phút40giây |10phút|

Niềm tin/giây trên HUD cũng quy đổi theo nhịp mới, không hiển thị tốc độ600ms cũ như tốc độ thực. Đây là giữ các phép cũ theo số ngày; chưa đổi sang ba tiểu thần lực hay phí/hiệu lực mới của Master. Thời điểm xử lý hiệu ứng vẫn có độ phân giải12giây ở1×.

## Kiểm tra

- [Kết quả mô phỏng](artifacts/world-clock-core-result.json):120000ms/ngày,5000ms/giờ; ranh giới60/70/120giây cho18/20/06h và15/45giây cho09/15h; lưu phần thời gian5000ms/tải lại/tiếp tục;8người sống; ba checkpoint dạng cư dân cũ giữ chính xác tuổi/tick/nghề/công trình/hiệu ứng, không ghép hàng hoặc sửa bản gốc. Bản lưu thời gian âm hoặc>=12giây bị từ chối.
- [Phép đo trình duyệt thật](artifacts/world-clock-browser-result.json): chạy nguyên một ngày ở1×, đo **120.32giây** tới đầu ngày2;8người sống, Food2.34. Checkpoint dừng sau khi đồng hồ tới07:05, tải lại đúng07:05. Dừng3giây giữ nguyên thời gian/Faith/thời tiết. Bãi mở09h/đóng15h, bữa tối18–20h và đêm20–06h đã quan sát trực tiếp. Chạy2× trong5giây và thao tác dừng cho khoảng10.68giây tiến trình (có độ trễ thao tác). Mobile không tràn ngang; không lỗi JavaScript hoặc tải tài nguyên.
- Lượt đo đầu ra136,59giây đã phát hiện lỗi thật: vòng lặp cũ chặn thời gian frame ở200ms, bỏ phần thời gian khi render chậm. Đã tách thời gian camera khỏi thời gian mô phỏng và đo lại với **cùng điều kiện120giây**, không nới tiêu chí. Một lượt khác dừng ở màn hình tải do test chưa chờ giao diện; đã chờ đúng trạng thái tải xong trước assertion, giữ các tiêu chí thời gian.
- `test:server`: hai client/ủy quyền/lệnh trùng và đồng hồ tự chạy qua; trước12giây giữ thời gian lẻ/tick0, sau khoảng13giây tick1,revision16.
- Hồi quy `test:tides`30tuyến+chuyến kiếm3đá thật, `test:faith`, `test:session`, `test:three-branches-save`13checkpoint chỉ đọc qua. Kiểm tra kiểu và build qua, bản cuối551,3KB. Chưa nhận toàn bộ GDD hoặc toàn bộ cân bằng Master đã xong.

## Ảnh và bản thử

- [Bãi cạn lúc09h trên đồng hồ mới](artifacts/world-clock-low-tide.png).
- [Bữa tối lúc18h](artifacts/world-clock-dinner-desktop.png).
- [Giao diện điện thoại](artifacts/world-clock-mobile.png).
- [Browser lưu giữa bước tại07:05](artifacts/world-clock-browser-partial-save.json).
- [Browser đầu ngày2 —8người sống](artifacts/world-clock-browser-day-save.json).
- [Mô phỏng lưu phần thời gian5000ms](artifacts/world-clock-ready-save.json).

Các lượt thử dùng origin/context riêng và các checkpoint đã kiếm hàng. Bản lưu người dùng và ba nhánh gốc giữ nguyên. Để áp dụng trên tab game đang mở với bản mã cũ: **lưu game rồi tải lại trang**. Không cần tạo lại thế giới.
