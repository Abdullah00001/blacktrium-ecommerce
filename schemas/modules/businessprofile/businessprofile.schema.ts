import { Schema, model, Model } from 'mongoose';
import { IBusinessProfile } from '@/businessprofile/businessprofile.types';

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
  status: { type: String, default: 'inactive', index: true },
}, {
  timestamps: true
});

export const BusinessProfileModel: Model<IBusinessProfile> = model<IBusinessProfile>('BusinessProfile', BusinessProfileSchema);
