import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  createCategoryService,
  updateCategoryService,
  getCategoriesService,
  createSubCategoryService,
  updateSubCategoryService,
  getSubCategoriesService,
} from '@/app/modules/category/category.services';
import {
  TCategoryQuery,
  TCreateCategory,
  TUpdateCategory,
  TCreateSubCategory,
  TUpdateSubCategory,
  TSubCategoryQuery,
} from '@/app/modules/category/category.schemas';

// ========================
// Category Controllers
// ========================

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const payload = req.body as TCreateCategory;

    const data = await createCategoryService({ payload });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Category created successfully',
      data,
      traceId,
    });
  }
);

export const updateCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };
    const payload = req.body as TUpdateCategory;

    const data = await updateCategoryService({ id, payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Category updated successfully',
      data,
      traceId,
    });
  }
);

export const getCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = (req as any).validatedQuery as TCategoryQuery;

    const data = await getCategoriesService({ query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Retrieve categories successful',
      data,
      traceId,
    });
  }
);

// ========================
// SubCategory Controllers
// ========================

export const createSubCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const payload = req.body as TCreateSubCategory;

    const data = await createSubCategoryService({ payload });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'SubCategory created successfully',
      data,
      traceId,
    });
  }
);

export const updateSubCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const { id } = req.params as { id: string };
    const payload = req.body as TUpdateSubCategory;

    const data = await updateSubCategoryService({ id, payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'SubCategory updated successfully',
      data,
      traceId,
    });
  }
);

export const getSubCategoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = (req as any).validatedQuery as TSubCategoryQuery;

    const data = await getSubCategoriesService({ query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Retrieve subcategories successful',
      data,
      traceId,
    });
  }
);
