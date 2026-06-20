import { Request, Response } from 'express';

import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  signupService,
  verifySignupOtpService,
} from '@/app/modules/auth/auth.services';
import { JwtPayload } from 'jsonwebtoken';
import { extractToken } from '@/app/utils/jwt.utils';

export const signupController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const payload = req.body;
    const data = await signupService({ traceId, payload });
    res.status(201).json({
      success: true,
      status: 200,
      message: 'User signup successful',
      data,
      traceId,
    });
    return;
  }
);

export const verifySignupOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as JwtPayload;
    const token = extractToken(req) as string;
    const data = await verifySignupOtpService({ user, token });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Otp verification successful',
      data,
      traceId,
    });
    return;
  }
);
