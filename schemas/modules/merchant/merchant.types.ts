import { Document, Types } from 'mongoose';

export interface ISocialLink {
  platform: string;
  url: string;
}

export interface IMerchant extends Document {
  userId: Types.ObjectId;
  businessProfileId: Types.ObjectId;
  shopName: string;
  aboutShop: string;
  termsAndCondition: string;
  shopType: string;
  shopLink?: string | null;
  location: string;
  phone: string;
  socialLinks: ISocialLink[];
  profileImage: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
