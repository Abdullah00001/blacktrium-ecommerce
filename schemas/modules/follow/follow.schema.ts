import { Schema, model, Model } from 'mongoose';
import { IFollow } from '@/follow/follow.types';

const FollowSchema = new Schema<IFollow>({
  followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  targetId: { type: Schema.Types.ObjectId, required: true, refPath: 'targetType', index: true },
  targetType: { type: String, required: true, enum: ['BusinessProfile', 'Merchant'], index: true },
}, {
  timestamps: true
});

// Ensure a user can only follow a target once
FollowSchema.index({ followerId: 1, targetId: 1, targetType: 1 }, { unique: true });

export const FollowModel: Model<IFollow> = model<IFollow>('Follow', FollowSchema);
