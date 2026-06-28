import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  getAdminEarningStatsService,
  getAdminSubscriptionEarningsService,
  getAdminCommissionEarningsService,
} from '@/app/modules/earning/earning.services';

export const getAdminEarningStatsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const traceId = getTraceId();
    const data = await getAdminEarningStatsService();

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Admin earning stats retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getAdminSubscriptionEarningsController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const data = await getAdminSubscriptionEarningsService(req.query);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Subscription earnings retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getAdminCommissionEarningsController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const data = await getAdminCommissionEarningsService(req.query);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Commission earnings retrieved successfully',
      data,
      traceId,
    });
  }
);
