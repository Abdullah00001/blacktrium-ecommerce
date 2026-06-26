import { Document, Types } from "mongoose";

export interface ISubcategory extends Document {
  categoryId: Types.ObjectId;
  subCategoryName: string;
  createdAt: Date;
  updatedAt: Date;
}
