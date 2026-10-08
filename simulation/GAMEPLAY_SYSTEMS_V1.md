# ĐẢO THIÊN NGUYÊN — ĐỀ XUẤT HỆ THỐNG GAMEPLAY V1

> Bản thiết kế đề xuất, tổng hợp từ `GAME_DESIGN.md`, `GAMEPLAY_REDESIGN.md`, `PROGRESS.md`, các báo cáo phase và mã nguồn hiện tại. Đây là nguồn để thống nhất quyết định tiếp theo; không có nghĩa mọi cơ chế dưới đây đã được triển khai.
>
> Định hướng đã chốt theo yêu cầu của người chơi: **game chiến lược online cạnh tranh trong một thế giới dai dẳng**, có dân cư, kinh tế, giao thương, nuôi quân và chiến tranh; không phải game theo trận/ván.

---

## 1. Tóm tắt hướng game

**Người chơi lãnh đạo một nền văn minh.** Cư dân mô phỏng đời sống và lao động; người chơi quyết định nơi mở rộng, phân bổ nguồn lực, công nghệ, thương mại, ngoại giao và chiến tranh.

### Lời hứa trải nghiệm

> Mỗi quyết định kinh tế làm thay đổi khả năng sinh tồn, giao thương và sức mạnh quân sự của nền văn minh.

### Vòng lặp cốt lõi

```text
Quan sát nhu cầu và bản đồ
        ↓
Phân bổ lao động, xây dựng và nghiên cứu
        ↓
Tạo thặng dư tài nguyên, phát triển dân số
        ↓
Mở tuyến giao thương, ngoại giao hoặc chuẩn bị quân đội
        ↓
Tranh chấp ảnh hưởng và lãnh thổ
        ↓
Điều chỉnh chính sách, kinh tế và chiến lược
```

### Vai trò của người chơi

- Điều khiển **ở cấp nền văn minh**, không phải bấm từng cư dân cho mọi việc suốt game.
- Lệnh cá nhân vẫn có thể dùng để cứu hộ, xử lý tình huống hoặc tạo khoảnh khắc gần gũi với cư dân.
- Hình tượng “Thần” trong tài liệu cũ có thể giữ làm phong cách trình bày; cơ chế chính là lãnh đạo và ban sắc lệnh. Thần lực nên là hệ thống phụ, không thay thế kinh tế/chiến lược.

---

## 2. Những điểm đang làm game nhạt hoặc khó hiểu

### 2.1 Mở đầu thiếu quyết định có ý nghĩa

Hiện người chơi chọn seed/hình dạng/kích thước, bắt đầu rồi đặt nhiều cư dân lên bản đồ. Chưa có lựa chọn giải thích tại sao một vị trí tốt, chưa có tình huống mở đầu, vai trò cộng đồng hay hậu quả rõ ràng. Việc đặt đủ người có cảm giác như hoàn tất thao tác thiết lập hơn là bắt đầu xây dựng nền văn minh.

**Hướng sửa:** thay phần “đặt từng người” bằng chọn điểm định cư có thông tin địa hình, sau đó đặt trại và chọn ưu tiên lao động. Cư dân còn lại xuất hiện theo nhóm/đợt ngắn với hoạt ảnh. Giữ chế độ đặt tự do trong công cụ tạo map nếu cần.

### 2.2 Thủ công kéo dài nhưng chưa tạo quyết định mới

Click NPC → chọn hành động → chờ lệnh lặp lại dễ thành thao tác lặp. Tự động hóa xuất hiện muộn nhưng game online chiến lược cần điều khiển vĩ mô sớm.

**Hướng sửa:** cho phép phân công ưu tiên lao động cơ bản từ đầu; tiến trình mở rộng độ thông minh và chính sách, không khóa toàn bộ tự động hóa đến giữa game.

### 2.3 Tài liệu và code đang nói khác nhau

