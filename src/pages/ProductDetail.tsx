import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiZap, FiChevronLeft } from 'react-icons/fi';
import { getProductById } from '../services/mockApi';
import type { Product, ProductVariant } from '../types';
import { useCartStore } from '../features/cart/cartStore';
import { formatPrice } from '../utils/format';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

const MOCK_REVIEWS = [
  { id: 1, name: 'Nguyễn Văn A', rating: 5, date: '15/12/2024', comment: 'Sản phẩm tuyệt vời! Đúng như mô tả, giao hàng nhanh. Rất hài lòng.' },
  { id: 2, name: 'Trần Thị B', rating: 4, date: '10/12/2024', comment: 'Hàng chính hãng, đẹp. Giá tốt hơn so với các cửa hàng khác.' },
  { id: 3, name: 'Lê Văn C', rating: 5, date: '05/12/2024', comment: 'Mua lần 2 rồi, luôn tin tưởng shop. Sản phẩm hoàn hảo!' },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/');
    return null;
  }

  return <ProductDetailContent key={id} id={id} />;
}

function ProductDetailContent({ id }: { id: string }) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  useEffect(() => {
    getProductById(id).then((p) => {
      setProduct(p);
      if (p) {
        setMainImage(p.images[0]);
        setSelectedVariant(p.variants[0]);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h2>
        <Button onClick={() => navigate('/')}>Về trang chủ</Button>
      </div>
    );
  }

  const price = selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const uniqueColors = Array.from(
    new Map(product.variants.filter((v) => v.color).map((v) => [v.color, v])).values()
  );
  const uniqueStorages = Array.from(
    new Set(product.variants.filter((v) => v.storage).map((v) => v.storage))
  );

  function selectVariantByAttribute(attr: Partial<ProductVariant>) {
    const match = product!.variants.find((v) => {
      if (attr.color && v.color !== attr.color) return false;
      if (attr.storage && v.storage !== attr.storage) return false;
      return true;
    });
    if (match) setSelectedVariant(match);
  }

  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem({
      productId: product!.id,
      variantId: selectedVariant.id,
      name: product!.name,
      image: product!.images[0],
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      quantity,
      color: selectedVariant.color,
      storage: selectedVariant.storage,
    });
    toast.success(`Đã thêm "${product!.name}" vào giỏ hàng!`);
  }

  function handleBuyNow() {
    handleAddToCart();
    navigate('/cart');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors"
      >
        <FiChevronLeft size={16} /> Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 mb-3">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  mainImage === img ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500 font-medium">{product.brand}</span>
            {discount > 0 && <Badge variant="discount">-{discount}%</Badge>}
            {!product.inStock && <Badge variant="default">Hết hàng</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <Rating value={product.rating} showValue reviewCount={product.reviewCount} size={16} />
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-red-600">{formatPrice(price)}</span>
            {originalPrice > price && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>

          {/* Color selector */}
          {uniqueColors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Màu sắc: <span className="font-normal">{selectedVariant?.color}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {uniqueColors.map((v) => (
                  <button
                    key={v.color}
                    onClick={() => selectVariantByAttribute({ color: v.color, storage: selectedVariant?.storage })}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm transition-all ${
                      selectedVariant?.color === v.color
                        ? 'border-red-500 bg-red-50 text-red-700 font-medium'
                        : 'border-gray-200 hover:border-gray-400'
                    } ${!v.inStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {v.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage selector */}
          {uniqueStorages.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Dung lượng: <span className="font-normal">{selectedVariant?.storage}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {uniqueStorages.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => selectVariantByAttribute({ color: selectedVariant?.color, storage })}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm transition-all ${
                      selectedVariant?.storage === storage
                        ? 'border-red-500 bg-red-50 text-red-700 font-medium'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Số lượng</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:border-red-400 transition-colors font-bold"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:border-red-400 transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <FiShoppingCart size={18} />
              Thêm vào giỏ
            </Button>
            <Button
              size="lg"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              <FiZap size={18} />
              Mua ngay
            </Button>
          </div>

          {/* Policies */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {[
              '✅ Hàng chính hãng 100%',
              '🚚 Giao hàng trong 2 giờ (nội thành)',
              '🔄 Đổi trả miễn phí 30 ngày',
              '🛡️ Bảo hành 12-24 tháng chính hãng',
            ].map((t) => (
              <p key={t} className="text-sm text-gray-700">{t}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {([
            { key: 'desc', label: 'Mô tả sản phẩm' },
            { key: 'specs', label: 'Thông số kỹ thuật' },
            { key: 'reviews', label: `Đánh giá (${product.reviewCount.toLocaleString('vi-VN')})` },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'desc' && (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <p>{product.description}</p>
            <p className="mt-3 text-gray-600">
              Sản phẩm được phân phối chính thức bởi PhoneStore - đại lý ủy quyền tại Việt Nam. Cam kết hàng chính hãng 100%, đầy đủ phụ kiện, tem nhãn nguyên vẹn.
            </p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-5 py-3 font-medium text-gray-700 w-40">{key}</td>
                    <td className="px-5 py-3 text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {MOCK_REVIEWS.map((r) => (
              <div key={r.id} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <Rating value={r.rating} size={14} />
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
