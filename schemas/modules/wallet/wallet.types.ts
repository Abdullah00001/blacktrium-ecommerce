import { Document, Types } from 'mongoose';

export interface IWallet extends Document {
  merchantId: Types.ObjectId;
  balance: number;
  stripeAccountId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
