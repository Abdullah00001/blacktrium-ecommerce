import { Types } from 'mongoose';
import { ReviewModel } from '@/app/schemas/review/review.schema';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { IReview } from '@/app/schemas/review/review.types';
import {
  TCreateReview,
  TReviewQuery,
  TReplyReview,
} from '@/app/modules/review/review.schemas';

// Helper to update BusinessProfile ratings
const updateBusinessRating = async (targetId: Types.ObjectId) => {
  const result = await ReviewModel.aggregate([
    { $match: { targetId } },
    {
      $group: {
        _id: '$targetId',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    const { averageRating, reviewsCount } = result[0];
    await BusinessProfileModel.findByIdAndUpdate(targetId, {
      $set: {
        rating: Math.round(averageRating * 10) / 10,
        reviewsCount,
      },
    });
  }
};

export const createReviewService = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: TCreateReview;
}): Promise<IReview> => {
  const targetObjectId = new Types.ObjectId(payload.targetId);

  // Check if business exists
  const business = await BusinessProfileModel.findById(targetObjectId);
  if (!business) {
    throw new Error('Business Profile not found');
  }

  // Check if user already reviewed
  const existingReview = await ReviewModel.findOne({
    userId: new Types.ObjectId(userId),
    targetId: targetObjectId,
  });

  if (existingReview) {
    throw new Error('You have already reviewed this business');
  }

  const review = await ReviewModel.create({
    userId: new Types.ObjectId(userId),
    targetId: targetObjectId,
    rating: payload.rating,
    text: payload.text,
    image: payload.image,
    isAnonymous: payload.isAnonymous,
  });

  // Update business aggregate
  await updateBusinessRating(targetObjectId);

  return review;
};

export const getReviewsByTargetIdService = async ({
  targetId,
  query,
}: {
  targetId: string;
  query: TReviewQuery;
}): Promise<unknown> => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const filter = { targetId: new Types.ObjectId(targetId) };

  const [data, total] = await Promise.all([
    ReviewModel.find(filter)
      .populate('userId', 'firstName lastName profileImage')
      .populate('replies.repliedBy', 'firstName lastName profileImage')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    ReviewModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      totalPages,
      links: {
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
    },
  };
};

export const replyToReviewService = async ({
  reviewId,
  merchantUserId,
  payload,
}: {
  reviewId: string;
  merchantUserId: string;
  payload: TReplyReview;
}): Promise<IReview> => {
  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    throw new Error('Review not found');
  }

  // Ensure the merchant replying is actually the owner of the target business
  const business = await BusinessProfileModel.findById(review.targetId);
  if (!business || business.userId.toString() !== merchantUserId) {
    throw new Error('You do not have permission to reply to this review');
  }

  review.replies.push({
    text: payload.text,
    repliedBy: new Types.ObjectId(merchantUserId),
    createdAt: new Date(),
  });

  await review.save();

  return review;
};
