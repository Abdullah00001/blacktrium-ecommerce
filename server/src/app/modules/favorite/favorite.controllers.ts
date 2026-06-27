import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { IUser } from '@/app/schemas/user/user.types';
import {
  toggleFavoriteService,
  getFavoritesService,
} from '@/app/modules/favorite/favorite.services';
import {
  TToggleFavorite,
  TFavoriteQuery,
} from '@/app/modules/favorite/favorite.schemas';

export const toggleFavoriteController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TToggleFavorite;

    const data = await toggleFavoriteService({
      userId: user._id.toString(),
      payload,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: data.favorited ? 'Added to favorites' : 'Removed from favorites',
      data,
      traceId,
    });
  }
);

export const getFavoritesController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const query = req.query as unknown as TFavoriteQuery;

    const data = await getFavoritesService({
      userId: user._id.toString(),
      query,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Favorites retrieved successfully',
      data,
      traceId,
    });
  }
);
