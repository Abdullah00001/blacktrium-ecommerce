import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { IUser } from '@/app/schemas/user/user.types';
import {
  createOrderService,
  getMyOrdersService,
  getMerchantOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
} from '@/app/modules/order/order.services';
import {
  TCreateOrder,
  TOrderQuery,
  TUpdateOrderStatus,
} from '@/app/modules/order/order.schemas';

// ========================
// Order Controllers
// ========================

export const createOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TCreateOrder;

    const data = await createOrderService({
      buyerId: user._id.toString(),
      payload,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Order created successfully',
      data,
      traceId,
    });
  }
);

export const getMyOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const query = req.query as unknown as TOrderQuery;

    const data = await getMyOrdersService({
      buyerId: user._id.toString(),
      query,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Orders retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getMerchantOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const merchantId = (req as any).merchantId as string;
    const query = req.query as unknown as TOrderQuery;

    const data = await getMerchantOrdersService({
      merchantId,
      query,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Merchant orders retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getOrderByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;

    const data = await getOrderByIdService({ id });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Order retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateOrderStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    const payload = req.body as TUpdateOrderStatus;

    const data = await updateOrderStatusService({ id, payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Order status updated successfully',
      data,
      traceId,
    });
  }
);
