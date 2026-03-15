import type { Product } from '../../types';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
}

export default function ProductGrid({ products, loading, skeletonCount = 8 }: ProductGridProps) {
  if (loading) return <ProductGridSkeleton count={skeletonCount} />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
