import { Router } from 'express';
import {
  getMyWalletController,
  connectStripeController,
} from '@/app/modules/wallet/wallet.controllers';
import { validateReqBody } from '@/app/utils/system.utils';
import { ConnectStripeSchema } from '@/app/modules/wallet/wallet.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  findUserById,
} from '@/app/modules/auth/auth.middlewares';
import { requireMerchantShop } from '@/app/modules/wallet/wallet.middlewares';

const router = Router();

// ========================
// Wallet Routes
// ========================

// GET my wallet (Authenticated + Merchant)
router
  .route('/wallet/me')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    requireMerchantShop,
    getMyWalletController
  );

// POST connect stripe account (Authenticated + Merchant)
router
  .route('/wallet/connect-stripe')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    requireMerchantShop,
    validateReqBody(ConnectStripeSchema),
    connectStripeController
  );

export default router;
