export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  variants: ProductVariant[];
  inStock: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  tags: string[];
}

export interface ProductVariant {
  id: string;
  color?: string;
  storage?: string;
  ram?: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  color?: string;
  storage?: string;
}

export interface FilterOptions {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  ram?: string[];
  storage?: string[];
  sort?: 'price-asc' | 'price-desc' | 'name-asc' | 'newest' | 'popular';
  page?: number;
  perPage?: number;
  keyword?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
