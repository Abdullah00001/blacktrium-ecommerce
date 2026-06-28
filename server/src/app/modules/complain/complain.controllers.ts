import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  getReportedReviewsService,
  deleteReportedReviewService,
} from '@/app/modules/complain/complain.services';

export const getComplainsController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const data = await getReportedReviewsService(req.query);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Complains retrieved successfully',
      data,
      traceId,
    });
  }
);

export const deleteComplainController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    
    await deleteReportedReviewService(id);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Complain and associated review removed successfully',
      data: null,
      traceId,
    });
  }
);
