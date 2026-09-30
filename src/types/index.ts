export type CategoryId =
  | 'nungu-ilaneer'
  | 'fresh-ice-creams'
  | 'sarbath'
  | 'milk-shake'
  | 'fresh-juices'
  | 'sharja'
  | 'omlete';

export interface Product {
  id: string;
  name: string;
  tamilName?: string | null;
  category: CategoryId;
  price: number;
  image: string;
  description?: string;
  available: boolean;
  allowIceCreamAddon?: boolean;
  popular?: boolean;
}

export interface CartItem {
  id: string; // Unique composite ID: e.g. "prod_id" or "prod_id_with_icecream"
  productId: string;
  product: Product;
  quantity: number;
  withIceCream: boolean;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'pickup' | 'delivery';
export type PaymentMethod = 'cod' | 'upi';

export interface CheckoutFormData {
  name: string;
  mobile: string;
  orderType: OrderType;
  address: string;
  landmark: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  tamilName: string;
  description: string;
  iconName: string;
  badge?: string;
  image: string;
}
