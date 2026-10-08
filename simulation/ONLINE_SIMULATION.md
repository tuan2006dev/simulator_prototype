# Online Simulation Foundation

## Current prototype

`src/core/SimulationSession.ts` is the mutation boundary for one development island. The loopback API (`npm run server:dev`, `127.0.0.1:3001`) creates its world and resource map, advances the simulation clock, and validates labor assignment, NPC placement, and manual actions. NPC positions, movement orders, harvest results, resource depletion/regeneration, rest, and nearby conversation are included in revisioned snapshots.

From **Server thử nghiệm**, a player can create an island and share its island ID. Another browser can enter that ID and join the same in-memory island. Each joined browser receives a server-issued connection token and its own command sequence. Both browsers read the same snapshots and submit commands to the same simulation session; neither browser runs a competing simulation tick.

Construction, research, era transitions, combat, and other unsupported mutations remain locked in this mode to prevent client/server state divergence.

## Creatures tab and settlement growth

The **Sinh vật** tab holds founder placement and later immigration. Founders are placed free on unoccupied grass, sand, or forest tiles. Once all founders are placed, each new settler costs 60 food and 20 wood. Living population is capped at 15 plus 5 per completed house; children also count toward this cap. The server validates immigration through `invite_settler`, including placement, capacity, resources, and command replay, before charging the inventory.

In local mode the same tab also unlocks cattle, chickens, and dogs through their respective research. Placement creates wild animals, which are fed for 10 food per interaction. Animal creation/feeding remains unavailable in server mode until these systems become authoritative.

Foraging herb patches yields 20 food and 1 herb before tool bonuses, so the nature/domestication research path has an obtainable source of herbs.

## Important limitations

This is a local multiplayer test, not production online multiplayer. There is no account authentication, ownership/permissions, persistence, reconnect/recovery, authoritative combat, or internet-facing listener. Connection tokens are temporary development credentials stored in memory; anyone who knows an island ID can join up to the local player limit. Sessions disappear when the server process restarts. Several gameplay systems still run only in local mode. Do not build trade or war on this prototype until ownership, inventory, and combat are authoritative.

## Authority model

```text
Browser client                         Game server
  input / render                         authenticate connection
  sends command + session token ──────▶ validate identity and island state
  receives revisioned snapshot ◀────── sequence commands and advance ticks
  presentation only                      authoritative island state
```

Production must derive identity from a real authenticated connection. Clients send intent; they must not send resource totals, NPC positions, combat outcomes, or elapsed tick counts they want trusted.

## Next implementation slices

1. Add player ownership/permissions and movement interpolation/events for joined clients.
2. Enable the building, research, and era commands already handled by the local simulation session in server mode, after initializing and validating civilization state there.
3. Add server persistence and reconnect/recovery. Local browser save/load is implemented; it does not persist server sessions.
4. Add authoritative combat and inventory, then implement trade and war with rate limits and server-side validation.
5. Verify reconnects, stale commands, concurrent resource spending, and equal outcomes across clients.
### Lao động trên bản đồ

Khi phiên mô phỏng có bản đồ, cư dân trưởng thành đã được đặt lên đảo tự tìm tài nguyên theo ưu tiên. Dân đi từng ô, làm việc 10 tick, rồi chuyển sản lượng vào kho chung (10 thức ăn, 3 gỗ hoặc 2 đá trước thưởng công cụ). Thời gian đi đường không tạo sản lượng. Hái lượm còn tạo 0,5 thảo dược mỗi lượt đủ sản lượng. Tài nguyên giảm đúng lượng đã thu; lượt cuối có thể thu một phần. Dân không đi được, hết tài nguyên hoặc chờ nơi làm việc sẽ hiện lý do và thử lại sau 10 tick. Dân làm tại công trình không đồng thời thu hoạch theo ưu tiên. Lệnh trực tiếp thay thế lượt tự động hiện tại; sau đó dân trở lại ưu tiên. Phiên CLI không có bản đồ vẫn giữ mô phỏng lao động trừu tượng.

### Công trình và nâng cấp

Chơi cục bộ hỗ trợ 21 loại công trình: 15 loại Đồ Đá/Đồ Đồng cùng mỏ sắt, mỏ than, lò luyện sắt, ruộng lanh, xưởng dệt và trạm giao thương. Có 189 texture SVG cho 3 cấp hình ảnh và 3 phong cách Đồ Đá/Đồ Đồng/Đồ Sắt. Cấp 2–3 mở theo kỷ nguyên và nghiên cứu. Chọn công trình trong Xây dựng, đặt lên ô phù hợp, rồi phân công thợ. Thợ phải đi đến nơi trước khi thi công hoặc sản xuất. Chuyển thợ sang công trình khác tự rút khỏi nơi cũ; dân dưới 18 tuổi hoặc chưa đặt lên bản đồ không được phân công. Nhà/kho/cầu tự rút thợ sau khi hoàn thành, trở về ưu tiên lao động.

