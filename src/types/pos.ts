export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  stock: number;
  barcode?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  voucherCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
  customerId?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'digital';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  change?: number;
}

export interface Voucher {
  code: string;
  guidId: string;
  type: 'fixed' | 'percentage';
  value: number;
  minimumOrderAmount?: number;
}

export interface ApiConfig {
  serviceCode: string;
  posAppId: string;
  apiUrl: string;
}

export interface ApplyVoucherResult {
  success: boolean;
  message: string;
}
