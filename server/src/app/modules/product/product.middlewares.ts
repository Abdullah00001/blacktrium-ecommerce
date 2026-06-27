import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { ProductModel } from '@/app/schemas/product/product.schema';
import { MerchantModel } from '@/app/schemas/merchant/merchant.schema';
import { IUser } from '@/app/schemas/user/user.types';

export const checkProductExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid product ID format',
      });
      return;
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        status: 404,
        message: 'Product not found',
      });
      return;
    }

    (req as any).product = product;

    next();
  } catch (error) {
    next(error);
  }
};

export const checkProductOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = (req as any).product;
    const user = req.user as IUser;

    if (!product) {
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Product data not found in request context',
      });
      return;
    }

    // Find the merchant shop associated with this product
    const shop = await MerchantModel.findById(product.merchantId);

    if (!shop || shop.userId.toString() !== user._id.toString()) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'You do not have permission to modify this product',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkMerchantBeforeCreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { merchantId } = req.body;

    if (!merchantId || !Types.ObjectId.isValid(merchantId)) {
      res.status(400).json({
        success: false,
        status: 400,
        message: 'Valid merchantId is required to create a product',
      });
      return;
    }

    const shop = await MerchantModel.findById(merchantId);

    if (!shop) {
      res.status(404).json({
        success: false,
        status: 404,
        message: 'Merchant shop not found',
      });
      return;
    }

    if (shop.userId.toString() !== user._id.toString()) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'You do not have permission to create products for this shop',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
