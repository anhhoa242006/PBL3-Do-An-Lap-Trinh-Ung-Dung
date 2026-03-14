import { products } from '../data/products';
import { categories } from '../data/categories';
import type { Product, Category, FilterOptions, PaginatedResponse } from '../types';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export async function getProducts(
  filters: FilterOptions = {}
): Promise<PaginatedResponse<Product>> {
  await delay(rand(300, 800));

  let result = [...products];

  if (filters.category) {
    const catSlug = filters.category;
    const catMap: Record<string, string> = {
      'dien-thoai': 'phone',
      'may-tinh-bang': 'tablet',
      'phu-kien': 'accessory',
      laptop: 'laptop',
    };
    const cat = catMap[catSlug] ?? catSlug;
    result = result.filter((p) => p.category === cat);
  }

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.brand.toLowerCase().includes(kw) ||
        p.tags.some((t) => t.includes(kw))
    );
  }

  if (filters.brand && filters.brand.length > 0) {
    result = result.filter((p) => filters.brand!.includes(p.brand));
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  // Sort
  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'popular':
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'newest':
    default:
      // keep original order (newest first assumed)
      break;
  }

  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 8;
  const total = result.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const data = result.slice(start, start + perPage);

  return { data, total, page, perPage, totalPages };
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(rand(300, 600));
  return products.find((p) => p.id === id) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  await delay(200);
  return categories;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await delay(rand(300, 500));
  return products.filter((p) => p.isFeatured).slice(0, 8);
}

export async function getSaleProducts(): Promise<Product[]> {
  await delay(rand(200, 400));
  return products.filter((p) => p.isOnSale).slice(0, 8);
}

export async function getAccessoryProducts(): Promise<Product[]> {
  await delay(rand(200, 400));
  return products.filter((p) => p.category === 'accessory').slice(0, 8);
}

export async function searchProducts(keyword: string): Promise<Product[]> {
  await delay(rand(400, 700));
  const kw = keyword.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(kw) ||
      p.brand.toLowerCase().includes(kw) ||
      p.description.toLowerCase().includes(kw) ||
      p.tags.some((t) => t.includes(kw))
  );
}
