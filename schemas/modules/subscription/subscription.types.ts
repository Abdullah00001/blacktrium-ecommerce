import { Document, Types } from 'mongoose';

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  revenueCatId: string;
  packageId: string;
  productId: string;
  planTier: string;
  status: string;
  platform: string;
  maxBusinessAllowed: number;
  isTrial: boolean;
  purchasedAt: Date;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
