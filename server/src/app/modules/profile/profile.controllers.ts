import { Request, Response } from 'express';

import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import { IUser } from '@/app/schemas/user/user.types';
import { TProfilePayload } from '@/app/modules/profile/profile.schemas';
import { updateProfileService } from '@/app/modules/profile/profile.services';


export const updateProfileController=asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const payload=req.body as TProfilePayload;
    const data=await updateProfileService({payload,user})
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