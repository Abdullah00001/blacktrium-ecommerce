import { z } from 'zod';

export const ConnectStripeSchema = z.object({
  stripeAccountId: z.string().min(1, 'Stripe Account ID is required'),
});

export type TConnectStripe = z.infer<typeof ConnectStripeSchema>;
