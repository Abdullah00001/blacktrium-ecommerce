import { z } from 'zod';

export const SyncSubscriptionSchema = z.object({
  revenueCatId: z.string().min(1, 'RevenueCat ID is required'),
  packageId: z.string().min(1, 'Package ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  planTier: z.string().min(1, 'Plan tier is required'),
  platform: z.string().min(1, 'Platform is required'),
  purchasedAt: z.string().datetime({ message: 'purchasedAt must be a valid ISO 8601 date' }),
  isTrial: z.boolean().optional().default(false),
  expiresAt: z.string().datetime({ message: 'expiresAt must be a valid ISO 8601 date' }).nullable().optional(),
});

export type TSyncSubscription = z.infer<typeof SyncSubscriptionSchema>;
