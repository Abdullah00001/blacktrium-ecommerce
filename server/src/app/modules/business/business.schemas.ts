import { z } from 'zod';

const mongoObjectIdRegex = /^[0-9a-fA-F]{24}$/;


export const PromotionSchema = z.object({
  title: z.string().min(1, 'Promotion title is required'),
  subtitle: z.string().min(1, 'Promotion subtitle is required'),
  lastDate: z.string().min(1, 'Last date is required'),
  lastTime: z.string().min(1, 'Last time is required'),
});

export const EventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  subtitle: z.string().min(1, 'Event subtitle is required'),
  date: z.string().min(1, 'Event date is required'),
  time: z.string().min(1, 'Event time is required'),
  image: z.string().url('Invalid image URL format').optional(),
  description: z.string().min(1, 'Event description is required'),
});

export const CreateBusinessSchema = z.object({
  businessName: z.string().min(1, 'Business name cannot be empty').max(150, 'Business name is too long'),
  businessType: z.string().min(1, 'Business type is required'),
  categoryId: z.string().regex(mongoObjectIdRegex, 'Invalid Category ID format'),
  subCategoryId: z.string().regex(mongoObjectIdRegex, 'Invalid Sub-category ID format'),
  countryId: z.string().regex(mongoObjectIdRegex, 'Invalid Country ID format').optional(),
  location: z.string().min(1, 'Location cannot be empty'),
  thumbnailImage: z.string().url().optional().nullable(),
  businessImages: z.array(z.string().url()).max(10, 'Maximum 10 images allowed').optional().default([]),
  businessDescription: z.string().max(2000, 'Description too long').optional().nullable(),
  promotions: z.array(PromotionSchema).optional().default([]),
  events: z.array(EventSchema).optional().default([]),
  spotlightFeature: z.boolean().optional().default(false),
});

export type TCreateBusiness = z.infer<typeof CreateBusinessSchema>;

export const UpdateBusinessSchema = z.object({
  businessName: z.string().min(1).max(150).optional(),
  businessType: z.string().min(1).optional(),
  countryId: z.string().regex(mongoObjectIdRegex).optional(),
  location: z.string().min(1).optional(),
  thumbnailImage: z.string().url().optional().nullable(),
  businessImages: z.array(z.string().url()).max(10).optional(),
  businessDescription: z.string().max(2000).optional().nullable(),
  promotions: z.array(PromotionSchema).optional(),
  events: z.array(EventSchema).optional(),
  spotlightFeature: z.boolean().optional(),
});

export type TUpdateBusiness = z.infer<typeof UpdateBusinessSchema>;

export const AdminUpdateBusinessStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export type TAdminUpdateBusinessStatus = z.infer<typeof AdminUpdateBusinessStatusSchema>;

export const BusinessQuerySchema = z.object({
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  countryId: z.string().optional(),
  businessType: z.string().optional(),
  location: z.string().optional(),
  isFeatured: z.any().optional().transform((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }),
});

export type TBusinessQuery = z.infer<typeof BusinessQuerySchema>;
