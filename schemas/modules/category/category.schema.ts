import { Schema, model, Model } from "mongoose";
import { ICategory } from "@/category/category.types";

const CategorySchema = new Schema<ICategory>(
  {
    // Define your schema properties here
    categoryName: { type: String, required: true, index: true },
    categoryImage: { type: String, required: true },
    isPopular: { type: Boolean, default: false, index: true },
    status:{type:Boolean,default:true,index:true},
  },
  {
    timestamps: true,
  },
);

export const CategoryModel: Model<ICategory> = model<ICategory>(
  "Category",
  CategorySchema,
);
