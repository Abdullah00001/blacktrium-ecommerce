import { Router } from 'express';
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
} from '@/app/modules/cart/cart.controllers';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  AddToCartSchema,
  UpdateCartItemSchema,
} from '@/app/modules/cart/cart.schemas';
import {
  checkAccessToken,
    checkAccountStatus,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

// Applying auth middleware directly to routes to avoid leaking to v1 global scope

router
  .route('/cart')
  .get(checkAccessToken,
    checkAccountStatus, getCartController)
  .delete(checkAccessToken,
    checkAccountStatus, clearCartController);

router
  .route('/cart/add')
  .post(checkAccessToken,
    checkAccountStatus, validateReqBody(AddToCartSchema), addToCartController);

router
  .route('/cart/item/:itemId')
  .patch(checkAccessToken,
    checkAccountStatus, validateReqBody(UpdateCartItemSchema), updateCartItemController)
  .delete(checkAccessToken,
    checkAccountStatus, removeCartItemController);

export const CartRoutes = router;
