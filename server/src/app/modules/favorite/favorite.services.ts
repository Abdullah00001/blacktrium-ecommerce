import { Types } from 'mongoose';
import { FavoriteModel } from '@/app/schemas/favorite/favorite.schema';
import {
  TToggleFavorite,
  TFavoriteQuery,
} from '@/app/modules/favorite/favorite.schemas';

export const toggleFavoriteService = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: TToggleFavorite;
}): Promise<{ favorited: boolean }> => {
  const targetId = new Types.ObjectId(payload.targetId);
  const userObjectId = new Types.ObjectId(userId);

  const query: Record<string, any> = {
    userId: userObjectId,
    itemType: payload.itemType,
  };

  if (payload.itemType === 'business') {
    query.businessId = targetId;
  } else {
    query.productId = targetId;
  }

  // Check if it already exists
  const existingFavorite = await FavoriteModel.findOne(query);

  if (existingFavorite) {
    // If it exists, remove it
    await FavoriteModel.findByIdAndDelete(existingFavorite._id);
    return { favorited: false };
  } else {
    // If it doesn't exist, create it
    await FavoriteModel.create(query);
    return { favorited: true };
  }
};

export const getFavoritesService = async ({
  userId,
  query,
}: {
  userId: string;
  query: TFavoriteQuery;
}): Promise<unknown> => {
  const { type = 'business', page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const filter = {
    userId: new Types.ObjectId(userId),
    itemType: type,
  };

  const populateField = type === 'business' ? 'businessId' : 'productId';
  
  // Populate the specific target. For products, populate basic info. For businesses, populate basic info.
  // Using generic populate so Mongoose pulls all fields.
  const [data, total] = await Promise.all([
    FavoriteModel.find(filter)
      .populate(populateField)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    FavoriteModel.countDocuments(filter),
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
      },
    },
  };
};
