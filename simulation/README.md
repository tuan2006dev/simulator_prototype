# Đảo Thiên Nguyên

Game mô phỏng xây dựng và quản lý đảo, viết bằng TypeScript.

## Chạy trên máy

```sh
npm ci
npm run build
npm run serve
```

Mở http://127.0.0.1:4173 để chơi.

## Triển khai Vercel

Import kho GitHub vào Vercel. Thư mục gốc là thư mục chứa `package.json`.
File `vercel.json` cấu hình sẵn: Framework Other, cài đặt `npm ci`, build
`npm run build`, và xuất website từ `web`.

Website hỗ trợ chơi cục bộ và lưu tiến độ trong trình duyệt.
Chế độ Server thử nghiệm cần API riêng tại localhost:3001; API này chỉ
phục vụ thử nghiệm trên máy và không được triển khai trên Vercel.
Xem `ONLINE_SIMULATION.md` để biết giới hạn hiện tại.
