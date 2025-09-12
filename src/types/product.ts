export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  description: string;
  specifications: { [key: string]: string };
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviews: number;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}