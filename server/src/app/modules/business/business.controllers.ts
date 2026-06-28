import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  createBusinessService,
  getMyBusinessesService,
  getBusinessByIdService,
  updateBusinessService,
  getAllBusinessesService,
  updateBusinessStatusService,
} from '@/app/modules/business/business.services';
import {
  TCreateBusiness,
  TUpdateBusiness,
  TBusinessQuery,
  TAdminUpdateBusinessStatus,
} from '@/app/modules/business/business.schemas';
import { IUser } from '@/app/schemas/user/user.types';

export const createBusinessController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TCreateBusiness;

    const data = await createBusinessService({
      userId: user._id.toString(),
      payload,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Business created successfully',
      data,
      traceId,
    });
  }
);

export const getMyBusinessesController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;

    const data = await getMyBusinessesService({
      userId: user._id.toString(),
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Businesses retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getBusinessByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };

    const data = await getBusinessByIdService({ id });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Business retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateBusinessController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };
    const user = req.user as IUser;
    const payload = req.body as TUpdateBusiness;

    const data = await updateBusinessService({ id, userId: user._id.toString(), payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Business updated successfully',
      data,
      traceId,
    });
  }
);

export const getAllBusinessesController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = (req as any).validatedQuery as TBusinessQuery;

    const data = await getAllBusinessesService({ query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Businesses retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateBusinessStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };
    const { status } = req.body as TAdminUpdateBusinessStatus;

    const data = await updateBusinessStatusService({ id, status });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Business status updated successfully',
      data,
      traceId,
    });
  }
);
