import { Router } from 'express';
import { validateReqQuery } from '@/app/utils/system.utils';
import {
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import { SubscriberQuerySchema } from '@/app/modules/subscriber/subscriber.schemas';
import { getAllSubscribersController } from '@/app/modules/subscriber/subscriber.controllers';

const router = Router();

// ========================
// Admin Subscriber Routes
// ========================

router
  .route('/admin/subscribers')
  .get(
    checkAdminAccessToken,
    isAdmin,
    validateReqQuery(SubscriberQuerySchema),
    getAllSubscribersController
  );

export default router;
