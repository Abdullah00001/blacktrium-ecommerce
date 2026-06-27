import { Router } from 'express';
import {
  createSubscriptionPlanController,
  getAllSubscriptionPlansController,
  getSubscriptionPlanByIdController,
  updateSubscriptionPlanController,
  adminUpdateSubscriptionPlanController,
} from '@/app/modules/subscriptionplan/subscriptionplan.controllers';
import {
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema,
  adminUpdateSubscriptionPlanSchema,
  subscriptionPlanQuerySchema,
} from '@/app/modules/subscriptionplan/subscriptionplan.schemas';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  checkAdminAccessToken,
  isAdmin,
  findUserById,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

// ========================
// Developer Routes (No credentials required)
// ========================
router
  .route('/dev/subscription-plan')
  .post(
    validateReqBody(createSubscriptionPlanSchema),
    createSubscriptionPlanController
  );

router
  .route('/dev/subscription-plan/:id')
  .patch(
    validateReqBody(updateSubscriptionPlanSchema),
    updateSubscriptionPlanController
  );

// ========================
// Admin Routes (Credentials required)
// ========================
router
  .route('/admin/subscription-plan/:id/details')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqBody(adminUpdateSubscriptionPlanSchema),
    adminUpdateSubscriptionPlanController
  );

// ========================
// Public / App Routes
// ========================
router
  .route('/subscription-plan')
  .get(
    validateReqQuery(subscriptionPlanQuerySchema),
    getAllSubscriptionPlansController
  );

router
  .route('/subscription-plan/:id')
  .get(
    getSubscriptionPlanByIdController
  );

export default router;
