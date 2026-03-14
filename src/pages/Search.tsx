import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { searchProducts } from '../services/mockApi';
import type { Product } from '../types';
import ProductGrid from '../components/products/ProductGrid';

export default function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') ?? '';

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    searchProducts(keyword).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [keyword]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <FiSearch size={24} className="text-gray-400" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Kết quả tìm kiếm cho: <span className="text-red-600">"{keyword}"</span>
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {results.length > 0
                ? `Tìm thấy ${results.length} sản phẩm`
                : 'Không tìm thấy sản phẩm nào'}
            </p>
          )}
        </div>
      </div>

      {!keyword ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-600">Nhập từ khóa để tìm kiếm sản phẩm</p>
        </div>
      ) : loading ? (
        <ProductGrid products={[]} loading={true} skeletonCount={8} />
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">😔</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy sản phẩm nào
          </h2>
          <p className="text-gray-500 mb-6">
            Không có kết quả cho từ khóa "<strong>{keyword}</strong>"
          </p>
          <div className="text-sm text-gray-400 mb-8 space-y-1">
            <p>Gợi ý:</p>
            <p>• Kiểm tra lại chính tả từ khóa</p>
            <p>• Thử các từ khóa tổng quát hơn</p>
            <p>• Thử tìm theo tên thương hiệu (Apple, Samsung, Xiaomi...)</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      ) : (
        <ProductGrid products={results} loading={false} />
      )}
    </div>
  );
}
