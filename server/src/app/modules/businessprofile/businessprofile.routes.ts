import { Router } from 'express';
import {
  createBusinessProfileController,
  getMyBusinessProfilesController,
  getBusinessProfileByIdController,
  updateBusinessProfileController,
  getAllBusinessProfilesController,
  updateBusinessProfileStatusController,
} from '@/app/modules/businessprofile/businessprofile.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateBusinessProfileSchema,
  UpdateBusinessProfileSchema,
  BusinessProfileQuerySchema,
  AdminUpdateBusinessProfileStatusSchema,
} from '@/app/modules/businessprofile/businessprofile.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  findUserById,
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';

import {
  checkBusinessProfileExists,
  checkBusinessOwnership,
} from '@/app/modules/businessprofile/businessprofile.middlewares';

const router = Router();

// ========================
// Business Profile Routes
// ========================

// CREATE business profile (Authenticated + Requires Active Subscription)
router
  .route('/business-profile')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqBody(CreateBusinessProfileSchema),
    createBusinessProfileController
  );

// GET my business profiles (Authenticated)
router
  .route('/business-profile/me')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    getMyBusinessProfilesController
  );

// GET single business profile
router
  .route('/business-profile/:id')
  .get(
    checkBusinessProfileExists,
    getBusinessProfileByIdController
  );

// UPDATE business profile (Authenticated + Owner)
router
  .route('/business-profile/:id')
  .patch(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    checkBusinessProfileExists,
    checkBusinessOwnership,
    validateReqBody(UpdateBusinessProfileSchema),
    updateBusinessProfileController
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