| Chủ đề | Tài liệu thiết kế | Mã hiện tại | Hệ quả |
|---|---|---|---|
| Vai trò người chơi | Thần mô phỏng đảo; tài liệu redesign thêm tự động hóa | Một đảo cục bộ, điều khiển trực tiếp NPC | Chưa có mô hình chủ quyền/người chơi online |
| Thức ăn lúc đầu | 0 trong bảng starting conditions | `startPop × 5` | Hướng dẫn và cân bằng khác nhau |
| Lửa | Ghi miễn phí | Có chi phí gỗ/thức ăn | Người chơi không biết đâu là luật đúng |
| Era 3 | Nông trại 5 ngày, gỗ ≥100, food ≥500, Elder và nghiên cứu | Điều kiện hiện tại khác, không kiểm tra đủ các ý trên | Checklist có thể không phản ánh thiết kế đã duyệt |
| Era 5 | Có điều kiện wealth ≥2000 | Chưa có wealth/livestock hoàn chỉnh | Mốc tiến trình không thể xác nhận đúng thiết kế |
| NPC/online | NPC tự vận hành về sau | Trạng thái mô phỏng nằm phía trình duyệt | Client tự sửa trạng thái sẽ không đồng bộ giữa người chơi |
| Thời gian | Có pause, x1/x2; ngày/tick chưa thống nhất | Engine tuổi NPC theo ngày tick; game UI có tốc độ cục bộ | Rủi ro tốc độ già hóa và online không công bằng |

**Quy tắc tài liệu:** mọi cơ chế phải gắn một trạng thái `Đang dùng`, `Đề xuất`, `Đang làm`, hoặc `Hoãn`. Không ghi tính năng là hoàn thành chỉ vì có UI hoặc cấu trúc dữ liệu.

---

## 3. Mô hình thế giới online đề xuất

### 3.1 Thế giới dai dẳng, máy chủ làm chủ trạng thái

- Mỗi shard là một thế giới tồn tại lâu dài; nền văn minh của người chơi cùng tồn tại trên bản đồ.
- Máy chủ là nơi xác nhận tài nguyên, công trình, lệnh, chiến đấu và kết quả giao dịch.
- Trình duyệt gửi lệnh có cấu trúc, ví dụ `AssignWorkers`, `StartResearch`, `CreateTradeOffer`, `DeclareWar`; không tự ghi thẳng `island.food` hay `island.tick`.
- Client hiển thị/interpolate trạng thái và dự đoán giao diện nếu cần; máy chủ trả lại sự kiện/kết quả có mã định danh để tránh áp dụng lặp.
- Một nhịp mô phỏng cố định dùng cho mọi người. Không cho một người tăng tốc hoặc pause toàn shard.
- Khi offline, nền văn minh tiếp tục mô phỏng. Giới hạn thời gian catch-up và thêm bảo vệ khi vắng mặt; không cho người chơi tích tài nguyên vô hạn.

### 3.2 Quyền sở hữu và tương tác

- Người chơi sở hữu nền văn minh, kho, công trình, quân đội và các ô ảnh hưởng.
- Khu trung lập có thể khai phá; khu đã có chủ cần giao thương, thỏa thuận hoặc xung đột.
- NPC thuộc về nền văn minh, không phải tài sản có thể chuyển tự do giữa người chơi.
- Giao dịch/chiến tranh là lệnh máy chủ xác nhận và có nhật ký chung.
- Thế giới không có màn hình “thắng ván”; có bảng thành tựu/rank theo giai đoạn và mục tiêu theo mùa nếu muốn tạo nhịp cạnh tranh.

### 3.3 Những cơ chế cục bộ phải thay khi vào online

