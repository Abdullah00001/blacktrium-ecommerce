import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { ProductCategoryModel } from '@/app/schemas/productcategory/productcategory.schema';

export const checkProductCategoryExists = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const categoryExists = await ProductCategoryModel.exists({ _id: id });
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Product category not found',
      });
    }
    return next();
  }
);
