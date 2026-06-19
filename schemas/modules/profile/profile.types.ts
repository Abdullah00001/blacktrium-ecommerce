import { Document, Types } from 'mongoose';

export interface IProfile extends Document {
  _id: Types.ObjectId;
  userId:Types.ObjectId;
  profileAvatar:string|null;
  interest:string[];
  country:string;
  createdAt: Date;
  updatedAt: Date;
}
