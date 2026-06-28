import { Schema, model, Model } from 'mongoose';
import { IMerchant } from '@/merchant/merchant.types';

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const MerchantSchema = new Schema<IMerchant>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  businessProfileId: {
    type: Schema.Types.ObjectId,
    ref: 'BusinessProfile',
    required: true,
    index: true,
  },
  shopName: { type: String, required: true, index: true },
  aboutShop: { type: String, required: true },
  termsAndCondition: { type: String, required: true },
  shopType: { type: String, required: true },
  shopLink: { type: String, default: null },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  socialLinks: { type: [SocialLinkSchema], default: [] },
  profileImage: { type: String, default: null },
  status: { type: String, default: 'active', index: true },
}, {
  timestamps: true
});

export const MerchantModel: Model<IMerchant> = model<IMerchant>('Merchant', MerchantSchema);
