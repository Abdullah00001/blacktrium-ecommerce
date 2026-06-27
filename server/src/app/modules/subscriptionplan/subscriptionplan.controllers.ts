import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  TCreateSubscriptionPlan,
  TUpdateSubscriptionPlan,
  TAdminUpdateSubscriptionPlan,
  TSubscriptionPlanQuery,
} from '@/app/modules/subscriptionplan/subscriptionplan.schemas';
import {
  createSubscriptionPlanService,
  getAllSubscriptionPlansService,
  getSubscriptionPlanByIdService,
  updateSubscriptionPlanService,
} from '@/app/modules/subscriptionplan/subscriptionplan.services';

export const createSubscriptionPlanController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const payload = req.body as TCreateSubscriptionPlan;

    const data = await createSubscriptionPlanService({ payload });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Subscription plan created successfully',
      data,
      traceId,
    });
  }
);

export const getAllSubscriptionPlansController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = (req as any).validatedQuery as TSubscriptionPlanQuery;

    const data = await getAllSubscriptionPlansService({ query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Subscription plans retrieved successfully',
      data,
      traceId,
    });
  }
);

export const getSubscriptionPlanByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };

    const data = await getSubscriptionPlanByIdService({ id });

    if (!data) {
      res.status(404).json({
        success: false,
        status: 404,
        message: 'Subscription plan not found',
        traceId,
      });
      return;
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Subscription plan retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateSubscriptionPlanController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };
    const payload = req.body as TUpdateSubscriptionPlan;

    const data = await updateSubscriptionPlanService({ id, payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Subscription plan updated successfully',
      data,
      traceId,
    });
  }
);

export const adminUpdateSubscriptionPlanController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };
    const payload = req.body as TAdminUpdateSubscriptionPlan;

    const data = await updateSubscriptionPlanService({ id, payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Subscription plan details updated successfully',
      data,
      traceId,
    });
  }
);
