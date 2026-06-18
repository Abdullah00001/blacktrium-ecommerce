import { Schema, model, Model } from 'mongoose';
import { IProfile } from './profile.types';

const ProfileSchema = new Schema<IProfile>({
  // Define your schema properties here
}, {
  timestamps: true
});

export const ProfileModel: Model<IProfile> = model<IProfile>('Profile', ProfileSchema);
