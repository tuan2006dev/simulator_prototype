# Era 0 và Faith — tổng hợp với game design

> Cập nhật nhân lực 2026-10-05: tự nhận vị trí công trình/xưởng, cảnh báo chuỗi sản xuất và bảo toàn phần tiến độ khi điều chuyển đã chạy cục bộ. Tính cách chọn nghề còn là bước sau; xem [kết quả](PRODUCTION_WORKFORCE_RESULT.md).

> Cập nhật tiếp 2026-10-05: thời tiết, cháy rừng nhỏ và Cầu Mưa đã triển khai cục bộ; giữ 40/60/+30% 45 giây theo đặc tả. Cân bằng thiên tai, giới hạn và test tại [báo cáo](WEATHER_RESULT.md).

> Cập nhật 2026-10-05: Niềm tin/Ban Phước đã triển khai cục bộ theo mốc gốc, chặn dùng trong kiệt sức; trần/khởi đầu/bonus đền của bản thử và kiểm tra tại [báo cáo thần lực](FAITH_RESULT.md). Đề xuất giảm nhẹ hậu quả dưới đây vẫn là phương án cân bằng tương lai.

> Ngày: 2026-10-05. Nguồn: ERA0_AND_DIVINE_SYSTEMS_SPEC.md, GAME_DESIGN.md, ERA_SYSTEM_DESIGN.md, GAMEPLAY_SYSTEMS_V1.md và mã nguồn hiện tại.
> Đây là bản đối chiếu và **đề xuất tích hợp**, chưa phải cơ chế đã chạy. Giữ nguyên file đặc tả mới của người chơi. Các điều chỉnh cân bằng bên dưới chưa được coi là quyết định đã duyệt.

## 1. Hướng game sau khi ghép hai tài liệu

Người chơi là **Ý Niệm Khởi Thủy**, dẫn dắt nhóm 5–15 người sống sót sau Đại Hồng Thủy. Dân tự lo nhu cầu và làm việc; người chơi bố trí nơi định cư, phân công, nghiên cứu và dùng thần lực có giới hạn để giải quyết tình huống. Nhịp mở đầu cần tạo cảm giác một bộ tộc đang sống, không chỉ các thanh tài nguyên đang tăng.

Vòng lặp mở đầu:

**Đặt nơi định cư → hái thức ăn/nhặt vật liệu → giữ lửa và dựng chỗ ngủ → ăn tối, nghỉ, giao tiếp → tạo thặng dư → học công nghệ → phát triển làng.**

Sau đó giữ trục chính **Đồ Đá → Đồ Đồng → Đồ Sắt → Hiện Đại → Dị Tượng**, với ba nhánh Công Nghệ Cao, Linh Khí / Huyền Bí và Quỷ Dị. Faith đi xuyên các thời đại, không thay thế hậu cần, khoa học hoặc trở thành điều kiện bắt buộc để tiến cấp.

Hình tượng thần linh phù hợp với GAME_DESIGN.md gốc. Với hướng online cạnh tranh của GAMEPLAY_SYSTEMS_V1.md, phép phải có chi phí, phạm vi và luật do máy chủ kiểm tra; cảnh nâng đảo là cốt truyện mở đầu, chưa đồng nghĩa người chơi được tùy ý sửa địa hình trong thế giới chung.

## 2. Các điểm cần thống nhất

