export type Product = {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  color: string;
  accent: string;
  price: number;
  size: string;
  spicy: boolean;
  sweet: boolean;
  vegan: boolean;
  gluten_free: boolean;
  created_at?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export type Page =
  | 'home'
  | 'products'
  | 'product'
  | 'story'
  | 'recipes'
  | 'wishlist'
  | 'compare'
  | 'checkout'
  | 'dashboard'
  | 'login'
  | 'stores'
  | 'contact';
