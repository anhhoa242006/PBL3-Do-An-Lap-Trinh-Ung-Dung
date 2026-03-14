import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useCartStore } from '../../features/cart/cartStore';
import { searchProducts } from '../../services/mockApi';
import type { Product } from '../../types';
import { categories } from '../../data/categories';

export default function Header() {
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchProducts(query);
        setSuggestions(results.slice(0, 5));
        setShowSuggestions(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(product: Product) {
    navigate(`/product/${product.id}`);
    setQuery('');
    setShowSuggestions(false);
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-red-600 text-white text-xs py-1 text-center">
        🎉 Miễn phí vận chuyển cho đơn hàng từ 500.000₫ | Hotline: 1800-6789
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">📱</span>
            <span className="text-xl font-bold text-red-600 hidden sm:block">PhoneStore</span>
          </Link>

          {/* Search */}
          <div ref={searchRef} className="flex-1 relative max-w-2xl">
            <form onSubmit={handleSearch}>
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <FiSearch size={16} />
                </button>
              </div>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {loading ? (
                  <div className="p-4 text-sm text-gray-500 text-center">Đang tìm kiếm...</div>
                ) : suggestions.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">Không tìm thấy kết quả</div>
                ) : (
                  <ul>
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => handleSuggestionClick(p)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <p className="text-xs text-red-600 font-semibold">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(p.price)}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                    <li className="border-t">
                      <button
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(query)}`);
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 text-center"
                      >
                        Xem tất cả kết quả cho "{query}"
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 hover:text-red-600 transition-colors">
            <FiShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Category nav - desktop */}
        <nav className="hidden md:flex items-center gap-1 mt-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col p-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
