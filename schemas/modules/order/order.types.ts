import { Document, Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface ICustomerInfo {
  name: string;
  phone: string;
  address: string;
}

export interface IPaymentInfo {
  method: string;
  status: string; // 'pending', 'paid', 'failed'
  subtotal: number;
  shippingFee: number;
  total: number;
}

export interface IOrder extends Document {
  orderId: string; // Unique human-readable ID e.g., #83473
  buyerId: Types.ObjectId;
  merchantId: Types.ObjectId;
  items: IOrderItem[];
  customerInfo: ICustomerInfo;
  paymentInfo: IPaymentInfo;
  status: string; // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  createdAt: Date;
  updatedAt: Date;
}