- Pause và x1/x2 cục bộ → hiển thị nhịp mô phỏng chung; có thể pause ở phòng riêng khi không ảnh hưởng người khác.
- Paint map → chỉ dùng trước khi tạo shard hoặc trong công cụ quản trị; không sửa map shard đang chạy tùy tiện.
- Thay đổi tài nguyên/tick bằng console → chỉ là công cụ test trên môi trường dev, không phải API gameplay.
- UI đơn đảo → chọn nền văn minh hiện tại nhưng hỗ trợ bản đồ nhiều khu định cư và thông tin đối thủ.

---

## 4. Cơ chế chơi chuẩn

### 4.1 Thời gian

Tách rõ ba khái niệm: **server tick**, **ngày mô phỏng**, **năm tuổi nhân vật**. Một ngày có số tick cố định; tuổi NPC chỉ tăng theo năm mô phỏng. Tốc độ chạy, tốc độ đói, xây dựng, nghiên cứu, sinh sản và hành quân phải dùng cùng một lịch quy đổi.

Không cân bằng trước khi xác định thời gian thật tương ứng với một ngày/năm game và mức catch-up khi offline.

### 4.2 Tài nguyên

#### Tài nguyên MVP

| Tài nguyên | Tạo ra từ | Dùng cho | Câu hỏi người chơi cần trả lời |
|---|---|---|---|
| Thức ăn | Hái lượm, đánh cá, nông trại, chăn nuôi | Nuôi dân và quân | Kho đủ nuôi được bao lâu? |
| Gỗ | Rừng, trại gỗ, thương mại | Nhà, công trình, thuyền | Có nên mở rộng hoặc bán gỗ? |
| Đá | Mỏ/điểm đá, thương mại | Công trình bền, phòng thủ | Có đủ xây khu mới không? |
| Tri thức | Học giả/nghiên cứu | Mở công nghệ | Công nghệ này giải quyết vấn đề nào? |

Tài nguyên cấp cao như đồng, sắt, vải, dầu chỉ thêm khi có công trình và nhu cầu thật; không thêm nhiều loại chỉ để làm HUD dày hơn.

#### Sổ cái kinh tế

```text
Kho cuối kỳ = Kho đầu kỳ
            + Sản xuất
            + Nhập thương mại
            - Tiêu dùng dân cư
            - Tiêu dùng quân đội
            - Xây dựng/nghiên cứu
            - Xuất thương mại/thất thoát
```

Mỗi giao dịch ghi rõ nguồn vào/ra trong tooltip hoặc nhật ký. Không để tài nguyên giảm mà người chơi không biết vì sao.

### 4.3 Dân cư và lao động

- Dân số có nhu cầu ăn, nghỉ, an toàn và quan hệ xã hội.
- Người trưởng thành tạo lực lượng lao động; trẻ em/già yếu có hệ số lao động riêng nếu giữ các nhóm này.
- Người chơi đặt **ưu tiên hoặc số lao động** cho nông nghiệp, khai thác, xây dựng, nghiên cứu và quân đội.
- NPC tự tìm việc trong phạm vi có thể đi tới, báo lý do khi không làm được: thiếu công trình, thiếu nguyên liệu, đầy chỗ, đường bị chặn.
- Lệnh trực tiếp cá nhân là ngoại lệ có thời hạn; khi xong NPC quay lại vai trò được giao.
- Không để thất bại doi hoặc mệt xuất hiện mà không có cảnh báo, thời gian cứu và cách xử lý.

### 4.4 Công trình

Mỗi công trình cần có 6 thông tin nhất quán: **điều kiện đặt, chi phí, thời gian xây, số lao động, sản lượng/upkeep, tác dụng chiến lược**.

Ví dụ vai trò:

- Nông trại: tạo thức ăn, cần lao động và đất phù hợp.
- Trại gỗ/mỏ: chuyển vị trí tài nguyên thành sản lượng ổn định, có thể cạn tài nguyên.
- Nhà/kho: tăng sức chứa hoặc giới hạn phát triển; phải giải thích rõ hiệu ứng.
- Chợ/cảng: cần cho tuyến thương mại, khoảng cách và hàng hóa.
- Doanh trại: huấn luyện quân và tạo giới hạn quân số.
- Tường/tháp: bảo vệ khu định cư nhưng có chi phí duy trì.

