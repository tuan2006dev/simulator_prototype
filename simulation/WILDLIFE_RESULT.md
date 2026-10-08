# Thú hoang và phòng vệ khi khám phá — 08/10/2026

Đã triển khai vòng đầu: sói hoang/lợn rừng có lãnh địa, đi bộ quanh vùng, phát hiện-rút về, đuốc xua sói, giáo/áo chống đỡ và nối thương tích với hệ chữa trị đang có. Giữ bản lưu người dùng và các checkpoint cũ; không thêm vật tư thưởng khi xua thú.

## Luật hiện có

- Mỗi thế giới có tối đa hai lãnh địa tùy rừng/đường đi, cách lửa trại9–18ô, không sinh ngay trên công trình. Loài thứ hai cách loài thứ nhất ít nhất8ô.
- Thú đi một ô mỗi2nhịp, trong bán kính2ô quanh lãnh địa. Không truy đuổi người hoặc gây đột kích vào làng. Vùng4ô quanh lửa trại không chịu cuộc gặp thú.
- Chỉ hiện thú trên bản đồ khi đang trong tầm nhìn; chỉ ghi tên lãnh địa sau khi thực sự thấy. Sói/lợn có hình vector riêng, màu mềm và nét bo tròn, có nhịp chuyển động nhỏ. Đã xem ảnh trong game; giữ thú nuôi bò/gà/chó độc lập.
- Lần này nguy hiểm được xử lý trên chuyến khám phá/tuần tra của người được chọn. Chưa mở thú tấn công toàn bộ dân đang lao động, trẻ em, gia súc hoặc cả làng.
- Trong3ô đường đi thật có thể phát hiện và rút về; không nhận hàng ở điểm chưa thu. Kiểm tra từng ô di chuyển, không nhảy xuyên qua thú bằng bước đi6ô.
- Sói tránh đuốc còn nhiên liệu, lùi một bước trong lãnh địa rồi nghỉ10nhịp. Đuốc cạn không xua; nhịp ban đêm làm cháy hết nhiên liệu cuối cùng thì tác dụng cũng hết. Luật hao/chế/tiếp đuốc giữ nguyên, không nạp miễn phí.
- Lợn rừng không bị đuốc xua. Khi áp sát≤1ô, thương tích cơ bản sói12/lợn16. Giáo giảm8, áo dệt giảm4, có thể cùng chống đỡ; giáo khi áp sát làm thú lùi/ngừng đe dọa10nhịp. Không giết thú hoặc nhận thịt/xương miễn phí.
- Mỗi thú có5nhịp giữa hai lần gây thương tích; kiểm tra nhiều ô trong một nhịp không nhân sát thương. Lưu/tải giữ thời hạn xua/cooldown.
- Tiến độ tự động tránh lãnh địa đã biết; đuốc mở đường qua sói, không mở đường qua lợn rừng. Còn có thể chọn mốc tay. Khi bị áp sát, tuần tra tự dừng, người rút về thật, giữ nghề/hàng và không tự đăng ký chuyến tiếp.
- Vòng này giới hạn sát thương thú ở sàn20HP để đường thoát bị chặn không khiến người chết vì lặp sát thương. Không dịch chuyển, không làm rơi/nhân cargo; cần mở lại lối về. Điều này không thay luật đói/rét hoặc các nguy hiểm khác.

Trong **Nhiệm vụ → Khám phá quanh làng**, bảng Thú hoang hiển thị lần gặp và loài đã thấy. Nút **Chuẩn bị giáo / chữa thương** mở Phòng vệ làng. Trang bị vẫn phải chế và tới kho lấy; thảo dược cần nghiên cứu trước, dùng2herbs/4nhịp làm để hồi tối đa20HP. Chuyến phải về/dừng trước khi đổi việc. Không cấp nghiên cứu, đồ hoặc thuốc cho bản chơi thật.

## Lượt chơi tiếp diễn thật

Bắt đầu từ [checkpoint khám phá đã chơi](artifacts/patrol-browser-played-save.json), độc lập và không sửa bản gốc. Đi tới vùng sói bằng lệnh đặt mốc, không đặt sẵn NPC cạnh thú trong lượt này.

