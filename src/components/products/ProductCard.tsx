import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShoppingCart } from 'react-icons/fi';
import type { Product } from '../../types';
import { useCartStore } from '../../features/cart/cartStore';
import { formatPrice } from '../../utils/format';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const defaultVariant = product.variants[0];

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      image: product.images[0],
      price: defaultVariant.price,
      originalPrice: defaultVariant.originalPrice,
      quantity: 1,
      color: defaultVariant.color,
      storage: defaultVariant.storage,
    });
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  return (
    <Link to={`/product/${product.id}`} className="card group flex flex-col hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2">
            <Badge variant="discount">-{product.discount}%</Badge>
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-2 right-2">
            <Badge variant="hot">Hot</Badge>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 flex-1">
          {product.name}
        </h3>
        <div className="mb-2">
          <Rating value={product.rating} reviewCount={product.reviewCount} size={12} />
        </div>
        <div className="mb-3">
          <p className="text-red-600 font-bold">{formatPrice(product.price)}</p>
          {product.originalPrice > product.price && (
            <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <FiShoppingCart size={14} />
          {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </Button>
      </div>
    </Link>
  );
}
