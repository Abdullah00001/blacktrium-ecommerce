import { z } from 'zod';

export const signupSchema = z.object({
  firstName: z.string({ error: 'first name required' }).min(1),
  lastName: z.string({ error: 'last name required' }).min(1),
  email: z.email({ error: 'invalid email format' }).toLowerCase(),
  country: z.string({ error: 'invalid country code' }).min(2),
  password: z.string({ error: 'password must be 8 character' }).min(8),
  isSubscribe
});
