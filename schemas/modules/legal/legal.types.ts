import { Document } from "mongoose";

export enum UserType {
  USER = "user",
  ORGANIZER = "organizer",
  MERCHANT = "merchant",
}

export enum ContentType {
  PRIVACY = "privacy",
  TERMS = "terms",
  ABOUT = "about",
  MISSION = "mission",
}

export interface ILegal extends Document {
  targetRole: UserType;
  contentType: ContentType;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
