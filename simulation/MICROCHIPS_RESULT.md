# H4C1 — Vi mạch và điều khiển công nghiệp có tác dụng thực

Ngày06/10/2026, tiếp từ `artifacts/technology-prepared-save.json` earned. Giữ bản lưu người dùng; chưa chuyển nhánh chủ đạo.

## Gameplay đã nối

- **Bán dẫn tiên tiến**: chỉ nghiên cứu sau hồ sơ nền tảng Công nghệ; trả8linh kiện2bộ phận máy +15gỗ10đá20food,4ngày. Không nhận hàng/biến thể miễn phí.
- **Xưởng vi mạch**: xây20gỗ10đá20food+6linh kiện2parts6đá xây. Một cấp,2thợ tối đa. Người đi xây/làm,2công suất, đầu vào/đầu ra/haulers thật. Mỗi mẻ2linh kiện+1đồng→1vi mạch, không sản xuất nếu mất điện; giữ input/mẻ. Icon vi mạch riêng và texture xưởng riêng.
- **Điều khiển công nghiệp**: nghiên cứu trả4vi mạch+10gỗ5đá15food,3ngày.
- **Trung tâm điều khiển**: xây20gỗ10đá20food+2vi mạch2parts5thép8đá xây. Một cấp,1người vận hành,2công suất. Người trưởng thành có mặt làm việc tại trung tâm tăng tốc mẻ công nghiệp trong bán kính Chebyshev6ô thêm25% (nhà máy linh kiện/xưởng vi mạch/xưởng máy/lò thép). Không cộng dồn trung tâm, không có tác dụng khi người nghỉ/ngủ/vắng/mất điện. Vẫn tiêu đầy đủ vật tư từng mẻ, không tạo thêm output miễn phí.
- Điều phối điện public cho hai công trình, mô tả/lợi ích/trạng thái/giới hạn cấp và lưu cũ thiếu microchips đã nối. Điện là công suất. Sửa nhãn thiếu điện cũ trong inspector xưởng khi bật nguồn trong lúc pause.
- Bộ ảnh hiện33công trình/297texture và86icon riêng; cư dân tiếp tục chibi mềm/dễ thương.

## Lượt thực, không cấp tài nguyên

Khai thác/giao đá thường còn thiếu. Trả đủ nghiên cứu/xây dựng bằng hàng đã kiếm từ đợt trước.3chuyến than mới trả24vải và1chuyến đồng trả12vải, vận chuyển đi/trao đổi/về; không làm lại46chuyến cũ. Chế tạo và giao **6vi mạch**, tiêu đúng4 vào nghiên cứu và2 vào xây trung tâm. Trung tâm có thợ/điện thực, tắt/bật/rút thợ làm mất/khôi phục hiệu ứng. Sau đó chạy nhà máy trong vùng và **giao9linh kiện mới** về kho từ thép/đồng thực.

682bước/50sống/Food1799,1. Kho9linh kiện/17thép/10than/710vải/25đá xây,0đồng/0parts/0vi mạch; xưởng vi mạch còn4linh kiện input, không được tính là kho phí tiến cấp. Xưởng vi mạch(2,6),trung tâm(0,4). Điểm tiếp tục **`artifacts/microchips-played-save.json`**. Máy phát/trung tâm đang bật; các xưởng khác tắt sau đủ mẻ. Viện chưa có thợ/đangOFF, proof0; cần cấp lại5ngày khi xét tiến cấp.

## Kiểm tra

`test:microchips` qua: khóa nền tảng/phí thật/replay/khai thác đá/xây/thợ/nhập hàng/điện/giữ input lúc tắt/lưu/6vi mạch được giao/tiêu4nghiên cứu2xây/hiệu ứng trung tâm/giao9linh kiện/50sống/HiệnĐại giữ/DịTượng khóa.

Fixture riêng so sánh20nhịp làm tại chỗ:4mẻ thường,5mẻ điều khiển; tiêu lần lượt8 và10linh kiện,5đồng cho5mẻ. Fixture nghỉ/vắng/tắt/rútthợ/bán kính và không cộng dồn/âm kho bị từ chối. Không dùng fixture thay bằng chứng earned.

Browser Edge context riêng: texture/cấp1/HiệnĐại/recipe, public tắt+bật xưởng và chạy thực tạo thêm vi mạch/50sống; nghiên cứu điều khiển trừ4vi mạch thật khi pause và lưu/tải không trả lần nữa; trung tâm hoạt động/tắt/bật phản hồi ngay/mobile/khóaDịTượng/no lỗi/no overflow. Typecheck/build390,4KB/session/era qua, icons-ui86 qua. Ảnh `artifacts/microchips-factory-desktop.png`, `microchips-research-desktop.png`, `control-center-desktop.png`, `control-center-mobile.png`. Temp thử ổD, không xóa dữ liệu người dùng.

## Còn làm

**H4C1 chuỗi mẫu Công nghệ đã chạy, H4 tổng chưa xong.** Chưa mở tiến cấp DịTượng, chưa chốt nhánh chủ đạo, chưa nhận biến thể, chưa có chuỗi hạt nhân/lò phản ứng hoặc hai kinh tế Linh Mạch/Quỷ Dị. Hiện Đại dầu/y tế chưa xong.

Tiếp H4C2: quyết định chuyển nhánh chủ đạo Công nghệ bằng dự án chủ động có phí/time/lưu/idempotent; trước mở cần3phân tích,5ngày điện cùng viện/thợ riêng (hiện0),nền tảng và chuỗi vi mạch/điều khiển đã có. Nếu giữ thiết kế, phí50linh kiện20thép và5ngày phải kiếm/trả thật; kho hiện9/17 nên cần sản xuất/nhập bổ sung, không cấp hàng. Chỉ cho chọn hướng đã thực hiện/kiểm tra; các hướng chưa có kinh tế phải ghi rõ chưa sẵn sàng, không thu phí/chuyển nhãn giả. Lựa chọn research/phong tỏa/bỏ qua giữ đúng ý nghĩa; các cơ chế biến thể để bước riêng có lựa chọn/chăm sóc, không tự đổi cả dân.
