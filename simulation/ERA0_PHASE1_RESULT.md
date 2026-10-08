# Era 0 — đợt 1: nhịp sống, sức khỏe và lửa trại

> Ngày 2026-10-05. Phạm vi: bản chơi cục bộ. Các đợt công trình sơ khai, thuộc tính, túi/trang bị đầy đủ, Faith và nguy hiểm vẫn ở checklist tiếp theo.

## Hành vi đã triển khai

- Một đồng hồ cho mô phỏng và giao diện: bắt đầu 06:00, làm việc 06:00–18:00, bữa tối 18:00–20:00, giao tiếp/ngủ ban đêm. Pause đóng băng tiến trình; ×2 tăng cùng một nhịp.
- Lửa trại miễn phí được chọn gần cư dân đầu tiên đã đặt, có đường tiếp cận và không đè công trình. Lưu vị trí; chặn xây hoặc vẽ nước đè lên lửa. Chưa tiêu hao củi trong đợt này.
- Dân về lửa trại ăn tối, hoặc tìm kho/lửa khi đói từ 80%. Có đồ ăn mang theo thì ăn tại chỗ trước. Không có đường về thì dùng đồ mang theo và nghỉ tại chỗ, không ăn từ một kho không thể tiếp cận.
- Bữa tối chỉ tiêu thụ lượng cần để hồi mức đói hiện tại, tối đa một khẩu phần. Một khẩu phần người lớn = 20 Food hồi 35 điểm đói; trẻ em 10, mẹ bầu 25 hồi 40. Dùng Food đang có, không tạo thêm tiền tệ khẩu phần.
- Đồ ăn mang theo chuyển từ kho chung, có giới hạn và chỉ cấp bổ sung khi kho còn trên hai ngày dự trữ. Không cấp thức ăn miễn phí mỗi tối. Bữa ăn cùng cư dân ở gần giảm cô đơn và cải thiện quan hệ thật.
- HP 0–100: thiếu ăn đến 100 đói làm mất HP, có thể chết. HP dưới 40 dừng làm việc để nghỉ; khi đói dưới 50, nghỉ hồi 12 HP mỗi bước, tương đương 5 HP/giờ game ở độ phân giải hiện tại. HP được giữ trong bản lưu; dữ liệu cũ thiếu HP nhận mặc định 100.
- Lao động, xây, sản xuất, nghiên cứu và giao thương tạm dừng khi chăm sóc nhu cầu. Giữ tiến độ; tính lại đường từ vị trí sau chuyến ăn/ngủ thay vì dùng đường cũ hoặc xóa tiến độ mẻ.
- Người vận chuyển nghỉ đêm trên tuyến, dùng đồ ăn mang theo; nhu cầu khẩn cấp vẫn ưu tiên. Không bắt quay về lửa mỗi tối làm chuyến hàng không bao giờ hoàn tất.
- Dân chưa đặt trên bản đồ không bị tăng đói hoặc chết trước khi người chơi thả xuống.
- Giao diện có HP, lượng ăn mang theo, lý do dừng và đồng hồ với biểu tượng làm việc/ăn/ngủ; đồng hồ hiện trên màn hình nhỏ. Thêm sắc đêm và lửa có tên trên bản đồ. Sửa bảng cư dân để trạng thái trống không hiện đồng thời với nhân vật được chọn.
- Sửa tab Nghiên cứu: giữ nút khi nội dung không đổi, chỉ cập nhật khi trạng thái đổi và giữ vị trí cuộn. Tránh mất thao tác bấm vì toàn bộ cây bị dựng lại mỗi bước mô phỏng.

## Cân bằng và giới hạn chủ động

Đây là nền cho sinh hoạt mới, chưa áp tất cả con số trong đặc tả:

