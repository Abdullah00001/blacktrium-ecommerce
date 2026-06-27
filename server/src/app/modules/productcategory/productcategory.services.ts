import { ProductCategoryModel } from '@/app/schemas/productcategory/productcategory.schema';
import {
  TProductCategoryQuery,
  TCreateProductCategory,
  TUpdateProductCategory,
} from '@/app/modules/productcategory/productcategory.schemas';

// ========================
// Product Category Services
// ========================

export const createProductCategoryService = async ({
  payload,
}: {
  payload: TCreateProductCategory;
}): Promise<unknown> => {
  
    const result = await ProductCategoryModel.create(payload);
    return result;
  
};

export const updateProductCategoryService = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateProductCategory;
}): Promise<unknown> => {
  
    const result = await ProductCategoryModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    );
    if (!result) {
      throw new Error('Product category not found');
    }
    return result;
  
};

export const getProductCategoriesService = async ({
  query,
}: {
  query: TProductCategoryQuery;
}): Promise<unknown> => {
  
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const matchStage: Record<string, any> = {};

    if (search) {
      matchStage.categoryName = { $regex: search, $options: 'i' };
    }

    if (status !== undefined) {
      matchStage.status = status;
    }

    const [data, total] = await Promise.all([
      ProductCategoryModel.find(matchStage)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      ProductCategoryModel.countDocuments(matchStage),
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
