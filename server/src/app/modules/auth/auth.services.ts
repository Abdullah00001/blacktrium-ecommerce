import mongoose, { Types } from 'mongoose';

import { UserModel } from '@/app/schemas/user/user.schema';
import { ProfileModel } from '@/app/schemas/profile/profile.schema';
import { SubscriberModel } from '@/app/schemas/subscriber/subscriber.schema';
import {
  TRecoverResetPayload,
  TSignupPayload,
} from '@/app/modules/auth/auth.schemas';
import { hashPassword } from '@/app/utils/password.utils';
import { SubscribeStatus } from '@/app/schemas/subscriber/subscriber.types';
import {
  generateAccessTokenForAdmin,
  generateAccessTokenForUser,
  generateOtpPageToken,
  generateRefreshToken,
} from '@/app/utils/jwt.utils';
import { generate } from 'otp-generator';
import { hashOtp } from '@/app/utils/otp.utils';
import {
  calculateMilliseconds,
  createRedisKey,
} from '@/app/utils/system.utils';
import { OTP_GENERATE_CONFIG, otpExpireAt, REDIS_PREFIXES } from '@/const';
import { getRedisClient } from '@/app/configs/redis.config';
import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '@/app/schemas/user/user.types';
import { IProfile } from '@/app/schemas/profile/profile.types';

export const deleteExpiredUnverifiedUser = async ({
  userId,
}: {
  userId: Types.ObjectId;
}): Promise<void> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Delete child collections first
    await SubscriberModel.deleteOne({ userId }, { session });

    await ProfileModel.deleteOne({ userId }, { session });

    await UserModel.deleteOne({ _id: userId }, { session });

    await session.commitTransaction();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    await session.endSession();
  }
};

export const signupService = async ({
  payload,
  traceId,
}: {
  payload: TSignupPayload;
  traceId: string;
}): Promise<unknown> => {
  const session = await mongoose.startSession();
  try {
    const redisClient = getRedisClient();
    session.startTransaction();
    const {
      country,
      email,
      firstName,
      isLegalTermsAccepted,
      isSubscribe,
      lastName,
    } = payload;
    const encryptedPassword = await hashPassword(payload.password);

    const [user] = await UserModel.create(
      [
        {
          email,
          firstName,
          isLegalTermsAccepted,
          lastName,
          password: encryptedPassword,
        },
      ],
      { session }
    );
    await ProfileModel.create(
      [
        {
          userId: user._id,
          country,
        },
      ],
      { session }
    );
    await SubscriberModel.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          firstName,
          lastName,
          userId: user._id,
          subscribeStatus: isSubscribe
            ? SubscribeStatus.SUBSCRIBED
            : SubscribeStatus.UNSUBSCRIBED,
        },
      },
      { session, upsert: true, new: true }
    );

    await session.commitTransaction();
    const otp = generate(6, OTP_GENERATE_CONFIG);
    const token = generateOtpPageToken({
      accountStatus: user.accountStatus,
      isVerified: user.isVerified,
      role: user.role,
      sub: user._id.toString(),
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
        createRedisKey(REDIS_PREFIXES.otp, user._id.toString()),
        encryptedOtp,
        'PX',
        calculateMilliseconds(otpExpireAt, 'minute')
      ),
      // here will be send the otp to user email using background job queue
    ]);
    return {
      token,
      otp,
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    await session.endSession();
  }
};

export const verifySignupOtpService = async ({
  user,
  token,
  tokenTtl,
}: {
  user: IUser;
  token: string;
  tokenTtl: number;
}): Promise<unknown | null> => {
  try {
    const redisClient = getRedisClient();
    const userId = user?._id.toString();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isVerified: true } },
      { new: true }
    );
    if (!updatedUser) return null;
    const accessToken = generateAccessTokenForUser({
      sub: userId as string,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      accountStatus: updatedUser.accountStatus,
      rememberMe: true,
    });
    if (tokenTtl > 0)
      await redisClient.set(
        createRedisKey(REDIS_PREFIXES.blacklist, token),
        token,
        'EX',
        tokenTtl
      );
    await redisClient.del(
      createRedisKey(REDIS_PREFIXES.otp, updatedUser._id.toString())
    );
    // in production user will get an email
    // await getEmailQueue().add('send-signup-success-email', {
    //   email: updatedUser.email,
    //   traceId,
    // });
    return {
      token: accessToken,
    };
  } catch (error) {
    throw error;
  }
};

