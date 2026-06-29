import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  getMyBusinessProfileService,
  getBusinessProfileByIdService,
  updateBusinessProfileService,
  getAllBusinessProfilesService,
  updateBusinessProfileStatusService,
  getRecommendedBusinessProfilesService,
} from '@/app/modules/businessprofile/businessprofile.services';
import {
  TUpdateBusinessProfile,
  TBusinessProfileQuery,
  TAdminUpdateBusinessProfileStatus,
} from '@/app/modules/businessprofile/businessprofile.schemas';
import { IUser } from '@/app/schemas/user/user.types';

export const getMyBusinessProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;

    const data = await getMyBusinessProfileService({
      userId: user._id.toString(),
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Business profile retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getBusinessProfileByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };

    const data = await getBusinessProfileByIdService({ id });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Business profile retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateBusinessProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TUpdateBusinessProfile;

    const data = await updateBusinessProfileService({ userId: user._id.toString(), payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Business profile updated successfully',
      data,
      traceId,
    });
  }
);

export const getAllBusinessProfilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = (req as any).validatedQuery as TBusinessProfileQuery;

    const data = await getAllBusinessProfilesService({ query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Business profiles retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateBusinessProfileStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };
    const { status } = req.body as TAdminUpdateBusinessProfileStatus;

    const data = await updateBusinessProfileStatusService({ id, status });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Business profile status updated successfully',
      data,
      traceId,
    });
  }
);

export const getRecommendedBusinessProfilesController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;

    const data = await getRecommendedBusinessProfilesService({
      userId: user?._id.toString() || null,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Recommended business profiles retrieved successfully',
      data,
      traceId,
    });
  }
);