| Chủ đề | Đặc tả mới / bản hiện tại | Hướng tích hợp đề xuất |
|---|---|---|
| Era 0 → Era 1 | Đặc tả có một kỷ nguyên khởi đầu riêng; game đang dùng năm mã `stone/bronze/iron/modern/anomaly` | Dùng **Khởi nguyên** làm chặng đầu bên trong Đồ Đá. Hoàn tất chặng mở định cư/nghiên cứu, không tự lên Đồ Đồng. Nếu muốn sáu thời đại độc lập thì phải thiết kế lại mốc và chuyển bản lưu riêng. |
| Ăn và dự trữ | Đặc tả 1–2 thức ăn/người/bữa; hiện người lớn ăn 20 đơn vị, giảm 35 điểm đói | Chốt đơn vị khẩu phần trước. Một khẩu phần có thể gồm nhiều đơn vị Food đang có; không đổi mỗi con số bữa ăn rồi giữ nguyên sản lượng, dự trữ và phí nghiên cứu. |
| Ngày đêm | Đặc tả có mốc 06:00, 18:00, 20:00; hiện 10 tick/ngày | Có đồng hồ mô phỏng chung và xử lý khi **đi qua mốc giờ**, tránh chỉ kiểm tra bằng đúng 18:00. Độ phân giải phải phục vụ được ăn 3 giây, đi đường, ngủ và hồi máu. |
| Nhu cầu | Hiện có đói/mệt/sợ/cô đơn; chưa có HP, STR/DEX/INT | Giữ nhu cầu cũ, bổ sung sức khỏe và thuộc tính. Hạnh phúc là chỉ số tổng hợp; không bỏ an toàn/xã hội khi thêm HP. |
| Tính cách | Hiện can đảm/tham lam/trung thành/sùng đạo/hòa đồng, thang ±100; mới dùng năm trục khác, ±50 | Chuyển can đảm/hòa đồng về thang mới; rộng lượng đảo dấu tham lam. Thêm cần cù/tò mò. Giữ trung thành/sùng đạo như dữ liệu xã hội riêng nếu còn dùng, không xóa lịch sử cư dân. |
| Nghề và tự phân công | Game có lao động bản đồ, người xây, nghiên cứu và vận chuyển | Chỉ tự gán người trưởng thành có thể làm việc và chưa được giữ cho nhiệm vụ khác. Lệnh người chơi được ưu tiên; một dân chỉ có một công việc tạo sản lượng tại một thời điểm. |
| Trưởng lão | Đặc tả bàn nghiên cứu cho Trưởng lão mở Era 1; thiết kế kỷ nguyên không bắt buộc già làng | Trưởng lão là vai trò cố vấn/giữ lửa, hỗ trợ nghiên cứu và tinh thần. Người trưởng thành khác vẫn nghiên cứu được; tránh khóa tiến trình vì tuổi hoặc chưa có thế hệ con cháu. |
| Công trình | Sáu công trình sơ khai; game đã có nhà, kho, cầu, nghiên cứu và công trình qua Đồ Sắt | Đối chiếu vai trò từng loại, dùng tiền thân/cải tạo khi phù hợp. Không thay toàn bộ nhà/kho đang có thành lều sơ khai hoặc cộng sức chứa hai lần. |
| Túi và công cụ | Có thức ăn cá nhân nhưng chưa có bốn ô túi và vận chuyển sản xuất nội bộ | Thêm hàng mang theo và quyền sở hữu vật phẩm thật, rồi mới Auto-Equip. Hàng ở túi đã rời kho; công cụ lấy ra không còn đồng thời ở kho. |
| Faith | Có cầu nguyện/tinh thần; chưa có tài nguyên Faith hoàn chỉnh | Lấy bốn phép mới làm hướng thiết kế thay danh sách phép cũ. Làm Ban Phước trước; chỉ mở phép còn lại khi có hệ thống nhận hiệu ứng thật. |

Các bảng sản lượng nghề, chết đói 12 tick và phép cũ trong GDD là thiết kế lịch sử, không phải luật kinh tế của bản chơi cục bộ hiện tại. Hiện nhu cầu đói tăng 0,8/tick; người lớn ăn 20 Food hồi 35 điểm, tương đương khoảng **4,57 Food/ngày** với 10 tick/ngày, chưa tính khác biệt trẻ em/mang thai. Đây là lý do cần cân bằng lại toàn bộ vòng ăn khi đổi sang lịch mới.

## 3. Luật nền cần rõ trước khi code

### Ăn, nghỉ và kho

