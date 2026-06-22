import { Request, Response } from 'express';

import { asyncHandler } from '@/app/utils/system.utils';
import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  changePasswordService,
  checkAccessTokenService,
  loginService,
  logoutService,
  resendOtpService,
  signupService,
  verifySignupOtpService,
} from '@/app/modules/auth/auth.services';
import { extractToken } from '@/app/utils/jwt.utils';
import { IUser } from '@/app/schemas/user/user.types';
import { IProfile } from '@/app/schemas/profile/profile.types';
import { JwtPayload } from 'jsonwebtoken';
import {
  adminAccessTokenExpiresIn,
  refreshTokenExpiresInWithOutRememberMe,
  refreshTokenExpiresInWithRememberMe,
} from '@/const';
import { cookieOption } from '@/app/utils/cookie.utils';
import { TLoginPayload } from './auth.schemas';

export const signupController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const payload = req.body;
    const data = await signupService({ payload, traceId });
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
    const user = req.user as IUser;
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

export const resendOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const data = await resendOtpService({ user, traceId });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Otp resend successful',
      data,
      traceId,
    });
    return;
  }
);

export const checkAccessTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const profile = req.profile as IProfile;
    const data = checkAccessTokenService({ profile, user });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'User is authenticated',
      data,
      traceId,
    });
    return;
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as JwtPayload;
    const token = extractToken(req);
    await logoutService({ token: token as string, user });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Logout successful',
      traceId,
    });
    return;
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { rememberMe } = req.body as TLoginPayload;
    const path = req.path;
    const isAdminLogin = path.includes('/admin/auth/login');
    const traceId = getTraceId();
    const user = req.user as IUser;
    const { accessToken, refreshToken } = await loginService({
      isAdmin: isAdminLogin,
      user,
      rememberMe,
    });
    if (isAdminLogin && refreshToken) {
      const refreshTokenExpireIn = rememberMe
        ? refreshTokenExpiresInWithRememberMe
        : refreshTokenExpiresInWithOutRememberMe;
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(adminAccessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpireIn)
      );
      res
        .status(200)
        .json({ success: true, message: 'Login successful', traceId });
      return;
    }
    res.status(200).json({
      success: true,
      status:200,
      message: 'Login successful',
      data: { accessToken },
      traceId,
    });
    return;
  }
);

export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const { newPassword } = req.body;
    await changePasswordService({ newPassword, user });
    res.status(200).json({
      success: true,
      status:200,
      message: 'Password change successful',
      traceId,
    });
    return;
  }
);
