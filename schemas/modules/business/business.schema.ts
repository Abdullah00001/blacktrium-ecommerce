import { Schema, model, Model } from 'mongoose';
import { IBusiness } from '@/business/business.types';
const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const PromotionSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    lastDate: { type: String, required: true },
    lastTime: { type: String, required: true },
  },
  { _id: false }
);

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    image: { type: String, default: null },
    description: { type: String, required: true },
  },
  { _id: false }
);

const BusinessSchema = new Schema<IBusiness>({
  businessProfileId: {
    type: Schema.Types.ObjectId,
    ref: 'BusinessProfile',
    required: true,
    index: true,
  },
  businessName: { type: String, required: true, index: true },
  businessType: { type: String, required: true },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  },
  subCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
    index: true,
  },
  countryId: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    index: true,
  },
  location: { type: String, required: true },
  websiteLink: { type: String, default: null },
  socialLinks: { type: [SocialLinkSchema], default: [] },
  thumbnailImage: { type: String, default: null },
  businessImages: [{ type: String }],
  businessDescription: { type: String, default: null },
  promotions: { type: [PromotionSchema], default: [] },
  events: { type: [EventSchema], default: [] },
  spotlightFeature: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  status: { type: String, default: 'active', index: true },
}, {
  timestamps: true
});

export const BusinessModel: Model<IBusiness> = model<IBusiness>('Business', BusinessSchema);
