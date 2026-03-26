// =====================
// PRODUCT & CATEGORY DATA
// =====================

const PHONESTORE_API_BASE = window.PHONESTORE_API_BASE
  || localStorage.getItem('phonestore_api_base')
  || 'http://localhost:3000/api';
window.PHONESTORE_API_BASE = PHONESTORE_API_BASE;

let catalogPromise = null;

function getCategoryIcon(value) {
  const key = String(value || '').toLowerCase();
  if (key.includes('dien-thoai')) return '📱';
  if (key.includes('tablet')) return '📟';
  if (key.includes('laptop')) return '💻';
  if (key.includes('am-thanh') || key.includes('mic')) return '🎧';
  if (key.includes('dong-ho')) return '⌚';
  if (key.includes('phu-kien')) return '🎒';
  if (key.includes('pc') || key.includes('man-hinh') || key.includes('may-in')) return '🖥️';
  if (key.includes('tivi')) return '📺';
  return '✨';
}

async function fetchJson(path) {
  const response = await fetch(`${PHONESTORE_API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status}`);
  }
  return response.json();
}

function normalizeCategory(item) {
  const id = item.id || item.slug || '';
  return {
    id,
    name: item.name || item.CategoryName || '',
    icon: item.icon || getCategoryIcon(id || item.name),
    count: Number(item.count ?? item.ProductCount ?? 0),
    description: item.description || item.Description || '',
  };
}

function normalizeVariant(variant = {}) {
  return {
    id: variant.id || variant.VariantID || 0,
    color: variant.color || variant.Color || '',
    storage: variant.storage || variant.Storage || '',
    price: Number(variant.price ?? variant.Price ?? 0),
    originalPrice: variant.originalPrice ? Number(variant.originalPrice) : Number(variant.OriginalPrice || 0) || null,
    stock: Number(variant.stock ?? variant.StockQuantity ?? 0),
    sku: variant.sku || variant.SKU || '',
    image: variant.image || variant.ImageURL || '',
  };
}

function normalizeProduct(item) {
  if (!item) return null;
  const variants = (item.variants || item.Variants || []).map(normalizeVariant);
  const images = item.images || item.Images || variants.map(v => v.image).filter(Boolean);
  const price = Number(item.price ?? item.Price ?? (variants[0]?.price || 0));
  const originalPrice = Number(item.originalPrice ?? item.OriginalPrice ?? (variants[0]?.originalPrice || price));
  const discount = Number(item.discount ?? item.Discount ?? (originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0));

  return {
    id: Number(item.id ?? item.ProductID),
    name: item.name || item.ProductName || '',
    slug: item.slug || item.Slug || '',
    brand: item.brand || item.BrandName || '',
    category: item.category || item.CategorySlug || '',
    categoryName: item.categoryName || item.CategoryName || '',
    description: item.description || item.FullDescription || item.ShortDescription || '',
    specs: item.specs || item.Specifications || {},
    warranty: item.warranty || item.Warranty || '',
    rating: Number(item.rating ?? item.AvgRating ?? 4.6),
    reviewCount: Number(item.reviewCount ?? item.ReviewCount ?? 0),
    price,
    originalPrice: originalPrice < price ? price : originalPrice,
    discount,
    image: item.image || images[0] || '',
    images,
    variants,
    isFeatured: Boolean(item.isFeatured),
    isOnSale: Boolean(item.isOnSale ?? discount > 0),
    isHot: Boolean(item.isHot ?? discount >= 15),
    tags: item.tags || [],
  };
}

async function loadCatalog() {
  if (catalogPromise) return catalogPromise;

  catalogPromise = (async () => {
    try {
      const [categoryData, brandData, productData] = await Promise.all([
        fetchJson('/categories'),
        fetchJson('/brands'),
        fetchJson('/products'),
      ]);

      categories = categoryData.map(normalizeCategory);
      brands = brandData.slice();
      products = productData.map(normalizeProduct).filter(Boolean);
    } catch (error) {
      console.warn('Không thể tải dữ liệu từ API, sử dụng dữ liệu mặc định.', error);
    }

    return { categories, brands, products };
  })();

  return catalogPromise;
}

let categories = [
  { id: 'dien-thoai', name: 'Điện thoại', icon: '📱', count: 12 },
  { id: 'may-tinh-bang', name: 'Máy tính bảng', icon: '📟', count: 4 },
  { id: 'phu-kien', name: 'Phụ kiện', icon: '🎧', count: 8 },
  { id: 'laptop', name: 'Laptop', icon: '💻', count: 4 },
];

let brands = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'vivo', 'Realme', 'Google', 'Sony', 'Dell', 'ASUS', 'Anker'];

