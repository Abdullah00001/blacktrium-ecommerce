import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
