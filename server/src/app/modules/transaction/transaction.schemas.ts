import { z } from 'zod';

export const RequestWithdrawalSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
});

export type TRequestWithdrawal = z.infer<typeof RequestWithdrawalSchema>;

export const AdminUpdateTransactionStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'failed']),
  stripeTransferId: z.string().optional(),
});

export type TAdminUpdateTransactionStatus = z.infer<typeof AdminUpdateTransactionStatusSchema>;

export const TransactionQuerySchema = z.object({
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
  type: z.enum(['earning', 'withdrawal']).optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'failed']).optional(),
});

export type TTransactionQuery = z.infer<typeof TransactionQuerySchema>;
