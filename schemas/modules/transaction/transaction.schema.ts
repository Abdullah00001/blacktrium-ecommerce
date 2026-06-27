import { Schema, model, Model } from 'mongoose';
import { ITransaction } from '@/transaction/transaction.types';

const TransactionSchema = new Schema<ITransaction>({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true, index: true },
  type: { type: String, enum: ['earning', 'withdrawal'], required: true, index: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'failed'], default: 'pending', index: true },
  stripeTransferId: { type: String },
  referenceId: { type: String },
}, {
  timestamps: true
});

export const TransactionModel: Model<ITransaction> = model<ITransaction>('Transaction', TransactionSchema);
