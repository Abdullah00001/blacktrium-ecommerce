import { Schema, model, Model } from "mongoose";
import { ISubscriptionplan } from "@/subscriptionplan/subscriptionplan.types";

const SubscriptionplanSchema = new Schema<ISubscriptionplan>(
  {
    revenueCatId: { type: String, required: true, unique: true },
    packageId: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    planTier: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    billingPeriod: { type: String, required: true },
    status: { type: String, default: "active" },
  },
  {
    timestamps: true,
  },
);

export const SubscriptionplanModel: Model<ISubscriptionplan> =
  model<ISubscriptionplan>("Subscriptionplan", SubscriptionplanSchema);
