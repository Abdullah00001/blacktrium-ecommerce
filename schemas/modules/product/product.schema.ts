import { Schema, model, Model } from 'mongoose';
import { IProduct } from '@/product/product.types';

const ProductSchema = new Schema<IProduct>({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true, index: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true, index: true },
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: 'Euros' },
  stockQuantity: { type: Number, required: true, default: 0 },
  colors: { type: [String], default: [] },
  materials: { type: [String], default: [] },
  sizes: { type: [String], default: [] },
  shippingCost: { type: Number, required: true },
  shippingCurrency: { type: String, required: true, default: 'Euros' },
  discount: { type: Number, default: 0 },
  images: { type: [String], required: true },
  status: { type: String, default: 'active', index: true },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
}, {
  timestamps: true
});

export const ProductModel: Model<IProduct> = model<IProduct>('Product', ProductSchema);
