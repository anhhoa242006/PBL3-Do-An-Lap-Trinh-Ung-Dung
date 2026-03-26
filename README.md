# PhoneStore (PBL3)

## Yêu cầu
- SQL Server (database `My_fear`)
- Node.js 18+ cho backend API

## Thiết lập database
1. Mở SQL Server Management Studio
2. Chạy lần lượt:
   - `Database/SQLQuery3.sql` (tạo schema)
   - `Database/SQLQuery1.sql` (seed data)

## Chạy backend API
```bash
cd backend
cp .env.example .env
# cập nhật DB_* trong .env theo môi trường của bạn
npm install
npm run start
```
API mặc định chạy tại `http://localhost:3000`.

## Chạy frontend
Frontend là HTML/CSS/JS thuần. Có thể mở trực tiếp file hoặc dùng server tĩnh:
```bash
cd frontend
python -m http.server 8000
```
Sau đó truy cập `http://localhost:8000/index.html`.

> Frontend sẽ gọi API tại `http://localhost:3000/api`.

## Tài khoản mẫu
Tài khoản mẫu được seed trong DB (xem `Database/SQLQuery1.sql`).
Ví dụ:
- Admin: `dangthienbinh6677@gmail.com` / `234567hash`
- Staff: `nguyuenbaodoanh0210@gmail.com` / `123456hash`
- Customer: `phamthilan09@gmail.com` / `Lanpham1123`
