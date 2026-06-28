import { Router } from 'express';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import { CustomNotificationSchema } from '@/app/modules/notification/notification.schemas';
import { sendCustomNotificationController } from '@/app/modules/notification/notification.controllers';

const router = Router();

// ========================
// Admin Notification Routes
// ========================

router
  .route('/admin/notification/custom')
  .post(
    checkAdminAccessToken,
    isAdmin,
    validateReqBody(CustomNotificationSchema),
    sendCustomNotificationController
  );

export default router;
