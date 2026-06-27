import { Schema, model, Model } from 'mongoose';
import { IOrder } from '@/order/order.types';

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  price: { type: Number, required: true },
}, { _id: false });

const CustomerInfoSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
}, { _id: false });

const PaymentInfoSchema = new Schema({
  method: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  total: { type: Number, required: true },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true, index: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true, index: true },
  items: { type: [OrderItemSchema], required: true },
  customerInfo: { type: CustomerInfoSchema, required: true },
  paymentInfo: { type: PaymentInfoSchema, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending', index: true },
}, {
  timestamps: true
});

export const OrderModel: Model<IOrder> = model<IOrder>('Order', OrderSchema);
