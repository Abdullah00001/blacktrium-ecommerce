import { Document, Schema } from "mongoose";

export interface IProfile extends Document {
  userId:Schema.Types.ObjectId;
  profileAvatar:string|null;
  interest:string[];
  country:string;
  createdAt: Date;
  updatedAt: Date;
}
