import { Router } from 'express';
import {
  createProductCategoryController,
  updateProductCategoryController,
  getProductCategoriesController,
} from '@/app/modules/productcategory/productcategory.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateProductCategorySchema,
  UpdateProductCategorySchema,
  ProductCategoryQuerySchema,
} from '@/app/modules/productcategory/productcategory.schemas';
import {
  checkAdminAccessToken,
  findUserById,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import { checkProductCategoryExists } from '@/app/modules/productcategory/productcategory.middlewares';

const router = Router();

// ========================
// Product Category Routes
// ========================

router
  .route('/product-category')
  .get(validateReqQuery(ProductCategoryQuerySchema), getProductCategoriesController);

router
  .route('/admin/product-category')
  .post(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqBody(CreateProductCategorySchema),
    createProductCategoryController
  );

router
  .route('/admin/product-category/:id')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    checkProductCategoryExists,
    validateReqBody(UpdateProductCategorySchema),
    updateProductCategoryController
  );

export default router;
