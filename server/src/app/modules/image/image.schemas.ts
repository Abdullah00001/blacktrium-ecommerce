import { s3Regex } from '@/const';
import { z } from 'zod';

const s3UrlSchema = z.string().regex(s3Regex);

export const imageSchema = z.object({
  imageUrl: s3UrlSchema.optional(),
  imageUrls: z.array(s3UrlSchema).optional(),
});

export const deleteImageSchema = imageSchema.refine(
  (payload) => Boolean(payload.imageUrl || payload.imageUrls?.length),
  {
    message: 'imageUrl or imageUrls is required.',
    path: ['imageUrl'],
  }
);

export type TImageSchemaPayload = z.infer<typeof imageSchema>;
