import { Document } from "mongoose";

export enum AccountStatus {
  BLOCKED = "blocked",
  ACTIVE = "active",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  password: string;
  isVerified: boolean;
  accountStatus: AccountStatus;
  isLegalTermsAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
