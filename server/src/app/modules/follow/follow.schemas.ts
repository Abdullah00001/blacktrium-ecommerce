import { z } from 'zod';

export const ToggleFollowSchema = z.object({
  targetId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid target ID format'),
  targetType: z.enum(['BusinessProfile', 'Merchant']),
});

export type TToggleFollow = z.infer<typeof ToggleFollowSchema>;
