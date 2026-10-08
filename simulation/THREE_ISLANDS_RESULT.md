# Bộ sinh quần đảo ba đảo — 08/10/2026

> Cập nhật sau đợt này: đã có tuyến trinh sát bãi cạn Răng Nanh, xem [TIDAL_RESULT.md](TIDAL_RESULT.md). Các câu “chưa bãi cạn” dưới đây mô tả thời điểm nghiệm thu bộ sinh trước đợt thủy triều.

Đã thêm lựa chọn **Ba đảo** cho thế giới cục bộ, có danh tính, seed con, địa hình/tài nguyên riêng, bãi định cư và dữ liệu lưu. Không tự đổi hoặc tái sinh bản đồ cũ. Không tạo dân/bộ tộc trên hai đảo phụ và không mở vượt biển giả.

## Cách xem/chơi

Tại màn hình tạo thế giới, chọn **Ba đảo**, chọn Nhỏ/Vừa/Lớn và seed. Preview ghi tên cả ba đảo. Khi đặt dân, bản đồ hiển thị toàn cảnh và vòng vàng **Bãi định cư** trên Thiên Nguyên. Trong Sinh vật/Nhiệm vụ có nút về đảo chính hoặc xem toàn quần đảo; chúng chỉ di chuyển camera, không mở sương mù hoặc chuyển người.

- **Thiên Nguyên:** đảo chính giữa quần đảo, có vùng grass/forest/mountain và ba nguồn ăn/gỗ/đá riêng gần bãi định cư. Giữ đất sét/đồng/sắt/than trên đảo chính cho chuỗi kinh tế hiện có.
- **Thần Ngư:** phía Đông Nam, tỷ lệ rừng cao hơn đảo chính, nguồn cá ven bờ dày và lượng cá cao hơn. Chưa có Mộc hoặc dân làng.
- **Răng Nanh:** phía Tây Bắc, lõi núi/đá dày, nguồn đá trên diện tích đất cao hơn đảo chính; giảm nguồn thức ăn/gỗ. Chưa có Krock hoặc dân làng.

Danh tính vùng là địa lý, chưa phải chủ quyền hay quan hệ chính trị. Nguồn thuộc WorldMap/ResourceMap, **không cộng vào kho người chơi**. Thiết kế tài nguyên còn cần cân bằng cùng dân AI/giao thương ở các đợt sau.

Kích thước Nhỏ/Vừa/Lớn áp dụng cho nền đảo chính50×35/80×50/120×80. Khung biển tự mở rộng theo vị trí bờ và seed, không cắt hai đảo phụ để giữ khung cũ. Ví dụ seed20810:

| Nền đảo chính | Toàn khung quần đảo |
|---|---|
| 50×35 | 92×85 |
| 80×50 | 126×111 |
| 120×80 | 179×159 |

Bờ đất đảo chính–mỗi đảo phụ cách12–15ô, tính khoảng cách thẳng ngắn nhất giữa các ô bờ; không dùng khoảng cách hai tâm. Biển có nước nông quanh từng bờ và nước sâu ngăn hai đảo. **Chưa có bãi cạn hoặc lịch rút nước**, nên dân chưa đi bộ qua biển.

Dân khởi đầu và cư dân đón thêm chỉ đặt trên Thiên Nguyên; chọn đảo phụ bị từ chối trước phí. Khu đất đi được trên từng đảo liên thông; đã loại các ô đi được bị cô lập trong lõi núi do noise. Đuốc/thú hoang/khám phá/hàng mang vẫn dùng hệ hiện có. Khi chơi, fog tiếp tục che vùng chưa thấy; tên đảo trên cảnh game không làm lộ địa hình bị che.

Lựa chọn này chỉ có ở chế độ cục bộ. Cụm Đảo/hình dạng cũ vẫn giữ thuật toán cũ; chế độ server thử nghiệm không nhận bố cục mới. Cảnh báo lương thực không còn hiện0ngày khi chưa đặt cư dân.

## Kiểm thử bộ sinh

`test:three-islands` qua **60bản đồ**:20seed tại3kích thước. Có các seed1,2,3,42,321,20810,999999 và13seed bổ sung.

