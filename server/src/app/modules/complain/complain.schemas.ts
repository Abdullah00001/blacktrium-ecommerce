import { z } from 'zod';

export const ComplainQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  type: z.enum(['event', 'profile', 'product']).optional(),
});
