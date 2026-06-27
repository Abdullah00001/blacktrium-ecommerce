import { Router } from 'express';
import {
  getMyTransactionsController,
  requestWithdrawalController,
  updateTransactionStatusController,
} from '@/app/modules/transaction/transaction.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  TransactionQuerySchema,
  RequestWithdrawalSchema,
  AdminUpdateTransactionStatusSchema,
} from '@/app/modules/transaction/transaction.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  findUserById,
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import { requireMerchantShop } from '@/app/modules/wallet/wallet.middlewares';
import { checkTransactionExists } from '@/app/modules/transaction/transaction.middlewares';

const router = Router();

// ========================
// Transaction Routes
// ========================

// GET my transactions (Authenticated + Merchant)
router
  .route('/transaction/me')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    requireMerchantShop,
    validateReqQuery(TransactionQuerySchema),
    getMyTransactionsController
  );

// POST request withdrawal (Authenticated + Merchant)
router
  .route('/transaction/withdraw')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    requireMerchantShop,
    validateReqBody(RequestWithdrawalSchema),
    requestWithdrawalController
  );

// ========================
// Admin Transaction Routes
// ========================

// PATCH update transaction status (Admin)
router
  .route('/admin/transaction/:id/status')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    checkTransactionExists,
    validateReqBody(AdminUpdateTransactionStatusSchema),
    updateTransactionStatusController
  );

export default router;
