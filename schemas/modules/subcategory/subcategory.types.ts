import { Document, Types } from "mongoose";

export interface ISubcategory extends Document {
  categoryId: Types.ObjectId;
  subCategoryName: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
