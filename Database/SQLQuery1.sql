INSERT INTO dbo.Categories 
(CategoryName, Slug, Description, ParentID, DisplayOrder)
VALUES
(N'Điện thoại, Tablet', 'dien-thoai-tablet', 
 N'Danh mục điện thoại và máy tính bảng', NULL, 1),

(N'Laptop', 'laptop', 
 N'Danh mục laptop các loại', NULL, 2),

(N'Âm thanh, Mic thu âm', 'am-thanh-mic', 
 N'Tai nghe, loa, micro', NULL, 3),

(N'Đồng hồ', 'dong-ho', 
 N'Các loại watch', NULL, 4),

(N'Phụ kiện', 'phu-kien', 
 N'Phụ kiện công nghệ', NULL, 5),

(N'PC, Màn hình, Máy in', 'pc-man-hinh-may-in', 
 N'Máy tính để bàn và thiết bị văn phòng', NULL, 6),

(N'Tivi', 'tivi', 
 N'Các loại Tivi', NULL, 8);


Insert INTO Brands(BrandName, Slug)
VALUES
('Apple','apple'),
('Samsung','samsung'),
('Xiaomi','xiaomi'),
('Oppo','oppo'),
('Sony','sony'),
('Infinix','infinix'),
('Realme', 'realme'),
('Huawei','huawei'),
('iPad', 'ipad'),
('Honor', 'honor'),
('Teclast','techlast'),
('MacBook', 'macbook'),
('ASUS','asus'),
('Lenovo','lenovo'),
('DELL','dell'),
('HP','hp'),
('ACER', 'acer'),
('LG','lg'),
('MSI', 'msi');


INSERT INTO Roles (RoleName)
VALUES
(N'Admin'),
(N'Staff'),
(N'Customer');

INSERT INTO Users 
(FullName, Email, PasswordHash, PhoneNumber, DateOfBirth, Address, RoleID)
VALUES
(N'Đặng Thiên Bình', 'dangthienbinh6677@gmail.com', '234567hash', '0900000001', '2000-05-10', N'Đà Nẵng', 1),
(N'Nguyễn Bảo Doanh', 'nguyuenbaodoanh0210@gmail.com', '123456hash', '0900000002', '2001-02-10', N'Đà Nẵng', 2),
(N'Nguyễn Anh Hoa', 'nguyenanhhoa242006@gmail.com', '567890hash', '0900000003', '2002-08-24', N'Đà Nẵng', 2),
(N'Quang Nhựt Anh Khoa', 'khoaquang0604@gmail.com','456789hash', '0434434545','2004-06-04',N'Đà Nẵng',2),
(N'Phạm Thị Lan', 'phamthilan09@gmail.com', 'Lanpham1123', '0900000004','1999-09-15', N'Đà Nẵng', 3);


INSERT INTO Products
(ProductName, Slug, ShortDescription, FullDescription, Specifications, Warranty, CategoryID, BrandID)
VALUES

-- Apple
(N'iPhone 17 Pro ',
 'iphone-17-pro',
 N'Flagship cao cấp của Apple',
 N'iPhone 17 Pro với chip A19 Pro mạnh mẽ.',
 N'Màn 6.3 inches, Chip A19 Pro,IOS 26',
 N'12 tháng chính hãng',
 1, 1),

 (N'iPhone 17 Pro Max ',
 'iphone-17-pro-max',
 N'Flagship cao cấp của Apple',
 N'iPhone 17 Pro Max với chip A19 Pro mạnh mẽ.',
 N'Màn 6.9 inches, Chip A19 Pro, IOS 26',
 N'12 tháng chính hãng',
 1, 1),

-- Samsung
(N'Samsung Galaxy S24 Ultra',
 'samsung-galaxy-s24-ultra',
 N'Flagship cao cấp Samsung',
 N'Galaxy S24 Ultra với bút S-Pen.',
 N'Màn 6.8 inch, Snapdragon 8 Gen 3',
 N'12 tháng chính hãng',
 1, 2),

 (N'Samsung Galaxy S26 Ultra',
 'samsung-galaxy-s26-ultra',
 N'Flagship cao cấp Samsung',
 N'Galaxy S26 Ultra với bút S-Pen.',
 N'Màn 6.9 inch, Snapdragon 8 Elite Gen 5',
 N'12 tháng chính hãng',
 1, 2),

