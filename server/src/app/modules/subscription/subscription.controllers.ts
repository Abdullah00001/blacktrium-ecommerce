import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  syncSubscriptionService,
  getMySubscriptionService,
} from '@/app/modules/subscription/subscription.services';
import { IUser } from '@/app/schemas/user/user.types';
import { TSyncSubscription } from '@/app/modules/subscription/subscription.schemas';

// ========================
// Subscription Controllers
// ========================

export const syncSubscriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TSyncSubscription;

    const data = await syncSubscriptionService({
      userId: user._id.toString(),
      payload,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Subscription synced successfully',
      data,
      traceId,
    });
  }
);

export const getMySubscriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;

    const data = await getMySubscriptionService({ userId: user._id.toString() });

    res.status(200).json({
      success: true,
      status: 200,
      message: data ? 'Active subscription found' : 'No active subscription found',
      data,
      traceId,
    });
  }
);
