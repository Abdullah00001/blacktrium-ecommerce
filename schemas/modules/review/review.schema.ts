import { Schema, model, Model } from 'mongoose';
import { IReview } from '@/review/review.types';

const ReviewReplySchema = new Schema({
  text: { type: String, required: true },
  repliedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const ReviewReportSchema = new Schema({
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
}, { timestamps: true });

const ReviewSchema = new Schema<IReview>({
  targetId: { type: Schema.Types.ObjectId, required: true, refPath: 'targetType', index: true },
  targetType: { type: String, required: true, enum: ['Business', 'Product', 'BusinessProfile'] },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String },
  image: { type: String },
  isAnonymous: { type: Boolean, default: false },
  replies: { type: [ReviewReplySchema], default: [] },
  reports: { type: [ReviewReportSchema], default: [] },
}, {
  timestamps: true
});

export const ReviewModel: Model<IReview> = model<IReview>('Review', ReviewSchema);