- Đúng3danh tính/seed con khác nhau; vị trí Đông Nam/Tây Bắc đúng.
- Cùng seed/cấu hình tái tạo cùng tiles, metadata và ResourceMap; seed khác có địa hình khác.
- Không chồng vùng đảo/không cắt biên; đất đi được của từng đảo liên thông.
- Khoảng bờ kiểm được12.04–13.04ô trong60bản đồ. Không có đường đi bộ giữa các bãi định cư qua biển.
- Profile cá/rừng/đá/ít thức ăn đạt; nguồn chỉ nằm trong đúng vùng. Main có nguồn ăn/gỗ/đá gần bãi và giữ chuỗi kim loại.
- Roundtrip giữ tiles/metadata/nguồn đã khai thác; dữ liệu trùng danh tính hoặc thiếu registry bị từ chối.
- Từ chối đặt/đón người ở đảo phụ, không trừ phí. Bản cũ đọc/lưu lại không được gắn quần đảo hoặc tái sinh địa hình.

## Lượt mô phỏng có kiếm hàng thật

Bắt đầu8người,0gỗ/0đá và40Food chung như game. Đặt dân quanh bãi trên Thiên Nguyên rồi phân công ăn/gỗ/đá. Chạy100nhịp (10ngày theo đồng hồ hiện tại): **8người sống**, Food142.6, gỗ22, đá20. Tất cả người trên đảo chính; có khai thác, mang hàng, giao kho và tiếp củi thật. Không cấp vật tư thành phẩm hoặc kéo dân qua biển. Đây là lượt10ngày, không phải kiểm tra toàn bộ tiến cấp/kỷ nguyên trên bố cục mới.

[Kết quả mô phỏng/60bản đồ](artifacts/three-islands-core-result.json), [bản chuẩn bị](artifacts/three-islands-ready-save.json), [bản chơi10ngày](artifacts/three-islands-played-save.json).

## Một lượt trực tiếp trên trình duyệt

Edge riêng, thao tác bằng giao diện: chọn Ba đảo/seed20810 → xem preview → bắt đầu → thử đặt ở đảo phụ (bị từ chối/không mất phí) → đặt8dân trên Thiên Nguyên → phân công → chạy khai thác/giao hàng → lưu/tải → kiểm tra registry và nguồn giữ nguyên → nút camera/mobile390px → tải bản cũ giữ địa hình/nguồn → xác nhận lựa chọn chỉ ở local.

Kết quả bản cuối:8người sống tại nhịp15, Food66.8, đá4; gỗ trong kho0 vì đã tiếp vào lửa trại, có nhiên liệu tại lửa. Lượt browser dừng sớm sau khi nguồn đầu tiên được khai thác/giao và tiếp củi; không gộp với kết quả10ngày của mô phỏng.

Không lỗi trang/tải tài nguyên, mobile không tràn ngang. Đã xem ảnh preview/toàn quần đảo/đảo chính/panel-mobile và sửa cảnh báo lương thực lúc chưa đặt dân.

- [Kết quả browser](artifacts/three-islands-browser-result.json)
- [Bản browser đặt đủ dân](artifacts/three-islands-browser-placed-save.json)
- [Bản browser đã kiếm hàng](artifacts/three-islands-browser-played-save.json)
- [Preview](artifacts/three-islands-preview.png)
- [Màn hình tạo](artifacts/three-islands-create-desktop.png)
- [Toàn cảnh ba đảo](artifacts/three-islands-overview-world.png)
- [Cảnh đảo chính đang chơi](artifacts/three-islands-mainland-world.png)
- [Bảng quần đảo](artifacts/three-islands-panel-desktop.png)
- [Mobile](artifacts/three-islands-mobile.png)

Kiểm tra kiểu dữ liệu/build536,9KB, `test:session` và13checkpoint ba nhánh cũ đọc/lưu lại đều qua. Các bản gốc và bản lưu của người dùng không sửa; browser dùng phiên/origin riêng.

## Chưa có và bước sau

Chưa bãi cạn/thủy triều/thuyền/tuyến vận chuyển giữa đảo, AI Mộc/Krock, ngoại giao/quà/cống/chủ quyền hoặc tutorial sáu hồi. Cần làm tuyến bãi cạn thực, lịch nước/cảnh báo/đường thoát/lưu người-hàng giữa chuyến trước khi mở NPC láng giềng và giao thương qua biển. Không nhận toàn bộ Master Era0 đã hoàn thành.
