import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '@/app/schemas/user/user.types';
import { IProfile } from '@/app/schemas/profile/profile.types';
import { ILegal } from '@/app/schemas/legal/legal.types';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | IUser;
      profile: IProfile;
      fileLimit?: number;
      fieldName?: string;
      requireAtLeastOne?: boolean;
      allOptional?: boolean;
      fieldConfig?: FieldConfig[];
      fileRequired: boolean;
      files?: { [fieldname: string]: Express.Multer.File[] };
      tokenTtl?: number;
      validatedQuery?: unknown;
      legalDoc: ILegal;
    }
  }
}
