import { z } from 'zod';

export const CreateContactSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is too short'),
  message: z.string().min(10, 'Message is too short'),
});

export const AdminUpdateContactStatusSchema = z.object({
  status: z.enum(['pending', 'resolved']),
});
