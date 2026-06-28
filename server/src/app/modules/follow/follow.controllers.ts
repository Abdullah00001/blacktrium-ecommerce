import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { IUser } from '@/app/schemas/user/user.types';
import { toggleFollowService, checkFollowStatusService } from '@/app/modules/follow/follow.services';
import { TToggleFollow } from '@/app/modules/follow/follow.schemas';

export const toggleFollowController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TToggleFollow;

    const result = await toggleFollowService({ 
      followerId: user._id.toString(), 
      payload 
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: `Successfully ${(result as any).action}`,
      data: result,
      traceId,
    });
  }
);

export const checkFollowStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const { targetId, targetType } = req.query as { targetId: string; targetType: 'BusinessProfile' | 'Merchant' };

    if (!targetId || !targetType) {
      throw new Error('targetId and targetType are required query parameters');
    }

    const isFollowing = await checkFollowStatusService({
      followerId: user._id.toString(),
      targetId,
      targetType,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Follow status retrieved',
      data: { isFollowing },
      traceId,
    });
  }
);
