# Kết quả triển khai — 2026-10-05

> Báo cáo này ghi hai đợt Đồ Đá/Đồ Đồng. Đợt tiếp theo đã bổ sung Đồ Sắt, nâng cấp cấp 3 và giao thương NPC: xem [IRON_IMPLEMENTATION_RESULT.md](IRON_IMPLEMENTATION_RESULT.md) và WORK_PLAN.md để biết trạng thái hiện tại.

## Đã hoàn thành

- Lộ trình năm kỷ nguyên đúng GDD: Đồ Đá → Đồ Đồng → Đồ Sắt → Hiện Đại → Dị Tượng. Bản chơi hiện thực hiện hai kỷ nguyên đầu; các phần sau có nhãn chưa triển khai.
- Bảng kỷ nguyên hiển thị điều kiện thật: 12 dân sống đã đặt trên đảo, nghiên cứu cần thiết, nhà/kho hoàn thành, 5 mẻ nông trại, 5 mẻ trại gỗ hoặc mỏ đá, đủ chỗ ở và thức ăn dự trữ 3 ngày.
- Phát triển Đồ Đồng chủ động, trả 40 gỗ + 20 đá một lần, làm trong 20 tick có dân trưởng thành. Lưu/tải được cả tiến trình đang làm.
- Nghiên cứu dùng một dân trưởng thành được phân công, có tiến độ làm việc thật, đổi người phụ trách và tạm ngừng khi người đó không thể làm việc. Giao diện chia theo kỷ nguyên và nhóm; công nghệ chưa triển khai bị khóa trước khi thu phí.
- Mỏ đồng, lò luyện và xưởng gỗ tạo chuỗi quặng → đồng, gỗ → gỗ xẻ. Đầu vào, nguồn quặng và sức chứa kho quyết định sản lượng; kho đầy không làm mất nguyên liệu.
- Nâng cấp cấp 2 cần Đồ Đồng, nghiên cứu xây dựng, đồng/gỗ xẻ và thợ có mặt. Cấp 3 vẫn khóa. Sau đợt mở rộng có 90 texture SVG cho 15 loại công trình, 3 cấp hình ảnh và hai phong cách thời đại.
- Lưu/tải cục bộ, tự lưu và tiếp tục khi tạm dừng. Đọc bản cũ có thông báo về dữ liệu thiếu; dân mới sau khi tải lại có mã duy nhất.

## Cách chơi luồng mới

1. Bắt đầu hoặc tiếp tục bản lưu, đặt dân lên đảo và cân bằng ưu tiên thức ăn/gỗ/đá.
2. Nghiên cứu các công nghệ Đồ Đá; xây nhà, kho, nông trại và trại gỗ hoặc mỏ đá. Phân công thợ và tích lũy mẻ sản xuất.
3. Bấm huy hiệu kỷ nguyên để xem từng điều kiện; đủ điều kiện thì bấm phát triển Đồ Đồng.
4. Nghiên cứu luyện đồng, xây và vận hành ba công trình mới. Có đồng/gỗ xẻ thì nghiên cứu xây dựng và nâng cấp công trình.
5. Bấm Lưu để giữ tiến độ; lần mở sau dùng Tiếp tục bản đã lưu.

## Kiểm thử đã qua

- Kiểm tra kiểu dữ liệu và đóng gói bản trình duyệt.
- Lao động, phiên mô phỏng/lệnh trùng, bản đồ, sinh vật, công trình và server thử nghiệm.
- Luồng Đồ Đá → Đồ Đồng bằng lao động và sản xuất thật: nghiên cứu, xây, điều kiện, chi phí, tiến cấp, luyện đồng, chế biến gỗ và nâng cấp.
- Trường hợp quặng hết, kho đầy, không mất đầu vào, nghiên cứu gián đoạn/đổi người, không tự nhảy kỷ nguyên, tải giữa tiến trình và bản lưu cũ.
- Trình duyệt máy tính và màn hình 390 × 844: thao tác tiến cấp/nghiên cứu/nâng cấp/đặt xưởng gỗ, sản xuất, lưu/tải, thêm dân sau tải và không tràn bảng. Không có lỗi chạy được ghi nhận trong lượt kiểm tra này.
- Test hồi quy giao diện nghiên cứu và xây dựng đã qua. Test server giữ hoạt động chia sẻ đảo và kiểm tra lệnh như trước.

