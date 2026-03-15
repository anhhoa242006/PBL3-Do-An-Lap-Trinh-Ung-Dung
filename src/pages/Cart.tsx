import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiPlus, FiMinus } from 'react-icons/fi';
import { useCartStore } from '../features/cart/cartStore';
import { formatPrice } from '../utils/format';
import Button from '../components/ui/Button';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalDiscount, getTotalItems } =
    useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-8">
          Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá và mua sắm ngay!
        </p>
        <Button size="lg" onClick={() => navigate('/')}>
          <FiShoppingBag size={18} />
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  const total = getTotalPrice();
  const discount = getTotalDiscount();
  const subtotal = total + discount;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        🛒 Giỏ hàng ({getTotalItems()} sản phẩm)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="card p-4 flex items-start gap-4"
            >
              <Link to={`/product/${item.productId}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.productId}`}
                  className="font-medium text-gray-900 hover:text-red-600 line-clamp-2 transition-colors"
                >
                  {item.name}
                </Link>
                {(item.color || item.storage) && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {[item.color, item.storage].filter(Boolean).join(' | ')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variantId, item.quantity - 1)
                      }
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-red-400 transition-colors"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variantId, item.quantity + 1)
                      }
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-red-400 transition-colors"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatPrice(item.price * item.quantity)}</p>
                    {item.originalPrice > item.price && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(item.originalPrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.productId, item.variantId)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Xóa"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Tổng cộng</span>
                <span className="text-red-600 text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
              Tiến hành đặt hàng
            </Button>

            <Link
              to="/"
              className="block text-center text-sm text-gray-500 hover:text-red-600 mt-3 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
