require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { sql, query } = require('./db');

const app = express();

const defaultOrigins = [
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:3000',
];
const allowedOrigins = (process.env.ALLOWED_ORIGINS || defaultOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: false,
}));
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;
const REQUIRED_DB_ENV = ['DB_SERVER', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

function getMissingEnv() {
  return REQUIRED_DB_ENV.filter((key) => !process.env[key]);
}

function handleError(res, message, error) {
  const payload = { success: false, message };
  if (process.env.NODE_ENV !== 'production' && error) {
    payload.error = error.message;
  }
  return res.status(500).json(payload);
}

function requireDbConfig(req, res, next) {
  const missing = getMissingEnv();
  if (missing.length) {
    return res.status(500).json({
      success: false,
      message: 'Thiếu cấu hình kết nối database.',
      missing,
    });
  }
  return next();
}

function parseSpecifications(specText) {
  if (!specText) return {};
  const parts = String(specText)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.reduce((acc, part, index) => {
    if (part.includes(':')) {
      const [key, ...rest] = part.split(':');
      const value = rest.join(':').trim();
      if (key.trim()) acc[key.trim()] = value || '—';
    } else {
      acc[`Thông tin ${index + 1}`] = part;
    }
    return acc;
  }, {});
}

// Generate a placeholder image URL when the database does not provide assets.
function makePlaceholder(text, size = 400, paletteIndex = 0) {
  const palette = ['1a1a2e', '0a3d62', '2c3e50', '4a90d9', '8e44ad', '27ae60'];
  const color = palette[paletteIndex % palette.length];
  return `https://placehold.co/${size}x${size}/${color}/ffffff?text=${encodeURIComponent(text)}`;
}

function resolveImage(imageUrl, productName, size = 400, index = 0) {
  if (!imageUrl) return makePlaceholder(productName, size, index);
  const trimmed = String(imageUrl).trim();
  if (!trimmed) return makePlaceholder(productName, size, index);
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return makePlaceholder(productName, size, index);
}

function getCategoryIcon(slugOrName) {
  const value = String(slugOrName || '').toLowerCase();
  if (value.includes('dien-thoai')) return '📱';
  if (value.includes('tablet')) return '📟';
  if (value.includes('laptop')) return '💻';
  if (value.includes('am-thanh') || value.includes('mic')) return '🎧';
  if (value.includes('dong-ho')) return '⌚';
  if (value.includes('phu-kien')) return '🎒';
  if (value.includes('pc') || value.includes('man-hinh') || value.includes('may-in')) return '🖥️';
  if (value.includes('tivi')) return '📺';
  return '✨';
}

async function fetchProducts({ productId } = {}) {
  const conditions = ['p.IsActive = 1'];
  const params = [];

  if (productId) {
    conditions.push('p.ProductID = @productId');
    params.push({ name: 'productId', type: sql.Int, value: productId });
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(
    `SELECT p.ProductID, p.ProductName, p.Slug, p.ShortDescription, p.FullDescription,
            p.Specifications, p.Warranty,
            c.CategoryID, c.CategoryName, c.Slug AS CategorySlug,
            b.BrandID, b.BrandName,
            v.VariantID, v.Color, v.Storage, v.Price, v.OriginalPrice,
            v.StockQuantity, v.SKU, v.IsDefault, v.ImageURL,
            r.AvgRating, r.ReviewCount
     FROM Products p
     INNER JOIN Categories c ON p.CategoryID = c.CategoryID
     INNER JOIN Brands b ON p.BrandID = b.BrandID
     LEFT JOIN ProductVariants v ON v.ProductID = p.ProductID
     LEFT JOIN (
        SELECT ProductID,
               AVG(CAST(Rating AS FLOAT)) AS AvgRating,
               COUNT(*) AS ReviewCount
        FROM Reviews
        WHERE IsApproved = 1 OR IsApproved IS NULL
        GROUP BY ProductID
     ) r ON r.ProductID = p.ProductID
     ${whereClause}
     ORDER BY p.ProductID, v.IsDefault DESC, v.Price ASC;`,
    params,
  );

  const productMap = new Map();

  result.recordset.forEach((row) => {
    if (!productMap.has(row.ProductID)) {
      productMap.set(row.ProductID, {
        id: row.ProductID,
        name: row.ProductName,
        slug: row.Slug,
        brand: row.BrandName,
        brandId: row.BrandID,
        category: row.CategorySlug,
        categoryName: row.CategoryName,
        description: row.FullDescription || row.ShortDescription || '',
        specs: parseSpecifications(row.Specifications),
        warranty: row.Warranty || '',
        rating: row.AvgRating ? Number(row.AvgRating) : 4.6,
        reviewCount: row.ReviewCount ? Number(row.ReviewCount) : 0,
        variants: [],
        images: [],
      });
    }

    const product = productMap.get(row.ProductID);

    if (row.VariantID) {
      const variant = {
        id: row.VariantID,
        color: row.Color || '',
        storage: row.Storage || '',
        price: row.Price ? Number(row.Price) : 0,
        originalPrice: row.OriginalPrice ? Number(row.OriginalPrice) : null,
        stock: row.StockQuantity ? Number(row.StockQuantity) : 0,
        sku: row.SKU || '',
        isDefault: row.IsDefault ? true : false,
        image: resolveImage(row.ImageURL, row.ProductName, 600, product.variants.length),
      };
      product.variants.push(variant);
      product.images.push(variant.image);
    }
  });

  const products = Array.from(productMap.values()).map((product) => {
    if (!product.variants.length) {
      console.warn(`Product ${product.id} (${product.name}) has no variants. Using placeholder variant.`);
      product.variants = [{
        id: 0,
        color: '',
        storage: '',
        price: 0,
        originalPrice: null,
        stock: 0,
        sku: '',
        isDefault: true,
        image: resolveImage('', product.name, 600, 0),
      }];
      product.images = [product.variants[0].image];
    }

    const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];
    const minPrice = Math.min(...product.variants.map((v) => v.price || 0));
    const maxOriginal = Math.max(
      ...product.variants.map((v) => v.originalPrice || v.price || 0),
    );

    product.price = defaultVariant.price || minPrice;
    product.originalPrice = defaultVariant.originalPrice || maxOriginal || product.price;
    if (product.originalPrice < product.price) product.originalPrice = product.price;

    const discount = product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;
    product.discount = discount;
    product.isOnSale = discount > 0;
    product.isHot = discount >= 15 || product.reviewCount >= 50;
    product.tags = [
      ...(product.isHot ? ['hot'] : []),
      ...(product.isOnSale ? ['sale'] : []),
    ];

    product.image = resolveImage(defaultVariant.image, product.name, 400, 0);
    product.images = [...new Set(product.images)].filter(Boolean);

    return product;
  });

  const featured = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 6)
    .map((product) => product.id);

  products.forEach((product) => {
    product.isFeatured = featured.includes(product.id);
  });

  return products;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', requireDbConfig);

app.get('/api/categories', async (req, res) => {
  try {
    const result = await query(
      `SELECT c.CategoryID, c.CategoryName, c.Slug, c.Description,
              COUNT(p.ProductID) AS ProductCount
       FROM Categories c
       LEFT JOIN Products p ON p.CategoryID = c.CategoryID AND p.IsActive = 1
       GROUP BY c.CategoryID, c.CategoryName, c.Slug, c.Description, c.DisplayOrder
       ORDER BY c.DisplayOrder, c.CategoryName;`,
    );

    const categories = result.recordset.map((row) => ({
      id: row.Slug,
      name: row.CategoryName,
      description: row.Description || '',
      count: Number(row.ProductCount) || 0,
      icon: getCategoryIcon(row.Slug || row.CategoryName),
    }));

    res.json(categories);
  } catch (error) {
    handleError(res, 'Không thể tải danh mục.', error);
  }
});

app.get('/api/brands', async (req, res) => {
  try {
    const result = await query(
      'SELECT BrandName FROM Brands ORDER BY BrandName;',
    );
    const brands = result.recordset.map((row) => row.BrandName);
    res.json(brands);
  } catch (error) {
    handleError(res, 'Không thể tải thương hiệu.', error);
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await fetchProducts();
    res.json(products);
  } catch (error) {
    handleError(res, 'Không thể tải sản phẩm.', error);
  }
});

app.get('/api/products/:id', async (req, res) => {
  const productId = Number(req.params.id);
  if (!Number.isInteger(productId)) {
    return res.status(400).json({ success: false, message: 'Mã sản phẩm không hợp lệ.' });
  }

  try {
    const products = await fetchProducts({ productId });
    const product = products[0];
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    }
    return res.json(product);
  } catch (error) {
    return handleError(res, 'Không thể tải sản phẩm.', error);
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu.' });
  }

  try {
    const result = await query(
      `SELECT u.UserID, u.FullName, u.Email, u.PasswordHash, u.PhoneNumber,
              r.RoleName
       FROM Users u
       INNER JOIN Roles r ON u.RoleID = r.RoleID
       WHERE u.Email = @email;`,
      [{ name: 'email', type: sql.VarChar, value: email }],
    );

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
    }

    let isValid = false;
    const allowLegacyPasswords = process.env.ALLOW_LEGACY_PASSWORDS === 'true';
    if (user.PasswordHash && user.PasswordHash.startsWith('$2')) {
      isValid = await bcrypt.compare(password, user.PasswordHash);
    } else if (allowLegacyPasswords) {
      isValid = password === user.PasswordHash;
      if (isValid) {
        const hashed = await bcrypt.hash(password, 10);
        try {
          await query(
            'UPDATE Users SET PasswordHash = @hash WHERE UserID = @userId;',
            [
              { name: 'hash', type: sql.NVarChar, value: hashed },
              { name: 'userId', type: sql.Int, value: user.UserID },
            ],
          );
        } catch (error) {
          console.warn('Failed to upgrade password hash:', error);
        }
      }
    }

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
    }

    return res.json({
      success: true,
      user: {
        id: user.UserID,
        fullName: user.FullName,
        email: user.Email,
        phone: user.PhoneNumber,
        role: user.RoleName,
      },
    });
  } catch (error) {
    return handleError(res, 'Không thể đăng nhập.', error);
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, phone, password } = req.body || {};

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });
  }

  try {
    const existing = await query(
      'SELECT UserID FROM Users WHERE Email = @email;',
      [{ name: 'email', type: sql.VarChar, value: email }],
    );

    if (existing.recordset.length) {
      return res.status(409).json({ success: false, message: 'Email này đã được sử dụng.' });
    }

    const roleResult = await query(
      'SELECT RoleID FROM Roles WHERE RoleName = @roleName;',
      [{ name: 'roleName', type: sql.NVarChar, value: 'Customer' }],
    );

    const roleId = roleResult.recordset[0]?.RoleID || 3;
    const hashed = await bcrypt.hash(password, 10);

    const insertResult = await query(
      `INSERT INTO Users (FullName, Email, PasswordHash, PhoneNumber, RoleID)
       OUTPUT INSERTED.UserID
       VALUES (@fullName, @email, @passwordHash, @phone, @roleId);`,
      [
        { name: 'fullName', type: sql.NVarChar, value: fullName },
        { name: 'email', type: sql.VarChar, value: email },
        { name: 'passwordHash', type: sql.NVarChar, value: hashed },
        { name: 'phone', type: sql.VarChar, value: phone },
        { name: 'roleId', type: sql.Int, value: roleId },
      ],
    );

    return res.status(201).json({
      success: true,
      user: {
        id: insertResult.recordset[0].UserID,
        fullName,
        email,
        phone,
        role: 'Customer',
      },
    });
  } catch (error) {
    return handleError(res, 'Không thể đăng ký.', error);
  }
});

app.listen(PORT, () => {
  const missing = getMissingEnv();
  if (missing.length) {
    console.warn(`Thiếu cấu hình database: ${missing.join(', ')}`);
  }
  console.log(`API server running on http://localhost:${PORT}`);
});
