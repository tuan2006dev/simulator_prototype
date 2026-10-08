# Chuẩn bị vật tư Công nghệ — lượt sản xuất thật

Ngày06/10/2026. Tiếp từ `artifacts/decisions-played-save.json`, không sửa save người dùng và không cấp hàng.

## Đã kiếm được

46 chuyến thương nhân trả vải:22 chuyến quặng sắt,20 chuyến than,4 chuyến đồng. Từng chuyến trừ vải trước, đi tới bờ/trao đổi/trở về; nhập khẩu không tăng bộ đếm hàng sản xuất. Nghiên cứu/viện/3 phân tích/nền tảng đã hoàn tất không làm lại.

Luyện sắt→thép với thợ và vận chuyển; rồi cấp điện cho nhà máy linh kiện và xưởng máy. Sản xuất mới30 linh kiện,6 bộ phận máy,66 vải; linh kiện và máy đã giao về kho. Sau1777 bước:50 sống/Food1040,5, kho30linh kiện/6parts/30thép/6đồng/2than/746vải/39đá xây. Điểm tiếp tục **`artifacts/technology-prepared-save.json`** (earned).

Đã tắt máy phát/xưởng/lab sau chiến dịch để giữ nhiên liệu. Điện riêng viện reset0 đúng luật; nền tảng Công nghệ đã hoàn tất vẫn lưu. Khi cần điều kiện chuyển kỷ nguyên phải cấp lại5ngày điện cùng viện có thợ, không mượn proof cũ.

## Kết quả kiểm tra và điều chỉnh cách chơi

`test:technology-preparation` qua: mọi phí nhập/trả vật tư, nguồn khoáng hết không tự sinh thêm, đầu ra thực của luyện kim/lắp ráp, vận chuyển giao về kho,50 người sống xuyên suốt,lưu/tải,HiệnĐại giữ nguyên/DịTượng khóa.

Hai lỗi trong cách tổ chức lượt thử đã được xử lý, không sửa luật game để né: giữ5người ở công nghiệp quá lâu làm cạn đồ ăn và một người chết trong lượt thử thất bại riêng; đã trả thợ trồng lanh/dệt về lương thực sớm và trả người thương nhân khi hết chuyến. Chờ đủ sản phẩm về kho mới tắt xưởng máy làm tiêu quá nhiều thép trong khi thành phẩm còn đang giao; đã dừng theo tổng sản phẩm vừa chế tạo rồi chờ giao nốt. Bản cuối50 sống/Food1040,5, không dùng bản thử thất bại để tiếp tục.

Browser Edge context riêng: bật nhà máy/máy phát qua UI, chạy thực tạo thêm linh kiện,50sống/xưởng máyOFF; texture riêng nhà máy, bản cuối trên điện thoại/nền tảng giữ nguyên/proof điện0/DịTượng khóa/no overflow/no lỗi. Ảnh `artifacts/technology-preparation-factory.png`, `technology-preparation-mobile.png`. Dùng temp thử ổD.

## Còn làm

**Đợt này kiếm vật tư đầu vào, chưa thêm vi mạch hoặc hoàn thành chuỗi nhánh.** Tiếp triển khai nguồn linh kiện→vi mạch và nơi dùng vi mạch có tác dụng thực, theo nhánh Công nghệ trong ERA_SYSTEM_DESIGN.md. Có thể chia thành nghiên cứu bán dẫn (đòi nền tảng Công nghệ), xưởng vi mạch có texture/thợ/input/điện2/vận chuyển, nghiên cứu điều khiển tiêu vi mạch, trung tâm điều khiển dùng vi mạch với lợi ích vận hành rõ ràng và cần điện/thợ. Chi phí/prototype cần cân bằng theo bản30linh kiện6parts30thép6đồng đã kiếm được; thiếu nguyên liệu tiếp tục kiếm bằng quy trình thật.

Giữ ba nhánh; hồ sơ và chế tạo mẫu chưa chốt nhánh chủ đạo. Không mở DịTượng trước kinh tế nhánh chạy/test được và phí50linh kiện20thép/5ngày tiến cấp cùng điều kiện3phân tích/5ngày điện viện. Hiện Đại dầu/y tế còn chưa xong. Thời hạn03:27ngày07/10, từ02:57 chỉ kiểm tra/sửa lỗi.