- Nhu cầu khẩn cấp được ưu tiên hơn lao động, xây dựng, nghiên cứu và vận chuyển. Ăn/nghỉ xong tiếp tục nhiệm vụ còn hợp lệ; không mất hoặc nhân đôi hàng đang mang.
- Bữa tối phải tính thời gian đi về. Dân xa làng, đường bị chặn hoặc đang cứu hộ có phương án ăn tại chỗ; không mất bữa chỉ vì đến sau 20:00. Dân chưa đặt lên bản đồ không chạy về một vị trí không tồn tại.
- Lương khô trong túi được cấp từ kho hoặc sản xuất thật. Trừ đúng một lần khi ăn; nếu hết đồ ăn thì hiển thị lý do. Kho đầy không đồng nghĩa người ở nơi không có đường tới kho đã tiếp cận được thức ăn.
- Xác định lượng đói hồi mỗi khẩu phần, lượng đói ngoài giờ làm, chi phí trẻ em/người mang thai và cách thiếu khẩu phần được phân phối. Dùng cùng công thức để tính “đủ X ngày” và điều kiện tiến kỷ nguyên.
- Lều cần số chỗ ngủ rõ ràng. Bốn ô túi cần loại hàng cụ thể, giới hạn từng ô và **tổng sức vác**; hai ô 30 không được tự hiểu là người chưa có gùi vác được 60.
- Chọn một lửa trại khởi đầu miễn phí làm phương án mặc định đề xuất. Có thời gian an toàn và hướng dẫn tích củi trước khi mở tiêu hao nhiên liệu; chưa có gỗ không được khiến cả làng lập tức sợ 100% ngay ngày đầu.

### Thuộc tính và việc làm

- Giữ STR/DEX/INT 1–20 theo đặc tả. Cần xác định hệ số gốc: STR 10 với +3% mỗi điểm đã tăng 30%; INT 20 tăng 100% tốc độ nghiên cứu. Công thức phải tách tốc độ làm việc, số hàng/mẻ và tốc độ di chuyển.
- Công nghệ Công cụ đá hiện tăng 50% khai thác gỗ/đá. Khi thêm rìu/cuốc +50%, cần chuyển công nghệ thành quyền chế tạo công cụ hoặc quy định cộng hiệu ứng rõ; không vô tình thưởng hai lần cùng một lợi ích.
- Auto-Claim 70% hoặc 40/30/20/10 chỉ là mục tiêu ban đầu. Phải làm tròn cho làng 5 người, dành người cho xây/nghiên cứu, có dự phòng nếu không ai đủ điều kiện canh gác và không đổi nghề liên tục khi Food dao động quanh hai ngày.
- Giới hạn 1–2 Trưởng lão phải nằm trong tổng lao động. Điểm Tri Thức chưa có kinh tế hoàn chỉnh; trước mắt có thể dùng tiến độ nghiên cứu/kỷ lục khám phá thay vì thêm ngay một tiền tệ mới.

### Thần lực

Giữ các mốc gốc để đối chiếu: Ban Phước 50 Faith/45 giây/+50% tốc độ trong 30 giây; Cầu Mưa 40/60/+30% nông nghiệp 45 giây; Khiên 70/90; Khích Lệ 30/30. Thời gian khiên/khích lệ, lượng giảm sợ và phạm vi bảo vệ còn cần bổ sung.

**Vấn đề cân bằng lớn nhất:** Ban Phước hiện cho 30 × 1,5 + 60 × 0,5 = **75 đơn vị công**, trong khi không dùng phép được 90 trên cùng 90 giây, giả sử lao động liên tục. Tức là năng suất giảm khoảng **16,7%**, chưa tính 50 Faith. Đây chỉ hợp lý nếu cố ý thiết kế phép cứu nguy lấy tốc độ trước mắt đổi tổn thất sau đó, và giao diện nói rõ.

