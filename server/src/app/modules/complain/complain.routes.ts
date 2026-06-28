import { Router } from 'express';
import { validateReqQuery } from '@/app/utils/system.utils';
import {
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import { ComplainQuerySchema } from '@/app/modules/complain/complain.schemas';
import {
  getComplainsController,
  deleteComplainController,
} from '@/app/modules/complain/complain.controllers';

const router = Router();

// ========================
// Admin Complains Routes
// ========================

router
  .route('/admin/complains')
  .get(
    checkAdminAccessToken,
    isAdmin,
    validateReqQuery(ComplainQuerySchema),
    getComplainsController
  );

router
  .route('/admin/complains/:id')
  .delete(
    checkAdminAccessToken,
    isAdmin,
    deleteComplainController
  );

export default router;
