# PhoneStore (PBL3)

## Yêu cầu
- SQL Server (database My_fear)
- .NET SDK 10 (project target net10.0)
- Python 3 hoặc công cụ chạy static server cho frontend

## Thiết lập database
1. Mở SQL Server Management Studio.
2. Chạy lần lượt:
   - Database/SQLQuery3.sql (tạo schema)
   - Database/SQLQuery1.sql (seed data)

## Cấu hình backend .NET
1. Mở file PhoneStoreMVC/appsettings.json.
2. Kiểm tra ConnectionStrings:DefaultConnection đang trỏ đúng SQL Server instance và database My_fear.
3. Nếu cần, cập nhật thông tin server, xác thực và TrustServerCertificate theo môi trường máy.

## Chạy backend API (.NET)
1. Mở terminal tại thư mục PhoneStoreMVC.
2. Chạy lần lượt:

   dotnet restore
   dotnet run

3. API mặc định chạy tại:
   http://localhost:5000/api

## Kiểm tra nhanh backend
Mở trình duyệt và kiểm tra:
- http://localhost:5000/api/health
- http://localhost:5000/api/categories

Nếu cả hai endpoint trả JSON, backend đã chạy và kết nối database thành công.

## Chạy frontend
Frontend là HTML/CSS/JS thuần.

1. Mở terminal tại thư mục frontend.
2. Chạy:

   python -m http.server 8000

3. Truy cập:
   http://localhost:8000/index.html

Frontend mặc định gọi API tại:
http://localhost:5000/api

## Lưu ý khi từng dùng API base cũ
Nếu trước đó đã lưu API base khác trong localStorage, mở DevTools Console và chạy:

localStorage.removeItem("phonestore_api_base")

Sau đó tải lại trang.

## Tài khoản mẫu
Hệ thống có dữ liệu người dùng mẫu trong database seed.
Bạn có thể cập nhật lại thông tin đăng nhập trong database hoặc đăng ký tài khoản mới ở trang auth.