Tiến độ xây phải phụ thuộc lao động, nguyên liệu và thời gian; không để công trình tự hoàn tất mà không có trade-off nếu đó là cơ chế chính.

### 4.5 Nghiên cứu và kỷ nguyên

Hướng người chơi yêu cầu: **Đồ Đá → Đồ Đồng → Đồ Sắt → Hiện Đại → Dị Tượng**, giữ ba nhánh gốc Công Nghệ Cao, Linh Khí / Huyền Bí và Quỷ Dị. Bản chi tiết **Đề xuất ngày 2026-10-05** tại [Hệ thống kỷ nguyên và dị tượng](ERA_SYSTEM_DESIGN.md) thay các bảng giai đoạn trước đây.

| Kỷ nguyên | Khả năng mới |
|---|---|
| Đồ Đá | Sinh tồn, nhà/kho, nông nghiệp, thuần hóa và lao động tự động cơ bản |
| Đồ Đồng | Khai thác và chế biến đồng, gỗ xẻ, gạch/gốm, lương thực |
| Đồ Sắt | Thành thị, kim loại, vải, thương mại và cơ giới/điện nguyên mẫu |
| Hiện Đại | Thép, dầu, lưới điện, nhà máy, vận tải và viện nghiên cứu |
| Dị Tượng | Ba hướng chuyên môn với tài nguyên, công trình và biến thể riêng |

Người chơi chủ động bắt đầu chuyển cấp; máy chủ kiểm tra điều kiện và trừ phí một lần. Các điều kiện dùng dân sống, công nghệ, sản lượng thực tế và năng lực vận hành. Không cần già làng, thế hệ con cháu hoặc chiến thắng PvP. Công nghiệp hóa là chặng bên trong cuối Đồ Sắt, không nhảy từ kiếm sắt thẳng sang vi mạch.

Niềm tin đi xuyên tiến trình, không bị khoa học thay thế và không đồng nhất với linh khí/độ nhiễm. Dị tượng có khảo sát, lựa chọn phản ứng và cảnh báo rủi ro; không chỉ là nút chọn một màu văn minh. Người chơi có thể duy trì nền kinh tế Hiện Đại khi chưa chọn nhánh.

Các công nghệ/công trình chưa có chỉ là thiết kế, không được quảng bá như đã chạy. Triển khai tuần tự từ Đồ Đá đến Hiện Đại rồi các nhánh; các nhánh cuối thuộc tầm nhìn chính của game, không bị loại khỏi phạm vi thiết kế.
### 4.6 Giao thương

Giao dịch cần có: người mua/bán, hàng hóa, số lượng, giá, tuyến đường, thời gian đến, sức chứa và nguy cơ bị chặn.

- Người chơi tạo **lệnh mua**, **lệnh bán** hoặc **hợp đồng định kỳ**.
- Giá nên chịu ảnh hưởng cung/cầu nhưng có biên độ và phí để tránh vòng lặp arbitrage vô hạn.
- Tuyến đường cần công trình/đơn vị phù hợp; hàng chưa đến thì chưa cộng vào kho.
- Có thể bắt đầu bằng thương nhân NPC và hợp đồng đơn giản trước giao dịch trực tiếp giữa người chơi.

### 4.7 Quân đội và chiến tranh

- Quân đội dùng dân số lao động, thức ăn, vũ khí và chi phí duy trì.
- Mỗi đạo quân có thành phần, chỉ huy, mục tiêu, đường hành quân và nguồn tiếp tế.
- Chiến đấu giải quyết theo tick với sức mạnh, địa hình, tiếp tế, công sự, tinh thần và chất lượng trang bị.
- Kết quả phải tạo hậu quả kinh tế/lãnh thổ cụ thể; không chỉ trừ máu một thanh trừu tượng.
- Tấn công cần thời gian báo trước/hành quân để người chơi có cơ hội phản ứng; có vùng bảo hộ tân thủ và giới hạn đánh người mới.
- Không cho người mạnh đánh liên tục người offline; dùng lá chắn sau khi thành bị chiếm, giới hạn mục tiêu chênh lệch hoặc tài sản có thể cướp.

