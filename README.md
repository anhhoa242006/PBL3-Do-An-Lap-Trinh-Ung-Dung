# 📱 PhoneStore - Cửa hàng Điện thoại & Phụ kiện

A complete Vietnamese phone & accessories e-commerce frontend inspired by CellphoneS, built with React 18 + TypeScript + Vite.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18+ | UI framework |
| TypeScript | 5+ | Type safety |
| Vite | 8+ | Build tool |
| React Router v7 | 7+ | Client-side routing |
| Zustand | 5+ | State management (cart with localStorage) |
| TailwindCSS | 3+ | Utility-first styling |
| react-hook-form + zod | latest | Checkout form validation |
| react-hot-toast | 2+ | Toast notifications |
| react-icons | 5+ | Icon library |

## Features

- 🏠 **Home** - Banner carousel, category quick links, featured/sale/accessory sections
- 📂 **Category** - Sidebar filters (price, brand), sort options, pagination
- 📱 **Product Detail** - Image gallery, variant selector (color + storage), quantity selector, specs & reviews tabs
- 🛒 **Cart** - Full cart management, quantity controls, order summary (persisted to localStorage)
- 💳 **Checkout** - Validated form with react-hook-form + zod, payment method, success modal
- 🔍 **Search** - Live search suggestions in header (debounced 300ms), full search results page
- 🔔 **Toast Notifications** - "Added to cart" feedback on every add action
- 📱 **Responsive** - Mobile-first layout with hamburger menu

## Project Structure

```
src/
  app/
    router.tsx          # React Router setup
  components/
    ui/                 # Button, Input, Modal, Rating, Skeleton, Badge
    layout/             # Header, Footer, Layout
    products/           # ProductCard, ProductGrid
  features/
    cart/
      cartStore.ts      # Zustand cart store with localStorage persistence
  pages/                # Home, Category, ProductDetail, Cart, Checkout, Search, NotFound
  services/
    mockApi.ts          # Simulated API with 300-800ms delays
  data/
    products.ts         # 30+ products with Vietnamese prices & specs
    categories.ts       # Categories and brands
  types/
    index.ts            # TypeScript interfaces
  utils/
    format.ts           # VND price formatter
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at http://localhost:5173

## Key Implementation Details

- **Cart persistence**: Uses Zustand `persist` middleware with `localStorage` key `cart-storage`
- **Mock API**: All data is client-side with simulated async delays (300–800ms)
- **Products**: 30+ realistic products including phones (iPhone, Samsung, Xiaomi, OPPO, vivo, Realme, Google Pixel), tablets (iPad, Galaxy Tab), and accessories (AirPods, cases, chargers, power banks)
- **Prices**: All prices in VND (Vietnamese Dong)
- **Filtering**: Client-side filtering by category, brand, price range with sorting
- **Search**: Debounced live suggestions + full search results page
