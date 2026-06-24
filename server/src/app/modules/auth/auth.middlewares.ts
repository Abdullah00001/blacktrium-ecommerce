import { Request, Response, NextFunction } from 'express';

import { getTraceId } from '@/app/configs/requestContext.configs';
import {
  asyncHandler,
  calculateMilliseconds,
  createRedisKey,
} from '@/app/utils/system.utils';
import { UserModel } from '@/app/schemas/user/user.schema';
import { deleteExpiredUnverifiedUser } from '@/app/modules/auth/auth.services';
import { generate } from 'otp-generator';
import { compareOtp, hashOtp } from '@/app/utils/otp.utils';
import { getRedisClient } from '@/app/configs/redis.config';
import {
  AuthErrorType,
  OTP_GENERATE_CONFIG,
  otpExpireAt,
  REDIS_PREFIXES,
} from '@/const';
import {
  extractToken,
  generateOtpPageToken,
  verifyAccessToken,
  verifyOtpPageToken,
} from '@/app/utils/jwt.utils';
import { JwtPayload } from 'jsonwebtoken';
import { AccountStatus, IUser } from '@/app/schemas/user/user.types';
import { ProfileModel } from '@/app/schemas/profile/profile.schema';
import { comparePassword } from '@/app/utils/password.utils';

export const checkDuplicateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const traceId = getTraceId();
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next();
    }
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const userIdStr = user._id.toString();

    // CASE 1: Unverified account older than 24 hours -> Delete it
    if (!user.isVerified && user.createdAt < oneDayAgo) {
      await deleteExpiredUnverifiedUser({ userId: user._id });
      return next();
    }

    // CASE 2: Unverified account within 24 hours -> Regenerate & Dispatch OTP
    if (!user.isVerified && user.createdAt >= oneDayAgo) {
      /**
       * TODO:
       * generate otp
       * generate token
       * send otp to user
       */
      const redisClient = getRedisClient();
      const otp = generate(6, OTP_GENERATE_CONFIG);
      const token = generateOtpPageToken({
        accountStatus: user.accountStatus,
        isVerified: user.isVerified,
        role: user.role,
        sub: userIdStr,
      });
      const encryptedOtp = hashOtp({ otp });
      const emailTemplatePayload = {
        email: user.email,
        otp,
        traceId,
        otpExpireAt,
      } as const;
      await Promise.all([
        redisClient.set(
          createRedisKey(REDIS_PREFIXES.otp, userIdStr),
          encryptedOtp,
          'PX',
          calculateMilliseconds(otpExpireAt, 'minute')
        ),
        // here will be send the otp to user email using background job queue
      ]);
      // for development purpose otp sent on body
      return res.status(200).json({
        success: false,
        status: 200,
        message: 'User signup successful',
        data: {
          otp,
          token,
        },
        traceId,
      });
    }

    return res.status(409).json({
      success: false,
      status: 409,
      message: 'An account with this email already exists',
      errorType: AuthErrorType.DUPLICATE_DATA,
      traceId,
    });
  }
);

export const findUserByEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = getTraceId();
    const { email } = req.body;
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials,Please check email or password',
        errorType: AuthErrorType.INVALID_CREDENTIALS,
        traceId,
      });
      return;
    }
    req.user = user;
    next();
    return;
  }
);

export const checkPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = getTraceId();
    const { password } = req.body;
    const hashedPassword = (req.user as IUser).password as string;
    const isMatched = await comparePassword(password, hashedPassword);
    if (!isMatched) {
      res.status(401).json({
        success: false,
        errorType: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Invalid Credential,Check Your Email And Password',
        traceId,
      });
      return;
    }
    next();
  }
);

export const checkOtpPageToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = getTraceId();
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication token not found',
        errorType: AuthErrorType.TOKEN_INVALID,
        traceId,
      });
      return;
    }
    const redisClient = getRedisClient();
    const isBlackListed = await redisClient.get(createRedisKey(REDIS_PREFIXES.blacklist,token));
    if (isBlackListed) {
      res.status(401).json({
        success: false,
        message: 'Token has been revoked',
        errorType: AuthErrorType.TOKEN_BLACKLISTED,
        traceId,
      });
      return;
    }
    const decoded = verifyOtpPageToken(token);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        errorType: AuthErrorType.TOKEN_INVALID,
        traceId,
      });
      return;
    }
    req.user = decoded;
    next();
  }
);

export const checkOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = getTraceId();
    const user = req.user as IUser;
    const { otp } = req.body;
    // get the redis client
    const redisClient = getRedisClient();
    const hashedOtp = await redisClient.get(
      createRedisKey(REDIS_PREFIXES.otp, user._id.toString() as string)
    );
    if (!hashedOtp) {
      res.status(401).json({
        success: false,
        message: 'OTP has expired, please request a new one',
        errorType: AuthErrorType.OTP_EXPIRED,
        traceId,
      });
      return;
    }
    const isMatched = compareOtp({ hashedOtp, otp });
    if (!isMatched) {
      res.status(401).json({
        success: false,
        message: 'Invalid OTP, please check and try again',
        errorType: AuthErrorType.INVALID_OTP,
        traceId,
      });
      return;
    }
    next();
  }
);

export const checkAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const traceId = getTraceId();
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication token not found',
        errorType: AuthErrorType.TOKEN_INVALID,
        traceId,
      });
      return;
    }
    const redisClient = getRedisClient();
    const isBlackListed = await redisClient.get(
      createRedisKey(REDIS_PREFIXES.blacklist, token)
    );
    if (isBlackListed) {
      res.status(401).json({
        success: false,
        message: 'Token has been revoked',
        errorType: AuthErrorType.TOKEN_BLACKLISTED,
        traceId,
      });
      return;
    }
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        errorType: AuthErrorType.TOKEN_INVALID,
        traceId,
      });
      return;
    }
    req.user = decoded;
    next();
  }
);

export const checkAccountStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const traceId = getTraceId();
    const route = req.path;
    const { sub } = req.user as JwtPayload;
    const user = await UserModel.findOne({ _id: sub });
    if (!user) {
      res.status(401).json({
        success: false,
        message:
          'Authentication failed. User record associated with this token does not exist.',
        errorType: AuthErrorType.TOKEN_INVALID,
        traceId,
      });
      return;
    }
    if (user?.accountStatus === AccountStatus.BLOCKED) {
      res.status(401).json({
        success: false,
        message: 'Access denied, your account has been blocked',
        errorType: AuthErrorType.USER_BLOCKED,
        traceId,
      });
      return;
    }
    const isLogoutRoute = route.startsWith('/auth/logout');
    if (!isLogoutRoute) {
      const profile = await ProfileModel.findOne({ userId: sub });
      if (profile) {
        req.profile = profile;
      }
      req.user = user;
    }
    next();
  }
);

export const checkCurrentPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { currentPassword } = req.body;
    const { password } = req.user as IUser;
    const isMatched = await comparePassword(
      currentPassword,
      password as string
    );
    if (!isMatched) {
      res
        .status(403)
        .json({
          success: false,
          status: 403,
          message: 'Current password not matched',
        });
      return;
    }
    next();
  }
);
