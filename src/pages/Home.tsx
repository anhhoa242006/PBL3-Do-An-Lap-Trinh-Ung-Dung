import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Product } from '../types';
import {
  getFeaturedProducts,
  getSaleProducts,
  getAccessoryProducts,
} from '../services/mockApi';
import ProductGrid from '../components/products/ProductGrid';
import { categories } from '../data/categories';

const BANNERS = [
  {
    id: 1,
    title: 'iPhone 15 Pro - Titan. Siêu bền.',
    subtitle: 'Chip A17 Pro - Hiệu năng đỉnh cao',
    cta: 'Mua ngay',
    link: '/product/iphone-15-pro',
    bg: 'from-gray-900 to-gray-700',
    emoji: '📱',
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'S Pen thông minh - AI Galaxy đột phá',
    cta: 'Khám phá',
    link: '/product/samsung-s24-ultra',
    bg: 'from-blue-900 to-blue-700',
    emoji: '🌟',
  },
  {
    id: 3,
    title: 'Sale Phụ kiện Hot',
    subtitle: 'Giảm đến 40% tai nghe, sạc, ốp lưng',
    cta: 'Xem ngay',
    link: '/category/phu-kien',
    bg: 'from-red-700 to-red-500',
    emoji: '🎧',
  },
  {
    id: 4,
    title: 'Xiaomi 14 - Camera Leica',
    subtitle: 'Snapdragon 8 Gen 3 - Sạc 90W siêu nhanh',
    cta: 'Tìm hiểu',
    link: '/product/xiaomi-14',
    bg: 'from-orange-700 to-orange-500',
    emoji: '⚡',
  },
];

function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const banner = BANNERS[current];

  return (
    <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
      <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} transition-all duration-700`} />
      <div className="relative h-full flex items-center px-10 md:px-16">
        <div className="text-white">
          <p className="text-5xl mb-4">{banner.emoji}</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>
          <p className="text-sm md:text-base text-white/80 mb-5">{banner.subtitle}</p>
          <Link
            to={banner.link}
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            {banner.cta} <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + BANNERS.length) % BANNERS.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
      >
        <FiChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % BANNERS.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
}

function SectionHeader({
  title,
  link,
  linkText = 'Xem tất cả',
}: {
  title: string;
  link: string;
  linkText?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <span className="w-1 h-6 bg-red-600 rounded-full inline-block" />
        {title}
      </h2>
      <Link
        to={link}
        className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"
      >
        {linkText} <FiArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [sale, setSale] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingSale, setLoadingSale] = useState(true);
  const [loadingAcc, setLoadingAcc] = useState(true);

  useEffect(() => {
    getFeaturedProducts().then((d) => {
      setFeatured(d);
      setLoadingFeatured(false);
    });
    getSaleProducts().then((d) => {
      setSale(d);
      setLoadingSale(false);
    });
    getAccessoryProducts().then((d) => {
      setAccessories(d);
      setLoadingAcc(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      {/* Banner */}
      <Banner />

      {/* Categories */}
      <section>
        <SectionHeader title="Danh mục sản phẩm" link="/category/dien-thoai" linkText="Tất cả" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="card p-5 flex flex-col items-center gap-3 hover:border-red-200 hover:shadow-md transition-all group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
              <span className="text-xs text-gray-400">{cat.productCount} sản phẩm</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <SectionHeader title="Sản phẩm nổi bật" link="/category/dien-thoai" />
        <ProductGrid products={featured} loading={loadingFeatured} skeletonCount={8} />
      </section>

      {/* Sale */}
      <section>
        <SectionHeader title="🔥 Giảm giá hot" link="/category/dien-thoai" />
        <ProductGrid products={sale} loading={loadingSale} skeletonCount={4} />
      </section>

      {/* Accessories */}
      <section>
        <SectionHeader title="Phụ kiện chính hãng" link="/category/phu-kien" />
        <ProductGrid products={accessories} loading={loadingAcc} skeletonCount={4} />
      </section>

      {/* Promo banners */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 flex items-center gap-4">
          <span className="text-4xl">🚚</span>
          <div>
            <p className="font-bold text-gray-900">Miễn phí vận chuyển</p>
            <p className="text-sm text-gray-600">Đơn hàng từ 500.000₫</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 flex items-center gap-4">
          <span className="text-4xl">🔄</span>
          <div>
            <p className="font-bold text-gray-900">Đổi trả 30 ngày</p>
            <p className="text-sm text-gray-600">Không cần lý do</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 flex items-center gap-4">
          <span className="text-4xl">🛡️</span>
          <div>
            <p className="font-bold text-gray-900">Bảo hành chính hãng</p>
            <p className="text-sm text-gray-600">12 - 24 tháng</p>
          </div>
        </div>
      </section>
    </div>
  );
}