let products = [
  // ===== ĐIỆN THOẠI (SMARTPHONES) =====
  {
    id: 1,
    name: 'iPhone 17 Pro Max 256GB',
    slug: 'iphone-17-pro-max-256gb',
    brand: 'Apple',
    category: 'dien-thoai',
    price: 34990000,
    originalPrice: 39990000,
    discount: 13,
    rating: 4.9,
    reviewCount: 2410,
    image: 'https://placehold.co/400x400/1a1a2e/ffffff?text=iPhone+17+Pro+Max',
    images: [
      'https://placehold.co/600x600/1a1a2e/ffffff?text=iPhone+17+Pro+Max',
      'https://placehold.co/600x600/2d2d44/ffffff?text=Side+View',
      'https://placehold.co/600x600/3d3d5c/ffffff?text=Back+View',
    ],
    description: 'iPhone 17 Pro Max – siêu phẩm flagship 2025 với chip A19 Pro vượt trội, màn hình ProMotion OLED 6.9 inch sắc nét tuyệt vời. Hệ thống camera 3 ống kính 48MP chụp ảnh sắc nét trong mọi điều kiện ánh sáng, sạc nhanh 40W và cổng USB-C 3.2 tốc độ cao.',
    specs: {
      'Màn hình': '6.9 inch ProMotion OLED 120Hz',
      'Chip': 'Apple A19 Pro',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '48MP Fusion + 48MP Telephoto 5x + 48MP Ultra Wide',
      'Camera selfie': '24MP TrueDepth',
      'Pin': '4685 mAh',
      'Sạc': '40W có dây • 20W MagSafe',
      'Cổng': 'USB-C 3.2 Gen 2',
      'Hệ điều hành': 'iOS 19',
      'Khung máy': 'Titanium cấp 5',
    },
    variants: [
      { color: 'Titan Đen', storage: '256GB', price: 34990000 },
      { color: 'Titan Trắng', storage: '256GB', price: 34990000 },
      { color: 'Titan Sa Mạc', storage: '512GB', price: 39990000 },
      { color: 'Titan Tự Nhiên', storage: '1TB', price: 44990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot', 'new'],
  },
  {
    id: 2,
    name: 'Samsung Galaxy S25 Ultra 256GB',
    slug: 'samsung-galaxy-s25-ultra-256gb',
    brand: 'Samsung',
    category: 'dien-thoai',
    price: 28990000,
    originalPrice: 33990000,
    discount: 15,
    rating: 4.9,
    reviewCount: 1845,
    image: 'https://placehold.co/400x400/0a3d62/ffffff?text=Galaxy+S25+Ultra',
    images: [
      'https://placehold.co/600x600/0a3d62/ffffff?text=Galaxy+S25+Ultra',
      'https://placehold.co/600x600/1a5276/ffffff?text=Side+View',
      'https://placehold.co/600x600/2e86c1/ffffff?text=Back+View',
    ],
    description: 'Samsung Galaxy S25 Ultra – flagship AI hàng đầu 2025 với chip Snapdragon 8 Elite, camera 200MP, S Pen tích hợp và màn hình Dynamic AMOLED 2X 6.9 inch. Galaxy AI mạnh mẽ hỗ trợ mọi tác vụ sáng tạo.',
    specs: {
      'Màn hình': '6.9 inch Dynamic AMOLED 2X 120Hz',
      'Chip': 'Snapdragon 8 Elite for Galaxy',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '200MP + 50MP Tele 5x + 10MP Tele 3x + 12MP Ultra Wide',
      'Camera selfie': '12MP',
      'Pin': '5000 mAh',
      'Sạc': '45W có dây • 15W không dây',
      'Hệ điều hành': 'Android 15 • One UI 7',
      'Đặc biệt': 'S Pen tích hợp • Galaxy AI',
    },
    variants: [
      { color: 'Titan Đen', storage: '256GB', price: 28990000 },
      { color: 'Titan Bạc', storage: '512GB', price: 33990000 },
      { color: 'Titan Xanh', storage: '1TB', price: 38990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot', 'new'],
  },
  {
    id: 3,
    name: 'Xiaomi 15 Ultra 512GB',
    slug: 'xiaomi-15-ultra-512gb',
    brand: 'Xiaomi',
    category: 'dien-thoai',
    price: 24990000,
    originalPrice: 28990000,
    discount: 14,
    rating: 4.8,
    reviewCount: 678,
    image: 'https://placehold.co/400x400/1c1c1c/ffffff?text=Xiaomi+15+Ultra',
    images: [
      'https://placehold.co/600x600/1c1c1c/ffffff?text=Xiaomi+15+Ultra',
      'https://placehold.co/600x600/2c2c2c/ffffff?text=Side+View',
      'https://placehold.co/600x600/3c3c3c/ffffff?text=Back+View',
    ],
    description: 'Xiaomi 15 Ultra – quái vật nhiếp ảnh Leica 2025 với camera quad 50MP, chip Snapdragon 8 Elite, màn hình LTPO AMOLED 6.73 inch và sạc nhanh 90W siêu tốc. Hệ thống ống kính Leica Summilux cho ảnh đẹp ngang máy ảnh DSLR.',
    specs: {
      'Màn hình': '6.73 inch LTPO AMOLED 120Hz',
      'Chip': 'Snapdragon 8 Elite',
      'RAM': '16GB LPDDR5X',
      'Bộ nhớ': '512GB UFS 4.0',
      'Camera chính': '50MP Leica Summilux 1" + 50MP Tele 5x + 50MP Tele 3x + 50MP Ultra Wide',
      'Camera selfie': '32MP',
      'Pin': '5410 mAh',
      'Sạc': '90W có dây • 50W không dây',
      'Hệ điều hành': 'Android 15 • HyperOS 2',
    },
    variants: [
      { color: 'Trắng', storage: '256GB', price: 21990000 },
      { color: 'Đen', storage: '512GB', price: 24990000 },
      { color: 'Titan', storage: '1TB', price: 28990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
  },
  {
    id: 4,
    name: 'OPPO Find X8 Ultra 256GB',
    slug: 'oppo-find-x8-ultra-256gb',
    brand: 'OPPO',
    category: 'dien-thoai',
    price: 22990000,
    originalPrice: 26990000,
    discount: 15,
    rating: 4.7,
    reviewCount: 512,
    image: 'https://placehold.co/400x400/2c3e50/ffffff?text=OPPO+Find+X8+Ultra',
    images: [
      'https://placehold.co/600x600/2c3e50/ffffff?text=OPPO+Find+X8+Ultra',
      'https://placehold.co/600x600/3d5166/ffffff?text=Side+View',
    ],
    description: 'OPPO Find X8 Ultra – tuyệt tác nhiếp ảnh Hasselblad với cảm biến Periscope Telephoto 6x, chip Snapdragon 8 Elite, màn hình LTPO4 AMOLED 6.82 inch và pin 5910mAh sạc nhanh 100W.',
    specs: {
      'Màn hình': '6.82 inch LTPO4 AMOLED 120Hz',
      'Chip': 'Snapdragon 8 Elite',
      'RAM': '16GB LPDDR5X',
      'Bộ nhớ': '256GB UFS 4.0',
      'Camera chính': '50MP Hasselblad 1" + 50MP Periscope 6x + 50MP Ultra Wide',
      'Camera selfie': '32MP',
      'Pin': '5910 mAh',
      'Sạc': '100W SuperVOOC • 50W AIRVOOC',
      'Hệ điều hành': 'Android 15 • ColorOS 15',
      'Đặc biệt': 'Hasselblad Natural Colour Calibration',
    },
    variants: [
      { color: 'Đen Vũ Trụ', storage: '256GB', price: 22990000 },
      { color: 'Trắng Sứ', storage: '512GB', price: 26990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
  },
  {
    id: 5,
    name: 'iPhone 17 128GB',
    slug: 'iphone-17-128gb',
    brand: 'Apple',
    category: 'dien-thoai',
    price: 22990000,
    originalPrice: 25990000,
    discount: 12,
    rating: 4.8,
    reviewCount: 3120,
    image: 'https://placehold.co/400x400/d4c5b0/333333?text=iPhone+17',
    images: [
      'https://placehold.co/600x600/d4c5b0/333333?text=iPhone+17',
      'https://placehold.co/600x600/e8d8c0/333333?text=Side+View',
    ],
    description: 'iPhone 17 – thiết kế mỏng nhất trong lịch sử Apple với màn hình OLED 6.3 inch sắc nét, chip A18, camera 48MP cải tiến và lớp vỏ nhôm hợp kim mới. Dynamic Island thế hệ mới thông minh hơn.',
    specs: {
      'Màn hình': '6.3 inch Super Retina XDR OLED 60Hz',
      'Chip': 'Apple A18',
      'RAM': '8GB',
      'Bộ nhớ': '128GB',
      'Camera chính': '48MP Fusion + 12MP Ultra Wide',
      'Camera selfie': '12MP TrueDepth',
      'Pin': '3850 mAh',
      'Sạc': '20W có dây • 15W MagSafe',
      'Hệ điều hành': 'iOS 19',
    },
    variants: [
      { color: 'Hồng', storage: '128GB', price: 22990000 },
      { color: 'Vàng Kem', storage: '128GB', price: 22990000 },
      { color: 'Xanh Bạc Hà', storage: '256GB', price: 25990000 },
      { color: 'Đen', storage: '512GB', price: 31990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot', 'new'],
  },
  {
    id: 6,
    name: 'Samsung Galaxy S25+ 256GB',
    slug: 'samsung-galaxy-s25-plus-256gb',
    brand: 'Samsung',
    category: 'dien-thoai',
    price: 23990000,
    originalPrice: 27990000,
    discount: 14,
    rating: 4.8,
    reviewCount: 987,
    image: 'https://placehold.co/400x400/1a3a5c/ffffff?text=Galaxy+S25+Plus',
    images: [
      'https://placehold.co/600x600/1a3a5c/ffffff?text=Galaxy+S25+Plus',
      'https://placehold.co/600x600/2a4a6c/ffffff?text=Side+View',
    ],
    description: 'Samsung Galaxy S25+ – hiệu năng flagship với màn hình Dynamic AMOLED 2X 6.7 inch, chip Snapdragon 8 Elite, pin 4900mAh và Galaxy AI thế hệ mới. Thiết kế mỏng nhẹ, khung titan sang trọng.',
    specs: {
      'Màn hình': '6.7 inch Dynamic AMOLED 2X 120Hz',
      'Chip': 'Snapdragon 8 Elite for Galaxy',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '50MP + 10MP Tele 3x + 12MP Ultra Wide',
      'Camera selfie': '12MP',
      'Pin': '4900 mAh',
      'Sạc': '45W có dây • 15W không dây',
      'Hệ điều hành': 'Android 15 • One UI 7',
    },
    variants: [
      { color: 'Titan Đen', storage: '256GB', price: 23990000 },
      { color: 'Titan Bạc', storage: '512GB', price: 27990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
  },
  {
    id: 7,
    name: 'iPhone 16e 128GB',
    slug: 'iphone-16e-128gb',
    brand: 'Apple',
    category: 'dien-thoai',
    price: 16990000,
    originalPrice: 19990000,
    discount: 15,
    rating: 4.6,
    reviewCount: 1540,
    image: 'https://placehold.co/400x400/f0e6d3/333333?text=iPhone+16e',
    images: [
      'https://placehold.co/600x600/f0e6d3/333333?text=iPhone+16e',
      'https://placehold.co/600x600/e0d5c3/333333?text=Side+View',
    ],
    description: 'iPhone 16e – lựa chọn phổ thông của Apple 2025 với chip A16 Bionic, màn hình OLED 6.1 inch, camera 48MP sắc nét và Face ID bảo mật. Hỗ trợ Apple Intelligence và MagSafe.',
    specs: {
      'Màn hình': '6.1 inch Super Retina XDR OLED',
      'Chip': 'Apple A16 Bionic',
      'RAM': '6GB',
      'Bộ nhớ': '128GB',
      'Camera chính': '48MP Fusion',
      'Camera selfie': '12MP TrueDepth + Face ID',
      'Pin': '3961 mAh',
      'Sạc': '20W có dây • 15W MagSafe',
      'Hệ điều hành': 'iOS 18',
    },
    variants: [
      { color: 'Đen', storage: '128GB', price: 16990000 },
      { color: 'Trắng', storage: '128GB', price: 16990000 },
      { color: 'Xanh', storage: '256GB', price: 19990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot', 'new'],
  },
  {
    id: 8,
    name: 'Samsung Galaxy A56 5G 128GB',
    slug: 'samsung-galaxy-a56-5g-128gb',
    brand: 'Samsung',
    category: 'dien-thoai',
    price: 9990000,
    originalPrice: 11990000,
    discount: 17,
    rating: 4.5,
    reviewCount: 823,
    image: 'https://placehold.co/400x400/4a90d9/ffffff?text=Galaxy+A56+5G',
    images: [
      'https://placehold.co/600x600/4a90d9/ffffff?text=Galaxy+A56+5G',
      'https://placehold.co/600x600/5aa0e9/ffffff?text=Side+View',
    ],
    description: 'Samsung Galaxy A56 5G – tầm trung cao cấp 2025 với màn hình Super AMOLED 6.7 inch 120Hz, chip Exynos 1580, camera 50MP và pin 5000mAh sạc nhanh 45W.',
    specs: {
      'Màn hình': '6.7 inch Super AMOLED 120Hz',
      'Chip': 'Exynos 1580',
      'RAM': '8GB',
      'Bộ nhớ': '128GB',
      'Camera chính': '50MP + 12MP Ultra Wide + 5MP Macro',
      'Camera selfie': '32MP',
      'Pin': '5000 mAh',
      'Sạc': '45W SuperFast',
      'Hệ điều hành': 'Android 15 • One UI 7',
      'Cập nhật': '4 năm OS và 5 năm bảo mật',
    },
    variants: [
      { color: 'Xanh Dương', storage: '128GB', price: 9990000 },
      { color: 'Tím Pastel', storage: '256GB', price: 11490000 },
      { color: 'Đen Bóng', storage: '256GB', price: 11490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
  },
  {
    id: 9,
    name: 'Xiaomi Redmi Note 14 Pro 256GB',
    slug: 'xiaomi-redmi-note-14-pro-256gb',
    brand: 'Xiaomi',
    category: 'dien-thoai',
    price: 7490000,
    originalPrice: 8990000,
    discount: 17,
    rating: 4.5,
    reviewCount: 1980,
    image: 'https://placehold.co/400x400/27ae60/ffffff?text=Redmi+Note+14+Pro',
    images: [
      'https://placehold.co/600x600/27ae60/ffffff?text=Redmi+Note+14+Pro',
      'https://placehold.co/600x600/2ecc71/ffffff?text=Side+View',
    ],
    description: 'Xiaomi Redmi Note 14 Pro – tầm trung bùng nổ 2025 với camera 200MP Leica, màn hình AMOLED 6.67 inch 120Hz, chip Snapdragon 7s Gen 3 và sạc nhanh 90W.',
    specs: {
      'Màn hình': '6.67 inch AMOLED 120Hz',
      'Chip': 'Snapdragon 7s Gen 3',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '200MP OIS + 8MP Ultra Wide + 2MP Macro',
      'Camera selfie': '16MP',
      'Pin': '5110 mAh',
      'Sạc': '90W Turbo',
      'Hệ điều hành': 'Android 15 • HyperOS 2',
    },
    variants: [
      { color: 'Đen', storage: '128GB', price: 5990000 },
      { color: 'Xanh', storage: '256GB', price: 7490000 },
      { color: 'Tím', storage: '512GB', price: 9490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 10,
    name: 'vivo V50 5G 256GB',
    slug: 'vivo-v50-5g-256gb',
    brand: 'vivo',
    category: 'dien-thoai',
    price: 8990000,
    originalPrice: 10490000,
    discount: 14,
    rating: 4.4,
    reviewCount: 567,
    image: 'https://placehold.co/400x400/8e44ad/ffffff?text=vivo+V50+5G',
    images: [
      'https://placehold.co/600x600/8e44ad/ffffff?text=vivo+V50+5G',
      'https://placehold.co/600x600/9b59b6/ffffff?text=Side+View',
    ],
    description: 'vivo V50 5G – chuyên gia selfie 2025 với camera trước 50MP ZEISS, màn hình LTPO AMOLED 6.67 inch 120Hz, chip Snapdragon 7 Gen 3 và pin 6000mAh sạc nhanh 90W.',
    specs: {
      'Màn hình': '6.67 inch LTPO AMOLED 120Hz',
      'Chip': 'Snapdragon 7 Gen 3',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '50MP ZEISS OIS + 50MP ZEISS Tele',
      'Camera selfie': '50MP ZEISS',
      'Pin': '6000 mAh',
      'Sạc': '90W FlashCharge',
      'Hệ điều hành': 'Android 15 • Funtouch OS 15',
      'Đặc biệt': 'ZEISS Optics • IP68',
    },
    variants: [
      { color: 'Tím Ánh Ngân', storage: '256GB', price: 8990000 },
      { color: 'Vàng Champagne', storage: '256GB', price: 8990000 },
      { color: 'Xanh Đại Dương', storage: '512GB', price: 10490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['new'],
  },
  {
    id: 11,
    name: 'Realme 14 Pro+ 5G 256GB',
    slug: 'realme-14-pro-plus-256gb',
    brand: 'Realme',
    category: 'dien-thoai',
    price: 9490000,
    originalPrice: 11490000,
    discount: 17,
    rating: 4.4,
    reviewCount: 743,
    image: 'https://placehold.co/400x400/e74c3c/ffffff?text=Realme+14+Pro+Plus',
    images: [
      'https://placehold.co/600x600/e74c3c/ffffff?text=Realme+14+Pro+Plus',
      'https://placehold.co/600x600/c0392b/ffffff?text=Side+View',
    ],
    description: 'Realme 14 Pro+ 5G – flagship tầm trung 2025 với màn hình OLED 6.83 inch 120Hz đổi màu theo nhiệt độ độc đáo, chip Snapdragon 7s Gen 3, camera 50MP Sony IMX882 và pin 6000mAh.',
    specs: {
      'Màn hình': '6.83 inch OLED 120Hz (đổi màu theo nhiệt độ)',
      'Chip': 'Snapdragon 7s Gen 3',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '50MP Sony IMX882 OIS + 8MP Ultra Wide + 2MP Macro',
      'Camera selfie': '16MP',
      'Pin': '6000 mAh',
      'Sạc': '80W SUPERVOOC',
      'Hệ điều hành': 'Android 15 • Realme UI 6',
      'Đặc biệt': 'IP65 • Lưng đổi màu độc đáo',
    },
    variants: [
      { color: 'Xanh Ngọc', storage: '256GB', price: 9490000 },
      { color: 'Đen', storage: '256GB', price: 9490000 },
      { color: 'Trắng Ngọc Trai', storage: '512GB', price: 11490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
  },
  {
    id: 12,
    name: 'Google Pixel 9 Pro 256GB',
    slug: 'google-pixel-9-pro-256gb',
    brand: 'Google',
    category: 'dien-thoai',
    price: 22990000,
    originalPrice: 26990000,
    discount: 15,
    rating: 4.7,
    reviewCount: 412,
    image: 'https://placehold.co/400x400/4285f4/ffffff?text=Pixel+9+Pro',
    images: [
      'https://placehold.co/600x600/4285f4/ffffff?text=Google+Pixel+9+Pro',
      'https://placehold.co/600x600/3275e4/ffffff?text=Side+View',
    ],
    description: 'Google Pixel 9 Pro – AI smartphone mạnh nhất 2025 với chip Tensor G4, camera 50MP triple với Magic Eraser thế hệ mới, màn hình LTPO OLED 6.3 inch và 7 năm cập nhật hệ điều hành.',
    specs: {
      'Màn hình': '6.3 inch LTPO OLED 120Hz',
      'Chip': 'Google Tensor G4',
      'RAM': '16GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '50MP OIS + 48MP Tele 5x + 48MP Ultra Wide',
      'Camera selfie': '10.5MP',
      'Pin': '4700 mAh',
      'Sạc': '37W có dây • 23W không dây',
      'Hệ điều hành': 'Android 15',
      'Cập nhật': '7 năm OS và bảo mật',
      'Đặc biệt': 'Google AI • Gemini tích hợp • IP68',
    },
    variants: [
      { color: 'Obsidian', storage: '256GB', price: 22990000 },
      { color: 'Porcelain', storage: '512GB', price: 26990000 },
      { color: 'Hazel', storage: '1TB', price: 31990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['new'],
  },
  // ===== MÁY TÍNH BẢNG (TABLETS) =====
  {
    id: 13,
    name: 'iPad Pro M4 11 inch WiFi 256GB',
    slug: 'ipad-pro-m4-11-inch-256gb',
    brand: 'Apple',
    category: 'may-tinh-bang',
    price: 22990000,
    originalPrice: 25990000,
    discount: 12,
    rating: 4.9,
    reviewCount: 634,
    image: 'https://placehold.co/400x400/e8e8e8/333333?text=iPad+Pro+M4',
    images: [
      'https://placehold.co/600x600/e8e8e8/333333?text=iPad+Pro+M4',
      'https://placehold.co/600x600/d8d8d8/333333?text=Side+View',
      'https://placehold.co/600x600/c8c8c8/333333?text=Back+View',
    ],
    description: 'iPad Pro M4 – máy tính bảng mạnh nhất thế giới với chip M4, màn hình OLED Ultra Retina XDR 11 inch siêu sắc nét, thiết kế mỏng kỷ lục 5.1mm. Hỗ trợ Apple Pencil Pro và Magic Keyboard.',
    specs: {
      'Màn hình': '11 inch Ultra Retina XDR OLED (Tandem OLED)',
      'Chip': 'Apple M4',
      'RAM': '8GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '12MP Wide',
      'Camera selfie': '12MP TrueDepth Ultra Wide',
      'Pin': 'Lên đến 10 giờ',
      'Kết nối': 'WiFi 6E • Bluetooth 5.3 • USB-C 4 (Thunderbolt 4)',
      'Hệ điều hành': 'iPadOS 18',
      'Đặc biệt': 'Face ID • Apple Pencil Pro • Magic Keyboard',
    },
    variants: [
      { color: 'Bạc', storage: '256GB', price: 22990000 },
      { color: 'Đen Không Gian', storage: '512GB', price: 27990000 },
      { color: 'Bạc', storage: '1TB', price: 34990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['new', 'hot'],
  },
  {
    id: 14,
    name: 'iPad Air M3 13 inch WiFi 256GB',
    slug: 'ipad-air-m3-13-inch-256gb',
    brand: 'Apple',
    category: 'may-tinh-bang',
    price: 19990000,
    originalPrice: 22990000,
    discount: 13,
    rating: 4.8,
    reviewCount: 387,
    image: 'https://placehold.co/400x400/b8d4e8/333333?text=iPad+Air+M3',
    images: [
      'https://placehold.co/600x600/b8d4e8/333333?text=iPad+Air+M3',
      'https://placehold.co/600x600/a8c4d8/333333?text=Side+View',
    ],
    description: 'iPad Air M3 13 inch – sức mạnh chuyên nghiệp, giá tầm trung với chip M3, màn hình Liquid Retina 13 inch rộng lớn sắc nét và khung nhôm tái chế. Hiệu năng vượt trội cho sáng tạo nội dung.',
    specs: {
      'Màn hình': '13 inch Liquid Retina',
      'Chip': 'Apple M3',
      'RAM': '8GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '12MP Wide',
      'Camera selfie': '12MP Ultra Wide (nằm ngang)',
      'Pin': 'Lên đến 10 giờ',
      'Kết nối': 'WiFi 6E • Bluetooth 5.3 • USB-C (USB 3)',
      'Hệ điều hành': 'iPadOS 18',
      'Màu sắc': 'Xanh, Tím, Vàng Ánh Sao, Xám Không Gian',
    },
    variants: [
      { color: 'Xanh', storage: '256GB', price: 19990000 },
      { color: 'Tím', storage: '256GB', price: 19990000 },
      { color: 'Vàng Ánh Sao', storage: '512GB', price: 24990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['new'],
  },
  {
    id: 15,
    name: 'Samsung Galaxy Tab S10+ 256GB',
    slug: 'samsung-galaxy-tab-s10-plus-256gb',
    brand: 'Samsung',
    category: 'may-tinh-bang',
    price: 17990000,
    originalPrice: 21990000,
    discount: 18,
    rating: 4.7,
    reviewCount: 298,
    image: 'https://placehold.co/400x400/2c3e50/ffffff?text=Tab+S10+Plus',
    images: [
      'https://placehold.co/600x600/2c3e50/ffffff?text=Galaxy+Tab+S10+Plus',
      'https://placehold.co/600x600/3d5166/ffffff?text=Side+View',
    ],
    description: 'Samsung Galaxy Tab S10+ – máy tính bảng Android cao cấp 2025 với màn hình Dynamic AMOLED 2X 12.4 inch, chip Snapdragon 8 Gen 3, Galaxy AI và S Pen đi kèm. Hiệu năng mạnh mẽ cho công việc và giải trí.',
    specs: {
      'Màn hình': '12.4 inch Dynamic AMOLED 2X 120Hz',
      'Chip': 'Snapdragon 8 Gen 3 for Galaxy',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera chính': '13MP + 8MP Ultra Wide',
      'Camera selfie': '12MP',
      'Pin': '10090 mAh',
      'Sạc': '45W SuperFast',
      'Hệ điều hành': 'Android 14 • One UI 6.1',
      'Đặc biệt': 'S Pen đi kèm • DeX Mode • IP68',
    },
    variants: [
      { color: 'Bạc Ánh Trăng', storage: '256GB', price: 17990000 },
      { color: 'Xám Than', storage: '512GB', price: 21990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 16,
    name: 'Samsung Galaxy Tab S10 FE 128GB',
    slug: 'samsung-galaxy-tab-s10-fe-128gb',
    brand: 'Samsung',
    category: 'may-tinh-bang',
    price: 9490000,
    originalPrice: 11990000,
    discount: 21,
    rating: 4.5,
    reviewCount: 312,
    image: 'https://placehold.co/400x400/1e8bc3/ffffff?text=Tab+S10+FE',
    images: [
      'https://placehold.co/600x600/1e8bc3/ffffff?text=Galaxy+Tab+S10+FE',
      'https://placehold.co/600x600/2e9bd3/ffffff?text=Side+View',
    ],
    description: 'Samsung Galaxy Tab S10 FE – tablet tầm trung tốt nhất 2025 với màn hình PLS LCD 10.9 inch, chip Exynos 1580, S Pen đi kèm và pin 10090mAh. Giải pháp hoàn hảo cho học tập và làm việc.',
    specs: {
      'Màn hình': '10.9 inch PLS LCD 90Hz',
      'Chip': 'Exynos 1580',
      'RAM': '8GB',
      'Bộ nhớ': '128GB',
      'Camera chính': '8MP',
      'Camera selfie': '10MP',
      'Pin': '10090 mAh',
      'Sạc': '45W SuperFast',
      'Hệ điều hành': 'Android 15 • One UI 7',
      'Đặc biệt': 'S Pen đi kèm • IP68',
    },
    variants: [
      { color: 'Xanh Bạc Hà', storage: '128GB', price: 9490000 },
      { color: 'Xám Graphite', storage: '256GB', price: 11490000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
  },
  // ===== PHỤ KIỆN (ACCESSORIES) =====
  {
    id: 17,
    name: 'AirPods 4 (Chống ồn chủ động)',
    slug: 'airpods-4-anc',
    brand: 'Apple',
    category: 'phu-kien',
    price: 3490000,
    originalPrice: 4490000,
    discount: 22,
    rating: 4.8,
    reviewCount: 2870,
    image: 'https://placehold.co/400x400/f5f5f5/333333?text=AirPods+4+ANC',
    images: [
      'https://placehold.co/600x600/f5f5f5/333333?text=AirPods+4+ANC',
      'https://placehold.co/600x600/e8e8e8/333333?text=Side+View',
    ],
    description: 'AirPods 4 với chống ồn chủ động (ANC) – tai nghe không dây mở tai cao cấp nhất Apple 2024 với chip H2, thiết kế mới thoải mái hơn, âm thanh Spatial Audio và hộp sạc MagSafe tích hợp loa.',
    specs: {
      'Chip': 'Apple H2',
      'Chống ồn': 'ANC chủ động (Active Noise Cancellation)',
      'Thiết kế': 'Open-ear (hở tai)',
      'Thời lượng pin tai': '5 giờ (ANC bật) / 6 giờ (ANC tắt)',
      'Thời lượng pin hộp': '30 giờ',
      'Sạc': 'USB-C • MagSafe',
      'Kết nối': 'Bluetooth 5.3',
      'Kháng nước': 'IP54',
      'Đặc biệt': 'Spatial Audio • Voice Isolation',
    },
    variants: [
      { color: 'Trắng', storage: '', price: 3490000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot', 'sale', 'new'],
  },
  {
    id: 18,
    name: 'Ốp lưng iPhone 17 Pro Max MagSafe chính hãng',
    slug: 'op-lung-iphone-17-pro-max-magsafe',
    brand: 'Apple',
    category: 'phu-kien',
    price: 890000,
    originalPrice: 1190000,
    discount: 25,
    rating: 4.5,
    reviewCount: 234,
    image: 'https://placehold.co/400x400/222f3e/ffffff?text=iPhone+17+Case',
    images: [
      'https://placehold.co/600x600/222f3e/ffffff?text=iPhone+17+Pro+Max+Case',
    ],
    description: 'Ốp lưng chính hãng Apple cho iPhone 17 Pro Max với tích hợp MagSafe mạnh hơn, chất liệu FineWoven cao cấp thân thiện môi trường, thiết kế ôm sát bảo vệ hoàn hảo.',
    specs: {
      'Tương thích': 'iPhone 17 Pro Max',
      'Chất liệu': 'FineWoven (vi sợi cao cấp)',
      'Tính năng': 'MagSafe tích hợp',
      'Màu sắc': 'Đen, Trắng Xanh, Xanh Đại Dương, Tím',
      'Độ dày': '1.0 mm',
    },
    variants: [
      { color: 'Đen', storage: '', price: 890000 },
      { color: 'Trắng Xanh', storage: '', price: 890000 },
      { color: 'Xanh Đại Dương', storage: '', price: 890000 },
      { color: 'Tím', storage: '', price: 890000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
  },
  {
    id: 19,
    name: 'Cáp sạc USB-C 2m chính hãng Apple',
    slug: 'cap-sac-usb-c-apple-2m',
    brand: 'Apple',
    category: 'phu-kien',
    price: 690000,
    originalPrice: 890000,
    discount: 22,
    rating: 4.7,
    reviewCount: 1240,
    image: 'https://placehold.co/400x400/bdc3c7/333333?text=USB-C+Cable+2m',
    images: [
      'https://placehold.co/600x600/bdc3c7/333333?text=Apple+USB-C+Cable+2m',
    ],
    description: 'Cáp USB-C 2m chính hãng Apple, hỗ trợ sạc nhanh 240W và truyền dữ liệu USB 3 tốc độ 40Gb/s. Đầu dây bện chắc chắn, bền bỉ theo thời gian.',
    specs: {
      'Độ dài': '2 mét',
      'Kết nối': 'USB-C to USB-C',
      'Sạc nhanh': 'Hỗ trợ 240W',
      'Truyền dữ liệu': 'USB 3 (40Gb/s)',
      'Chất liệu': 'Dây bện tressbraid',
    },
    variants: [
      { color: 'Trắng', storage: '', price: 690000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: [],
  },
  {
    id: 20,
    name: 'Pin dự phòng Xiaomi 50W 25000mAh',
    slug: 'pin-du-phong-xiaomi-50w-25000mah',
    brand: 'Xiaomi',
    category: 'phu-kien',
    price: 690000,
    originalPrice: 890000,
    discount: 22,
    rating: 4.6,
    reviewCount: 3410,
    image: 'https://placehold.co/400x400/ecf0f1/333333?text=Xiaomi+Power+Bank+50W',
    images: [
      'https://placehold.co/600x600/ecf0f1/333333?text=Xiaomi+Power+Bank+50W+25000',
    ],
    description: 'Pin dự phòng Xiaomi 25000mAh 50W – sạc nhanh 50W, 3 cổng (2 USB-C + 1 USB-A), hiển thị phần trăm pin LED, sạc đồng thời nhiều thiết bị kể cả laptop.',
    specs: {
      'Dung lượng': '25000 mAh',
      'Sạc vào': 'USB-C 50W',
      'Sạc ra': 'USB-C 50W, USB-A 22.5W, USB-C 20W',
      'Số cổng': '3 cổng (2 USB-C + 1 USB-A)',
      'Hiển thị': 'LED số phần trăm',
      'Kích thước': '165 × 75 × 28 mm',
      'Trọng lượng': '490g',
    },
    variants: [
      { color: 'Trắng', storage: '', price: 690000 },
      { color: 'Đen', storage: '', price: 690000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 21,
    name: 'Samsung Galaxy Buds3 Pro',
    slug: 'samsung-galaxy-buds3-pro',
    brand: 'Samsung',
    category: 'phu-kien',
    price: 3990000,
    originalPrice: 4990000,
    discount: 20,
    rating: 4.7,
    reviewCount: 678,
    image: 'https://placehold.co/400x400/2c3e50/ffffff?text=Galaxy+Buds3+Pro',
    images: [
      'https://placehold.co/600x600/2c3e50/ffffff?text=Samsung+Galaxy+Buds3+Pro',
    ],
    description: 'Samsung Galaxy Buds3 Pro – tai nghe true wireless cao cấp 2024 với thiết kế trong tai mới, chống ồn ANC thông minh, âm thanh Hi-Fi 24bit và kết nối Bluetooth 5.4.',
    specs: {
      'Chip': 'Samsung Seamless Codec',
      'Chống ồn': 'ANC thông minh đa lớp',
      'Thời lượng pin tai': '6 giờ (ANC bật)',
      'Thời lượng pin hộp': '30 giờ',
      'Sạc': 'USB-C • Không dây',
      'Kết nối': 'Bluetooth 5.4',
      'Kháng nước': 'IPX4',
      'Đặc biệt': 'Hi-Fi 24bit/96kHz • Auto Switch',
    },
    variants: [
      { color: 'Bạc', storage: '', price: 3990000 },
      { color: 'Đen', storage: '', price: 3990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['new'],
  },
  {
    id: 22,
    name: 'Củ sạc Anker 140W GaN 3 cổng',
    slug: 'cu-sac-anker-140w-gan-3-cong',
    brand: 'Anker',
    category: 'phu-kien',
    price: 890000,
    originalPrice: 1190000,
    discount: 25,
    rating: 4.8,
    reviewCount: 1890,
    image: 'https://placehold.co/400x400/2c3e50/ffffff?text=Anker+140W+GaN',
    images: [
      'https://placehold.co/600x600/2c3e50/ffffff?text=Anker+140W+GaN+Charger',
    ],
    description: 'Củ sạc Anker 140W GaN Prime 3 cổng – công nghệ GaN III thế hệ mới, sạc laptop, điện thoại và tablet cùng lúc. 2 cổng USB-C + 1 USB-A, màn hình LED hiển thị công suất.',
    specs: {
      'Công suất tối đa': '140W',
      'Cổng 1 (USB-C)': '140W (khi dùng 1 cổng)',
      'Cổng 2 (USB-C)': '100W',
      'Cổng 3 (USB-A)': '22.5W',
      'Công nghệ': 'GaN III (Gallium Nitride)',
      'Hiển thị': 'Màn hình LED công suất',
      'Kích thước': '52 × 52 × 38 mm',
    },
    variants: [
      { color: 'Đen', storage: '', price: 890000 },
      { color: 'Trắng', storage: '', price: 890000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  {
    id: 23,
    name: 'Tai nghe Sony WH-1000XM6',
    slug: 'sony-wh-1000xm6',
    brand: 'Sony',
    category: 'phu-kien',
    price: 6990000,
    originalPrice: 8990000,
    discount: 22,
    rating: 4.9,
    reviewCount: 1120,
    image: 'https://placehold.co/400x400/1a1a2e/ffffff?text=Sony+WH-1000XM6',
    images: [
      'https://placehold.co/600x600/1a1a2e/ffffff?text=Sony+WH-1000XM6',
      'https://placehold.co/600x600/2a2a3e/ffffff?text=Side+View',
    ],
    description: 'Sony WH-1000XM6 – tai nghe chụp tai chống ồn đỉnh cao thế giới 2025 với chip QN3 thế hệ mới, 12 microphone, pin 40 giờ, gấp gọn và âm thanh LDAC Hi-Res.',
    specs: {
      'Chip': 'Sony QN3',
      'Chống ồn': 'ANC Industry-leading (12 mic)',
      'Thời lượng pin': '40 giờ (ANC bật)',
      'Sạc nhanh': '10 phút = 5 giờ nghe',
      'Kết nối': 'Bluetooth 5.3 • NFC',
      'Codec': 'LDAC • AAC • SBC',
      'Kháng nước': 'IPX4',
      'Đặc biệt': 'Speak-to-Chat • Auto Pause',
    },
    variants: [
      { color: 'Đen', storage: '', price: 6990000 },
      { color: 'Bạc', storage: '', price: 6990000 },
      { color: 'Nâu Trầm', storage: '', price: 6990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot', 'sale', 'new'],
  },
  {
    id: 24,
    name: 'Kính cường lực iPhone 17 Pro Max Privacy',
    slug: 'kinh-cuong-luc-iphone-17-pro-max',
    brand: 'Apple',
    category: 'phu-kien',
    price: 390000,
    originalPrice: 590000,
    discount: 34,
    rating: 4.4,
    reviewCount: 456,
    image: 'https://placehold.co/400x400/d5d8dc/333333?text=Privacy+Glass',
    images: [
      'https://placehold.co/600x600/d5d8dc/333333?text=iPhone+17+Pro+Max+Privacy+Glass',
    ],
    description: 'Kính cường lực Privacy 2.5D cho iPhone 17 Pro Max, chống nhìn trộm 60°, độ cứng 9H chống trầy xước, chống vân tay, phủ nano siêu kỵ nước, lắp đặt không bong bóng.',
    specs: {
      'Tương thích': 'iPhone 17 Pro Max',
      'Loại': 'Kính cường lực Privacy (chống nhìn trộm)',
      'Độ cứng': '9H',
      'Góc che': '60° (2 bên)',
      'Độ dày': '0.33 mm',
      'Đặc biệt': 'Phủ nano kỵ nước • Chống vân tay',
    },
    variants: [
      { color: 'Trong suốt', storage: '', price: 390000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale'],
  },
  // ===== LAPTOP =====
  {
    id: 25,
    name: 'MacBook Air M4 13 inch 16GB 256GB',
    slug: 'macbook-air-m4-13-inch',
    brand: 'Apple',
    category: 'laptop',
    price: 28990000,
    originalPrice: 32990000,
    discount: 12,
    rating: 4.9,
    reviewCount: 1240,
    image: 'https://placehold.co/400x400/c8c8c8/333333?text=MacBook+Air+M4',
    images: [
      'https://placehold.co/600x600/c8c8c8/333333?text=MacBook+Air+M4',
      'https://placehold.co/600x600/b8b8b8/333333?text=Side+View',
    ],
    description: 'MacBook Air M4 – laptop mỏng nhẹ mạnh mẽ nhất 2025 với chip Apple M4 thế hệ mới, 16GB RAM thống nhất, màn hình Liquid Retina 13.6 inch và pin lên đến 18 giờ. Thiết kế không quạt tản nhiệt hoàn toàn im lặng.',
    specs: {
      'Màn hình': '13.6 inch Liquid Retina 2560×1664',
      'Chip': 'Apple M4 (10 nhân CPU + 10 nhân GPU)',
      'RAM': '16GB Unified Memory',
      'Bộ nhớ': '256GB SSD',
      'Camera': '12MP Center Stage',
      'Pin': '18 giờ',
      'Trọng lượng': '1.24 kg',
      'Cổng': '2x Thunderbolt 4, MagSafe 3, 3.5mm',
      'Hệ điều hành': 'macOS Sequoia',
      'Màu sắc': 'Midnight, Starlight, Sky Blue, Rose',
    },
    variants: [
      { color: 'Midnight', storage: '256GB', price: 28990000 },
      { color: 'Sky Blue', storage: '512GB', price: 33990000 },
      { color: 'Starlight', storage: '1TB', price: 38990000 },
    ],
    isFeatured: true,
    isOnSale: true,
    isHot: true,
    tags: ['hot', 'new'],
  },
  {
    id: 26,
    name: 'MacBook Pro M4 Pro 14 inch 24GB 512GB',
    slug: 'macbook-pro-m4-pro-14-inch',
    brand: 'Apple',
    category: 'laptop',
    price: 49990000,
    originalPrice: 54990000,
    discount: 9,
    rating: 4.9,
    reviewCount: 567,
    image: 'https://placehold.co/400x400/2c2c2c/ffffff?text=MacBook+Pro+M4+Pro',
    images: [
      'https://placehold.co/600x600/2c2c2c/ffffff?text=MacBook+Pro+M4+Pro',
      'https://placehold.co/600x600/3c3c3c/ffffff?text=Side+View',
    ],
    description: 'MacBook Pro M4 Pro 14 inch – công cụ sáng tạo chuyên nghiệp với chip M4 Pro 14 nhân, màn hình Liquid Retina XDR 14.2 inch ProMotion 120Hz, 24GB RAM thống nhất và pin 24 giờ. Lý tưởng cho video editing 4K/8K và lập trình.',
    specs: {
      'Màn hình': '14.2 inch Liquid Retina XDR ProMotion 120Hz',
      'Chip': 'Apple M4 Pro (14 nhân CPU + 20 nhân GPU)',
      'RAM': '24GB Unified Memory',
      'Bộ nhớ': '512GB SSD',
      'Camera': '12MP Center Stage',
      'Pin': '24 giờ',
      'Trọng lượng': '1.62 kg',
      'Cổng': '3x Thunderbolt 5, HDMI, MagSafe 3, SD Card, 3.5mm',
      'Hệ điều hành': 'macOS Sequoia',
      'Màu sắc': 'Space Black, Silver',
    },
    variants: [
      { color: 'Space Black', storage: '512GB', price: 49990000 },
      { color: 'Silver', storage: '1TB', price: 56990000 },
    ],
    isFeatured: true,
    isOnSale: false,
    isHot: false,
    tags: ['new'],
  },
  {
    id: 27,
    name: 'Dell XPS 16 Core Ultra 9 32GB 1TB',
    slug: 'dell-xps-16-core-ultra-9',
    brand: 'Dell',
    category: 'laptop',
    price: 44990000,
    originalPrice: 49990000,
    discount: 10,
    rating: 4.7,
    reviewCount: 289,
    image: 'https://placehold.co/400x400/1a1a2e/ffffff?text=Dell+XPS+16',
    images: [
      'https://placehold.co/600x600/1a1a2e/ffffff?text=Dell+XPS+16',
      'https://placehold.co/600x600/2a2a3e/ffffff?text=Side+View',
    ],
    description: 'Dell XPS 16 – laptop Windows cao cấp nhất 2025 với màn hình OLED 16.3 inch 4K+ 120Hz, chip Intel Core Ultra 9 285H, card NVIDIA RTX 4070 8GB và 32GB RAM DDR5. Thiết kế CNC nhôm nguyên khối sang trọng.',
    specs: {
      'Màn hình': '16.3 inch OLED 4K+ (3840×2400) 120Hz',
      'Chip': 'Intel Core Ultra 9 285H (24 nhân)',
      'RAM': '32GB LPDDR5X',
      'Bộ nhớ': '1TB PCIe Gen 5 SSD',
      'Card đồ họa': 'NVIDIA GeForce RTX 4070 8GB',
      'Pin': '99.5Wh',
      'Trọng lượng': '2.1 kg',
      'Cổng': '2x Thunderbolt 4, USB-C, SD Card, 3.5mm',
      'Hệ điều hành': 'Windows 11 Pro',
    },
    variants: [
      { color: 'Bạc Platinum', storage: '1TB', price: 44990000 },
      { color: 'Bạc Platinum', storage: '2TB', price: 51990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
  },
  {
    id: 28,
    name: 'ASUS ROG Zephyrus G16 RTX 4080 32GB 1TB',
    slug: 'asus-rog-zephyrus-g16-rtx-4080',
    brand: 'ASUS',
    category: 'laptop',
    price: 52990000,
    originalPrice: 59990000,
    discount: 12,
    rating: 4.8,
    reviewCount: 198,
    image: 'https://placehold.co/400x400/1a1a1a/00ff88?text=ROG+Zephyrus+G16',
    images: [
      'https://placehold.co/600x600/1a1a1a/00ff88?text=ASUS+ROG+Zephyrus+G16',
      'https://placehold.co/600x600/0a0a0a/00ff88?text=Side+View',
    ],
    description: 'ASUS ROG Zephyrus G16 – laptop gaming mỏng cao cấp 2025 với màn hình OLED QHD+ 240Hz, chip Intel Core Ultra 9 185H, RTX 4080 Laptop GPU 12GB và thiết kế mỏng chỉ 18.95mm. Sức mạnh gaming đỉnh cao trong vóc dáng mỏng nhẹ.',
    specs: {
      'Màn hình': '16 inch OLED QHD+ (2560×1600) 240Hz',
      'Chip': 'Intel Core Ultra 9 185H (24 nhân)',
      'RAM': '32GB LPDDR5X',
      'Bộ nhớ': '1TB PCIe Gen 4 SSD',
      'Card đồ họa': 'NVIDIA GeForce RTX 4080 Laptop 12GB',
      'Pin': '90Wh',
      'Trọng lượng': '1.95 kg',
      'Cổng': '2x USB-A, 2x USB-C (Thunderbolt 4), HDMI 2.1, SD Card',
      'Hệ điều hành': 'Windows 11 Home',
      'Đặc biệt': 'ROG Intelligent Cooling • MUX Switch',
    },
    variants: [
      { color: 'Eclipse Gray', storage: '1TB', price: 52990000 },
      { color: 'Eclipse Gray', storage: '2TB', price: 59990000 },
    ],
    isFeatured: false,
    isOnSale: true,
    isHot: false,
    tags: ['sale', 'new'],
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
    (p.name || '').toLowerCase().includes(kw) ||
    (p.brand || '').toLowerCase().includes(kw) ||
    (p.description || '').toLowerCase().includes(kw)
  );
}

function getFeaturedProducts() {
  const featured = products.filter(p => p.isFeatured);
  return featured.length ? featured : products.slice(0, 8);
}

function getSaleProducts() {
  return products.filter(p => p.isOnSale && p.discount >= 15);
}

function getRelatedProducts(product) {
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
}
