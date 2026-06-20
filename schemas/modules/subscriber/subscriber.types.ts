import { Document, Types } from "mongoose";

export enum SubscribeStatus {
  SUBSCRIBED = "subscribed",
  UNSUBSCRIBED = "unsubscribed",
}

export interface ISubscriber extends Document {
  userId: Types.ObjectId | null;
  firstName: string;
  lastName: string;
  email: string;
  subscribeStatus: SubscribeStatus;
  createdAt: Date;
  updatedAt: Date;
}
