import type { Category, Brand } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Điện thoại', slug: 'dien-thoai', icon: '📱', productCount: 25 },
  { id: '2', name: 'Máy tính bảng', slug: 'may-tinh-bang', icon: '📟', productCount: 8 },
  { id: '3', name: 'Phụ kiện', slug: 'phu-kien', icon: '🎧', productCount: 15 },
  { id: '4', name: 'Laptop', slug: 'laptop', icon: '💻', productCount: 10 },
];

export const brands: Brand[] = [
  { id: '1', name: 'Apple', logo: '🍎' },
  { id: '2', name: 'Samsung', logo: '🌟' },
  { id: '3', name: 'Xiaomi', logo: '🔲' },
  { id: '4', name: 'OPPO', logo: '⭕' },
  { id: '5', name: 'vivo', logo: '✅' },
  { id: '6', name: 'Realme', logo: '🔷' },
  { id: '7', name: 'Google', logo: '🔍' },
];
