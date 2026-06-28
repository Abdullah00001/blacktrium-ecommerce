import { z } from 'zod';

export const UpdateBusinessProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
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
});

export type TBusinessProfileQuery = z.infer<typeof BusinessProfileQuerySchema>;
