import type {
  CartItem,
} from "./cart";

export interface CheckoutCustomer {
  name: string;

  email: string;

  phone: string;

  addressLine1: string;

  addressLine2: string;

  city: string;

  postalCode: string;

  notes: string;
}

export interface CreateOrderParams {
  userId?: string;

  customer: CheckoutCustomer;

  items: CartItem[];

  subtotal: number;

  deliveryFee: number;
}

export interface CreatedOrder {
  id: string;

  orderNumber: string;

  subtotal: number;

  deliveryFee: number;

  total: number;
}