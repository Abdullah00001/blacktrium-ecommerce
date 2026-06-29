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
  findUserById,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

// Apply auth middleware to all cart routes
router.use(checkAccessToken, checkAccountStatus, findUserById);

router
  .route('/cart')
  .get(getCartController)
  .delete(clearCartController);

router
  .route('/cart/add')
  .post(validateReqBody(AddToCartSchema), addToCartController);

router
  .route('/cart/item/:itemId')
  .patch(validateReqBody(UpdateCartItemSchema), updateCartItemController)
  .delete(removeCartItemController);

export const CartRoutes = router;