Ảnh kết quả nằm trong `artifacts/`: `bronze-house-upgraded.png`, `bronze-sawmill-producing.png`, `bronze-mobile.png` và `era-mobile.png`.

## Giới hạn và thứ tự tiếp theo

Bản này là luồng chơi cục bộ. Các lệnh xây dựng/nghiên cứu/kỷ nguyên chưa mở trên server thử nghiệm; dữ liệu server chưa lưu dai dẳng. Lưu cục bộ chưa hứa hẹn tái hiện chính xác mọi kết quả ngẫu nhiên sau khi tải lại.

Đợt mở rộng Đồ Đồng đã hoàn thành như phần dưới; chặng đầu Đồ Sắt đã được bổ sung trong báo cáo riêng. Còn tiền công nghiệp Đồ Sắt, Hiện Đại, Dị Tượng và biến thể. Niềm tin hiện mới có hành vi cầu nguyện/nghi lễ cơ bản, chưa có kinh tế riêng hoặc ba nhánh dị tượng. Cần cân bằng thêm bằng nhiều lượt chơi dài với bản đồ ngẫu nhiên trước khi chốt nhịp tiến cấp.

## Đợt mở rộng Đồ Đồng — đã hoàn thành

Nghiên cứu **Gạch và đồ gốm** mở hố đất sét, lò gạch và xưởng gốm. Nghiên cứu **Lúa mì và làm bánh** mở ruộng lúa mì và lò bánh. Cả hai cần Đồ Đồng, nghiên cứu nền tảng, nguyên liệu và người phụ trách thật.

| Công trình | Mỗi mẻ làm việc 10 tick/thợ |
|---|---|
| Hố đất sét | Thu 6 đất sét từ mỏ còn trữ lượng trong 3 ô |
| Lò gạch | 4 đất sét +2 gỗ →4 gạch |
| Xưởng gốm | 3 đất sét +1 gỗ →2 đồ gốm |
| Ruộng lúa mì | 12 lúa mì; đất màu mỡ +25% |
| Lò bánh | 8 lúa mì +2 gỗ →bánh tương đương 40 thức ăn |

Xưởng gốm cần thêm 4 gỗ xẻ khi xây; lò bánh cần thêm 8 gạch +2 đồ gốm. Gốm đang trong kho tăng 10 sức chứa mỗi loại hàng/chiếc, tối đa +100. Gốm dùng xây công trình không còn tạo lợi ích kho; hàng có sẵn được giữ lại nếu sức chứa giảm. Thức ăn có kho riêng. Lúa mì thô chưa ăn được và không tính vào dự trữ thức ăn.

Bản lưu trước đợt mở rộng nhận bốn loại hàng mới ở mức 0. Những thế giới có bờ nước và ô đất trống được bổ sung mỏ đất sét; không thay tài nguyên cũ và không phục hồi mỏ đất sét đã cạn.

Test mới đã qua:

- `test:bronze-economy`: tiếp tục từ bản chơi Đồ Đồng thật, nghiên cứu → khai thác → chế biến → xây lò bánh → sản xuất. Kiểm tra chính xác công thức, chi phí lệnh trùng, sức chứa, kho đầy, thiếu nhiên liệu, mỏ cạn, đất màu mỡ, lúa mì không thành thức ăn trực tiếp, lưu/tải và sinh mỏ theo seed.
- `test:bronze-economy-ui`: thao tác nghiên cứu, đặt hố đất sét, phân công và thu hàng, xem năm công trình mới, dùng gạch/gốm xây thêm lò bánh, tải lại giữ đủ hàng/công trình. Kiểm tra máy tính và màn hình 390 × 844; không tràn bảng hoặc ghi nhận lỗi chạy.
- Kiểm tra kiểu dữ liệu/build và test hồi quy lao động, phiên mô phỏng, bản đồ, sinh vật, công trình, giao diện nghiên cứu/xây dựng/kỷ nguyên đều qua.

Ảnh mới: [lò bánh trên máy tính](artifacts/bronze-bakery-desktop.png), [danh mục điện thoại](artifacts/bronze-economy-mobile.png), [kho hàng điện thoại](artifacts/bronze-goods-mobile.png).

Chạy kiểm thử theo thứ tự: `npm run test:era`, `npm run test:bronze-economy`, rồi `npm run test:bronze-economy-ui` khi môi trường có Playwright và Edge. Các bản lưu kiểm thử chỉ nằm trong thư mục artifacts và các phiên trình duyệt kiểm thử riêng.
