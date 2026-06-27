import { Schema, model, Model } from 'mongoose';
import { IReview } from '@/review/review.types';

const ReviewReplySchema = new Schema({
  text: { type: String, required: true },
  repliedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const ReviewSchema = new Schema<IReview>({
  targetId: { type: Schema.Types.ObjectId, ref: 'BusinessProfile', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String },
  image: { type: String },
  isAnonymous: { type: Boolean, default: false },
  replies: { type: [ReviewReplySchema], default: [] },
}, {
  timestamps: true
});

export const ReviewModel: Model<IReview> = model<IReview>('Review', ReviewSchema);
