import { Router } from 'express';
import {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getCategoriesController,
  createSubCategoryController,
  deleteSubCategoryController,
  getSubCategoriesController,
} from '@/app/modules/category/category.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  CategoryQuerySchema,
  CreateSubCategorySchema,
  SubCategoryQuerySchema,
} from '@/app/modules/category/category.schemas';
import {
  checkAdminAccessToken,
  findUserById,
  isAdmin,
} from '@/app/modules/auth/auth.middlewares';

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
    validateReqBody(UpdateCategorySchema),
    updateCategoryController
  )
  .delete(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    deleteCategoryController
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
  .delete(
    checkAdminAccessToken,
    isAdmin,
    findUserById,
    deleteSubCategoryController
  );

export default router;
