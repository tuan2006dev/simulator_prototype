# Vật tư và điện trước Hiện Đại — N4A tiếp

## Đã kiểm chứng trong lượt chơi thật

Tiếp từ artifacts/modern-50-stable-save.json, giữ đủ 50 dân sống và 50 giường. Phân công 4 người lấy gỗ, 2 người ruộng lanh, 2 người dệt, 2 người luyện sắt, 1 người lò thép và 1 người giao thương. Các hàng nhập đều trả phí và chỉ nhận sau khi người giao thương quay về.

`test:modern-readiness` qua: 18 chuyến đổi vải lấy quặng sắt, 14 chuyến đổi đồng lấy than; tổng 32 chuyến trả phí mới. Sản xuất thêm 44 thép thật. Khi đủ vật tư, chuyển 4 thợ dệt/lanh sang khai thác và luyện đồng còn trên bản đồ; đổi thêm than bằng đồng thật. Sau đó trả thợ công nghiệp tạm thời về làm lương thực, tích hơn 8 ngày ăn rồi bật máy phát/xưởng để kiểm chứng 3 ngày điện. Không thêm kho/vật tư, sửa nhu cầu, mở khóa hoặc đặt công trình hoàn thành trong save để qua điều kiện.

Kết quả sau 4741 bước từ bản 50 dân: Food 1813,4; gỗ 1900; đá 144; thép 36; đá xây 119; vải 1000; bộ phận máy 16; đồng 11; than trong kho 8 và tại máy 8. Công suất 6/2; cùng một xưởng đạt 30 bước điện liên tục. Cả 10 điều kiện và phí 30 thép +40 đá xây +20 vải đã đủ. Save thành công: artifacts/modern-ready-save.json. Đây vẫn là Đồ Sắt; Hiện Đại chưa mở.

Các lượt trước thất bại vì chưa dành đủ thép cho xưởng ngoài phí, hoặc bật máy rồi chờ lương thực khiến than và thép bị dùng hết. Không dùng các lượt đó làm bằng chứng đạt điều kiện. Lượt cuối chạy lại từ bản 50 dân ban đầu, mua đủ vật tư, đổi phân công và giữ đầy lương thực trước cửa sổ điện; đã qua. Bản thử thất bại còn tên modern-readiness-waiting-save.json để đối chiếu, không tiếp từ nó khi thử chuỗi Hiện Đại.

## Giao diện và test

Bảng chuẩn bị có ba thẻ phí riêng với icon thép/đá xây/vải của game, hiện đủ/thiếu và nút mở sản xuất khi thiếu. Giải thích xưởng máy cũng dùng thép; tắt máy trong lúc chờ sẽ phải kiểm chứng lại 3 ngày điện, và nên trả thợ về làm lương thực sau chiến dịch tích vật tư. Không tự trả phí.

`test:modern-readiness-ui` qua trên browser context riêng desktop/390×844: 10 điều kiện xanh và đủ ba phí; icon tải được; Hiện Đại vẫn khóa. Tắt máy khi pause làm bằng chứng về 0 ngay, không đổi vật tư/nhịp; reload giữ đúng trạng thái. Không lỗi/tràn. Có ảnh phí, điều kiện, công trình và cư dân chibi trong game. `test:modern-preparation-ui` hồi quy qua; kiểu dữ liệu/build qua.

Ảnh: artifacts/modern-ready-desktop.png, modern-ready-mobile.png, modern-ready-fees-desktop.png, modern-ready-fees-mobile.png, modern-ready-power-reset.png, modern-ready-island.png.

## Điểm tiếp tục

N4 vẫn chưa hoàn thành. Lượt tiếp theo dùng **modern-ready-save.json**, nối nút trả phí một lần/thời gian 5 ngày/lưu tải; mở ít nhất một chuỗi nhà máy linh kiện tiêu kim loại +công suất, có mục tiêu nghiên cứu hoặc nâng cấp thực sự dùng sản phẩm. Chỉ mở cờ Hiện Đại sau khi chuỗi đã chạy và test. Dị Tượng vẫn khóa.

Chú ý xưởng đang dùng thép: lúc bắt đầu chuyển cấp trả 30 thép còn 6 trong kho; đầu vào xưởng đang có 4. Cần quyết định tắt xưởng sau khi bắt đầu để dành thép cho công trình mới; không tự thêm vật tư. Máy phát còn đủ nhiên liệu ngắn hạn nhưng nghiên cứu/sản xuất tiếp vẫn phải tiếp than. Mạch đồng thật còn 56 tại (11,8), cộng 8 quặng trong buffer mỏ và 2 đồng trong buffer lò; cho thợ trở lại mỏ/lò khi cần tiền đổi than/kim loại. Vải đã đủ đổi quặng sắt. Lò thép còn 3 sắt và 5 than trong buffer, không tính là kho phí. Những nguồn này giữ theo save thật.
