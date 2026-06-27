import { Document } from 'mongoose';

export interface ISubscriptionplan extends Document {
  revenueCatId: string;
  packageId: string;
  productId: string;
  name: string;
  description: string;
  planTier: string;
  price: number;
  currency: string;
  billingPeriod: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
