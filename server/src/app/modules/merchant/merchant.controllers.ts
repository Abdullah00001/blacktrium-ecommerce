import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  createMerchantService,
  getMyMerchantService,
  getMerchantByIdService,
  updateMerchantService,
  getAllMerchantsService,
  updateMerchantStatusService,
} from '@/app/modules/merchant/merchant.services';
import {
  TCreateMerchant,
  TUpdateMerchant,
  TMerchantQuery,
  TAdminUpdateMerchantStatus,
} from '@/app/modules/merchant/merchant.schemas';
import { IUser } from '@/app/schemas/user/user.types';

// ========================
// Merchant Controllers
// ========================

export const createMerchantController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TCreateMerchant;

    const data = await createMerchantService({
      userId: user._id.toString(),
      payload,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Merchant shop created successfully',
      data,
      traceId,
    });
  }
);

export const getMyMerchantController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;

    const data = await getMyMerchantService({
      userId: user._id.toString(),
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'My merchant shop retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getMerchantByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;

    const data = await getMerchantByIdService({ id });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Merchant shop retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateMerchantController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    const payload = req.body as TUpdateMerchant;

    const data = await updateMerchantService({
      id,
      payload,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Merchant shop updated successfully',
      data,
      traceId,
    });
  }
);

export const getAllMerchantsController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = req.query as unknown as TMerchantQuery;

    const data = await getAllMerchantsService({ query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Merchant shops retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateMerchantStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    const { status } = req.body as TAdminUpdateMerchantStatus;

    const data = await updateMerchantStatusService({
      id,
      status,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Merchant shop status updated successfully',
      data,
      traceId,
    });
  }
);
