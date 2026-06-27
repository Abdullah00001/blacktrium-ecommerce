import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/app/utils/system.utils';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { IUser } from '@/app/schemas/user/user.types';
import { Role } from '@/app/schemas/user/user.types';

// ========================
// Business Profile Middlewares
// ========================

export const checkBusinessProfileExists = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const profile = await BusinessProfileModel.findById(id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Business profile not found',
      });
    }
    (req as any).businessProfile = profile;
    return next();
  }
);

export const checkBusinessOwnership = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const profile = (req as any).businessProfile;

    if (user.role !== Role.ADMIN && profile.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'You do not have permission to modify this business profile',
      });
    }

    return next();
  }
);
