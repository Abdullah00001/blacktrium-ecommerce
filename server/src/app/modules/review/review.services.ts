import { Types } from 'mongoose';
import { ReviewModel } from '@/app/schemas/review/review.schema';
import { BusinessModel } from '@/app/schemas/business/business.schema';
import { ProductModel } from '@/app/schemas/product/product.schema';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { IReview } from '@/app/schemas/review/review.types';
import {
  TCreateReview,
  TReviewQuery,
  TReplyReview,
  TReportReview,
} from '@/app/modules/review/review.schemas';

// Helper to update Target ratings (Business, Product, or BusinessProfile)
const updateTargetRating = async (targetId: Types.ObjectId, targetType: 'Business' | 'Product' | 'BusinessProfile') => {
  const result = await ReviewModel.aggregate([
    { $match: { targetId, targetType } },
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
    const updatePayload = {
      $set: {
        rating: Math.round(averageRating * 10) / 10,
        reviewsCount,
      },
    };
    if (targetType === 'Business') {
      await BusinessModel.findByIdAndUpdate(targetId, updatePayload);
    } else if (targetType === 'Product') {
      await ProductModel.findByIdAndUpdate(targetId, updatePayload);
    } else if (targetType === 'BusinessProfile') {
      await BusinessProfileModel.findByIdAndUpdate(targetId, updatePayload);
    }
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

  // Check if target exists
  if (payload.targetType === 'Business') {
    const business = await BusinessModel.findById(targetObjectId);
    if (!business) throw new Error('Business not found');
  } else if (payload.targetType === 'Product') {
    const product = await ProductModel.findById(targetObjectId);
    if (!product) throw new Error('Product not found');
  } else if (payload.targetType === 'BusinessProfile') {
    const businessProfile = await BusinessProfileModel.findById(targetObjectId);
    if (!businessProfile) throw new Error('Business Profile not found');
  } else {
    throw new Error('Invalid targetType');
  }

  // Check if user already reviewed
  const existingReview = await ReviewModel.findOne({
    userId: new Types.ObjectId(userId),
    targetId: targetObjectId,
    targetType: payload.targetType,
  });

  if (existingReview) {
    throw new Error('You have already reviewed this item');
  }

  const review = await ReviewModel.create({
    userId: new Types.ObjectId(userId),
    targetId: targetObjectId,
    targetType: payload.targetType,
    rating: payload.rating,
    text: payload.text,
    image: payload.image,
    isAnonymous: payload.isAnonymous,
  });

  // Update target aggregate
  await updateTargetRating(targetObjectId, payload.targetType);

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

  // Ensure the merchant replying is actually the owner of the target
  if (review.targetType === 'Business') {
    const business = await BusinessModel.findById(review.targetId).populate('businessProfileId');
    if (!business) throw new Error('You do not have permission to reply to this review');
    const businessProfile = business.businessProfileId as any; 
    if (!businessProfile || businessProfile.userId.toString() !== merchantUserId) {
      throw new Error('You do not have permission to reply to this review');
    }
  } else if (review.targetType === 'Product') {
    const product = await ProductModel.findById(review.targetId).populate('merchantId');
    if (!product) throw new Error('You do not have permission to reply to this review');
    const merchant = product.merchantId as any;
    if (!merchant || merchant.userId.toString() !== merchantUserId) {
      throw new Error('You do not have permission to reply to this review');
    }
  } else if (review.targetType === 'BusinessProfile') {
    const businessProfile = await BusinessProfileModel.findById(review.targetId);
    if (!businessProfile || businessProfile.userId.toString() !== merchantUserId) {
      throw new Error('You do not have permission to reply to this review');
    }
  }

  review.replies.push({
    text: payload.text,
    repliedBy: new Types.ObjectId(merchantUserId),
    createdAt: new Date(),
  });

  await review.save();

  return review;
};

export const reportReviewService = async ({
  reviewId,
  userId,
  payload,
}: {
  reviewId: string;
  userId: string;
  payload: TReportReview;
}): Promise<IReview> => {
  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    throw new Error('Review not found');
  }

  // Check if the user already reported this review
  const alreadyReported = review.reports?.some(r => r.reportedBy.toString() === userId);
  if (alreadyReported) {
    throw new Error('You have already reported this review');
  }

  review.reports.push({
    reportedBy: new Types.ObjectId(userId),
    reason: payload.reason,
    createdAt: new Date(),
  });

  await review.save();

  return review;
};
