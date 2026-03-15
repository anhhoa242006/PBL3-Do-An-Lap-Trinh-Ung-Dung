import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-8xl mb-6">📱</div>
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Trang không tồn tại
      </h2>
      <p className="text-gray-500 mb-8">
        Trang bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không chính xác.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
      >
        🏠 Về trang chủ
      </Link>
    </div>
  );
}
