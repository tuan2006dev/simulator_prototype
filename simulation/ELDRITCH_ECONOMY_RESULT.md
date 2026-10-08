# Quỷ Dị — kinh tế sinh chất và kiểm soát phơi nhiễm (H4E1)

06/10/2026. Lượt THAY THẾ thứ ba từ artifacts/analysis-played-save.json earned trước quyết định: giữ viện và ba hồ sơ đã phân tích, làm nền tảng Quỷ Dị mới. Không lấy hàng/proof của Hightech hoặc Mystic, không sửa hai nhánh đã chốt, không thay save người dùng. Hiện vẫn Hiện Đại, chưa mở dự án chuyển nhánh Quỷ Dị và chưa có biến thể.

## Luồng chơi

1. Nền tảng eldritch tại viện trả4linh kiện/60nhịp làm, có người và điện thật. Nghiên cứu Tiếp cận di tích biến chất cần nền tảng, trả6vải4đá xây/vật tư thường/thời gian.
2. Trạm thu di tích đặt trong2ô điểm đã nghiên cứu, có thợ đi tới. Một mẻ:2xương cốt di tích +1huyết thạch, tiêu1trữ lượng, tăng8nhiễm nguồn và tối đa5phơi nhiễm người thu. Nguồn24trữ lượng/0–100nhiễm, hồi1trữ lượng/giảm1nhiễm mỗi10nhịp. Nguồn nhiễm60 hoặc cạn, thợ phơi nhiễm30 thì dừng an toàn. Có nút cho nghỉ/tiếp tục. Không giết/hiến tế dân để sinh vật liệu.
3. Người rời3ô nguồn hồi1phơi nhiễm mỗi5nhịp; muốn hồi nhanh hơn dùng khu cách ly. Không truyền nhiễm sang người đi ngang, không trừ HP ngẫu nhiên, không biến đổi toàn dân. Trong bản đầu phơi nhiễm là giới hạn lao động có cảnh báo, không phải mô phỏng bệnh lây hoàn chỉnh.
4. Nghiên cứu Sinh chất ổn định trả2xương1huyết thạch4vải; xưởng dùng2xương1huyết thạch1thảo dược→1sinh chất, cần2công suất/thợ tại chỗ/nguyên liệu giao trước chế/thành phẩm giao về kho.
5. Nghiên cứu Kiểm soát phơi nhiễm trả3sinh chất; xây khu cách ly trả2sinh chất4đá xây/vật tư thường. Đây là nơi dùng sản phẩm thật:1sinh chất/10nhịp có tác dụng,2công suất/người làm tại chỗ; giảm2nhiễm nguồn trong3ô và2phơi nhiễm cư dân trong4ô. Vắng thợ/ngủ/mất điện/không có nhiễm trong vùng giữ nhiên liệu, không chăm sóc từ xa hoặc cả đảo.

Trạm/xưởng/khu cách ly đều một cấp, vật tư nghiên cứu/xây có trả thật. Ba texture và ba icon riêng theo màu tím đất/kem, hình khối di tích/bồn sinh chất/khu kiểm soát; giữ cư dân chibi mềm dễ thương. 41công trình/369texture/94icon. Điện là công suất đang cấp, không có hàng điện trong kho.

## Lượt earned và checkpoint

- 8chuyến than trả64vải; thu đá, làm nền tảng/nghiên cứu/xây/thợ/haul/điện thật. Trả người thu về Food và rời vùng nguồn lúc phơi nhiễm/nhiễm cao rồi quay lại an toàn, không dùng vật tư fixture.
- 1661bước,50người sống, Food1699,4; thu34xương/17huyết thạch, chế và giao9sinh chất. Trả3 nghiên cứu +2 xây khu cách ly và tiêu2 cho20nhịp kiểm soát có tác dụng.
- artifacts/eldritch-played-save.json: nguồn24/20nhiễm, không còn người phơi nhiễm; kho4xương2huyết thạch1sinh chất,23than912vải25đá xây,0linh kiện/0thép/0parts. Trạm còn10xương5huyết thạch chờ giao, khu cách ly còn1sinh chất đầu vào/0fuel; không cộng hàng tại xưởng vào kho trả phí.
- ViệnOFF/proof0, xưởngOFF/khu cách lyOFF/trạm nghỉ; máy phát vẫnON trong checkpoint. Đợt sau tắt máy khi chưa cần và giữ người Food để tránh hao than. Chưa đủ phí50linh kiện20thép hoặc5ngày điện viện để chuyển nhánh.
- artifacts/relic-channel-played-save.json trước nghiên cứu sinh chất; biomatter-ready-save.json trước mẻ xưởng; quarantine-ready-save.json trước vòng kiểm soát. Không tiếp eldritch-waiting-save nếu có lần thử thất bại.

## Test

- test:eldritch: lượt earned trên; pause giữ sản lượng/nhiên liệu, nghiên cứu/xây tiêu sản phẩm thật, lưu toàn chuỗi; yêu cầu chuyển eldritch bị từ chối và không mở cờ.
- Fixture riêng chỉ điều chỉnh áp lực nguồn/phơi nhiễm/vị trí thợ và đối tượng, dùng hàng earned. Kiểm tra nguồn cạn/nhiễm60/người30 dừng, tiêu1charge và ra đúng2+1, biên29→30 không tạo save vượt30; cách ly đúng−2nhiễm/−2phơi nhiễm trong vùng, ngoài4ô không ảnh hưởng, ngủ/mất điện giữfuel, từ chối nguồncharge25.
- test:eldritch-ui: Edge riêng, public thu mẫu pause/tiếp/lưu/tải/live cả2sản phẩm, live chế sinh chất, khu cách ly tắt điện/lưu/tải/chạy vẫn giữfuel rồi bật lại/livecare;50sống/Modern chưa chốt/mobile390px/không tràn ngang/không lỗi. Đã xem ảnh, sửa cảnh báo nghỉ còn hiển thị sẵn sàng và câu “kinh tế chưa có” lỗi thời, chạy lại.
- Hồi quy clinic/surveys/anomaly-save/session/era và kiểu dữ liệu qua; browser94icons qua. Bản dựng khoảng458,2KB.
- Ảnh trong game và thao tác: artifacts/relic-extractor-desktop.png, biomatter-workshop-desktop.png, quarantine-desktop.png, eldritch-mobile.png, quarantine-mobile.png. Không dùng ảnh gallery thay ảnh vận hành.

## Tiếp theo

H4E1 kinh tế xong vòng đầu; H4E2 tiến cấp Quỷ Dị còn chưa làm. Từ eldritch-played-save.json kiếm và giao50linh kiện20thép qua nhập quặng/than trảvải/luyện/lắp ráp thật, không ghép tài nguyên hai lượt đã chốt. Nối gate/dự án chủ động/view trước/phí50+20/50nhịp làm cùng viện/thợ/5ngày điện riêng mới; giữ yêu cầu3phân tích/nền tảng/chuỗi nguồn-sinh chất-cách ly đã chạy. Chỉ mở nhánh sau kiểm tra earned/bộ lưu/lưu-tải/hủy-hoàn1lần/idempotent/outage. Sau đó mới cân nhắc biến thể tự nguyện/chăm sóc/đường gỡ, không tự đổi dân. Hạt nhân/dầu/vận tải/bệnh lây/y tế đầy đủ/toàn bộ endgame chưa xong.
