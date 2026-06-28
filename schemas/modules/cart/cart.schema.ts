import { Schema, model, Model } from 'mongoose';
import { ICart } from '@/cart/cart.types';

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String },
  color: { type: String },
}, { _id: true }); // Need _id so we can target and update/delete specific items if needed

const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  currency: { type: String, required: true, default: 'Euros' },
  items: { type: [CartItemSchema], default: [] },
}, {
  timestamps: true
});

export const CartModel: Model<ICart> = model<ICart>('Cart', CartSchema);
