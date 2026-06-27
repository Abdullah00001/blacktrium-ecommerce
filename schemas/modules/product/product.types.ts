import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  merchantId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  stockQuantity: number;
  colors: string[];
  materials: string[];
  sizes: string[];
  shippingCost: number;
  shippingCurrency: string;
  discount: number;
  images: string[];
  status: string;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