--Tablet
(N'iPad Air 11 inch M3 Wifi 2025',
'ipad-air-11-inch-m3-2025',
N'iPad Air 11 inch chip M3 chính hãng Apple',
N'iPad Air 11 inch 2025 sử dụng chip Apple M3 mạnh mẽ, màn hình Liquid Retina, hỗ trợ Apple Pencil.',
N'Màn hình: 11 inch, Chip: Apple M3, RAM: 8GB, Kết nối: Wifi',
N'12 tháng chính hãng',
1, 10),


-- Laptop
(N'MacBook Air M3 2024',
 'macbook-air-m3-2024',
 N'Laptop mỏng nhẹ Apple',
 N'MacBook Air chip M3 hiệu năng cao.',
 N'Màn 13 inch, M3, 8GB RAM, 256GB SSD',
 N'12 tháng chính hãng',
 2, 13),

(N'ASUS ROG Strix G16',
 'asus-rog-strix-g16',
 N'Laptop gaming hiệu năng cao',
 N'Laptop gaming RTX 4060.',
 N'i7, 16GB RAM, 512GB SSD, RTX 4060',
 N'24 tháng chính hãng',
 2, 14),

--Âm thanh
(N'Tai nghe Bluetooth chụp tai Sony WH-1000XM5',
'sony-wh-1000xm5',
N'Tai nghe chống ồn cao cấp Sony',
N'Sony WH-1000XM5 là tai nghe chống ồn chủ động hàng đầu với thời lượng pin lên đến 40 giờ.',
N'Bluetooth 5.2, Driver 30mm, Pin 40h, Sạc nhanh 3.5h',
N'12 tháng chính hãng',
3, 5),

--Đồng hồ
(N'Đồng hồ thông minh Huawei Watch Fit 4',
'huawei-watch-fit-4',
N'Smartwatch Huawei theo dõi sức khỏe',
N'Huawei Watch Fit 4 là đồng hồ thông minh với nhiều tính năng theo dõi sức khỏe và thể thao.',
N'Màn hình AMOLED, pin 10 ngày, đo nhịp tim, nghe gọi Bluetooth',
N'12 tháng chính hãng',
4, 9),

--Phụ kiện
(N'Apple Pencil 2023 USB-C chính hãng (MUWA3)',
'apple-pencil-2023-usb-c',
N'Bút Apple Pencil 2023 kết nối USB-C',
N'Apple Pencil 2023 hỗ trợ iPad với kết nối USB-C, độ trễ thấp và độ chính xác cao khi viết và vẽ.',
N'Kết nối USB-C, Bluetooth, trọng lượng 20.5g',
N'12 tháng chính hãng',
5, 1),

--PC
(N'Màn hình Gaming LG UltraGear 27G411A-B 27 inch',
'lg-ultragear-27g411a-b',
N'Màn hình gaming LG 27 inch 144Hz',
N'Màn hình LG UltraGear 27 inch dành cho game thủ với tần số quét 144Hz và thời gian phản hồi 1ms.',
N'Kích thước 27 inch, Full HD, 144Hz, 1ms, G-Sync, FreeSync',
N'24 tháng chính hãng',
6, 19),

-- Tivi
(N'Smart TV Samsung 55 inch 4K',
 'smart-tv-samsung-55-4k',
 N'Tivi 4K UHD',
 N'Smart TV Samsung độ phân giải 4K.',
 N'55 inch, 4K UHD',
 N'24 tháng chính hãng',
 7, 2);


 INSERT INTO ProductVariants
(ProductID, Color, Storage, Price, OriginalPrice, StockQuantity, SKU, IsDefault, ImageURL)
VALUES

