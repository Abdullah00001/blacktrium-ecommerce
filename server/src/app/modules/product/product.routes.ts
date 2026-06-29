import { Router } from 'express';
import {
  createProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getAllProductsController,
  updateProductStatusController,
} from '@/app/modules/product/product.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateProductSchema,
  UpdateProductSchema,
  ProductQuerySchema,
  AdminUpdateProductStatusSchema,
} from '@/app/modules/product/product.schemas';
import { findUserById,
  checkAccessToken,
    checkAccountStatus,
  checkAdminAccessToken,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import {
  checkProductExists,
  checkProductOwnership,
  checkMerchantBeforeCreateProduct,
} from '@/app/modules/product/product.middlewares';

const router = Router();

// ========================
// Product Routes
// ========================

// CREATE product (Authenticated + Merchant Owner)
router
  .route('/product')
  .post(
    checkAccessToken,
    checkAccountStatus,
    validateReqBody(CreateProductSchema),
    checkMerchantBeforeCreateProduct,
    createProductController
  );

// GET all products (Public or Authenticated, depending on requirements, usually public)
router
  .route('/product')
  .get(
    validateReqQuery(ProductQuerySchema),
    getAllProductsController
  );

// GET single product
router
  .route('/product/:id')
  .get(
    checkProductExists,
    getProductByIdController
  );

// UPDATE product (Authenticated + Merchant Owner)
router
  .route('/product/:id')
  .patch(
    checkAccessToken,
    checkAccountStatus,
    checkProductExists,
    checkProductOwnership,
    validateReqBody(UpdateProductSchema),
    updateProductController
  );

// DELETE product (Authenticated + Merchant Owner)
router
  .route('/product/:id')
  .delete(
    checkAccessToken,
    checkAccountStatus,
    checkProductExists,
    checkProductOwnership,
    deleteProductController
  );

// ========================
// Admin Product Routes
// ========================

// UPDATE product status (Admin)
router
  .route('/admin/product/:id/status')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    checkProductExists,
    validateReqBody(AdminUpdateProductStatusSchema),
    updateProductStatusController
  );

export default router;
