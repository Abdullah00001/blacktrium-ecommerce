import { Document } from "mongoose";

export interface IProductCategory extends Document {
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
}
