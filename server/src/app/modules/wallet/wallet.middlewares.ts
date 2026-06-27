import { Request, Response, NextFunction } from 'express';
import { MerchantModel } from '@/app/schemas/merchant/merchant.schema';
import { IUser } from '@/app/schemas/user/user.types';

export const requireMerchantShop = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as IUser;

    const shop = await MerchantModel.findOne({ userId: user._id });

    if (!shop) {
      res.status(403).json({
        success: false,
        status: 403,
        message: 'You must have a merchant shop to access the wallet',
      });
      return;
    }

    (req as any).merchantId = shop._id.toString();

    next();
  } catch (error) {
    next(error);
  }
};
