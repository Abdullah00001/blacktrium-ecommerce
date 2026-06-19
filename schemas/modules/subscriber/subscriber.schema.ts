import { Schema, model, Model } from "mongoose";
import { ISubscriber, SubscribeStatus } from "@/subscriber/subscriber.types";

const SubscriberSchema = new Schema<ISubscriber>(
  {
    // Define your schema properties here
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User",default:null },
    subscribeStatus: {
      type: String,
      enum: SubscribeStatus,
      default: SubscribeStatus.SUBSCRIBED,
    },
  },
  {
    timestamps: true,
  },
);

export const SubscriberModel: Model<ISubscriber> = model<ISubscriber>(
  "Subscriber",
  SubscriberSchema,
);
