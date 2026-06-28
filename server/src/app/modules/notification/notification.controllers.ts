import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { sendCustomNotificationService } from '@/app/modules/notification/notification.services';
import { TCustomNotification } from '@/app/modules/notification/notification.schemas';

export const sendCustomNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const payload = req.body as TCustomNotification;

    await sendCustomNotificationService({ payload, traceId });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Notifications dispatched successfully',
      data: null,
      traceId,
    });
  }
);
