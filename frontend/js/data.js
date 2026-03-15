// =====================
// PRODUCT & CATEGORY DATA
// =====================

const categories = [
  { id: 'dien-thoai', name: 'Điện thoại', icon: '📱', count: 20 },
  { id: 'may-tinh-bang', name: 'Máy tính bảng', icon: '📟', count: 8 },
  { id: 'phu-kien', name: 'Phụ kiện', icon: '🎧', count: 15 },
  { id: 'laptop', name: 'Laptop', icon: '💻', count: 10 },
];

const brands = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'vivo', 'Realme', 'Google'];

const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max-256gb',
    brand: 'Apple',
    category: 'dien-thoai',
    price: 28990000,
    originalPrice: 34990000,
    discount: 17,
    rating: 4.9,
    reviewCount: 1820,
    image: 'https://placehold.co/400x400/1a1a2e/ffffff?text=iPhone+15+Pro+Max',
    images: [
      'https://placehold.co/600x600/1a1a2e/ffffff?text=iPhone+15+Pro+Max',
      'https://placehold.co/600x600/2d2d44/ffffff?text=Side+View',
      'https://placehold.co/600x600/3d3d5c/ffffff?text=Back+View',
    ],
    description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch. Thiết kế titanium cao cấp.',
    specs: {
      'Màn hình': '6.7 inch Super Retina XDR',
      'Chip': 'Apple A17 Pro',
      'RAM': '8GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '48MP + 12MP + 12MP',
      'Camera selfie': '12MP TrueDepth',
      'Pin': '4422 mAh',
      'Hệ điều hành': 'iOS 17',
      'Màu sắc': 'Titan Đen, Titan Trắng, Titan Xanh, Titan Tự Nhiên',
    },
    variants: [
      { color: 'Titan Đen', storage: '256GB', price: 28990000 },
      { color: 'Titan Trắng', storage: '256GB', price: 28990000 },
      { color: 'Titan Xanh', storage: '512GB', price: 33990000 },
      { color: 'Titan Tự Nhiên', storage: '1TB', price: 38990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot', 'new'],
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 256GB',
    slug: 'samsung-galaxy-s24-ultra-256gb',
    brand: 'Samsung',
    category: 'dien-thoai',
    price: 26990000,
    originalPrice: 31990000,
    discount: 16,
    rating: 4.8,
    reviewCount: 956,
    image: 'https://placehold.co/400x400/0a3d62/ffffff?text=Galaxy+S24+Ultra',
    images: [
      'https://placehold.co/600x600/0a3d62/ffffff?text=Galaxy+S24+Ultra',
      'https://placehold.co/600x600/1a5276/ffffff?text=Side+View',
      'https://placehold.co/600x600/2e86c1/ffffff?text=Back+View',
    ],
    description: 'Samsung Galaxy S24 Ultra với bút S Pen tích hợp, camera 200MP, màn hình Dynamic AMOLED 2X 6.8 inch. Hiệu năng đỉnh cao với chip Snapdragon 8 Gen 3.',
    specs: {
      'Màn hình': '6.8 inch Dynamic AMOLED 2X',
      'Chip': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '200MP + 50MP + 10MP + 12MP',
      'Camera selfie': '12MP',
      'Pin': '5000 mAh',
      'Hệ điều hành': 'Android 14',
      'Đặc biệt': 'S Pen tích hợp',
    },
    variants: [
      { color: 'Titan Đen', storage: '256GB', price: 26990000 },
      { color: 'Titan Xám', storage: '512GB', price: 31990000 },
      { color: 'Titan Tím', storage: '1TB', price: 36990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 3,
    name: 'Xiaomi 14 Ultra 512GB',
    slug: 'xiaomi-14-ultra-512gb',
    brand: 'Xiaomi',
    category: 'dien-thoai',
    price: 22990000,
    originalPrice: 26990000,
    discount: 15,
    rating: 4.7,
    reviewCount: 432,
    image: 'https://placehold.co/400x400/1c1c1c/ffffff?text=Xiaomi+14+Ultra',
    images: [
      'https://placehold.co/600x600/1c1c1c/ffffff?text=Xiaomi+14+Ultra',
      'https://placehold.co/600x600/2c2c2c/ffffff?text=Side+View',
    ],
    description: 'Xiaomi 14 Ultra với hệ thống camera Leica, chip Snapdragon 8 Gen 3, màn hình AMOLED 6.73 inch. Chụp ảnh chuyên nghiệp như máy ảnh.',
    specs: {
      'Màn hình': '6.73 inch AMOLED',
      'Chip': 'Snapdragon 8 Gen 3',
      'RAM': '16GB',
      'Bộ nhớ': '512GB',
      'Camera chính': '50MP Leica + 50MP + 50MP + 50MP',
      'Camera selfie': '32MP',
      'Pin': '5000 mAh',
      'Hệ điều hành': 'Android 14',
    },
    variants: [
      { color: 'Trắng', storage: '256GB', price: 19990000 },
      { color: 'Đen', storage: '512GB', price: 22990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
  },
  {
    id: 4,
    name: 'OPPO Find X7 Ultra 256GB',
    slug: 'oppo-find-x7-ultra-256gb',
    brand: 'OPPO',
    category: 'dien-thoai',
    price: 19990000,
    originalPrice: 23990000,
    discount: 17,
    rating: 4.6,
    reviewCount: 321,
    image: 'https://placehold.co/400x400/2c3e50/ffffff?text=OPPO+Find+X7',
    images: [
      'https://placehold.co/600x600/2c3e50/ffffff?text=OPPO+Find+X7+Ultra',
    ],
    description: 'OPPO Find X7 Ultra với camera Hasselblad, sạc nhanh 100W, màn hình LTPO AMOLED 6.82 inch.',
    specs: {
      'Màn hình': '6.82 inch LTPO AMOLED',
      'Chip': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '50MP Hasselblad',
      'Pin': '5000 mAh',
      'Sạc': '100W SuperVOOC',
      'Hệ điều hành': 'Android 14',
    },
    variants: [
      { color: 'Đen', storage: '256GB', price: 19990000 },
      { color: 'Trắng', storage: '512GB', price: 23990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 5,
    name: 'iPhone 15 128GB',
    slug: 'iphone-15-128gb',
    brand: 'Apple',
    category: 'dien-thoai',
    price: 18990000,
    originalPrice: 22990000,
    discount: 17,
    rating: 4.7,
    reviewCount: 2100,
    image: 'https://placehold.co/400x400/f0e6d3/333333?text=iPhone+15',
    images: [
      'https://placehold.co/600x600/f0e6d3/333333?text=iPhone+15',
    ],
    description: 'iPhone 15 với chip A16 Bionic, camera 48MP Dynamic Island, cổng USB-C.',
    specs: {
      'Màn hình': '6.1 inch Super Retina XDR',
      'Chip': 'Apple A16 Bionic',
      'RAM': '6GB',
      'Bộ nhớ': '128GB',
      'Camera chính': '48MP + 12MP',
      'Camera selfie': '12MP TrueDepth',
      'Pin': '3877 mAh',
      'Hệ điều hành': 'iOS 17',
    },
    variants: [
      { color: 'Hồng', storage: '128GB', price: 18990000 },
      { color: 'Vàng', storage: '128GB', price: 18990000 },
      { color: 'Xanh', storage: '256GB', price: 21990000 },
      { color: 'Đen', storage: '512GB', price: 27990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot'],
  },
  {
    id: 6,
    name: 'Samsung Galaxy A55 5G 128GB',
    slug: 'samsung-galaxy-a55-128gb',
    brand: 'Samsung',
    category: 'dien-thoai',
    price: 8990000,
    originalPrice: 10990000,
    discount: 18,
    rating: 4.5,
    reviewCount: 678,
    image: 'https://placehold.co/400x400/5dade2/ffffff?text=Galaxy+A55',
    images: [
      'https://placehold.co/600x600/5dade2/ffffff?text=Galaxy+A55+5G',
    ],
    description: 'Samsung Galaxy A55 5G với màn hình Super AMOLED 6.6 inch, camera 50MP, pin 5000mAh.',
    specs: {
      'Màn hình': '6.6 inch Super AMOLED',
      'Chip': 'Exynos 1480',
      'RAM': '8GB',
      'Bộ nhớ': '128GB',
      'Camera chính': '50MP + 12MP + 5MP',
      'Camera selfie': '32MP',
      'Pin': '5000 mAh',
      'Hệ điều hành': 'Android 14',
    },
    variants: [
      { color: 'Xanh', storage: '128GB', price: 8990000 },
      { color: 'Tím', storage: '256GB', price: 10490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 7,
    name: 'Xiaomi Redmi Note 13 Pro 256GB',
    slug: 'xiaomi-redmi-note-13-pro-256gb',
    brand: 'Xiaomi',
    category: 'dien-thoai',
    price: 6490000,
    originalPrice: 7990000,
    discount: 19,
    rating: 4.4,
    reviewCount: 1230,
    image: 'https://placehold.co/400x400/27ae60/ffffff?text=Redmi+Note+13',
    images: [
      'https://placehold.co/600x600/27ae60/ffffff?text=Redmi+Note+13+Pro',
    ],
    description: 'Xiaomi Redmi Note 13 Pro với camera 200MP, màn hình AMOLED 6.67 inch, sạc nhanh 67W.',
    specs: {
      'Màn hình': '6.67 inch AMOLED',
      'Chip': 'Snapdragon 7s Gen 2',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '200MP + 8MP + 2MP',
      'Camera selfie': '16MP',
      'Pin': '5100 mAh',
      'Hệ điều hành': 'Android 13',
    },
    variants: [
      { color: 'Đen', storage: '128GB', price: 5490000 },
      { color: 'Xanh', storage: '256GB', price: 6490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 8,
    name: 'vivo V29 5G 256GB',
    slug: 'vivo-v29-5g-256gb',
    brand: 'vivo',
    category: 'dien-thoai',
    price: 8490000,
    originalPrice: 10490000,
    discount: 19,
    rating: 4.3,
    reviewCount: 345,
    image: 'https://placehold.co/400x400/8e44ad/ffffff?text=vivo+V29',
    images: [
      'https://placehold.co/600x600/8e44ad/ffffff?text=vivo+V29+5G',
    ],
    description: 'vivo V29 5G với camera selfie 50MP, màn hình AMOLED 6.78 inch, sạc nhanh 80W.',
    specs: {
      'Màn hình': '6.78 inch AMOLED',
      'Chip': 'Snapdragon 778G',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '50MP + 8MP + 2MP',
      'Camera selfie': '50MP',
      'Pin': '4600 mAh',
      'Hệ điều hành': 'Android 13',
    },
    variants: [
      { color: 'Xanh', storage: '256GB', price: 8490000 },
      { color: 'Vàng', storage: '256GB', price: 8490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['new'],
  },
  // Tablets
  {
    id: 9,
    name: 'iPad Pro M4 11 inch WiFi 256GB',
    slug: 'ipad-pro-m4-11-inch-256gb',
    brand: 'Apple',
    category: 'may-tinh-bang',
    price: 25990000,
    originalPrice: 28990000,
    discount: 10,
    rating: 4.9,
    reviewCount: 456,
    image: 'https://placehold.co/400x400/e8e8e8/333333?text=iPad+Pro+M4',
    images: [
      'https://placehold.co/600x600/e8e8e8/333333?text=iPad+Pro+M4',
    ],
    description: 'iPad Pro M4 với chip Apple M4, màn hình Ultra Retina XDR 11 inch OLED mỏng nhất từ trước đến nay.',
    specs: {
      'Màn hình': '11 inch Ultra Retina XDR OLED',
      'Chip': 'Apple M4',
      'RAM': '8GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '12MP',
      'Camera selfie': '12MP TrueDepth',
      'Pin': 'Lên đến 10 giờ',
      'Hệ điều hành': 'iPadOS 17',
    },
    variants: [
      { color: 'Bạc', storage: '256GB', price: 25990000 },
      { color: 'Đen Không Gian', storage: '512GB', price: 30990000 },
      { color: 'Bạc', storage: '1TB', price: 38990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: false,
    tags: ['new', 'hot'],
  },
  {
    id: 10,
    name: 'Samsung Galaxy Tab S9 FE 128GB',
    slug: 'samsung-galaxy-tab-s9-fe-128gb',
    brand: 'Samsung',
    category: 'may-tinh-bang',
    price: 10990000,
    originalPrice: 13490000,
    discount: 19,
    rating: 4.5,
    reviewCount: 210,
    image: 'https://placehold.co/400x400/34495e/ffffff?text=Tab+S9+FE',
    images: [
      'https://placehold.co/600x600/34495e/ffffff?text=Galaxy+Tab+S9+FE',
    ],
    description: 'Samsung Galaxy Tab S9 FE với màn hình TFT LCD 10.9 inch, bút S Pen đi kèm, chip Exynos 1380.',
    specs: {
      'Màn hình': '10.9 inch TFT LCD',
      'Chip': 'Exynos 1380',
      'RAM': '6GB',
      'Bộ nhớ': '128GB',
      'Camera chính': '8MP',
      'Camera selfie': '10MP',
      'Pin': '8000 mAh',
      'Hệ điều hành': 'Android 13',
      'Đặc biệt': 'S Pen đi kèm',
    },
    variants: [
      { color: 'Xanh', storage: '128GB', price: 10990000 },
      { color: 'Xám', storage: '256GB', price: 13490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  // Accessories
  {
    id: 11,
    name: 'AirPods Pro (thế hệ 2)',
    slug: 'airpods-pro-gen-2',
    brand: 'Apple',
    category: 'phu-kien',
    price: 4990000,
    originalPrice: 6490000,
    discount: 23,
    rating: 4.8,
    reviewCount: 3200,
    image: 'https://placehold.co/400x400/f5f5f5/333333?text=AirPods+Pro+2',
    images: [
      'https://placehold.co/600x600/f5f5f5/333333?text=AirPods+Pro+Gen+2',
    ],
    description: 'AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động, âm thanh Adaptive Audio. Hộp sạc MagSafe.',
    specs: {
      'Chip': 'Apple H2',
      'Chống ồn': 'ANC thế hệ 2',
      'Thời lượng pin tai': '6 giờ',
      'Thời lượng pin hộp': '30 giờ',
      'Sạc': 'MagSafe / Lightning / Apple Watch',
      'Kết nối': 'Bluetooth 5.3',
    },
    variants: [
      { color: 'Trắng', storage: '', price: 4990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot', 'sale'],
  },
  {
    id: 12,
    name: 'Ốp lưng Samsung Galaxy S24 Ultra chính hãng',
    slug: 'op-lung-samsung-galaxy-s24-ultra',
    brand: 'Samsung',
    category: 'phu-kien',
    price: 590000,
    originalPrice: 890000,
    discount: 34,
    rating: 4.3,
    reviewCount: 156,
    image: 'https://placehold.co/400x400/222f3e/ffffff?text=Samsung+Case',
    images: [
      'https://placehold.co/600x600/222f3e/ffffff?text=Samsung+S24+Ultra+Case',
    ],
    description: 'Ốp lưng chính hãng Samsung cho Galaxy S24 Ultra, chất liệu cao cấp bảo vệ máy tốt.',
    specs: {
      'Tương thích': 'Galaxy S24 Ultra',
      'Chất liệu': 'Silicone cao cấp',
      'Màu sắc': 'Đen, Trắng, Xanh, Tím',
    },
    variants: [
      { color: 'Đen', storage: '', price: 590000 },
      { color: 'Trắng', storage: '', price: 590000 },
      { color: 'Xanh', storage: '', price: 590000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 13,
    name: 'Cáp sạc USB-C 1m chính hãng Apple',
    slug: 'cap-sac-usb-c-apple',
    brand: 'Apple',
    category: 'phu-kien',
    price: 490000,
    originalPrice: 590000,
    discount: 17,
    rating: 4.6,
    reviewCount: 890,
    image: 'https://placehold.co/400x400/bdc3c7/333333?text=USB-C+Cable',
    images: [
      'https://placehold.co/600x600/bdc3c7/333333?text=Apple+USB-C+Cable',
    ],
    description: 'Cáp USB-C 1m chính hãng Apple, hỗ trợ sạc nhanh và truyền dữ liệu tốc độ cao.',
    specs: {
      'Độ dài': '1 mét',
      'Kết nối': 'USB-C to USB-C',
      'Sạc nhanh': 'Hỗ trợ',
      'Truyền dữ liệu': 'USB 3 (40Gb/s)',
    },
    variants: [
      { color: 'Trắng', storage: '', price: 490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: [],
  },
  {
    id: 14,
    name: 'Pin dự phòng Xiaomi 33W 20000mAh',
    slug: 'pin-du-phong-xiaomi-33w-20000mah',
    brand: 'Xiaomi',
    category: 'phu-kien',
    price: 590000,
    originalPrice: 790000,
    discount: 25,
    rating: 4.5,
    reviewCount: 2100,
    image: 'https://placehold.co/400x400/ecf0f1/333333?text=Xiaomi+Power+Bank',
    images: [
      'https://placehold.co/600x600/ecf0f1/333333?text=Xiaomi+Power+Bank+33W',
    ],
    description: 'Pin dự phòng Xiaomi 20000mAh, sạc nhanh 33W, hai cổng USB-A + USB-C.',
    specs: {
      'Dung lượng': '20000 mAh',
      'Sạc vào': 'USB-C 33W',
      'Sạc ra': 'USB-A 22.5W, USB-C 33W',
      'Kích thước': '155 × 74 × 26 mm',
      'Trọng lượng': '440g',
    },
    variants: [
      { color: 'Trắng', storage: '', price: 590000 },
      { color: 'Đen', storage: '', price: 590000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 15,
    name: 'Tai nghe Samsung Galaxy Buds3 Pro',
    slug: 'samsung-galaxy-buds3-pro',
    brand: 'Samsung',
    category: 'phu-kien',
    price: 3490000,
    originalPrice: 4490000,
    discount: 22,
    rating: 4.6,
    reviewCount: 432,
    image: 'https://placehold.co/400x400/2c3e50/ffffff?text=Galaxy+Buds3+Pro',
    images: [
      'https://placehold.co/600x600/2c3e50/ffffff?text=Samsung+Galaxy+Buds3+Pro',
    ],
    description: 'Samsung Galaxy Buds3 Pro với thiết kế trong tai mới, chống ồn thông minh, âm thanh Hi-Fi.',
    specs: {
      'Chip': 'Samsung R',
      'Chống ồn': 'ANC thông minh',
      'Thời lượng pin tai': '6 giờ',
      'Thời lượng pin hộp': '30 giờ',
      'Kết nối': 'Bluetooth 5.4',
      'Kháng nước': 'IPX4',
    },
    variants: [
      { color: 'Bạc', storage: '', price: 3490000 },
      { color: 'Đen', storage: '', price: 3490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['new'],
  },
  // Laptops
  {
    id: 16,
    name: 'MacBook Air M3 13 inch 8GB 256GB',
    slug: 'macbook-air-m3-13-inch',
    brand: 'Apple',
    category: 'laptop',
    price: 26990000,
    originalPrice: 29990000,
    discount: 10,
    rating: 4.9,
    reviewCount: 876,
    image: 'https://placehold.co/400x400/c8c8c8/333333?text=MacBook+Air+M3',
    images: [
      'https://placehold.co/600x600/c8c8c8/333333?text=MacBook+Air+M3',
    ],
    description: 'MacBook Air M3 với chip Apple M3, màn hình Liquid Retina 13.6 inch, pin 18 giờ, mỏng nhẹ chỉ 1.24 kg.',
    specs: {
      'Màn hình': '13.6 inch Liquid Retina',
      'Chip': 'Apple M3',
      'RAM': '8GB Unified Memory',
      'Bộ nhớ': '256GB SSD',
      'Camera': '1080p FaceTime HD',
      'Pin': '18 giờ',
      'Trọng lượng': '1.24 kg',
      'Hệ điều hành': 'macOS Sonoma',
    },
    variants: [
      { color: 'Midnight', storage: '256GB', price: 26990000 },
      { color: 'Starlight', storage: '512GB', price: 31990000 },
      { color: 'Space Gray', storage: '1TB', price: 37990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: false,
    tags: ['hot', 'new'],
  },
  {
    id: 17,
    name: 'Dell XPS 15 Core i7 16GB 512GB',
    slug: 'dell-xps-15-i7-16gb',
    brand: 'Dell',
    category: 'laptop',
    price: 32990000,
    originalPrice: 37990000,
    discount: 13,
    rating: 4.7,
    reviewCount: 345,
    image: 'https://placehold.co/400x400/1a1a2e/ffffff?text=Dell+XPS+15',
    images: [
      'https://placehold.co/600x600/1a1a2e/ffffff?text=Dell+XPS+15',
    ],
    description: 'Dell XPS 15 với màn hình OLED 15.6 inch 3.5K, chip Intel Core i7-13700H, card đồ họa NVIDIA RTX 4060.',
    specs: {
      'Màn hình': '15.6 inch OLED 3.5K',
      'Chip': 'Intel Core i7-13700H',
      'RAM': '16GB DDR5',
      'Bộ nhớ': '512GB SSD',
      'Card đồ họa': 'NVIDIA RTX 4060 8GB',
      'Pin': '86Wh',
      'Trọng lượng': '1.86 kg',
      'Hệ điều hành': 'Windows 11 Home',
    },
    variants: [
      { color: 'Bạc', storage: '512GB', price: 32990000 },
      { color: 'Bạc', storage: '1TB', price: 38990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 18,
    name: 'Realme C67 4G 128GB',
    slug: 'realme-c67-4g-128gb',
    brand: 'Realme',
    category: 'dien-thoai',
    price: 3990000,
    originalPrice: 4990000,
    discount: 20,
    rating: 4.2,
    reviewCount: 567,
    image: 'https://placehold.co/400x400/f39c12/ffffff?text=Realme+C67',
    images: [
      'https://placehold.co/600x600/f39c12/ffffff?text=Realme+C67+4G',
    ],
    description: 'Realme C67 với màn hình IPS LCD 6.72 inch 90Hz, camera 108MP, pin 5000mAh sạc nhanh 67W.',
    specs: {
      'Màn hình': '6.72 inch IPS LCD 90Hz',
      'Chip': 'Snapdragon 685',
      'RAM': '6GB',
      'Bộ nhớ': '128GB',
      'Camera chính': '108MP + 2MP',
      'Camera selfie': '8MP',
      'Pin': '5000 mAh',
      'Sạc nhanh': '67W SUPERVOOC',
      'Hệ điều hành': 'Android 13',
    },
    variants: [
      { color: 'Xanh', storage: '128GB', price: 3990000 },
      { color: 'Đen', storage: '256GB', price: 4890000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 19,
    name: 'Google Pixel 8 Pro 256GB',
    slug: 'google-pixel-8-pro-256gb',
    brand: 'Google',
    category: 'dien-thoai',
    price: 20990000,
    originalPrice: 24990000,
    discount: 16,
    rating: 4.7,
    reviewCount: 234,
    image: 'https://placehold.co/400x400/4285f4/ffffff?text=Pixel+8+Pro',
    images: [
      'https://placehold.co/600x600/4285f4/ffffff?text=Google+Pixel+8+Pro',
    ],
    description: 'Google Pixel 8 Pro với chip Tensor G3, AI camera, màn hình LTPO OLED 6.7 inch, 7 năm cập nhật.',
    specs: {
      'Màn hình': '6.7 inch LTPO OLED',
      'Chip': 'Google Tensor G3',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '50MP + 48MP + 48MP',
      'Camera selfie': '10.5MP',
      'Pin': '5050 mAh',
      'Hệ điều hành': 'Android 14',
      'Cập nhật': '7 năm OS và bảo mật',
    },
    variants: [
      { color: 'Đen', storage: '256GB', price: 20990000 },
      { color: 'Be', storage: '512GB', price: 24990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['new'],
  },
  {
    id: 20,
    name: 'Củ sạc Anker 65W GaN 2 cổng',
    slug: 'cu-sac-anker-65w-gan',
    brand: 'Anker',
    category: 'phu-kien',
    price: 490000,
    originalPrice: 690000,
    discount: 29,
    rating: 4.7,
    reviewCount: 1560,
    image: 'https://placehold.co/400x400/2c3e50/ffffff?text=Anker+65W+GaN',
    images: [
      'https://placehold.co/600x600/2c3e50/ffffff?text=Anker+65W+GaN+Charger',
    ],
    description: 'Củ sạc Anker 65W GaN 2 cổng USB-C, nhỏ gọn, hỗ trợ sạc nhanh cho laptop, điện thoại.',
    specs: {
      'Công suất tối đa': '65W',
      'Cổng': '2x USB-C',
      'Công nghệ': 'GaN II',
      'Kích thước': '45 × 45 × 32 mm',
    },
    variants: [
      { color: 'Đen', storage: '', price: 490000 },
      { color: 'Trắng', storage: '', price: 490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
];

// Helper functions
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

function getProductsByCategory(categoryId, filters = {}) {
  let result = products.filter(p => p.category === categoryId);

  if (filters.brand && filters.brand.length > 0) {
    result = result.filter(p => filters.brand.includes(p.brand));
  }

  if (filters.minPrice !== undefined) {
    result = result.filter(p => p.price >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter(p => p.price <= filters.maxPrice);
  }

  if (filters.sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'popular') {
    result.sort((a, b) => b.reviewCount - a.reviewCount);
  } else if (filters.sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
}

function searchProducts(keyword) {
  const kw = keyword.toLowerCase().trim();
  if (!kw) return [];
  return products.filter(p =>
    p.name.toLowerCase().includes(kw) ||
    p.brand.toLowerCase().includes(kw) ||
    p.description.toLowerCase().includes(kw)
  );
}

function getFeaturedProducts() {
  return products.filter(p => p.isFeatured);
}

function getSaleProducts() {
  return products.filter(p => p.isOnSale && p.discount >= 15);
}

function getRelatedProducts(product) {
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
}
