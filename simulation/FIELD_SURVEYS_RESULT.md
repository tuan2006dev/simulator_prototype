> Cập nhật09:50: cơ sở đo đạc/phân tích đã chơi/test; xem ANALYSIS_RESULT.md. Điểm tiếp tục mới analysis-played-save.json, lựa chọn/dự án nhánh còn làm. Phần H4B tiếp theo dưới đây giữ lịch sử.

# Khảo sát thực địa — H4A, 09:01 ngày 06/10/2026

Đã có vòng khảo sát sơ bộ chơi được trong Hiện Đại. **H4A xong, H4 tổng còn làm**: cơ sở đo đạc/điện/phân tích/lựa chọn chưa có. Ba hồ sơ thực địa không thay cho điều kiện cơ sở đã xử lý3 đợt khảo sát của thiết kế. Dị Tượng vẫn khóa; chưa nhận tài nguyên nhánh hay biến thể.

## Luật đã triển khai

Khảo sát thực địa cần Hợp đồng cung ứng, phí15 gỗ/10 đá/20 thức ăn +6 linh kiện/1 bộ phận máy,3 ngày nghiên cứu tại bàn. Sau hoàn thành, xác định3 điểm nghi vấn có đường đi trên đất, tránh công trình và cách nhau; nhãn Tín hiệu công nghệ/Mạch linh khí/Vùng nhiễu quỷ dị gắn với3 hướng thiết kế. Đây là tín hiệu cần kiểm chứng, không phát sinh tự động sức mạnh/nguy hiểm/mỏ hay vật phẩm nhánh. Không phụ thuộc chờ RNG xuất hiện dị tượng.

Mỗi chuyến giữ/trả phí **2 linh kiện +2 vải**, chọn1 người trưởng thành rảnh: đi tới tọa độ, **10 nhịp quan sát tại chỗ**, trở về bàn mới ghi nhận1 hồ sơ. Đang đi/đang quan sát không tính là hồ sơ đã về; không cộng sản lượng hàng. Bàn nghiên cứu hiện tại là nơi nhận hồ sơ sơ bộ, chưa thay viện phân tích hiện đại.

Cư dân được giữ quyền sở hữu như người nghiên cứu thực địa: không bị tự nhận việc và chặn lệnh đổi nghề/phân công sang công trình khi đang đi. Không nhận người đang có hàng, hành động hoặc lượt lao động dở; hướng dẫn cho nghỉ và giao hàng trước. Sinh hoạt/né nguy hiểm giữ tiến độ; không teleport để hoàn thành. Đường/ô đích bị chặn giữ chuyến, cho mở lại hoặc hủy. Hủy trả đúng2+2 một lần, không ghi hồ sơ, cư dân vẫn ở vị trí hiện tại. Save giữ điểm/vị trí/pha/timer/owner; dữ liệu sai hoặc trùng điểm bị chặn.

Lộ trình có bảng khảo sát riêng, trạng thái đội, tọa độ, tiến độ0/3 và thẻ từng điểm; nút chọn người/cử/hủy, vạch phân ranh và màu giấy/gỗ đúng giao diện. Giữ texture chibi trên bản đồ. Chưa có marker địa hình riêng cho điểm và chưa có viện/texture viện; làm cùng H4B phù hợp.

## Lượt vật tư thật

`test:surveys` tiếp từ modern-dispatch-played-save.json. Tắt máy công nghiệp để giữ nhiên liệu, nghiên cứu trả6 linh kiện/1 phần máy thật. Khởi hành qua public command, duplicate không trả lần hai; lệnh đổi nghề/phân công bị chặn. Cư dân di chuyển thật, snapshot pha giữ chính xác, hủy/hoàn phí và khởi hành lại. Thực hiện cả3 điểm, đứng đúng tọa độ khi quan sát, chưa ghi hồ sơ lúc trở về đang đi; chỉ ghi sau tới bàn.

Kết quả sau **188 bước**: **3 hồ sơ về bàn,50 dân sống/Food1735,4**, kho **24 linh kiện/3 bộ phận máy/10 than**. Tổng phí linh kiện36 ban đầu →30 sau nghiên cứu →24 sau3 chuyến; hủy không tiêu thêm. Vải trong kho còn1000 do các buffer cũ giao tiếp; đã kiểm tra tổng kho+buffer+túi+phần mới sản xuất để xác nhận phí6 vải, không giả định kho đứng yên. Không sửa kho/unlock/công trình/nhu cầu để qua.

Bản earned: artifacts/surveys-ready-save.json (đã nghiên cứu), surveys-outbound-save.json (chuyến paid đang đi), **surveys-played-save.json (3 hồ sơ đã về, điểm tiếp tục mới)**. Save người dùng giữ nguyên. Fixture riêng: timer/owner hỏng bị chặn; đổi ô đích thành nước giữ tiến độ và hoàn phí khi hủy, không có hồ sơ. Bài này tìm ra điểm pathfinder cho phép ô đích đặc biệt; bổ sung kiểm tra đất đi được trước di chuyển khảo sát.

## Browser và hồi quy

`test:surveys-ui` qua context riêng: chọn người/bấm cử public, pause giữ tiến độ và trừ đúng2+2; tải giữa chuyến/hủy hoàn đúng; chạy thật1 chuyến, trở về ghi1/3,50 sống. Tải lại desktop/390×844 giữ kết quả, không lỗi JS/tải hỏng/tràn ngang. Có ảnh chibi trong game/thao tác; đã xem ảnh và bổ sung ranh giới/nút/select của bảng, kiểm tra lại sau chỉnh UI.

Ảnh artifacts/surveys-ready-desktop.png, surveys-outbound-desktop.png, surveys-returned-desktop.png, surveys-island.png, surveys-mobile.png. Type/build qua (game.js368,5KB); session/raids/modern-investment/emergency-meals/production-workforce hồi quy qua. NPC đi khảo sát dùng bộ lọc researching hiện có; startResearch cũng loại người đang nghiên cứu để không chiếm người ngoài thực địa. Không cài phụ thuộc/publish/commit/subagent.

## H4B tiếp theo

Tiếp từ **surveys-played-save.json**, không làm lại nghiên cứu hoặc ba chuyến. Nối cơ sở đo đạc/viện hiện đại có texture/cost/đường xây thật, công suất2 và người tới làm; tiêu linh kiện thực sự cho phân tích hồ sơ. Bộ đếm điện5 ngày của viện phải riêng đúng cơ sở/thợ/điện, không dùng proof xưởng máy. Phân tích xong mới mở lựa chọn nghiên cứu/phong tỏa/bỏ qua, cho xem chi phí/hệ quả giới hạn. Cả3 nhánh giữ thiết kế gốc; chưa mở Dị Tượng cho đến khi có dự án nền tảng và chuỗi hàng/nguồn/nơi dùng chạy/test được. Giữ thời hạn03:27 ngày07/10, kiểm tra cuối02:57.
