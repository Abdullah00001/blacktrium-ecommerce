import { Schema, model, Model } from 'mongoose';
import { IBusinessProfile } from '@/businessprofile/businessprofile.types';

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const BusinessProfileSchema = new Schema<IBusinessProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  subscriptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    index: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  profileAvatar: { type: String, default: null },
  businessOwnerType: { type: String, default: null },
  countryId: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    default: null,
  },
  tagLine: { type: String, default: null },
  bio: { type: String, default: null },
  socialLinks: { type: [SocialLinkSchema], default: [] },
  status: { type: String, default: 'inactive', index: true },
}, {
  timestamps: true
});

export const BusinessProfileModel: Model<IBusinessProfile> = model<IBusinessProfile>('BusinessProfile', BusinessProfileSchema);
