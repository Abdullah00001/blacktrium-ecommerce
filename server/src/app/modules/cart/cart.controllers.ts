import { Request, Response } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { IUser } from '@/app/schemas/user/user.types';
import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from '@/app/modules/cart/cart.services';
import {
  TAddToCart,
  TUpdateCartItem,
} from '@/app/modules/cart/cart.schemas';

export const getCartController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;

    const data = await getCartService({ userId: user._id.toString() });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Cart retrieved successfully',
      data,
      traceId,
    });
  }
);

export const addToCartController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TAddToCart;

    const data = await addToCartService({ userId: user._id.toString(), payload });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Item added to cart',
      data,
      traceId,
    });
  }
);

export const updateCartItemController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const itemId = req.params.itemId as string;
    const payload = req.body as TUpdateCartItem;

    const data = await updateCartItemService({
      userId: user._id.toString(),
      itemId,
      payload,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Cart item updated',
      data,
      traceId,
    });
  }
);

export const removeCartItemController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const itemId = req.params.itemId as string;

    const data = await removeCartItemService({
      userId: user._id.toString(),
      itemId,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Item removed from cart',
      data,
      traceId,
    });
  }
);

export const clearCartController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;

    const data = await clearCartService({ userId: user._id.toString() });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Cart cleared successfully',
      data,
      traceId,
    });
  }
);
