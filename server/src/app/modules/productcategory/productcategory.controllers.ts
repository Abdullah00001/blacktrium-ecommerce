import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  createProductCategoryService,
  updateProductCategoryService,
  getProductCategoriesService,
} from '@/app/modules/productcategory/productcategory.services';
import {
  TProductCategoryQuery,
  TCreateProductCategory,
  TUpdateProductCategory,
} from '@/app/modules/productcategory/productcategory.schemas';

// ========================
// Product Category Controllers
// ========================

export const createProductCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const payload = req.body as TCreateProductCategory;

    const data = await createProductCategoryService({ payload });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Product category created successfully',
      data,
      traceId,
    });
  }
);

export const updateProductCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };
    const payload = req.body as TUpdateProductCategory;

    const data = await updateProductCategoryService({ id, payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Product category updated successfully',
      data,
      traceId,
    });
  }
);

export const getProductCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = (req as any).validatedQuery as TProductCategoryQuery;

    const data = await getProductCategoriesService({ query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Retrieve product categories successful',
      data,
      traceId,
    });
  }
);
