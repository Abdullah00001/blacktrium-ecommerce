import { Schema, model, Model } from "mongoose";
import { ContentType, ILegal, UserType } from "@/legal/legal.types";

const LegalSchema = new Schema<ILegal>(
  {
    // Define your schema properties here
    targetRole: { type: String, enum: UserType, required: true, index: true },
    contentType: {
      type: String,
      enum: ContentType,
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const LegalModel: Model<ILegal> = model<ILegal>("Legal", LegalSchema);
