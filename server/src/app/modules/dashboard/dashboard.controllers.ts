import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { getAdminDashboardOverviewService } from '@/app/modules/dashboard/dashboard.services';

export const getAdminDashboardController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = {
      chartType: req.query.chartType as string | undefined,
      year: req.query.year as string | undefined
    };

    const data = await getAdminDashboardOverviewService(query);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Admin dashboard overview retrieved successfully',
      data,
      traceId,
    });
  }
);
