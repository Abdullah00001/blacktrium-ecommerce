import { z } from 'zod';

const mongoObjectIdRegex = /^[0-9a-fA-F]{24}$/;

const SocialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  url: z.string().url({ message: 'Must be a valid URL' }),
});

export const UpdateBusinessProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  brandName: z.string().max(100).optional().nullable(),
  profileAvatar: z.string().url().optional().nullable(),
  businessOwnerType: z.string().min(1).optional(),
  businessType: z.enum(['Physical', 'Virtual', 'Hybrid']).optional().nullable(),
  countryId: z.string().regex(mongoObjectIdRegex).optional(),
  tagLine: z.string().max(200).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  socialLinks: z.array(SocialLinkSchema).optional(),
});

export type TUpdateBusinessProfile = z.infer<typeof UpdateBusinessProfileSchema>;

export const AdminUpdateBusinessProfileStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export type TAdminUpdateBusinessProfileStatus = z.infer<typeof AdminUpdateBusinessProfileStatusSchema>;

export const BusinessProfileQuerySchema = z.object({
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  status: z.string().optional(),
  businessOwnerType: z.string().optional(),
});

export type TBusinessProfileQuery = z.infer<typeof BusinessProfileQuerySchema>;
