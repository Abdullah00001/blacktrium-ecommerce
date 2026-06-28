import { Router } from 'express';
import { getAdminDashboardController } from '@/app/modules/dashboard/dashboard.controllers';
import {
  checkAdminAccessToken,
  findUserById,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

// ========================
// Admin Dashboard Routes
// ========================

// GET admin dashboard overview metrics
router
  .route('/admin/dashboard')
  .get(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    getAdminDashboardController
  );

export default router;
