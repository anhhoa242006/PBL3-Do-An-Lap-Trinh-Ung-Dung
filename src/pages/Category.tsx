import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiChevronDown, FiFilter } from 'react-icons/fi';
import { getProducts } from '../services/mockApi';
import type { Product, FilterOptions } from '../types';
import { categories, brands } from '../data/categories';
import ProductGrid from '../components/products/ProductGrid';
import Button from '../components/ui/Button';

const PRICE_RANGES = [
  { label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { label: 'Trên 20 triệu', min: 20000000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá thấp → cao', value: 'price-asc' },
  { label: 'Giá cao → thấp', value: 'price-desc' },
  { label: 'Phổ biến nhất', value: 'popular' },
] as const;

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [sort, setSort] = useState<FilterOptions['sort']>('newest');
  const [showFilter, setShowFilter] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters: FilterOptions = {
        category: slug,
        brand: selectedBrands.length > 0 ? selectedBrands : undefined,
        minPrice: priceRange.min,
        maxPrice: priceRange.max === Infinity ? undefined : priceRange.max,
        sort,
        page,
        perPage: 8,
      };
      const res = await getProducts(filters);
      setProducts(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }, [slug, selectedBrands, priceRange, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [slug, selectedBrands, priceRange, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  function handlePriceRange(min: number, max: number) {
    if (priceRange.min === min && priceRange.max === max) {
      setPriceRange({});
    } else {
      setPriceRange({ min, max });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {category ? `${category.icon} ${category.name}` : 'Sản phẩm'}
        </h1>
        {!loading && (
          <p className="text-sm text-gray-500 mt-1">Tìm thấy {total} sản phẩm</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar / Filter */}
        <aside className="lg:w-56 shrink-0">
          {/* Mobile filter toggle */}
          <button
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 mb-3"
            onClick={() => setShowFilter((o) => !o)}
          >
            <span className="flex items-center gap-2 font-medium">
              <FiFilter size={16} />
              Bộ lọc
            </span>
            <FiChevronDown
              className={`transition-transform ${showFilter ? 'rotate-180' : ''}`}
            />
          </button>

          <div className={`space-y-5 ${showFilter ? '' : 'hidden lg:block'}`}>
            {/* Price filter */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-sm mb-3">Mức giá</h3>
              <ul className="space-y-2">
                {PRICE_RANGES.map((r) => {
                  const active = priceRange.min === r.min && priceRange.max === r.max;
                  return (
                    <li key={r.label}>
                      <button
                        onClick={() => handlePriceRange(r.min, r.max)}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                          active
                            ? 'bg-red-50 text-red-600 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {r.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Brand filter */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-sm mb-3">Thương hiệu</h3>
              <ul className="space-y-2">
                {brands.map((b) => (
                  <li key={b.id}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.name)}
                        onChange={() => toggleBrand(b.name)}
                        className="accent-red-600"
                      />
                      <span className="text-sm">{b.logo} {b.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reset */}
            {(selectedBrands.length > 0 || priceRange.min !== undefined) && (
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => {
                  setSelectedBrands([]);
                  setPriceRange({});
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-sm text-gray-500 hidden sm:block">
              {loading ? '...' : `${total} kết quả`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as FilterOptions['sort'])}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-red-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ProductGrid products={products} loading={loading} skeletonCount={8} />

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Trước
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-gray-200 hover:border-red-300 hover:text-red-600'
                  }`}
                >
                  {p}
                </button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau
              </Button>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">😔</p>
              <p className="text-gray-600 font-medium">Không tìm thấy sản phẩm nào</p>
              <p className="text-sm text-gray-400 mt-1">Hãy thử thay đổi bộ lọc</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
