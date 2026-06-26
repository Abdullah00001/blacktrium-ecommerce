import { Document } from 'mongoose';

export interface ICategory extends Document {
  categoryName:string,
  categoryImage:string,
  status:boolean,
  createdAt: Date;
  updatedAt: Date;
}
