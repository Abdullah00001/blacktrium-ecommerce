import { Schema, model, Model } from 'mongoose';
import { IWallet } from '@/wallet/wallet.types';

const WalletSchema = new Schema<IWallet>({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true, unique: true },
  balance: { type: Number, required: true, default: 0 },
  stripeAccountId: { type: String },
  status: { type: String, default: 'active' },
}, {
  timestamps: true
});

export const WalletModel: Model<IWallet> = model<IWallet>('Wallet', WalletSchema);
