import { z } from 'zod';

const SocialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  url: z.string().url({ message: 'Must be a valid URL' }),
});

export const CreateMerchantSchema = z.object({
  shopName: z.string().min(1, 'Shop name cannot be empty').max(150),
  aboutShop: z.string().min(1, 'About shop is required').max(2000),
  termsAndCondition: z.string().min(1, 'Terms and condition is required'),
  shopType: z.string().min(1, 'Shop type is required'),
  shopLink: z.string().url('Invalid shop link').optional().nullable(),
  location: z.string().min(1, 'Location cannot be empty'),
  phone: z.string().min(1, 'Phone is required'),
  socialLinks: z.array(SocialLinkSchema).optional().default([]),
  profileImage: z.string().url().optional().nullable(),
  bannerImage: z.string().url().optional().nullable(),
});

export type TCreateMerchant = z.infer<typeof CreateMerchantSchema>;

export const UpdateMerchantSchema = z.object({
  shopName: z.string().min(1).max(150).optional(),
  aboutShop: z.string().min(1).max(2000).optional(),
  termsAndCondition: z.string().min(1).optional(),
  shopType: z.string().min(1).optional(),
  shopLink: z.string().url().optional().nullable(),
  location: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  socialLinks: z.array(SocialLinkSchema).optional(),
  profileImage: z.string().url().optional().nullable(),
  bannerImage: z.string().url().optional().nullable(),
});

export type TUpdateMerchant = z.infer<typeof UpdateMerchantSchema>;

export const AdminUpdateMerchantStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export type TAdminUpdateMerchantStatus = z.infer<typeof AdminUpdateMerchantStatusSchema>;

export const MerchantQuerySchema = z.object({
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type TMerchantQuery = z.infer<typeof MerchantQuerySchema>;
