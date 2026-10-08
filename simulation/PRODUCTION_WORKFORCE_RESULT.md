> Cập nhật đợt tiếp: đã có bảng điều hành, mục tiêu dự trữ người chơi chỉnh và danh sách cảnh báo mở công trình; xem [báo cáo](MANAGEMENT_RESULT.md). Các giới hạn dưới đây ghi tại thời điểm đợt nhân lực.

# Tự nhận công nhân và cảnh báo chuỗi sản xuất — 2026-10-05

## Hành vi đã chạy

Khi tự nhận việc của làng bật, dân trưởng thành ở chế độ Tự động có thể nhận vị trí tại công trình sản xuất hoàn thành. Bản cũ giữ tất cả phân công sẵn có như việc bạn chọn; không đoán rằng chúng là phân công tự động. Người chơi có thể chuyển từng người sang Tự động để trao quyền điều chỉnh cả vị trí ở công trình hiện tại.

Thứ tự ưu tiên:

1. Duy trì thức ăn: dùng ruộng/bến câu khả dụng, rồi hái/câu ở nguồn còn đường đi. Mục tiêu nhân lực thức ăn vẫn theo dự trữ và nhu cầu ăn hiện có.
2. Vận chuyển hàng thực tế, tăng số người khi thành phẩm tồn nhiều. Mục tiêu từ mức cơ bản khoảng một người/8 dân đến tối đa một người/4 dân và không quá 6, dùng người còn rảnh sau ưu tiên thức ăn. Đây là mục tiêu điều phối, không cưỡng chế rút người đang giao hàng.
3. Dự trữ gỗ/đá, nhận trại gỗ/mỏ đá nếu khả dụng hoặc dùng nghề thu thập.
4. Với dự trữ ăn từ 1,5 ngày, nhận một người mỗi xưởng hữu ích trước khi bổ sung thêm. Ưu tiên lò bánh, nguồn thô, rồi chế biến; bỏ xưởng không có nguồn đầu vào hoặc đường cấp nguyên liệu. Mốc hàng dự trữ thử nghiệm cho xưởng là 30 mỗi hàng chế biến/nguồn hàng, 100 gỗ, 60 đá, 80 thức ăn. Các mốc này dùng để mở vị trí mới, chưa phải mục tiêu sản xuất do người chơi chỉnh.

Không tự xây, nâng cấp, nghiên cứu, chế công cụ hoặc khởi hành thương vụ. Các việc đó vẫn do bạn chọn. Không lấy trẻ nhỏ, người mang hàng, có lệnh trực tiếp, đang nghiên cứu/chế tạo hoặc đang xử lý nhu cầu sinh tồn. Người chỉ định bằng tay không bị điều chuyển.

## Quyền điều phối và giữ công việc

Mỗi công trình lưu danh sách người tự nhận riêng với danh sách nhân công tổng. Phân công tay/rút người bằng tay khóa người đó ở chế độ Bạn chọn nghề; chọn Tự động trong tab Dân cư để trao lại quyền. Người đang làm xong mẻ/chuyến được giữ, không bị lấy giữa đường.

Công trình có nút **Bật/Tắt tự nhận công nhân**. Tắt ngăn nhận thêm và trả nhóm tự động tại ranh giới mẻ/chuyến; giữ thợ bạn chỉ định. Tắt tự nhận việc của toàn làng ngừng điều phối, vẫn giữ các phân công đang làm.

Xưởng đầy kho, thiếu nguồn hoặc không còn đường có thể trả người tự động; khi thức ăn xuống dưới 1,5 ngày, công trình ngoài chuỗi thức ăn cũng nhường người tại ranh giới an toàn. Nhân công ở xưởng vẫn ăn/ngủ/đi tới nơi như trước. Không tăng sản lượng miễn phí, không đổi phí công trình hay công thức, không dịch chuyển người hoặc ghi hàng vào kho từ xa.

Ban Phước tạo tiến độ số lẻ: khi vừa hoàn thành một chu kỳ còn phần dư, phần dư được giữ theo người/công trình khi điều chuyển và phục hồi lúc tự nhận lại đúng công trình. Không bỏ công đã làm, không khiến người bị kẹt mãi vì tiến độ luôn còn 0,5 bước.