### 4.8 Ngoại giao

MVP chỉ cần: trung lập, giao thương, hiệp ước không xâm phạm và chiến tranh. Liên minh, chư hầu, gián điệp, chiến tranh tổng lực và nhiều loại treaty để sau.

---

## 5. Hệ thống nhiệm vụ

### 5.1 Mục tiêu của nhiệm vụ

Nhiệm vụ dạy người chơi **một cơ chế đúng lúc họ cần dùng**, đồng thời chỉ ra bước tiếp theo. Nhiệm vụ không nên bắt người chơi lặp một nút nhiều lần chỉ để nhận thưởng.

### 5.2 Các nhóm nhiệm vụ

| Nhóm | Tần suất | Vai trò |
|---|---|---|
| Hướng dẫn chính | Một lần, có thể bỏ qua và mở lại | Dạy điều khiển và luật cơ bản |
| Chương nền văn minh | Dài hạn, theo tiến trình | Dẫn qua kinh tế → nghiên cứu → thương mại → quân đội |
| Hợp đồng | Tự chọn, có thời hạn | Tạo mục tiêu kinh tế ngắn hạn |
| Sự kiện thế giới | Theo tình huống máy chủ | Tạo quyết định chung, không bắt mọi người online đúng một giờ |
| Thành tựu | Không bắt buộc | Ghi nhận khám phá và phong cách chơi |

### 5.3 Quy tắc giao diện và logic

- Mỗi thời điểm có tối đa **một nhiệm vụ hướng dẫn chính** và tối đa ba mục tiêu phụ.
- Nhiệm vụ hiện tại luôn nói rõ: **cần làm gì, vì sao, kiểm tra tiến độ ở đâu, nhận được gì**.
- Cho phép tạm ẩn, bỏ qua hướng dẫn và xem lại trong sổ tay.
- Nhiệm vụ tiến độ dài có thể hoàn tất khi offline; hạn chót chỉ dùng với hợp đồng tùy chọn.
- Phần thưởng mở tính năng, vật liệu khởi đầu hoặc slot xây dựng; tránh phát quá nhiều tài nguyên làm hỏng cân bằng.
- Server ghi nhận sự kiện theo ID; nhận thưởng phải idempotent, không nhận lặp bằng cách gửi lại lệnh.
- Không yêu cầu nhiệm vụ hoàn thành một hành động chưa được triển khai trong game.

### 5.4 Chuỗi nhiệm vụ tân thủ đề xuất

Thời lượng mục tiêu: một phiên giới thiệu ngắn; không ép người chơi đọc hết tài liệu trước khi chơi.