Đề xuất thử nghiệm: vẫn giữ +50% trong 30 giây, nhưng giảm hậu quả xuống khoảng −10% đến −20% trong 20–30 giây và chỉ áp dụng người thực sự được tăng cường. Đây là khoảng để kiểm thử, chưa phải số đã duyệt. Không tự áp dụng cùng hậu quả cho mưa/khiên khi chưa định nghĩa người bị tác động.

Cooldown 45 giây kết thúc trước chu kỳ buff + kiệt sức 90 giây của đặc tả gốc. Nếu bấm ngay lúc nút sáng lại sẽ rơi vào Burnout: cần hiển thị thời gian hồi phục và chặn mặc định việc dùng lại trong kiệt sức ở phiên bản đầu. Bạo loạn/Burnout đầy đủ triển khai sau khi có luật xã hội và cách hồi phục cụ thể.

Các điểm còn thiếu phải được chốt thành dữ liệu:

- Trần Faith, Faith khởi đầu, bonus đền; chỉ dân sống đã đặt trên bản đồ tham gia công thức. Theo công thức mới, ở hạnh phúc 50%, sợ 0, 10 dân hồi 1,5 Faith/giây trước bonus đền: khoảng 33,3 giây đủ 50 Faith từ 0. Cần thử với tốc độ ngày đêm để tránh phép quá thường xuyên.
- Thống nhất **giây mô phỏng** cho phép: pause đóng băng Faith/buff/cooldown; ×2 tăng đồng bộ. Giờ trong ngày quy đổi từ cùng đồng hồ, không đồng nhất một giờ game với một giờ thực. Bản online tương lai dùng thời gian máy chủ và chính sách offline rõ ràng.
- Leo thang 50 → 100 → 150 theo đặc tả mới là hệ số tuyến tính, khác x2 liên tiếp ở GDD cũ. Cần quy định lần thứ tư, giới hạn hệ số, cửa sổ hai phút và khi nào reset. Hiển thị chi phí thực trước khi bấm.
- Lưu cả Faith, hiệu ứng, hồi phục, cooldown và lịch sử dùng phép; tải lại không xóa hậu quả, hoàn phí hoặc gia hạn buff.
- Ban Phước tăng tiến độ lao động thực, không cộng Food trực tiếp. Cầu Mưa chờ nông nghiệp/thời tiết/cháy có luật tương ứng; Khiên chờ đột kích; Khích Lệ chờ chiến đấu. Phép chưa hoạt động bị khóa và không tiêu Faith.

## 4. Thứ tự nên làm tiếp

**Ưu tiên chiều sâu khởi đầu trước khi mở tiền công nghiệp/Hiện Đại.** Không bỏ hướng các thời đại và dị tượng; làm nền sinh tồn đủ ổn để các thời đại sau sử dụng chung.

| Đợt | Phạm vi | Điều kiện hoàn thành |
|---|---|---|
| 1 — Nhịp sống | Đồng hồ, đơn vị khẩu phần, ăn khẩn cấp, nghỉ, HP, giữ nhiệm vụ khi ngắt; lửa trại trung tâm và UI lý do trạng thái | Làng có thức ăn tiếp cận được thì tự ăn; sinh hoạt qua ngày/đêm; pause/tải lại giữ đúng tiến trình |
| 2 — Khởi nguyên chơi được | Lửa trại dùng nhiên liệu có cảnh báo, lều/chỗ ngủ, bãi chứa, bến câu/cầu/bàn nghiên cứu; hướng dẫn và hình ảnh phù hợp | Chơi từ tay trắng đến định cư mà không bị vòng khóa; qua chặng Khởi nguyên vẫn tiếp tục Đồ Đá |
| 3 — Dân có khác biệt | STR/DEX/INT, chuyển tính cách, nghề/cố vấn, Auto-Claim có quyền ưu tiên phân công tay | Làng 5/10/15 người phân việc hợp lý, không chiếm người xây/nghiên cứu/vận chuyển |
| 4 — Đồ mang theo | Ba ô trang bị, bốn ô túi, vật phẩm/công thức, chuyển hàng về kho, Auto-Equip | Hàng không nhân đôi/mất khi ăn, đổi nghề, chết, hủy việc, kho đầy, đường chặn hoặc tải lại |
| 5 — Faith tối thiểu | Thanh Faith, Ban Phước, giá/cooldown/hồi phục, hiệu ứng hình ảnh, lệnh và lưu trạng thái | Phép tác động sản xuất thật; lợi ích đo được; dùng lặp và tải lại không vượt luật |
| 6 — Nguy hiểm và văn hóa | Lửa tắt/rét, thú dữ, giông bão, ngộ độc, cứu sói/bích họa/totem; mở phép tương ứng | Có báo trước, cách phòng/chữa và xác suất theo đơn vị thời gian rõ; không diệt làng ngẫu nhiên lúc mới chơi |
| 7 — Trình bày và mở rộng | Intro ba đoạn có bỏ qua; sau đó tiền công nghiệp → Hiện Đại → dị tượng | Intro không chặn tải bản lưu; hệ thống nền phục vụ được các thời đại sau |

