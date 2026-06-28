import { Document, Types } from 'mongoose';

export interface IBusinessProfile extends Document {
  userId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