## Cảnh báo và giao diện

Bảng chi tiết công trình và phần Hậu cần trong tab Dân cư hiển thị nguyên nhân: thiếu công nhân, thiếu loại đầu vào cụ thể, chờ vận chuyển, nguồn cạn, kho đầu ra đầy, không có đường tới công trình hoặc đường cấp/giao hàng bị ngăn cách. Có nhãn người tự nhận và người bạn phân công. Cảnh báo cập nhật sau thao tác ngay cả khi tạm dừng.

Điện thoại: bảng công trình phủ lên ô Niềm tin, không bị che nội dung/nút. Bản lưu v5 giữ nút bật/tắt, quyền sở hữu phân công và phần tiến độ còn dư; kiểm tra ID/giới hạn/trùng khi đọc.

## Kiểm tra

Các làng 5/15/25 dân dùng bản đồ và công trình chuẩn bị cho phép thử; không phân công xưởng bằng tay, không cấp hàng thêm trong lúc chạy. Qua **60 ngày**:

| Dân | Dân sống | Thức ăn cuối | Đồng sản xuất | Người vận chuyển nhiều nhất |
|---|---|---|---|---|
| 5 | 5 | 278,5 | 6 | 2 |
| 15 | 15 | 271,3 | 66 | 4 |
| 25 | 25 | 218,0 | 88 | 4 |

Kiểm tra thêm: nhân công thủ công, giữ mẻ dở/chuyến hàng, rút tại ranh giới, giữ/phục hồi 0,5 bước và lưu phần dư, bật/tắt riêng công trình, đổi chế độ người, nguồn cạn/kho đầy/đường ngăn cách, đọc bản cũ và từ chối danh sách nhân công giả. Kho công trình không vượt 60, túi không vượt 30.

Trình duyệt Edge tiếp tục **bản làng Đồ Đồng thật 12 người**. Bản cũ giữ nhân công ban đầu; dùng điều khiển thật để chuyển sang tự động và bật tự nhận việc, chạy 15 ngày, tắt lò luyện, tải lại và chạy 6 ngày để rút nhóm tự động. Phân công một người bằng tay, bật lại xưởng, tải lại rồi chạy 6 ngày: người đó vẫn ở xưởng. Tổng 27 ngày, đủ 12 người sống, còn khoảng 686,6 thức ăn. Kiểm tra cảnh báo, desktop và 390×844, không lỗi chạy/tài nguyên hoặc tràn ngang.

Tiếp tục riêng hai bản làng đã chơi, trao quyền tự động qua lệnh thật rồi chạy 40 ngày: Đồ Đồng đủ 12 người, 700 thức ăn; Đồ Sắt đủ 25 người, khoảng 542,9 thức ăn; bản lưu nhân công/tiến độ hợp lệ.

Kiểm tra kiểu dữ liệu/build và hồi quy nghề tự động, công trình, nhịp sống, trang bị, phiên lệnh, Ban Phước, thời tiết và hậu cần Đồ Đồng/Đồ Sắt.

Ảnh: `artifacts/production-factory-desktop.png`, `production-factory-mobile.png`, `production-overview-desktop.png`, `production-overview-mobile.png`. Bản lưu mô phỏng: `production-auto-5-save.json`, `production-auto-15-save.json`, `production-auto-25-save.json`; bản trình duyệt: `production-browser-save.json`.

## Giới hạn và bước tiếp

Đây là điều phối cục bộ theo nhu cầu đơn giản; chưa có tính cách chọn nghề, mục tiêu kho tùy chỉnh hay quy hoạch mạng đường. Nguồn cạn cần bạn tìm/xây nơi khác; cảnh báo không tự tạo tài nguyên hay tự đặt công trình. Kho làng vẫn dùng pool chung của hậu cần hiện tại. Chưa mở tính năng này cho online.

Bước tiếp hợp lý: mục tiêu dự trữ người chơi chỉnh được và ghim danh sách cảnh báo; sau đó phát triển nguy hiểm/đột kích nhỏ và Khiên Thần theo đặc tả.
