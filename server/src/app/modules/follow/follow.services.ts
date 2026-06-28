import { Types } from 'mongoose';
import { FollowModel } from '@/app/schemas/follow/follow.schema';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { MerchantModel } from '@/app/schemas/merchant/merchant.schema';
import { TToggleFollow } from '@/app/modules/follow/follow.schemas';

export const toggleFollowService = async ({
  followerId,
  payload,
}: {
  followerId: string;
  payload: TToggleFollow;
}): Promise<unknown> => {
  const { targetId, targetType } = payload;
  const targetObjectId = new Types.ObjectId(targetId);
  const followerObjectId = new Types.ObjectId(followerId);

  // 1. Verify target exists
  if (targetType === 'BusinessProfile') {
    const exists = await BusinessProfileModel.exists({ _id: targetObjectId });
    if (!exists) throw new Error('Business Profile not found');
  } else if (targetType === 'Merchant') {
    const exists = await MerchantModel.exists({ _id: targetObjectId });
    if (!exists) throw new Error('Merchant not found');
  } else {
    throw new Error('Invalid targetType');
  }

  // 2. Check if currently following
  const existingFollow = await FollowModel.findOne({
    followerId: followerObjectId,
    targetId: targetObjectId,
    targetType,
  });

  if (existingFollow) {
    // Unfollow
    await FollowModel.deleteOne({ _id: existingFollow._id });

    // Decrement followers count
    if (targetType === 'BusinessProfile') {
      await BusinessProfileModel.findByIdAndUpdate(targetObjectId, { $inc: { followersCount: -1 } });
    }

    return { action: 'unfollowed', targetId };
  } else {
    // Follow
    await FollowModel.create({
      followerId: followerObjectId,
      targetId: targetObjectId,
      targetType,
    });

    // Increment followers count
    if (targetType === 'BusinessProfile') {
      await BusinessProfileModel.findByIdAndUpdate(targetObjectId, { $inc: { followersCount: 1 } });
    }

    return { action: 'followed', targetId };
  }
};

export const checkFollowStatusService = async ({
  followerId,
  targetId,
  targetType,
}: {
  followerId: string;
  targetId: string;
  targetType: 'BusinessProfile' | 'Merchant';
}): Promise<boolean> => {
  const existingFollow = await FollowModel.exists({
    followerId: new Types.ObjectId(followerId),
    targetId: new Types.ObjectId(targetId),
    targetType,
  });
  return !!existingFollow;
};
