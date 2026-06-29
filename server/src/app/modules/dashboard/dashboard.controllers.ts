import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { 
  getAdminDashboardOverviewService,
  getUserDashboardHomeService,
  getMerchantDashboardService
} from '@/app/modules/dashboard/dashboard.services';
import { IUser } from '@/app/schemas/user/user.types';
import { IMerchant } from '@/app/schemas/merchant/merchant.types';

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

export const getUserDashboardHomeController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const data = await getUserDashboardHomeService(user._id.toString());

    res.status(200).json({
      success: true,
      status: 200,
      message: 'App Home dashboard retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getMerchantDashboardController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const merchantId = (req as any).merchantId;
    
    const data = await getMerchantDashboardService(merchantId);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Merchant dashboard retrieved successfully',
      data,
      traceId,
    });
  }
);
