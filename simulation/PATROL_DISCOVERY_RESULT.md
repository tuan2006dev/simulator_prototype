# Tuần tra và điểm khám phá — 08/10/2026

Đã bổ sung vòng khám phá tiếp theo, dùng bản đồ, nguồn tài nguyên, đi bộ, cargo và thuộc tính hiện có. Không thay bản lưu người dùng; không tự đổi nghề hoặc tạo thành phẩm miễn phí.

## Cách chơi

Mở **Nhiệm vụ → Khám phá quanh làng**, chọn người trưởng thành đang rảnh rồi chọn **Tuần tra tự động**. Trinh sát ưu tiên các điểm đã thấy, sau đó rìa sương mù gần làng; tối đa một chuyến mỗi ngày. Ăn/ngủ và giao hàng giữ ưu tiên. Dừng tuần tra để đổi việc hoặc lấy/trả/tiếp đuốc; nếu đang đi thì người đi bộ về làng, giữ tiến độ việc cũ.

Có thể chọn **Đến…** ở một điểm đã phát hiện khi không tuần tra. Điểm chưa nhìn thấy không có tên hoặc biểu tượng trên bản đồ/bảng. Biểu tượng bia đá được vẽ riêng theo bộ icon của game; điểm đã xử lý được làm nhạt.

- **Bụi quả dại:** thu tối đa8Food từ một nguồn thảo dược thật, trừ đúng số lượng tại nguồn.
- **Vạt thảo dược:** thu tối đa2herbs từ một nguồn khác. Hàng vào cargo rồi mang/giao kho; không cộng kho từ xa. Kho đầy giữ hàng theo cơ chế vận chuyển hiện có, nhu cầu ăn có thể dùng Food đang mang.
- **Bia đá cổ:** đọc2nhịp tại chỗ, tăng1trí tuệ cho người đọc, trần10. Tiến độ đọc dở được lưu; hoàn thành chỉ nhận một lần, kể cả sau tải lại. Người đã ở trần nhận0, không hạ thuộc tính.

Mỗi thế giới sinh tối đa3điểm theo lửa trại/địa hình/nguồn có đường đi thật; không đảm bảo đủ3 nếu thế giới thiếu nguồn phù hợp. Điểm vật tư đã cạn báo cạn và không phát hàng. Nguồn tự nhiên giữ luật hồi của game, nhưng phần thu khám phá chỉ một lần.

**Cảnh báo:** tính số nhịp đi bộ về lửa trại theo đường hiện tại, yêu cầu quay về khi thời gian sáng còn ít; cảnh báo đuốc còn≤5nhiên liệu. Đường bị chặn giữ vị trí/chuyến và báo cần mở lối, không dịch chuyển cư dân. Đây là dự toán đi bộ, sinh hoạt/nguy hiểm vẫn có thể làm chậm hành trình. Đuốc không tự được chế hoặc tiếp miễn phí.

## Kiểm thử mô phỏng

Tiếp diễn độc lập từ [lượt khám phá trước](artifacts/exploration-played-save.json), không sửa checkpoint gốc. Nguồn/điểm được tạo từ dữ liệu có sẵn; không cấp thêm gỗ, thức ăn hoặc herbs để vượt điều kiện.

- 30bước / 3chuyến tự động: thu8Food+2herbs, đọc bia, mang/giao hàng thật.
- 8người sống, Food cuối132.5; số ô biết238→368.
- Trí tuệ người đọc9→10; kiểm tra lưu chuyến/điểm, dừng tuần tra, giữ nghề.
- Fixture riêng: nguồn cạn không tạo hàng; điểm ẩn không được chọn; ban đêm/đói không khởi hành; gần tối quay về trước thu; đuốc yếu có cảnh báo; đường bị chặn không dịch chuyển; INT ở trần10; điểm trùng bị từ chối; lấy/trả/chế đuốc hoặc đổi việc không chen vào tuần tra.

Fixture không được tính là sự kiện tự nhiên của lượt kiếm hàng. Lượt tự động ngắn không phát cảnh báo nguy hiểm; cảnh báo được kiểm tra bằng tình huống riêng, không nhận là đã gặp nguy hiểm trong lượt này. Không có kết luận về sản xuất hoặc sinh tồn dài ngày.

Kết quả: [patrol-core-result.json](artifacts/patrol-core-result.json), [checkpoint mô phỏng](artifacts/patrol-played-save.json).

## Một lượt trực tiếp trên Edge riêng

Thao tác bằng nút game: chọn cư dân → bật tuần tra → đi/thu điểm → lưu giữa chuyến → tải lại → hoàn thành ba điểm → dừng tuần tra → về/giao hàng → tải lại xác nhận không nhận lần nữa. Kiểm tra desktop/mobile390px và không tràn ngang. Không dùng localStorage/bản lưu của phiên chơi người dùng.

Lượt cuối có8người sống, Food96.0, 3chuyến; đọc bia tăng9→10. Điểm đã xử lý/tiến độ/thuộc tính giữ qua tải lại; cargo đã giao xong. Có phiên cảnh báo đuốc riêng, ghi rõ fixture. Không lỗi trang hoặc tải tài nguyên.

- [Kết quả browser](artifacts/patrol-browser-result.json)
- [Lưu giữa chuyến](artifacts/patrol-browser-midtrip-save.json)
- [Lượt browser đã về/giao hàng](artifacts/patrol-browser-played-save.json)
- [Ảnh bắt đầu](artifacts/patrol-start-desktop.png)
- [Ảnh ba điểm](artifacts/patrol-discoveries-desktop.png)
- [Ảnh trong game](artifacts/patrol-world.png)
- [Ảnh mobile](artifacts/patrol-mobile.png)
- [Ảnh cảnh báo — fixture](artifacts/patrol-return-warning-fixture.png)

`test:patrol`, `test:patrol-ui`, `test:session`, `test:equipment`, kiểm tra13checkpoint ba nhánh đọc/lưu lại không sửa gốc đều qua. Kiểm tra kiểu dữ liệu và build518,4KB qua. Bộ icon96món. Kiểm tra browser bản cuối tải điểm đã thu/không nhận lại, nút đến điểm thủ công (fixture), chữ cảnh báo sáng và giữ cư dân đang chọn đều qua; không giữ cảnh báo đường về sau khi đã về. Đã xem ảnh desktop/mobile/cảnh game; bản cuối chỉnh nhãn lượng hàng rõ Food/herbs và trần trí tuệ10.

## Phạm vi còn lại

Master đề xuất bia+50tri thức; game chưa có kho tri thức và nơi tiêu, nên đợt này dùng lợi ích cá nhân có tác dụng nghiên cứu thật. Không nhận hệ50tri thức đã hoàn thành. Chưa thú dữ/gió/che khuất địa hình/bonus độ cao, ba đảo/Mộc/Krock/thủy triều/hội thoại sáu hồi hoặc đồng hồ120giây/ngày. Tuần tra là lựa chọn của từng người hiện có, chưa thêm nghề mới hay hệ quân đội trinh sát.
