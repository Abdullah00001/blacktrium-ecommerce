import { Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  merchantId: Types.ObjectId;
  type: string; // 'earning' or 'withdrawal'
  amount: number;
  status: string; // 'pending', 'approved', 'rejected', 'failed'
  stripeTransferId?: string; // ID of the transfer on Stripe, if applicable
  referenceId?: string; // E.g., Order ID for earnings
  createdAt: Date;
  updatedAt: Date;
}
