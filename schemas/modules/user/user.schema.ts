import { Schema, model, Model } from "mongoose";
import { AccountStatus, IUser } from "@/user/user.types";

const UserSchema = new Schema<IUser>(
  {
    // Define your schema properties here
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    accountStatus: {
      type: String,
      enum: AccountStatus,
      default: AccountStatus.ACTIVE,
    },
    isLegalTermsAccepted: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
