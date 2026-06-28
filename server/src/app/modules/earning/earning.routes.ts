import { Router } from 'express';
import { validateReqQuery } from '@/app/utils/system.utils';
import {
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import { EarningQuerySchema } from '@/app/modules/earning/earning.schemas';
import {
  getAdminEarningStatsController,
  getAdminSubscriptionEarningsController,
  getAdminCommissionEarningsController,
} from '@/app/modules/earning/earning.controllers';

const router = Router();

// ========================
// Admin Earning Routes
// ========================

router
  .route('/admin/earning/stats')
  .get(
    checkAdminAccessToken,
    isAdmin,
    getAdminEarningStatsController
  );

router
  .route('/admin/earning/subscriptions')
  .get(
    checkAdminAccessToken,
    isAdmin,
    validateReqQuery(EarningQuerySchema),
    getAdminSubscriptionEarningsController
  );

router
  .route('/admin/earning/commissions')
  .get(
    checkAdminAccessToken,
    isAdmin,
    validateReqQuery(EarningQuerySchema),
    getAdminCommissionEarningsController
  );

export default router;
