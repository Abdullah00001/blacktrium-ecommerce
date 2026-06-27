/* eslint-disable no-useless-catch */
import { CategoryModel } from '@/app/schemas/category/category.schema';
import { SubcategoryModel } from '@/app/schemas/subcategory/subcategory.schema';
import {
  TCategoryQuery,
  TCreateCategory,
  TUpdateCategory,
  TCreateSubCategory,
  TUpdateSubCategory,
  TSubCategoryQuery,
} from '@/app/modules/category/category.schemas';

// ========================
// Category Services
// ========================

export const createCategoryService = async ({
  payload,
}: {
  payload: TCreateCategory;
}): Promise<unknown> => {
  try {
    const result = await CategoryModel.create(payload);
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateCategoryService = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateCategory;
}): Promise<unknown> => {
  try {
    const result = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    );
    if (!result) {
      throw new Error('Category not found');
    }

    // Cascade status update to all related subcategories
    if (payload.status !== undefined) {
      await SubcategoryModel.updateMany(
        { categoryId: id },
        { $set: { status: payload.status } }
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getCategoriesService = async ({
  query,
}: {
  query: TCategoryQuery;
}): Promise<unknown> => {
  try {
    const { page = 1, limit = 10, search, status, isPopular } = query as any;
    const skip = (page - 1) * limit;

    const pipeline: any[] = [];
    const matchStage: Record<string, any> = {};

    if (search) {
      matchStage.categoryName = { $regex: search, $options: 'i' };
    }

    if (status !== undefined) {
      matchStage.status = status;
    }

    if (isPopular !== undefined) {
      matchStage.isPopular = isPopular;
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'subcategories', // mongoose lowercase pluralizes "Subcategory"
          localField: '_id',
          foreignField: 'categoryId',
          as: 'subCategories',
        },
      },
      {
        $addFields: {
          subCategoryCount: { $size: '$subCategories' },
        },
      },
      {
        $project: {
          subCategories: 0, // exclude array to save bandwidth
        },
      },
      {
        $sort: { createdAt: -1 },
      }
    );

    const facetPipeline = [
      ...pipeline,
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    const result = await CategoryModel.aggregate(facetPipeline);

    const data = result[0].data;
    const total = result[0].metadata[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total: total,
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
  } catch (error) {
    throw error;
  }
};

// ========================
// SubCategory Services
// ========================

export const createSubCategoryService = async ({
  payload,
}: {
  payload: TCreateSubCategory;
}): Promise<unknown> => {
  try {
    // Optionally check if category exists
    const categoryExists = await CategoryModel.exists({
      _id: payload.categoryId,
    });
    if (!categoryExists) {
      throw new Error('Category does not exist');
    }

    const result = await SubcategoryModel.create(payload);
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateSubCategoryService = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateSubCategory;
}): Promise<unknown> => {
  try {
    const result = await SubcategoryModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    );
    if (!result) {
      throw new Error('SubCategory not found');
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const getSubCategoriesService = async ({
  query,
}: {
  query: TSubCategoryQuery;
}): Promise<unknown> => {
  try {
    const { page = 1, limit = 10, search, category, status } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (category) {
      filter.categoryId = category;
    }

    if (search) {
      filter.subCategoryName = { $regex: search, $options: 'i' };
    }

    if (status !== undefined) {
      filter.status = status;
    }

    const [data, total] = await Promise.all([
      SubcategoryModel.find(filter)
        .populate('categoryId', 'categoryName')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      SubcategoryModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total: total,
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
  } catch (error) {
    throw error;
  }
};
