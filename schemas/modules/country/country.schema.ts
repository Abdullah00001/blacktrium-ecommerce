import { Schema, model, Model } from "mongoose";
import { ICountry } from "@/country/country.types";

const CountrySchema = new Schema<ICountry>(
  {
    // Define your schema properties here
    countryName: { type: String, required: true, index: true },
    countryCode: { type: String, required: true, index: true },
    status: { type: Boolean,default:true,index:true },
  },
  {
    timestamps: true,
  },
);

export const CountryModel: Model<ICountry> = model<ICountry>(
  "Country",
  CountrySchema,
);
