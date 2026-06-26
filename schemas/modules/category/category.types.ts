import { Document } from 'mongoose';

export interface ICategory extends Document {
  categoryName:string,
  categoryImage:string,
  createdAt: Date;
  updatedAt: Date;
}
