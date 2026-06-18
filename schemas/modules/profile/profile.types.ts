import { Document } from 'mongoose';

export interface IProfile extends Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
