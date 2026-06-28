import { Types } from 'mongoose';
import { SubscriptionModel } from '@/app/schemas/subscription/subscription.schema';
import { ISubscription } from '@/app/schemas/subscription/subscription.types';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { TSyncSubscription } from '@/app/modules/subscription/subscription.schemas';
import { getSystemQueue } from '@/app/queues/queues';

/**
 * Business profile limits per plan tier.
 * Starter = 1, Growth = 3, Pro = 10
 */
const PLAN_BUSINESS_LIMITS: Record<string, number> = {
  starter: 1,
  growth: 1,
  pro: 2,
};

// ========================
// Subscription Services
// ========================

export const syncSubscriptionService = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: TSyncSubscription;
}): Promise<unknown> => {
  const maxBusinessAllowed = PLAN_BUSINESS_LIMITS[payload.planTier.toLowerCase()] || 1;

  const result = await SubscriptionModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    {
      $set: {
        userId: new Types.ObjectId(userId),
        revenueCatId: payload.revenueCatId,
        packageId: payload.packageId,
        productId: payload.productId,
        planTier: payload.planTier,
        status: 'active',
        platform: payload.platform,
        maxBusinessAllowed,
        purchasedAt: new Date(payload.purchasedAt),
        expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
        isTrial: payload.isTrial ?? false,
      },
    },
    { upsert: true, new: true }
  );

  const systemQueue = getSystemQueue();
  const jobId = `expire_sub_${result._id.toString()}`;
  await systemQueue.remove(jobId);

  if (result.expiresAt) {
    const delay = new Date(result.expiresAt).getTime() - Date.now();
    if (delay > 0) {
      await systemQueue.add('expire-subscription', { subscriptionId: result._id.toString() }, { delay, jobId });
    } else {
      await systemQueue.add('expire-subscription', { subscriptionId: result._id.toString() }, { jobId });
    }
  }

  // ACTIVATE BUSINESS PROFILE
  // When a subscription is purchased/started, activate their business profile!
  await BusinessProfileModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { 
      $set: { 
        subscriptionId: result._id,
        status: 'active' 
      } 
    }
  );

  return result;
};

export const getMySubscriptionService = async ({
  userId,
}: {
  userId: string;
}): Promise<ISubscription | null> => {
  const subscription = await SubscriptionModel.findOne({
    userId: new Types.ObjectId(userId),
    status: 'active',
  });
  return subscription;
};

export const cancelSubscriptionService = async ({
  userId,
}: {
  userId: string;
}): Promise<unknown> => {
  const subscription = await SubscriptionModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId), status: 'active' },
    { $set: { status: 'cancelled' } },
    { new: true }
  );
  if (!subscription) throw new Error('No active subscription found to cancel');

  const systemQueue = getSystemQueue();
  await systemQueue.remove(`expire_sub_${subscription._id.toString()}`);

  return subscription;
};
