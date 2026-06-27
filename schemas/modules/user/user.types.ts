import { Document } from "mongoose";

export enum AccountStatus {
  BLOCKED = "blocked",
  ACTIVE = "active",
}

export enum Role{
  ADMIN='admin',
  USER='user'
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
  role: Role;
  fcmToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}
