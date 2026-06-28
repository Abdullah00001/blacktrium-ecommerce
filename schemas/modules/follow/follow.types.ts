import { Document, Types } from 'mongoose';

export interface IFollow extends Document {
  followerId: Types.ObjectId; // The User who is following
  targetId: Types.ObjectId;
  targetType: 'BusinessProfile' | 'Merchant';
  createdAt: Date;
  updatedAt: Date;
}
