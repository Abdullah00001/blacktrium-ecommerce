import mongoose, { Types } from 'mongoose';

import { UserModel } from '@/app/schemas/user/user.schema';
import { ProfileModel } from '@/app/schemas/profile/profile.schema';
import { SubscriberModel } from '@/app/schemas/subscriber/subscriber.schema';
import {
  TSignupPayload,
  TVerifyOtpPayload,
} from '@/app/modules/auth/auth.schemas';
import { hashPassword } from '@/app/utils/password.utils';
import { SubscribeStatus } from '@/app/schemas/subscriber/subscriber.types';
import { generateAccessTokenForUser, generateOtpPageToken } from '@/app/utils/jwt.utils';
import { generate } from 'otp-generator';
import { hashOtp } from '@/app/utils/otp.utils';
import {
  calculateMilliseconds,
  createRedisKey,
} from '@/app/utils/system.utils';
import { OTP_GENERATE_CONFIG, otpExpireAt, REDIS_PREFIXES } from '@/const';
import { getRedisClient } from '@/app/configs/redis.config';
import { JwtPayload } from 'jsonwebtoken';

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
}: {
  user: JwtPayload;
  token: string;
}): Promise<unknown | null> => {
  try {
    const redisClient = getRedisClient();
    const userId = user?.sub;
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
    const expirationTime = user.exp as number; // convert to seconds
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    const ttl = Math.floor(expirationTime - currentTime); // remaining time in seconds
    if (ttl > 0)
      await redisClient.set(
        createRedisKey(REDIS_PREFIXES.blacklist, token),
        token,
        'EX',
        ttl
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
