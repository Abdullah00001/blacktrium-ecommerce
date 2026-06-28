import { Document, Types } from 'mongoose';

export interface IContact extends Document {
  email: string;
  phone: string;
  message: string;
  status: string; // 'pending' | 'resolved'
  userId?: Types.ObjectId; // Optional, if submitted by authenticated user
  createdAt: Date;
  updatedAt: Date;
}
