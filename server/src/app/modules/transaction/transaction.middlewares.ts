import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { TransactionModel } from '@/app/schemas/transaction/transaction.schema';

export const checkTransactionExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid transaction ID format',
      });
      return;
    }

    const transaction = await TransactionModel.findById(id);

    if (!transaction) {
      res.status(404).json({
        success: false,
        status: 404,
        message: 'Transaction not found',
      });
      return;
    }

    (req as any).transaction = transaction;

    next();
  } catch (error) {
    next(error);
  }
};
