import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  getMyTransactionsService,
  requestWithdrawalService,
  updateTransactionStatusService,
} from '@/app/modules/transaction/transaction.services';
import {
  TTransactionQuery,
  TRequestWithdrawal,
  TAdminUpdateTransactionStatus,
} from '@/app/modules/transaction/transaction.schemas';

// ========================
// Transaction Controllers
// ========================

export const getMyTransactionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const merchantId = (req as any).merchantId as string;
    const query = req.query as unknown as TTransactionQuery;

    const data = await getMyTransactionsService({ merchantId, query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Transactions retrieved successfully',
      data,
      traceId,
    });
  }
);

export const requestWithdrawalController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const merchantId = (req as any).merchantId as string;
    const { amount } = req.body as TRequestWithdrawal;

    const data = await requestWithdrawalService({ merchantId, amount });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Withdrawal request submitted successfully',
      data,
      traceId,
    });
  }
);

// Admin Controllers
export const updateTransactionStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    const payload = req.body as TAdminUpdateTransactionStatus;

    const data = await updateTransactionStatusService({ id, payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Transaction status updated successfully',
      data,
      traceId,
    });
  }
);