Xây mới tăng 5% mỗi thợ có mặt/tick; nâng cấp tăng 2,5%. Nâng cấp chỉ bắt đầu khi công trình hoàn thành, đủ chi phí và đã mở nghiên cứu tương ứng; chi phí trừ một lần, công trình giữ lợi ích thụ động ở cấp cũ đến khi nâng cấp xong. Sản xuất dừng trong thời gian nâng cấp. Chi phí gỗ/đá/thức ăn = (chi phí xây gỗ +20, đá +10, thức ăn +10) nhân cấp hiện tại. Nâng từ cấp 1 cần thêm 5 đồng +10 gỗ xẻ, Đồ Đồng và Kiến trúc Đồ Đồng; từ cấp 2 cần thêm 10 sắt +20 gỗ xẻ +20 gạch, Đồ Sắt và Kiến trúc Đồ Sắt.

Nhà thêm 5 chỗ ở/cấp và hồi phục nghỉ 2/cấp/ngày (toàn đảo tối đa 10). Kho chung có sức chứa cơ bản 300 thức ăn, thêm 400/cấp kho hoàn thành. Trại gỗ thu 6 gỗ, mỏ thu 4 đá, nông trại thu 20 thức ăn mỗi thợ/10 tick; cấp 2 tăng 50%, cấp 3 tăng 100%. Trại/mỏ chỉ lấy đúng loại tài nguyên trong bán kính 3 ô và không tạo sản lượng khi hết nguồn. Ruộng cạnh đất màu mỡ tăng 25% sản lượng. Đền giảm cô đơn/lo lắng cho dân gần đó. Cầu hoàn thành làm ô nước nông đi được và thêm 10%/cấp tốc độ xây dựng trên đảo.

Vị trí/di chuyển và nhịp công trình được chạy trong SimulationSession để không có nhịp sản xuất thứ hai ở trình duyệt. Lệnh xây/phân công/nâng cấp chưa được mở trên server thử nghiệm; giao diện giữ khóa các thao tác đó.

Kiểm tra: `npm run test:buildings`, `npm run test:buildings-ui`, `npm run textures`. Xem game bằng `npm run serve` tại localhost:4173.

### Kỷ nguyên và lưu cục bộ

Luồng Đồ Đá → Đồ Đồng dùng điều kiện dân cư, nghiên cứu, nhà/kho, mẻ sản xuất thật và dự trữ thức ăn. Người chơi bấm phát triển, trả 40 gỗ +20 đá một lần và chờ 20 tick có dân trưởng thành trên đảo. Đồ Đồng → Đồ Sắt cần 25 dân, Luyện đồng/Chữ viết/Khảo sát sắt, 50 đồng +30 gỗ xẻ đã sản xuất, kho và dự trữ 5 ngày; phí 30 gỗ xẻ +20 đồng +20 gạch, thời gian 30 tick. Hiện Đại và Dị Tượng chỉ hiển thị lộ trình, chưa thu phí mở khóa.

Mỏ đồng lấy quặng có thật trên bản đồ; lò luyện dùng 4 quặng + 2 gỗ để tạo 2 đồng; xưởng gỗ dùng 6 gỗ để tạo 4 gỗ xẻ. Hàng đầy hoặc thiếu đầu vào thì mẻ chế biến dừng trước khi trừ nguyên liệu. Mỗi loại hàng có sức chứa 100 cơ bản, cộng 200 mỗi cấp kho hoàn thành.

Mở rộng Đồ Đồng thêm đất sét hữu hạn ven nước, gạch/gốm và lúa mì/bánh. Gốm trong kho tăng tối đa 100 sức chứa mỗi loại hàng. Lò bánh dùng 8 gạch +2 gốm khi xây; mỗi mẻ 8 lúa mì +2 gỗ tạo 40 thức ăn dùng được. Bản lưu cũ thiếu các hàng mới nhận giá trị 0; thêm mỏ đất sét tại ô ven nước còn trống, giữ các tài nguyên cũ và không tái tạo mỏ đã cạn. Kiểm tra: `npm run test:bronze-economy`, `npm run test:bronze-economy-ui` (test kinh tế dùng bản lưu sinh ra từ `npm run test:era`).

Đồ Sắt thêm quặng/than hữu hạn, luyện 4 quặng +2 than →2 sắt; ruộng lanh tạo 12 sợi/mẻ, xưởng dệt dùng 6 sợi →3 vải. Trạm giao thương NPC giữ hàng xuất, cư dân đi tới thương nhân ven nước, trao đổi 10 tick rồi quay về nhập hàng; không tính nhập khẩu vào thành tích sản xuất. Có hủy/hoàn hàng và lưu giữa chuyến. Đây là giao thương cục bộ, chưa mở các lệnh này trên server và chưa có mạng kho khu vực. Xem IRON_IMPLEMENTATION_RESULT.md; kiểm tra `npm run test:iron`, `npm run test:iron-ui`.

Nút Lưu và tự lưu giữ bản đồ, tài nguyên, cư dân, công trình, nghiên cứu, kho hàng và tiến kỷ nguyên trong trình duyệt. Tiếp tục bản lưu khởi đầu ở trạng thái tạm dừng. Bản cũ thiếu lịch sử sản xuất được đưa về Đồ Đá với thông báo, giữ dân, công trình và tài nguyên đọc được. Kiểm tra luồng mới: `npm run test:era`, `npm run test:era-ui`.
