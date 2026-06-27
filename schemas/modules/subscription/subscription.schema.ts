import { Schema, model, Model } from 'mongoose';
import { ISubscription } from '@/subscription/subscription.types';

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  revenueCatId: { type: String, required: true, index: true },
  packageId: { type: String, required: true },
  productId: { type: String, required: true },
  planTier: { type: String, required: true, index: true },
  status: { type: String, default: 'active', index: true },
  platform: { type: String, required: true },
  maxBusinessAllowed: { type: Number, required: true, default: 1 },
  isTrial: { type: Boolean, default: false },
  purchasedAt: { type: Date, required: true },
  expiresAt: { type: Date, default: null },
}, {
  timestamps: true
});

export const SubscriptionModel: Model<ISubscription> = model<ISubscription>('Subscription', SubscriptionSchema);
