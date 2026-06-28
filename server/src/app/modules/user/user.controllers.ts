import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  getAllUsersService,
  getUserDetailsService,
  updateUserStatusService,
} from '@/app/modules/user/user.services';

export const getAllUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const data = await getAllUsersService(req.query);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Users retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getUserDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    const data = await getUserDetailsService(id);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User details retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateUserStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    const { status } = req.body;
    
    const data = await updateUserStatusService(id, status);

    res.status(200).json({
      success: true,
      status: 200,
      message: `User account status updated to ${status}`,
      data,
      traceId,
    });
  }
);
