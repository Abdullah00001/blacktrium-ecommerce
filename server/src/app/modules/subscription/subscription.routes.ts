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
    validateReqBody(SyncSubscriptionSchema),
    syncSubscriptionController
  );

router
  .route('/subscription/me')
  .get(
    checkAccessToken,
    checkAccountStatus,
    getMySubscriptionController
  );

router
  .route('/subscription/cancel')
  .post(
    checkAccessToken,
    checkAccountStatus,
    cancelSubscriptionController
  );

export default router;