| # | Tên | Người chơi học | Hoàn thành khi | Phản hồi/phần thưởng đề xuất |
|---:|---|---|---|---|
| 1 | Chọn nơi lập nghiệp | Đọc tài nguyên và địa hình | Chọn một trong các vị trí gợi ý | Đánh dấu lợi thế/rủi ro của nơi ở |
| 2 | Dựng nơi trú ẩn | Đặt trung tâm/khu định cư đầu tiên | Công trình đầu tiên được đặt | Hoạt ảnh nhóm cư dân đến; mở bảng dân cư |
| 3 | Bảo đảm lương thực | Cách xem tiêu dùng và dự trữ | Dự trữ đủ số ngày an toàn | Cảnh báo kho và mức tiêu thụ được giải thích |
| 4 | Chia việc | Phân công lao động | Có người làm thực phẩm và vật liệu | Hiện dự báo sản lượng theo ngày |
| 5 | Xây chuỗi sản xuất | Công trình, vị trí, sức chứa | Hoàn thành công trình sản xuất | Mở nhiệm vụ nghiên cứu cơ bản |
| 6 | Nghiên cứu đầu tiên | Chi phí, thời gian, điều kiện | Hoàn tất công nghệ cơ bản | Nêu hiệu ứng trước/sau nghiên cứu |
| 7 | Chuẩn bị thặng dư | Khác biệt giữa sản xuất và dự trữ | Có hàng hóa vượt nhu cầu thiết yếu | Gợi ý chợ/tuyến giao thương |
| 8 | Thành viên của thế giới | Giao dịch và quan hệ với nền văn minh khác | Xem hoặc lập hợp đồng thương mại đầu tiên | Mở trang đối ngoại; không tự tuyên chiến |
| 9 | Bảo vệ biên giới | Doanh trại, quân và chi phí duy trì | Huấn luyện lực lượng phòng thủ cơ bản | Cảnh báo rõ lượng lương thực quân tiêu thụ |

Nhiệm vụ 8–9 chỉ bật khi giao thương/quân sự đã hoạt động đủ mức. Trước đó UI ghi “Sắp mở khóa”, không dẫn người chơi đến màn hình trống.

### 5.5 Hợp đồng sau hướng dẫn

Ví dụ: “Bán 100 gỗ cho thương nhân”, “Dự trữ thức ăn đủ 5 ngày”, “Xây một kho gần khu sản xuất”. Hợp đồng phải có lựa chọn từ chối, thời hạn hợp lý và thưởng tương xứng với chi phí cơ hội.

---

## 6. Hướng dẫn tân thủ trong game

### 6.1 Màn hình đầu tiên

Thay màn hình tạo map hiện tại bằng quy trình có 3 bước:

1. **Thế giới:** chọn khu vực/shard, seed hoặc bản đồ chuẩn; giải thích thế giới dai dẳng và thời gian online.
2. **Vị trí định cư:** hiển thị 3 điểm gợi ý, mỗi điểm có thức ăn, gỗ, đá, nước và rủi ro.
3. **Cộng đồng:** chọn tên nền văn minh và một ưu tiên khởi đầu (nông nghiệp, khai thác hoặc thương mại); ưu tiên là hướng mở màn, không khóa build.

Không đặt 5–15 người lên map mà không giải thích họ là ai, vì sao ở đó và cần làm gì. Khi bấm bắt đầu, hiển thị một mục tiêu lớn cùng một dòng giải thích; bảng nhiệm vụ có thể mở rộng khi người chơi muốn.

### 6.2 Các bước onboarding

1. Chú giải camera, chọn NPC/công trình và mở panel.
2. Dạy đọc kho: số lượng hiện tại, sản lượng/tiêu thụ, số ngày dự trữ.
3. Dạy ưu tiên lao động và báo hệ quả trước khi xác nhận.
4. Dạy đặt công trình qua bóng ma vị trí, phạm vi và địa hình hợp lệ.
5. Dạy nghiên cứu với chi phí, yêu cầu và hiệu ứng dự kiến.
6. Dạy giao thương trước; chiến tranh chỉ giới thiệu sau khi kinh tế ổn định.

### 6.3 Quy tắc trợ giúp

- Một tooltip một lần; spotlight đúng nút, không che vùng cần bấm.
- Có nút **Bỏ qua**, **Tiếp tục sau** và **Xem lại hướng dẫn**.
- Cảnh báo quan trọng giải thích cả nguyên nhân lẫn hành động có thể làm.
- Không dùng thuật ngữ như “Elder”, “utility AI”, “tick” trong UI người chơi nếu chưa giải nghĩa.
- Tooltip tài nguyên nói rõ `+X/ngày`, `−Y/ngày`, `còn đủ Z ngày`.
- Trạng thái khóa công nghệ nói tên điều kiện còn thiếu, không chỉ ghi “chưa đạt Era”.

