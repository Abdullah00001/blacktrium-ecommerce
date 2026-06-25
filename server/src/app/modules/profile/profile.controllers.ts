import { Request, Response } from 'express';

import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { IUser } from '@/app/schemas/user/user.types';
import { TProfilePayload } from '@/app/modules/profile/profile.schemas';
import {
  getMyProfileService,
  updateProfileService,
} from '@/app/modules/profile/profile.services';
import { IProfile } from '@/app/schemas/profile/profile.types';

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload = req.body as TProfilePayload;
    const data = await updateProfileService({ payload, user });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Profile update successful',
      data,
      traceId,
    });
    return;
  }
);

export const getMyProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    console.log(user);
    const profile = req.profile as IProfile;
    const data = getMyProfileService({ profile, user });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Profile retrieve successful',
      data,
      traceId,
    });
    return;
  }
);
