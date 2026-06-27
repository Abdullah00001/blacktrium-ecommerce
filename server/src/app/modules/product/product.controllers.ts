import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  createProductService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  getAllProductsService,
  updateProductStatusService,
} from '@/app/modules/product/product.services';
import {
  TCreateProduct,
  TUpdateProduct,
  TProductQuery,
  TAdminUpdateProductStatus,
} from '@/app/modules/product/product.schemas';

// ========================
// Product Controllers
// ========================

export const createProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const payload = req.body as TCreateProduct;

    const data = await createProductService({
      payload,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Product created successfully',
      data,
      traceId,
    });
  }
);

export const getProductByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;

    const data = await getProductByIdService({ id });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Product retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    const payload = req.body as TUpdateProduct;

    const data = await updateProductService({
      id,
      payload,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Product updated successfully',
      data,
      traceId,
    });
  }
);

export const deleteProductController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;

    const data = await deleteProductService({ id });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Product deleted successfully',
      data,
      traceId,
    });
  }
);

export const getAllProductsController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const query = req.query as unknown as TProductQuery;

    const data = await getAllProductsService({ query });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Products retrieved successfully',
      data,
      traceId,
    });
  }
);

export const updateProductStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const id = req.params.id as string;
    const { status } = req.body as TAdminUpdateProductStatus;

    const data = await updateProductStatusService({
      id,
      status,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Product status updated successfully',
      data,
      traceId,
    });
  }
);
