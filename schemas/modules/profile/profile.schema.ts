import { Schema, model, Model, Types } from "mongoose";
import { IProfile } from "@/profile/profile.types";

const ProfileSchema = new Schema<IProfile>(
  {
    // Define your schema properties here
    userId: { type: Types.ObjectId, ref: "User", required: true },
    profileAvatar: { type: String, default: null },
    interest: [{ type: String }],
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const ProfileModel: Model<IProfile> = model<IProfile>(
  "Profile",
  ProfileSchema,
);
