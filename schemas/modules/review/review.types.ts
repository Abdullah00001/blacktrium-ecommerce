import { Document, Types } from 'mongoose';

export interface IReviewReply {
  text: string;
  repliedBy: Types.ObjectId; // User ID (usually merchant owner)
  createdAt: Date;
}

export interface IReview extends Document {
  targetId: Types.ObjectId; // e.g. BusinessProfile ID
  userId: Types.ObjectId; // User leaving the review
  rating: number; // 1 to 5
  text?: string;
  image?: string;
  isAnonymous: boolean;
  replies: IReviewReply[];
  createdAt: Date;
  updatedAt: Date;
}
