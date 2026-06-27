import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { MerchantModel } from '@/app/schemas/merchant/merchant.schema';
import { IUser } from '@/app/schemas/user/user.types';

export const checkMerchantExists = async (
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
        message: 'Invalid merchant ID format',
      });
      return;
    }

    const shop = await MerchantModel.findById(id);

    if (!shop) {
      res.status(404).json({
        success: false,
        status: 404,
        message: 'Merchant shop not found',
      });
      return;
    }

    // Attach shop to request for subsequent middlewares if needed
    (req as any).merchant = shop;

    next();
  } catch (error) {
    next(error);
  }
};

export const checkMerchantOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shop = (req as any).merchant;
    const user = req.user as IUser;

    if (!shop) {
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Merchant data not found in request context',
      });
      return;
    }

    if (shop.userId.toString() !== user._id.toString()) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'You do not have permission to perform this action',
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
