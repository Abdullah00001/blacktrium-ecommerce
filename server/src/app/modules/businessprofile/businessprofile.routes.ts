import { Router } from 'express';
import {
  getMyBusinessProfileController,
  getBusinessProfileByIdController,
  updateBusinessProfileController,
  getAllBusinessProfilesController,
  updateBusinessProfileStatusController,
  getRecommendedBusinessProfilesController,
} from '@/app/modules/businessprofile/businessprofile.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  UpdateBusinessProfileSchema,
  BusinessProfileQuerySchema,
  AdminUpdateBusinessProfileStatusSchema,
} from '@/app/modules/businessprofile/businessprofile.schemas';
import { findUserById,
  checkAccessToken,
    checkAccountStatus,
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';

import {
  checkBusinessProfileExists,
} from '@/app/modules/businessprofile/businessprofile.middlewares';

const router = Router();

// ========================
// Business Profile Routes
// ========================

// GET Recommended Business Profiles (Public/Authenticated)
router
  .route('/business-profile/recommended')
  .get(
    checkAccessToken,
    checkAccountStatus,
    getRecommendedBusinessProfilesController
  );

// GET my business profile (Authenticated)
router
  .route('/business-profile/me')
  .get(
    checkAccessToken,
    checkAccountStatus,
    getMyBusinessProfileController
  );

// UPDATE my business profile (Authenticated)
router
  .route('/business-profile/me')
  .patch(
    checkAccessToken,
    checkAccountStatus,
    validateReqBody(UpdateBusinessProfileSchema),
    updateBusinessProfileController
  );

// GET single business profile
router
  .route('/business-profile/:id')
  .get(
    checkBusinessProfileExists,
    getBusinessProfileByIdController
  );

// ========================
// Admin Business Profile Routes
// ========================

// GET all business profiles (Admin)
router
  .route('/admin/business-profile')
  .get(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqQuery(BusinessProfileQuerySchema),
    getAllBusinessProfilesController
  );

// UPDATE business profile status (Admin)
router
  .route('/admin/business-profile/:id/status')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    checkBusinessProfileExists,
    validateReqBody(AdminUpdateBusinessProfileStatusSchema),
    updateBusinessProfileStatusController
  );

export default router;
