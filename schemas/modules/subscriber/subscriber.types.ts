import { Document, Schema } from "mongoose";

export enum SubscribeStatus {
  SUBSCRIBED = "subscribed",
  UNSUBSCRIBED = "unsubscribed",
}

export interface ISubscriber extends Document {
  userId: Schema.Types.ObjectId | null;
  firstName: string;
  lastName: string;
  email: string;
  subscribeStatus: SubscribeStatus;
  createdAt: Date;
  updatedAt: Date;
}
