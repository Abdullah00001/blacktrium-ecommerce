import { Schema, model, Model } from "mongoose";
import { IProductCategory } from "@/productcategory/productcategory.types";

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    categoryName: { type: String, required: true, index: true },
    status: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  },
);

export const ProductCategoryModel: Model<IProductCategory> =
  model<IProductCategory>("ProductCategory", ProductCategorySchema);
