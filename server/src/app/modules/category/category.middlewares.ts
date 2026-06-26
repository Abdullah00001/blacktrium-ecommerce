import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { CategoryModel } from '@/app/schemas/category/category.schema';
import { SubcategoryModel } from '@/app/schemas/subcategory/subcategory.schema';

export const checkCategoryExists = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const categoryExists = await CategoryModel.exists({ _id: id });
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Category not found',
      });
    }
    return next();
  }
);

export const checkSubCategoryExists = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const subCategoryExists = await SubcategoryModel.exists({ _id: id });
    if (!subCategoryExists) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'SubCategory not found',
      });
    }
    return next();
  }
);
