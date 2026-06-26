import { Document } from "mongoose";

export interface ICountry extends Document {
  countryName: string;
  countryCode: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
