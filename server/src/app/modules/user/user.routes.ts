import { Router } from 'express';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import {
  UserQuerySchema,
  AdminUpdateUserStatusSchema,
} from '@/app/modules/user/user.schemas';
import {
  getAllUsersController,
  getUserDetailsController,
  updateUserStatusController,
} from '@/app/modules/user/user.controllers';

const router = Router();

// ========================
// Admin User Management Routes
// ========================

router
  .route('/admin/users')
  .get(
    checkAdminAccessToken,
    isAdmin,
    validateReqQuery(UserQuerySchema),
    getAllUsersController
  );

router
  .route('/admin/users/:id')
  .get(
    checkAdminAccessToken,
    isAdmin,
    getUserDetailsController
  );

router
  .route('/admin/users/:id/status')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    validateReqBody(AdminUpdateUserStatusSchema),
    updateUserStatusController
  );

export default router;
