import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  getMyWalletService,
  connectStripeService,
} from '@/app/modules/wallet/wallet.services';
import { TConnectStripe } from '@/app/modules/wallet/wallet.schemas';

// ========================
// Wallet Controllers
// ========================

export const getMyWalletController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const merchantId = (req as any).merchantId as string;

    const data = await getMyWalletService({ merchantId });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Wallet retrieved successfully',
      data,
      traceId,
    });
  }
);

export const connectStripeController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const merchantId = (req as any).merchantId as string;
    const { stripeAccountId } = req.body as TConnectStripe;

    const data = await connectStripeService({
      merchantId,
      stripeAccountId,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Stripe account connected successfully',
      data,
      traceId,
    });
  }
);
