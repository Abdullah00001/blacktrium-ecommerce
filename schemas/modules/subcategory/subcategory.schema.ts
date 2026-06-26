import { Schema, model, Model } from "mongoose";
import { ISubcategory } from "@/subcategory/subcategory.types";

const SubcategorySchema = new Schema<ISubcategory>(
  {
    // Define your schema properties here
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    subCategoryName: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  },
);

export const SubcategoryModel: Model<ISubcategory> = model<ISubcategory>(
  "Subcategory",
  SubcategorySchema,
);
