import { z } from 'zod';
import { AccountStatus } from '@/app/schemas/user/user.types';

export const UserQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  type: z.enum(['user', 'business', 'merchant']).optional(),
});

export const AdminUpdateUserStatusSchema = z.object({
  status: z.nativeEnum(AccountStatus),
});
