import { z } from 'zod';
import { UserType, ContentType } from '@/app/schemas/legal/legal.types';

export const LegalQuerySchema = z.object({
  targetRole: z.enum(Object.values(UserType) as [string, ...string[]], {
    message: "Invalid targetRole. Must be 'user', 'organizer', or 'merchant'.",
  }),

  contentType: z.enum(Object.values(ContentType) as [string, ...string[]], {
    message:
      "Invalid contentType. Must be 'privacy', 'terms', 'about', or 'mission'.",
  }),
});

export type TLegalQuery = z.infer<typeof LegalQuerySchema>;

export const LegalContentSchema = z.object({
  content: z
    .string({
      message: 'Content block cannot be empty and must be a valid string.',
    })
    .trim()
    .min(1),
});

export type TLegalContent = z.infer<typeof LegalContentSchema>;
