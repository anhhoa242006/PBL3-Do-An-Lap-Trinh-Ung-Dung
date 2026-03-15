interface BadgeProps {
  children: React.ReactNode;
  variant?: 'discount' | 'hot' | 'new' | 'sale' | 'default';
  className?: string;
}

const variantClasses = {
  discount: 'bg-red-600 text-white',
  hot: 'bg-orange-500 text-white',
  new: 'bg-blue-500 text-white',
  sale: 'bg-green-500 text-white',
  default: 'bg-gray-200 text-gray-700',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
