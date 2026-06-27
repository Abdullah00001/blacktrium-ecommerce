import { Schema, model, Model } from "mongoose";
import { AccountStatus, IUser, Role } from "@/user/user.types";

const UserSchema = new Schema<IUser>(
  {
    // Define your schema properties here
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, default: null },
    isVerified: { type: Boolean, default: false, index: true },
    accountStatus: {
      type: String,
      enum: AccountStatus,
      default: AccountStatus.ACTIVE,
      index: true,
    },
    role: { type: String, default: Role.USER, index: true },
    isLegalTermsAccepted: { type: Boolean, required: true },
    fcmToken: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