-- iPhone 17 Pro
(1,N'Titan Tự nhiên','256GB',30990000,32990000,20,'IP17PRO-256-TTN',1,'iphone17pro.jpg'),
(1,N'Titan Xanh','512GB',34990000,36990000,15,'IP17PRO-512-TX',0,'iphone17pro-blue.jpg'),
(1,N'Titan Tự nhiên','1TB',39990000,41990000,10,'IP17PRO-1TB-TTN',0,'iphone17pro-1tb.jpg'),

-- iPhone 17 Pro Max
(2,N'Titan Tự nhiên','256GB',33990000,35990000,20,'IP17PM-256-TTN',1,'iphone17pm.jpg'),
(2,N'Titan Đen','512GB',37990000,39990000,15,'IP17PM-512-DEN',0,'iphone17pm-black.jpg'),
(2,N'Titan Đen','1TB',42990000,44990000,8,'IP17PM-1TB-DEN',0,'iphone17pm-1tb.jpg'),

-- Samsung S24 Ultra
(3,N'Đen','256GB',28990000,30990000,18,'S24U-256-BLACK',1,'s24ultra.jpg'),
(3,N'Tím','512GB',31990000,33990000,10,'S24U-512-PURPLE',0,'s24ultra-purple.jpg'),

-- Samsung S26 Ultra
(4,N'Đen','256GB',31990000,33990000,15,'S26U-256-BLACK',1,'s26ultra.jpg'),
(4,N'Bạc','512GB',34990000,36990000,10,'S26U-512-SILVER',0,'s26ultra-silver.jpg'),

-- iPad Air M3
(5,N'Xám','128GB',15790000,16900000,25,'IPADAIR-M3-128',1,'ipadair.jpg'),
(5,N'Xám','256GB',18990000,19900000,20,'IPADAIR-M3-256',0,'ipadair256.jpg'),

-- MacBook Air M3
(6,N'Bạc','256GB',27990000,29990000,12,'MBA-M3-256',1,'macbookair.jpg'),
(6,N'Xám','512GB',32990000,34990000,8,'MBA-M3-512',0,'macbookair512.jpg'),

-- ASUS ROG Strix
(7,N'Đen','512GB',32990000,34990000,10,'ROG-G16-512',1,'rog-g16.jpg'),

-- Sony WH1000XM5
(8,N'Đen',NULL,6480000,7990000,30,'SONY-XM5-BLACK',1,'sony-xm5.jpg'),
(8,N'Trắng',NULL,6480000,7990000,20,'SONY-XM5-WHITE',0,'sony-xm5-white.jpg'),

-- Huawei Watch Fit 4
(9,N'Đen',NULL,2540000,3090000,25,'HW-FIT4-BLACK',1,'huawei-fit4.jpg'),
(9,N'Hồng',NULL,2540000,3090000,15,'HW-FIT4-PINK',0,'huawei-fit4-pink.jpg'),

-- Apple Pencil
(10,N'Trắng',NULL,2090000,2190000,40,'APPLE-PENCIL-USBC',1,'apple-pencil.jpg'),

-- LG Monitor
(11,N'Đen',NULL,2890000,3990000,12,'LG-27G411A',1,'lg-monitor.jpg'),

-- Samsung TV
(12,N'Đen',NULL,12990000,14990000,10,'SS-TV55-4K',1,'samsung-tv.jpg');


INSERT INTO Coupons
(Code, Description, DiscountPercent, DiscountAmount, StartDate, EndDate)
VALUES
('SALE10', N'Giảm 10% toàn bộ sản phẩm', 10, NULL, GETDATE(), DATEADD(MONTH,1,GETDATE())),
('GIAM500K', N'Giảm 500.000đ cho đơn trên 10 triệu', NULL, 500000, GETDATE(), DATEADD(MONTH,1,GETDATE()));


INSERT INTO Banners (Title, ImageURL, LinkURL, DisplayOrder)
VALUES
(N'Siêu Sale Tháng 3', 'banner1.jpg', '/sale', 1),
(N'Laptop Gaming Giảm Sốc', 'banner2.jpg', '/laptop', 2);





