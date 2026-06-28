import { Router } from 'express';
import {
  createBusinessController,
  getMyBusinessesController,
  getBusinessByIdController,
  updateBusinessController,
  getAllBusinessesController,
  updateBusinessStatusController,
} from '@/app/modules/business/business.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateBusinessSchema,
  UpdateBusinessSchema,
  BusinessQuerySchema,
  AdminUpdateBusinessStatusSchema,
} from '@/app/modules/business/business.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  findUserById,
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
    findUserById,
    validateReqBody(CreateBusinessSchema),
    createBusinessController
  );

// GET my businesses (Authenticated)
router
  .route('/business/me')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
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
    findUserById,
    validateReqBody(UpdateBusinessSchema),
    updateBusinessController
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
