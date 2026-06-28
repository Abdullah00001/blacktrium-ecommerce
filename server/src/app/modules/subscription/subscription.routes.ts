import { Router } from 'express';
import {
  syncSubscriptionController,
  getMySubscriptionController,
  cancelSubscriptionController,
} from '@/app/modules/subscription/subscription.controllers';
import { validateReqBody } from '@/app/utils/system.utils';
import { SyncSubscriptionSchema } from '@/app/modules/subscription/subscription.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  findUserById,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

// ========================
// Subscription Routes
// ========================

router
  .route('/subscription/sync')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqBody(SyncSubscriptionSchema),
    syncSubscriptionController
  );

router
  .route('/subscription/me')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    getMySubscriptionController
  );

router
  .route('/subscription/cancel')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    cancelSubscriptionController
  );

export default router;
