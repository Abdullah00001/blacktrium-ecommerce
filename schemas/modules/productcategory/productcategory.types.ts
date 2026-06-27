import { Document } from "mongoose";

export interface IProductCategory extends Document {
  categoryName: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
