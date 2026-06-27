import { Types } from 'mongoose';
import { SubscriptionModel } from '@/app/schemas/subscription/subscription.schema';
import { ISubscription } from '@/app/schemas/subscription/subscription.types';
import { TSyncSubscription } from '@/app/modules/subscription/subscription.schemas';

/**
 * Business profile limits per plan tier.
 * Starter = 1, Growth = 3, Pro = 10
 */
const PLAN_BUSINESS_LIMITS: Record<string, number> = {
  starter: 1,
  growth: 3,
  pro: 10,
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
