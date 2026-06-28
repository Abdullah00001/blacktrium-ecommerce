import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { IUser } from '@/app/schemas/user/user.types';
import {
  createReviewService,
  getReviewsByTargetIdService,
  replyToReviewService,
  reportReviewService,
} from '@/app/modules/review/review.services';
import {
  TCreateReview,
  TReviewQuery,
  TReplyReview,
  TReportReview,
} from '@/app/modules/review/review.schemas';

export const createReviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TCreateReview;

    const data = await createReviewService({
      userId: user._id.toString(),
      payload,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Review created successfully',
      data,
      traceId,
    });
  }
);

export const getReviewsByTargetIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const targetId = req.params.targetId as string;
    const query = req.query as unknown as TReviewQuery;

    const data = await getReviewsByTargetIdService({ targetId, query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Reviews retrieved successfully',
      data,
      traceId,
    });
  }
);

export const replyToReviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const reviewId = req.params.id as string;
    const user = req.user as IUser;
    const payload = req.body as TReplyReview;

    const data = await replyToReviewService({
      reviewId,
      merchantUserId: user._id.toString(),
      payload,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Reply added successfully',
      data,
      traceId,
    });
  }
);

export const reportReviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const { id } = req.params as { id: string };
    const payload = req.body as TReportReview;

    const data = await reportReviewService({
      reviewId: id,
      userId: user._id.toString(),
      payload,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Review reported successfully',
      data,
      traceId,
    });
  }
);