- Giữ 10 bước/ngày và tốc độ cũ: một bước 2,4 giờ game, 600 ms ở ×1. Mốc 20:00 được xử lý ở bước kế tiếp, không yêu cầu đồng hồ đi qua đúng từng phút. Chưa có hoạt cảnh ăn đúng 3 giây thực.
- Giữ mức tăng đói của kinh tế hiện tại, chưa đổi sang +3% mỗi giờ lao động. Mất HP khi đói dùng khoảng đệm khoảng 30 bước của luật cũ, chưa áp −5 HP/giờ trong đặc tả. Cần cân bằng hai luật cùng sản lượng/khẩu phần ở đợt sau.
- Có năm bước lao động ban ngày: thu hoạch và mẻ sản xuất mới cần năm bước; xây/nâng cấp/nghiên cứu nhận lượng công gấp đôi mỗi bước làm việc để bù thời gian nghỉ. Chỉ tính công khi làm thật tại nơi cần thiết.
- Di chuyển tối đa sáu ô trên đường hợp lệ mỗi bước trong nhịp mới, ba khi mệt 100; chế độ cũ vẫn một ô. Không dùng dịch chuyển thẳng tới đích. Đường xa làm giảm sản lượng thực và có thể khiến bữa tối đến muộn.
- Công cụ, ba ô trang bị/bốn ô túi, phân công theo STR/DEX/INT, chỗ ngủ theo từng lều, nhiên liệu, rét, thú dữ và phép Faith chưa bật. Lửa là điểm sinh hoạt riêng, chưa đưa thêm một loại vào danh mục 21 công trình hiện có.
- Bản lưu cục bộ được giữ kỷ nguyên, vật tư, cư dân và tiến trình. Bản cũ có thể tự thiết lập điểm sinh hoạt sau khi vào game; không đặt đè nhà hoặc cấp vật tư. Online thử nghiệm vẫn dùng luật cũ; chưa tuyên bố sinh hoạt mới chạy trên server dai dẳng.

## Kiểm thử

Các lệnh kiểm tra bổ sung:

```powershell
npm run test:daily-life
npm run test:daily-life-ui
$env:DAILY_LIFE_TEST='1'
npm run test:era
npm run test:bronze-economy
npm run test:iron
```

Test sinh hoạt kiểm tra số dư kho/túi, bữa ăn không lặp sau tải, ngắt khẩn cấp, đường về, giữ tiến độ, hồi HP/chết đói, dân chưa đặt, chuyển dữ liệu thiếu HP và làng 5/10/15 người sống 30 ngày với nguồn thức ăn tiếp cận được. Bữa tối kiểm tra quan hệ và cô đơn, không chỉ trạng thái hình ảnh.

Test kinh tế đi từ Đồ Đá đến Đồ Sắt **khi bật nhịp sống mới**, không cấp vật tư hoặc công nghệ trong đường chơi chính. Khi kho Food đầy, test bánh điều chỉnh phân công để nhường chỗ sản xuất, không xóa thức ăn hoặc tăng sức chứa miễn phí. Giữ kiểm tra đầu vào/đầu ra, phí một lần, mỏ cạn, kho đầy, nâng cấp và hàng nhập không tính là sản xuất.

Test trình duyệt làng mới kiểm tra ăn/ngủ, HP, quay lại làm việc, pause, lưu/tải và màn hình 1440×1000/390×844. Hình ảnh tại `artifacts/daily-life-night.png`, `artifacts/daily-life-health-mobile.png`, `artifacts/daily-life-mobile.png`; bản lưu được chơi từ đầu tại `artifacts/daily-life-ui-save.json`.

Kết quả các lượt kiểm tra cuối được ghi trong WORK_PLAN.md. Không suy rộng test các làng có nguồn tiếp cận được thành bảo đảm sống sót trên mọi bản đồ hoặc khi người chơi phân công thiếu thức ăn.

## Bước tiếp theo

Đợt 2: làm lều/chỗ ngủ, bãi chứa và công trình sơ khai; bổ sung nhiên liệu có báo trước, hướng dẫn sinh tồn và cân bằng khoảng cách đi làm. Sau đó mới mở thuộc tính, trang bị và Faith theo ERA0_INTEGRATION_PLAN.md.
