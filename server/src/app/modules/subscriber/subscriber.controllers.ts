import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { getAllSubscribersService } from '@/app/modules/subscriber/subscriber.services';

export const getAllSubscribersController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const data = await getAllSubscribersService(req.query);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Subscribers retrieved successfully',
      data,
      traceId,
    });
  }
);
