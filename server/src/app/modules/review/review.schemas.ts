import { z } from 'zod';

const mongoObjectIdRegex = /^[0-9a-fA-F]{24}$/;

export const CreateReviewSchema = z.object({
  targetId: z.string().regex(mongoObjectIdRegex, 'Invalid Target ID format'),
  rating: z.number().int().min(1).max(5),
  text: z.string().optional(),
  image: z.string().url('Invalid image URL format').optional(),
  isAnonymous: z.boolean().optional().default(false),
});

export type TCreateReview = z.infer<typeof CreateReviewSchema>;

export const ReplyReviewSchema = z.object({
  text: z.string().min(1, 'Reply text is required'),
});

export type TReplyReview = z.infer<typeof ReplyReviewSchema>;

export const ReviewQuerySchema = z.object({
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
});

export type TReviewQuery = z.infer<typeof ReviewQuerySchema>;