---

## 7. Sổ tay “Cách chơi và cơ chế”

Đặt nút **Sổ tay** trong HUD và menu tạm dừng. Các mục tìm được bằng tìm kiếm và cũng mở được từ tooltip liên quan.

### Mục lục bắt buộc

1. **Bắt đầu thế giới:** chọn khu vực, đặt định cư, luật bảo hộ.
2. **Bản đồ:** địa hình, tài nguyên, vùng ảnh hưởng, đường đi.
3. **Dân cư:** nhu cầu, tuổi, nghề, phân công, sinh sản, tử vong.
4. **Kinh tế:** sản lượng, tiêu dùng, dự trữ, giá và công thức kho.
5. **Công trình:** vị trí, chi phí, thời gian xây, slot lao động, upkeep.
6. **Nghiên cứu:** điều kiện, chi phí, thời gian, hiệu ứng.
7. **Giao thương:** lệnh mua/bán, hợp đồng, tuyến đường, rủi ro.
8. **Quân đội:** tuyển, huấn luyện, trang bị, tiếp tế, di chuyển, chiến đấu.
9. **Ngoại giao/PvP:** hiệp ước, chiến tranh, bảo hộ, xử lý khi offline.
10. **Nhiệm vụ và nhật ký:** cách theo dõi mục tiêu, sự kiện và lịch sử.
11. **Điều khiển:** camera, phím tắt, tốc độ hiển thị và accessibility.

Mỗi mục dùng một mẫu cố định: **Nó là gì → Tác động gì → Cần điều kiện gì → Làm ở đâu → Ví dụ → Cách khắc phục khi thất bại**.

---

## 8. Đánh giá tình trạng theo code hiện tại

| Hệ thống | Đang có | Còn thiếu/không đúng mục tiêu online |
|---|---|---|
| Tạo đảo | Shape, size, seed, preview, bắt đầu | Chưa phải lobby/shard; lựa chọn vị trí và lợi ích chưa dẫn dắt |
| Đặt cư dân | Click đặt từng người, có progress | Tốn thao tác, thiếu vai trò/câu chuyện; không phù hợp onboarding chiến lược |
| Manual control | Chọn NPC, lệnh, path cơ bản | Chưa có macro labor đủ tốt; lệnh cá nhân và nền kinh tế chưa được giải thích trong game |
| Nhu cầu/AI | Engine AI, nhu cầu, quan hệ, sinh sản trong core | Luồng Era 0 riêng chỉ tick nhu cầu; cần xác định rõ lúc nào AI chạy và đồ ăn được tiêu thụ |
| Thu thập | HUD, node tài nguyên, lệnh thủ công | UI kết quả tức thời/đi bộ cần thống nhất; chưa có sổ cái và tốc độ/ngày rõ |
| Công trình | Catalogue, chi phí, progress, sản xuất, assign | Chi phí/đặt công trình có nguy cơ khóa vòng tiến triển; slot và sản lượng cần tutorial |
| Nghiên cứu | Tech tree, cost, điều kiện, timer | Mốc “Lửa miễn phí” không khớp; nhánh tech/era cần làm thành một nguồn dữ liệu |
| Dân cư | Danh sách và dropdown gán worker | Đây là chức năng cơ bản nhưng UI/era mô tả như hệ thống mở khóa; cần sửa lại tiến trình |
| Nhiệm vụ | Mission card/checklist điều kiện era | Chưa có quest definitions, tracking theo event, rewards hoặc quest journal |
| Era | Checker và splash trong client | Điều kiện một số Era lệch thiết kế; chưa có authoritative server hoặc transition persistence |
| Trade/war | Mới ở mức tài liệu/ý tưởng | Chưa có lệnh server, thị trường, quân, battle resolution hoặc chống lạm dụng PvP |

### Các vấn đề P0 cần giải quyết trước khi cân bằng

