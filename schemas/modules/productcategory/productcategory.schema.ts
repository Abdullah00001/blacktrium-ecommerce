import { Schema, model, Model } from "mongoose";
import { IProductCategory } from "@/productcategory/productcategory.types";

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    // Define your schema properties here
    categoryName: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  },
);

export const ProductCategoryModel: Model<IProductCategory> =
  model<IProductCategory>("ProductCategory", ProductCategorySchema);
