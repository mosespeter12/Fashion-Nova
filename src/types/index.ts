export type ProductCategory = 'all' | 'outfits' | 'footwear' | 'watches' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: 'outfits' | 'footwear' | 'watches' | 'accessories';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  details: string[];
  inStock: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
}

export interface CartItem {
  id: string; // unique item id based on product.id + size + color
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // multiplier against USD
}
