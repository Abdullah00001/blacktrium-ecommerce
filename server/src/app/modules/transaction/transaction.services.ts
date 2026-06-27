import { Types } from 'mongoose';
import { TransactionModel } from '@/app/schemas/transaction/transaction.schema';
import { WalletModel } from '@/app/schemas/wallet/wallet.schema';
import { ITransaction } from '@/app/schemas/transaction/transaction.types';
import {
  TTransactionQuery,
  TAdminUpdateTransactionStatus,
} from '@/app/modules/transaction/transaction.schemas';

export const getMyTransactionsService = async ({
  merchantId,
  query,
}: {
  merchantId: string;
  query: TTransactionQuery;
}): Promise<unknown> => {
  const { page = 1, limit = 10, type, status } = query;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {
    merchantId: new Types.ObjectId(merchantId),
  };

  if (type) filter.type = type;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    TransactionModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    TransactionModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      totalPages,
      links: {
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        firstPage: 1,
        lastPage: totalPages || 1,
      },
    },
  };
};

export const requestWithdrawalService = async ({
  merchantId,
  amount,
}: {
  merchantId: string;
  amount: number;
}): Promise<ITransaction> => {
  const merchantObjectId = new Types.ObjectId(merchantId);

  // 1. Fetch wallet
  const wallet = await WalletModel.findOne({ merchantId: merchantObjectId });

  if (!wallet) {
    throw new Error('Wallet not found');
  }

  // 2. Check balance
  if (wallet.balance < amount) {
    throw new Error('Insufficient balance');
  }

  // 3. Create pending withdrawal transaction
  const transaction = await TransactionModel.create({
    merchantId: merchantObjectId,
    type: 'withdrawal',
    amount,
    status: 'pending',
  });

  // 4. Deduct balance from wallet (Locking funds)
  wallet.balance -= amount;
  await wallet.save();

  return transaction;
};

// Admin Service
export const updateTransactionStatusService = async ({
  id,
  payload,
}: {
  id: string;
  payload: TAdminUpdateTransactionStatus;
}): Promise<ITransaction> => {
  const transaction = await TransactionModel.findById(id);

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  // If a withdrawal was rejected or failed, we must refund the wallet balance
  if (
    transaction.type === 'withdrawal' &&
    transaction.status === 'pending' &&
    (payload.status === 'rejected' || payload.status === 'failed')
  ) {
    await WalletModel.findOneAndUpdate(
      { merchantId: transaction.merchantId },
      { $inc: { balance: transaction.amount } }
    );
  }

  // Apply updates
  transaction.status = payload.status;
  if (payload.stripeTransferId) {
    transaction.stripeTransferId = payload.stripeTransferId;
  }

  await transaction.save();

  return transaction;
};
