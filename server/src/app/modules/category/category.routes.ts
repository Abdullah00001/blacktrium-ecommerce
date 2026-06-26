import { Router } from 'express';
import {
  createCategoryController,
  updateCategoryController,
  getCategoriesController,
  createSubCategoryController,
  updateSubCategoryController,
  getSubCategoriesController,
} from '@/app/modules/category/category.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  CategoryQuerySchema,
  CreateSubCategorySchema,
  UpdateSubCategorySchema,
  SubCategoryQuerySchema,
} from '@/app/modules/category/category.schemas';
import {
  checkAdminAccessToken,
  findUserById,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';
import {
  checkCategoryExists,
  checkSubCategoryExists,
} from '@/app/modules/category/category.middlewares';

const router = Router();

// ========================
// Category Routes
// ========================

router
  .route('/category')
  .get(validateReqQuery(CategoryQuerySchema), getCategoriesController);

router
  .route('/admin/category')
  .post(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqBody(CreateCategorySchema),
    createCategoryController
  );

router
  .route('/admin/category/:id')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    checkCategoryExists,
    validateReqBody(UpdateCategorySchema),
    updateCategoryController
  );

// ========================
// SubCategory Routes
// ========================

// Getting subcategories (can pass ?categoryId=... in query)
router
  .route('/subcategory')
  .get(validateReqQuery(SubCategoryQuerySchema), getSubCategoriesController);


router
  .route('/admin/subcategory')
  .post(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    validateReqBody(CreateSubCategorySchema),
    createSubCategoryController
  );

router
  .route('/admin/subcategory/:id')
  .patch(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    checkSubCategoryExists,
    validateReqBody(UpdateSubCategorySchema),
    updateSubCategoryController
  );

export default router;