Mô phỏng: 8bước tính cả chờ bình minh; xua sói1lần, thương tích0, 8người sống, Food188.6. Trinh sát giữ100HP, nghề và về lửa trại; nhiên liệu đuốc5→4 theo đồng hồ hiện có. Có checkpoint lúc vừa xua sói để kiểm tra lưu thời hạn.

Trình duyệt Edge riêng: chọn dân/đặt mốc bằng click bản đồ → đi thực tế → đuốc xua sói → lưu/tải giữa chuyến → trở về. Kết quả8người sống, Food188.6, trinh sát100HP; mobile390px không tràn ngang. Không lỗi trang/tải tài nguyên. Đã chụp cận cảnh hình sói trong game và xem ảnh.

- [Kết quả mô phỏng](artifacts/wildlife-core-result.json)
- [Bản chuẩn bị đã kiếm vật tư](artifacts/wildlife-ready-save.json)
- [Bản mô phỏng đã về](artifacts/wildlife-played-save.json)
- [Kết quả browser](artifacts/wildlife-browser-result.json)
- [Lưu giữa chuyến browser](artifacts/wildlife-browser-midtrip-save.json)
- [Bản browser đã về](artifacts/wildlife-browser-played-save.json)
- [Ảnh đuốc xua sói](artifacts/wildlife-torch-desktop.png)
- [Ảnh trong game](artifacts/wildlife-torch-world.png)
- [Cận cảnh sói](artifacts/wildlife-wolf-closeup.png)
- [Mobile](artifacts/wildlife-mobile.png)

## Tình huống thử riêng

Các tình huống này dựng riêng để kiểm tra biên, không nhận là sự kiện tự nhiên hoặc nghiên cứu đã trả phí của lượt trên:

- Đuốc cạn và nhịp đốt nhiên liệu cuối cùng không xua sói; đúng12HP khi bị sói áp sát.
- Lợn gây16HP; giáo còn8HP; giáo+áo còn4HP. Có cooldown, không nhân đòn do kiểm tra từng ô.
- Đi quanh lãnh địa40nhịp không vượt bán kính2; bản lưu thú sai vị trí bị từ chối.
- Không tấn công xuyên vùng nước không có lối; vùng gần lửa trại an toàn.
- Đường về bị chặn30nhịp: cư dân giữ vị trí, sống, HP≥20 và giữ đúng2gỗ đang mang; không dịch chuyển hoặc giao kho từ xa. Bản lưu vẫn tải được.
- Mô phỏng liệu trình tại kho từ84HP: trừ đúng2herbs,4nhịp làm, kết thúc100HP, không nhân thuốc qua lưu/tải.
- Browser fixture bật sẵn nghiên cứu thảo dược, đặt người cạnh lợn để gây thương tích có kiểm soát. Chuỗi công khai: bị thương xuống84HP → tự dừng tuần tra → lưu/tải → đi bộ về → bấm chữa → dùng một liều trả vật tư →100HP,8người sống. Đã xem ảnh; đây không phải lượt nghiên cứu Y học kiếm vật tư/trả phí thật.

[Fixture trước bị thương](artifacts/wildlife-injury-fixture-save.json), [ảnh cảnh báo thương tích](artifacts/wildlife-injury-fixture.png), [lợn trong game — fixture](artifacts/wildlife-boar-fixture-world.png), [chữa trị — fixture](artifacts/wildlife-healing-fixture.png).

## Kiểm tra hồi quy và phạm vi còn lại

`test:wildlife`, `test:wildlife-ui`, `test:patrol`, `test:care`, `test:session`, kiểm tra13checkpoint ba nhánh đọc/lưu lại đều qua. Kiểm tra kiểu dữ liệu và build524,8KB qua,98icon riêng. Các bản gốc ba nhánh không sửa hoặc ghép hàng.

Chưa hệ săn bắn/giết thú/loot, bầy thú/truy đuổi, rắn/độc/bệnh mới, thú tấn công lao động thường/vật nuôi, hoặc nghề trinh sát chiến đấu riêng. Chưa ba đảo/Mộc/Krock/thủy triều/hội thoại sáu hồi. Đây là vòng phòng vệ khi khám phá, không phải toàn bộ thiên tai và thú dữ trong Master.
