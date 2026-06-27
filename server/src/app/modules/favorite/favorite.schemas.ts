import { z } from 'zod';

const mongoObjectIdRegex = /^[0-9a-fA-F]{24}$/;

export const ToggleFavoriteSchema = z.object({
  itemType: z.enum(['business', 'product']),
  targetId: z.string().regex(mongoObjectIdRegex, 'Invalid Target ID format'),
});

export type TToggleFavorite = z.infer<typeof ToggleFavoriteSchema>;

export const FavoriteQuerySchema = z.object({
  type: z.enum(['business', 'product']).optional().default('business'),
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
});

export type TFavoriteQuery = z.infer<typeof FavoriteQuerySchema>;
