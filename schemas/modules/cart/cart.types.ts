import { Document, Types } from 'mongoose';

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  currency: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}
