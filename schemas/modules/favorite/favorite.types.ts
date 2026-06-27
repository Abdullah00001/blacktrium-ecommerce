import { Document, Types } from 'mongoose';

export interface IFavorite extends Document {
  userId: Types.ObjectId;
  itemType: 'business' | 'product';
  businessId?: Types.ObjectId;
  productId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
