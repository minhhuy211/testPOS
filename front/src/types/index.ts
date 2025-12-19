export interface Product {
  id: number; // Support both number (from API) and string (for compatibility)
  name: string;
  price: number;
  image?: string;
  category?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  code?: string; // Optional for API orders
  total: number;
  paidAt?: Date;
  createdAt?: string; // For API compatibility
  items: CartItem[];
}

export interface ApiOrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface ApiOrder {
  id: number;
  totalAmount: number;
  paymentTime: string; // từ API
  items: ApiOrderItem[];
}

