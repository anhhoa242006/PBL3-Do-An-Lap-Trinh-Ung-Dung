import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiCheck } from 'react-icons/fi';
import { useCartStore } from '../features/cart/cartStore';
import { formatPrice } from '../utils/format';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
];

const schema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  note: z.string().optional(),
  payment: z.enum(['cod', 'bank']),
});

type FormData = z.infer<typeof schema>;

function generateOrderNumber() {
  return 'PS' + Date.now().toString().slice(-8);
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalDiscount, clearCart } = useCartStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { payment: 'cod' },
  });

  const payment = watch('payment');
  const total = getTotalPrice();
  const discount = getTotalDiscount();
  const subtotal = total + discount;

  if (items.length === 0 && !showSuccess) {
    navigate('/cart');
    return null;
  }

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 1000));
    setOrderNumber(generateOrderNumber());
    setShowSuccess(true);
    clearCart();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          {/* Shipping info */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-5">Thông tin giao hàng</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('fullName')}
                  placeholder="Nguyễn Văn A"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('phone')}
                    placeholder="0987654321"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="email@example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('province')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">Chọn tỉnh/thành</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="text-xs text-red-500 mt-1">{errors.province.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('district')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">Chọn quận/huyện</option>
                    {['Quận 1', 'Quận 2', 'Quận 3', 'Quận Hoàn Kiếm', 'Quận Ba Đình', 'Quận Hải Châu', 'Quận Ngũ Hành Sơn'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-xs text-red-500 mt-1">{errors.district.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ cụ thể <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('address')}
                  placeholder="Số nhà, tên đường..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  {...register('note')}
                  placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-5">Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  payment === 'cod' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input type="radio" value="cod" {...register('payment')} className="accent-red-600" />
                <div>
                  <p className="font-medium text-sm">💵 Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-xs text-gray-500">Kiểm tra hàng trước khi trả tiền</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  payment === 'bank' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input type="radio" value="bank" {...register('payment')} className="accent-red-600" />
                <div>
                  <p className="font-medium text-sm">🏦 Chuyển khoản ngân hàng</p>
                  <p className="text-xs text-gray-500">Vietcombank / VPBank / Techcombank</p>
                </div>
              </label>
            </div>
          </div>

          <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : '🎯 Đặt hàng'}
          </Button>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Đơn hàng của bạn</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-2">{item.name}</p>
                    {item.color && (
                      <p className="text-xs text-gray-500">{item.color} {item.storage && `| ${item.storage}`}</p>
                    )}
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">x{item.quantity}</span>
                      <span className="text-xs font-bold text-red-600">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
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
                <span className="text-gray-600">Vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Tổng cộng</span>
                <span className="text-red-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal open={showSuccess} onClose={() => { setShowSuccess(false); navigate('/'); }} size="sm">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Đặt hàng thành công!</h2>
          <p className="text-gray-600 mb-1">Cảm ơn bạn đã tin tưởng PhoneStore</p>
          <p className="text-sm text-gray-500 mb-4">
            Mã đơn hàng: <span className="font-bold text-red-600">{orderNumber}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút.
          </p>
          <Button
            fullWidth
            onClick={() => { setShowSuccess(false); navigate('/'); }}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