export const resendOtpService = async ({
  user,
  traceId,
}: {
  user: IUser;
  traceId: string;
}): Promise<unknown> => {
  try {
    const redisClient = getRedisClient();
    const otp = generate(6, OTP_GENERATE_CONFIG);
    const encryptedOtp = hashOtp({ otp });
    const emailTemplatePayload = {
      email: user.email,
      otp,
      traceId,
      otpExpireAt,
    } as const;
    await Promise.all([
      redisClient.set(
        createRedisKey(REDIS_PREFIXES.otp, user._id.toString()),
        encryptedOtp,
        'PX',
        calculateMilliseconds(otpExpireAt, 'minute')
      ),
      // here will be send the otp to user email using background job queue
    ]);
    return { otp };
  } catch (error) {
    throw error;
  }
};

export const checkAccessTokenService = ({
  profile,
  user,
}: {
  user: IUser;
  profile: IProfile;
}): unknown => {
  try {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileAvatar: profile.profileAvatar,
    };
  } catch (error) {
    throw error;
  }
};

export const logoutService = async ({
  token,
  user,
}: {
  user: JwtPayload;
  token: string;
}): Promise<void> => {
  try {
    const redisClient = getRedisClient();
    const expirationTime = user?.exp as number; // convert to seconds
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    const ttl = Math.floor(expirationTime - currentTime); // remaining time in seconds
    if (ttl > 0)
      await redisClient.set(
        createRedisKey(REDIS_PREFIXES.blacklist, token),
        token,
        'EX',
        ttl
      );
  } catch (error) {
    throw error;
  }
};

export const loginService = async ({
  isAdmin,
  user,
  rememberMe,
}: {
  isAdmin: boolean;
  rememberMe: boolean;
  user: IUser;
}): Promise<{ accessToken: string; refreshToken?: string }> => {
  try {
    if (isAdmin) {
      const accessToken = generateAccessTokenForAdmin({
        isVerified: user.isVerified,
        role: user.role,
        sub: user._id.toString(),
        rememberMe,
        accountStatus: user.accountStatus,
      });
      const refreshToken = generateRefreshToken({
        isVerified: user.isVerified,
        role: user.role,
        sub: user._id.toString(),
        rememberMe,
        accountStatus: user.accountStatus,
      });
      return { accessToken, refreshToken };
    }
    const accessToken = generateAccessTokenForUser({
      isVerified: user.isVerified,
      role: user.role,
      sub: user._id.toString(),
      rememberMe,
      accountStatus: user.accountStatus,
    });

    return { accessToken };
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Unknown error occurred in login service');
  }
};

export const changePasswordService = async ({
  newPassword,
  user,
}: {
  newPassword: string;
  user: IUser;
}): Promise<void> => {
  try {
    const hashPass = await hashPassword(newPassword);
    await UserModel.findByIdAndUpdate(user._id, {
      $set: { password: hashPass },
    });
    return;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Unknown error occurred in change password service');
  }
};

export const recoverFindService = async ({
  user,
}: {
  user: IUser;
}): Promise<unknown> => {
  const redisClient = getRedisClient();
  const otp = generate(6, OTP_GENERATE_CONFIG);
  const token = generateOtpPageToken({
    accountStatus: user.accountStatus,
    isVerified: user.isVerified,
    role: user.role,
    sub: user._id.toString(),
  });
  const encryptedOtp = hashOtp({ otp });
  await Promise.all([
    redisClient.set(
      createRedisKey(REDIS_PREFIXES.otp, user._id.toString()),
      encryptedOtp,
      'PX',
      calculateMilliseconds(otpExpireAt, 'minute')
    ),
    // here will be send the recover otp to user email using background job queue later
  ]);
  return {
    token,
    otp,
  };
};

export const verifyRecoverOtpService = async ({
  user,
}: {
  user: IUser;
}): Promise<void> => {
  const redisClient = getRedisClient();
  await redisClient.del(
    createRedisKey(REDIS_PREFIXES.otp, user._id.toString())
  );
};

export const recoverResetPasswordService = async ({
  password,
  token,
  tokenTtl,
  user,
}: TRecoverResetPayload & {
  token: string;
  tokenTtl: number;
  user: IUser;
}): Promise<void> => {
  const redisClient = getRedisClient();
  const hashPass = await hashPassword(password);
  await UserModel.findByIdAndUpdate(user._id, {
    $set: { password: hashPass },
  });
  if (tokenTtl > 0) {
    await redisClient.set(
      createRedisKey(REDIS_PREFIXES.blacklist, token),
      token,
      'EX',
      tokenTtl
    );
  }
};
