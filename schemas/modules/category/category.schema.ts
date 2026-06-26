import { Schema, model, Model } from "mongoose";
import { ICategory } from "@/category/category.types";

const CategorySchema = new Schema<ICategory>(
  {
    // Define your schema properties here
    categoryName: { type: String, required: true, index: true },
    categoryImage: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const CategoryModel: Model<ICategory> = model<ICategory>(
  "Category",
  CategorySchema,
);
