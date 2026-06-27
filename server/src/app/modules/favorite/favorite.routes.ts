import { Router } from 'express';
import {
  toggleFavoriteController,
  getFavoritesController,
} from '@/app/modules/favorite/favorite.controllers';
import { validateReqBody, validateReqQuery } from '@/app/utils/system.utils';
import {
  ToggleFavoriteSchema,
  FavoriteQuerySchema,
} from '@/app/modules/favorite/favorite.schemas';
import {
  checkAccessToken,
  checkAccountStatus,
  findUserById,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

// ========================
// Favorite Routes
// ========================

// POST toggle favorite (Authenticated User)
router
  .route('/favorite/toggle')
  .post(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqBody(ToggleFavoriteSchema),
    toggleFavoriteController
  );

// GET user favorites (Authenticated User)
router
  .route('/favorite')
  .get(
    checkAccessToken,
    checkAccountStatus,
    findUserById,
    validateReqQuery(FavoriteQuerySchema),
    getFavoritesController
  );

export default router;