Không cần sản xuất ba video ngay: trước hết dùng lời dẫn/ảnh hoặc cảnh trong game có bỏ qua để kiểm tra đoạn nhập vai. Đặc tả xác suất tai nạn 5% cần ghi rõ mỗi bữa, mỗi ngày hay mỗi lần thao tác trước khi bật; chưa có mẫu thử thì không áp vào mọi tick.

## 5. Cổng kiểm thử cho từng đợt

- Chạy làng 5/10/15 người ít nhất 30 ngày với hạt giống cố định: có đồ ăn, thiếu ăn, không lều, đường về bị chặn, kho đầy, dân xa làng và dân chưa đặt. Kiểm tra nhu cầu/HP và số dư thật, không chỉ quan sát hình ảnh.
- Kiểm tra đi qua các mốc 06:00/18:00/20:00 ở ×1/×2, pause và tải giữa bữa; không ăn hai lần hoặc bỏ qua cả bữa vì bước thời gian.
- Bảo toàn tài nguyên: hàng kho + túi + hàng đang vận chuyển thay đổi đúng theo khai thác, tiêu dùng và mất mát được định nghĩa. Dừng/chuyển nhiệm vụ không cấp thêm hàng.
- Giữ hồi quy **Đồ Đá → Đồ Đồng → Đồ Sắt**, dự trữ tiến cấp, mẻ chế biến, nghiên cứu, nâng cấp và chuyến giao thương sau mỗi thay đổi thời gian/nhu cầu.
- Bản lưu hiện tại giữ dân, công trình/cấp, hàng, nghiên cứu và kỷ nguyên. Bổ sung trường thiếu bằng chuyển đổi có kiểm tra; không tự đặt lửa trại đè công trình hoặc tự cấp vật tư.
- Faith: thiếu điểm, chi phí tăng, bấm lặp, hết hiệu ứng, hồi phục, pause/×2 và tải giữa buff. So tổng sản lượng có/không dùng phép trên cùng điều kiện.
- Test trực tiếp trình duyệt máy tính và màn hình nhỏ: đồng hồ, nơi ăn/ngủ, lý do dừng, kho/trang bị, trạng thái phép và hướng dẫn đều nhìn thấy được.

## 6. Việc cụ thể mở đợt tiếp theo

Bắt đầu **đợt 1: đồng hồ + ăn/nghỉ + HP + lửa trại trung tâm**, giới hạn vào một luồng chơi hoàn chỉnh. Chốt đơn vị khẩu phần và quy đổi thời gian ngay trong đợt này; chưa bật thú dữ, bạo loạn hoặc bốn phép cùng lúc. Kết thúc bằng lượt chơi trình duyệt cho thấy dân đi làm, tự ăn, nghỉ và quay lại nhiệm vụ, cùng báo cáo hồi quy bản lưu và kinh tế.
