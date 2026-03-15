interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-3">
      <Skeleton className="w-full aspect-square mb-3" />
      <Skeleton className="h-3 w-1/3 mb-2" />
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-5 w-2/3 mb-1" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
