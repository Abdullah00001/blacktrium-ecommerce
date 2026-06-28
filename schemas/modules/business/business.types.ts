import { Document, Types } from 'mongoose';

export interface IPromotion {
  title: string;
  subtitle: string;
  lastDate: string;
  lastTime: string;
}

export interface IEvent {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  image?: string;
  description: string;
}

export interface IBusiness extends Document {
  businessProfileId: Types.ObjectId;
  businessName: string;
  businessType: string;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  countryId?: Types.ObjectId;
  location: string;
  thumbnailImage: string | null;
  businessImages: string[];
  businessDescription: string | null;
  promotions: IPromotion[];
  events: IEvent[];
  spotlightFeature: boolean;
  rating: number;
  reviewsCount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
