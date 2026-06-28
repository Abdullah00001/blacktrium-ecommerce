import { z } from 'zod';

export const EarningQuerySchema = z.object({
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  type: z.enum(['product', 'event']).optional(),
});

export type TEarningQuery = z.infer<typeof EarningQuerySchema>;
