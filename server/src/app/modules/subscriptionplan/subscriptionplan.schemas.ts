import { z } from 'zod';

export const createSubscriptionPlanSchema = z.object({
  revenueCatId: z.string().min(1, 'RevenueCat ID is required'),
  packageId: z.string().min(1, 'Package ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  planTier: z.string().min(1, 'Plan Tier is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  currency: z.string().optional().default('USD'),
  billingPeriod: z.string().min(1, 'Billing period is required'),
  status: z.string().optional().default('active'),
});

export const updateSubscriptionPlanSchema = z.object({
  revenueCatId: z.string().optional(),
  packageId: z.string().optional(),
  productId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  planTier: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  billingPeriod: z.string().optional(),
  status: z.string().optional(),
});

export const adminUpdateSubscriptionPlanSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export type TCreateSubscriptionPlan = z.infer<typeof createSubscriptionPlanSchema>;
export type TUpdateSubscriptionPlan = z.infer<typeof updateSubscriptionPlanSchema>;
export type TAdminUpdateSubscriptionPlan = z.infer<typeof adminUpdateSubscriptionPlanSchema>;

export const subscriptionPlanQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  planTier: z.string().optional(),
});

export type TSubscriptionPlanQuery = z.infer<typeof subscriptionPlanQuerySchema>;
