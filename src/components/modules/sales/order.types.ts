export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
export type PaymentStatus = "pending" | "paid" | "partial" | "refunded" | "failed";
export type PaymentMethod = "cash" | "card" | "mobile_banking" | "bank_transfer" | "credit";

export interface IOrderItem {
  product: {
      _id: string;
      name: string;
      images: string[];
      // Add other product fields as needed for display
  };
  variant?: string;
  quantity: number;
  price: number;
  total: number;
  discount?: number;
}

export interface IOrder {
  _id: string; // Backend ID
  orderId: string; // Human readable ID
  customer?: {
      _id: string;
      name: string;
      phone?: string;
      email?: string;
  };
  businessUnit: string;
  
  items: IOrderItem[];
  
  subTotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  shippingAddress?: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  billingAddress?: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
    items: {
        product: string;
        variant?: string;
        quantity: number;
        price: number;
        total: number;
    }[];
    customer?: string;
    businessUnit: string;
    subTotal: number;
    totalAmount: number;
    paidAmount: number;
    paymentMethod: PaymentMethod;
    outlet: string;
}
