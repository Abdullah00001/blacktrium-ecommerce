import { Router } from 'express';
import { 
  getAdminDashboardController, 
  getUserDashboardHomeController,
  getMerchantDashboardController
} from '@/app/modules/dashboard/dashboard.controllers';
import {
  checkAdminAccessToken,
  findUserById,
  isAdmin,
  checkAccessToken,
  checkAccountStatus,
} from '@/app/modules/auth/auth.middlewares';
import { requireMerchantShop } from '@/app/modules/wallet/wallet.middlewares';

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

// ========================
// User Dashboard Routes
// ========================

// GET User App Home Screen Data (Authenticated)
router
  .route('/dashboard/home')
  .get(checkAccessToken, checkAccountStatus, getUserDashboardHomeController);

// ========================
// Merchant Dashboard Routes
// ========================

// GET Merchant Business Profile Dashboard
router
  .route('/dashboard/merchant')
  .get(
    checkAccessToken,
    checkAccountStatus,
    requireMerchantShop,
    getMerchantDashboardController
  );

export default router;