1. **Không có ăn trong manual Era 0:** `tickManual()` tăng hunger và xử lý chết đói nhưng không chạy action ăn của AI; lệnh hái lượm tăng kho nhưng không làm giảm đói của cư dân. Nếu giữ chế độ này, người chơi cần một cơ chế ăn/tiêu dùng được chạy nhất quán.
2. **Thời gian/tuổi:** engine tăng tuổi theo chu kỳ ngày mô phỏng; cần quy định một tuổi đơn vị tương ứng bao nhiêu ngày game, đặc biệt khi thế giới chạy liên tục online.
3. **Đường thu thập và độ khó:** không cho yêu cầu xây công trình nếu người chơi chưa có cách khả thi để lấy gỗ/đá; nhiệm vụ phải kiểm tra một seed/map chuẩn có thể hoàn tất.
4. **Mốc Era:** không dùng công trình, loài vật, wealth hay chiến tranh làm điều kiện mở Era trước khi cơ chế tương ứng hoạt động.
5. **Tách state khỏi UI/client:** trước khi mở PvP, lệnh và state mutation phải qua lớp command/service do server xác nhận.

---

## 9. Phạm vi phát triển đề xuất

### Bước A — Chốt luật, chưa mở rộng code

- Chọn một bộ điều kiện khởi đầu và điều kiện Era.
- Chốt game clock, offline catch-up, quyền sở hữu và quy tắc PvP.
- Chốt một nguồn đúng: tài liệu này sau khi review; các file phase chỉ là lịch sử triển khai.

### Bước B — Vertical slice chơi được

Làm một hành trình hoàn chỉnh: chọn vị trí → lập trại → phân công lao động → cân đối lương thực → xây một chuỗi sản xuất → nghiên cứu → xem kho/dân số thay đổi và hiểu nguyên nhân.

Tiêu chí đạt: người mới không cần hỏi ngoài game để hoàn tất; không chết đói không thể tránh; mỗi bước có phản hồi và giải thích.

### Bước C — Quest + tutorial + handbook

Triển khai nhiệm vụ hướng dẫn trên đúng vertical slice, event-based quest tracker, bỏ qua/xem lại, sổ tay cơ chế. Không viết hướng dẫn cho trade/war đến khi có prototype chạy.

### Bước D — Nền tảng online

- API lệnh server-authoritative, xác thực quyền sở hữu và tính idempotent.
- Tick cố định và persistence; test reconnect, offline catch-up, hai lệnh xung đột cùng tài nguyên.
- Lobby/shard, bản đồ nhiều nền văn minh và nhật ký sự kiện.

### Bước E — Trade trước, war sau

Thêm NPC trader/hợp đồng trước để đo kinh tế. Khi luồng giao dịch ổn định mới mở player-to-player, rồi ngoại giao và chiến tranh theo tick. War cần hậu cần, cảnh báo và bảo hộ ngay trong prototype đầu tiên.

---

## 10. Nguyên tắc giữ game dễ hiểu

- Mỗi tài nguyên phải có nguồn, nơi dùng và cách xem tốc độ thay đổi.
- Mỗi công nghệ phải trả lời “mở ra lựa chọn nào mới?”.
- Mỗi nhiệm vụ phải dạy một cơ chế và có thể hoàn tất bằng tính năng đang chạy.
- Mỗi cảnh báo đưa ra nguyên nhân, mức khẩn cấp và ít nhất một hành động khắc phục.
- Mỗi cuộc chiến phải có chuẩn bị, thời gian phản ứng và hậu quả kinh tế.
- Không thêm hệ thống chỉ vì tài liệu liệt kê; thêm khi nó tạo quyết định mới trong vòng lặp cốt lõi.
- Giao diện dùng cùng một từ cho cùng một khái niệm; ví dụ chọn một từ “ngày mô phỏng” và không dùng lẫn “tick/ngày/năm” nếu không giải thích.

