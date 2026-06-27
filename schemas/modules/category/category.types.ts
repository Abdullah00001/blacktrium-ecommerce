import { Document } from 'mongoose';

export interface ICategory extends Document {
  categoryName:string,
  categoryImage:string,
  isPopular:boolean,
  status:boolean,
  createdAt: Date;
  updatedAt: Date;
}
