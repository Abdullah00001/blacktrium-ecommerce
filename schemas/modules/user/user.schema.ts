import { Schema, model, Model } from "mongoose";
import { IUser } from "@/user/user.types";

const UserSchema = new Schema<IUser>(
  {
    // Define your schema properties here
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

export const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
