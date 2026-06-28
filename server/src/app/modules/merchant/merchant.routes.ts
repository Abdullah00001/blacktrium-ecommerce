import { Router } from 'express';
import {
  createMerchantController,
  getMyMerchantController,
  getMerchantByIdController,
  updateMerchantController,
  getAllMerchantsController,
  updateMerchantStatusController,
  getMerchantAnalyticsController,
} from '@/app/modules/merchant/merchant.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateMerchantSchema,
  UpdateMerchantSchema,
  MerchantQuerySchema,
  AdminUpdateMerchantStatusSchema,
} from '@/app/modules/merchant/merchant.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  findUserById,
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import {
  checkMerchantExists,
  checkMerchantOwnership,
} from '@/app/modules/merchant/merchant.middlewares';

const router = Router();

// ========================
// Merchant Routes
// ========================

// CREATE merchant shop (Authenticated)
router
  .route('/merchant')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqBody(CreateMerchantSchema),
    createMerchantController
  );

// GET my merchant shop (Authenticated)
router
  .route('/merchant/me')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    getMyMerchantController
  );

// GET merchant analytics (Authenticated Pro User)
router
  .route('/merchant/analytics')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    getMerchantAnalyticsController
  );

// GET single merchant shop
router
  .route('/merchant/:id')
  .get(
    checkMerchantExists,
    getMerchantByIdController
  );

// UPDATE merchant shop (Authenticated + Owner)
router
  .route('/merchant/:id')
  .patch(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    checkMerchantExists,
    checkMerchantOwnership,
    validateReqBody(UpdateMerchantSchema),
    updateMerchantController
  );

// ========================
// Admin Merchant Routes
// ========================

// GET all merchant shops (Admin)
router
  .route('/admin/merchant')
  .get(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqQuery(MerchantQuerySchema),
    getAllMerchantsController
  );

// UPDATE merchant shop status (Admin)
router
  .route('/admin/merchant/:id/status')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    checkMerchantExists,
    validateReqBody(AdminUpdateMerchantStatusSchema),
    updateMerchantStatusController
  );

export default router;
