import { Router } from 'express';
import {
  createBusinessController,
  getMyBusinessesController,
  getBusinessByIdController,
  updateBusinessController,
  getAllBusinessesController,
  updateBusinessStatusController,
  keepBusinessActiveController,
} from '@/app/modules/business/business.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateBusinessSchema,
  UpdateBusinessSchema,
  BusinessQuerySchema,
  AdminUpdateBusinessStatusSchema,
} from '@/app/modules/business/business.schemas';
import { findUserById,
  checkAccessToken,
    checkAccountStatus,
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

// CREATE business (Authenticated)
router
  .route('/business')
  .post(
    checkAccessToken,
    checkAccountStatus,
    validateReqBody(CreateBusinessSchema),
    createBusinessController
  )
  .get(
    checkAccessToken,
    checkAccountStatus,
    validateReqQuery(BusinessQuerySchema),
    getAllBusinessesController
  );

// GET my businesses (Authenticated)
router
  .route('/business/me')
  .get(
    checkAccessToken,
    checkAccountStatus,
    getMyBusinessesController
  );

// GET single business
router
  .route('/business/:id')
  .get(
    getBusinessByIdController
  );

// UPDATE business (Authenticated + Owner)
router
  .route('/business/:id')
  .patch(
    checkAccessToken,
    checkAccountStatus,
    validateReqBody(UpdateBusinessSchema),
    updateBusinessController
  );

// POST keep a business active (used during downgrades)
router
  .route('/business/:id/keep-active')
  .post(
    checkAccessToken,
    checkAccountStatus,
    keepBusinessActiveController
  );

// GET all businesses (Admin)
router
  .route('/admin/business')
  .get(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqQuery(BusinessQuerySchema),
    getAllBusinessesController
  );

// UPDATE business status (Admin)
router
  .route('/admin/business/:id/status')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqBody(AdminUpdateBusinessStatusSchema),
    updateBusinessStatusController
  );

export default router;
