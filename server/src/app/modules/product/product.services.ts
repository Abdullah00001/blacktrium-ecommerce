import { Types } from 'mongoose';
import { ProductModel } from '@/app/schemas/product/product.schema';
import { IProduct } from '@/app/schemas/product/product.types';
import {
  TCreateProduct,
  TUpdateProduct,
  TProductQuery,
} from '@/app/modules/product/product.schemas';

// ========================
// Product Services
// ========================

export const createProductService = async ({
  payload,
}: {
  payload: TCreateProduct;
}): Promise<unknown> => {
  const result = await ProductModel.create({
    ...payload,
    merchantId: new Types.ObjectId(payload.merchantId),
    categoryId: new Types.ObjectId(payload.categoryId),
  });

  return result;
};

export const getProductByIdService = async ({
  id,
}: {
  id: string;
}): Promise<IProduct | null> => {
  const product = await ProductModel.findById(id)
    .populate('merchantId', 'shopName profileImage')
    .populate('categoryId', 'name');
  return product;
};

export const updateProductService = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateProduct;
}): Promise<unknown> => {
  const updateData: any = { ...payload };

  if (payload.categoryId) {
    updateData.categoryId = new Types.ObjectId(payload.categoryId);
  }

  const result = await ProductModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
};

export const deleteProductService = async ({
  id,
}: {
  id: string;
}): Promise<unknown> => {
  // Instead of hard delete, we can either delete or mark as inactive.
  // The mockup shows a "Delete" button, so we'll do a soft delete or hard delete depending on policy.
  // For now, hard delete is requested.
  const result = await ProductModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
};

export const getAllProductsService = async ({
  query,
}: {
  query: TProductQuery;
}): Promise<unknown> => {
  const { page = 1, limit = 10, search, status, categoryId, merchantId } = query;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  if (status) {
    filter.status = status;
  }

  if (categoryId) {
    filter.categoryId = new Types.ObjectId(categoryId);
  }

  if (merchantId) {
    filter.merchantId = new Types.ObjectId(merchantId);
  }

  const [data, total] = await Promise.all([
    ProductModel.find(filter)
      .populate('merchantId', 'shopName profileImage')
      .populate('categoryId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    ProductModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      totalPages,
      links: {
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        firstPage: 1,
        lastPage: totalPages || 1,
      },
    },
  };
};

export const updateProductStatusService = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<unknown> => {
  const result = await ProductModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  );
  if (!result) {
    throw new Error('Product not found');
  }
  return result;
};
