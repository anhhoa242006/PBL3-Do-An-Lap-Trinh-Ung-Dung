import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export default function Rating({ value, max = 5, size = 14, showValue, reviewCount }: RatingProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const full = i + 1 <= value;
    const half = !full && i + 0.5 < value;
    return { full, half };
  });

  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex items-center gap-0.5">
        {stars.map((s, i) =>
          s.full ? (
            <FaStar key={i} size={size} className="text-yellow-400" />
          ) : s.half ? (
            <FaStarHalfAlt key={i} size={size} className="text-yellow-400" />
          ) : (
            <FaRegStar key={i} size={size} className="text-gray-300" />
          )
        )}
      </span>
      {showValue && (
        <span className="text-sm font-medium text-gray-700">{value.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-500">({reviewCount.toLocaleString('vi-VN')})</span>
      )}
    </span>
  );
}
