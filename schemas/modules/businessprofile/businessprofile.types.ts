import { Document, Types } from 'mongoose';

export interface ISocialLink {
  platform: string;
  url: string;
}

export interface IBusinessProfile extends Document {
  userId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  firstName: string;
  lastName: string;
  brandName?: string;
  email: string;
  profileAvatar?: string;
  businessOwnerType?: string;
  businessType?: string;
  countryId?: Types.ObjectId;
  tagLine?: string;
  bio?: string;
  socialLinks?: ISocialLink[];
  status: string;
  followersCount: number;
  followingCount: number;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
