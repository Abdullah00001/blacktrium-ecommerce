import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { SubscriptionModel } from '@/app/schemas/subscription/subscription.schema';
import { IUser } from '@/app/schemas/user/user.types';
import { Types } from 'mongoose';

// ========================
// Subscription Middlewares
// ========================

export const checkActiveSubscription = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const traceId = getTraceId();
    const user = req.user as IUser;

    const subscription = await SubscriptionModel.findOne({
      userId: new Types.ObjectId(user._id.toString()),
      status: 'active',
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'A subscription is required to create a business profile. Please purchase a plan to continue.',
        traceId,
      });
    }

    (req as any).subscription = subscription;
    return next();
  }
);
