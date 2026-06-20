import { z } from 'zod';

export const signupPayloadSchema = z.object({
  firstName: z
    .string({ error: 'First name is required and must be text' })
    .trim()
    .min(1, { message: 'First name cannot be empty' })
    .max(50, { message: 'First name cannot exceed 50 characters' }),

  lastName: z
    .string({ error: 'Last name is required and must be text' })
    .trim()
    .min(1, { message: 'Last name cannot be empty' })
    .max(50, { message: 'Last name cannot exceed 50 characters' }),

  email: z
    .email({ error: 'Invalid email address format' })
    .trim()
    .toLowerCase(),

  country: z
    .string({ error: 'Country is required and must be text' })
    .trim()
    .min(2, {
      message: 'Country code must be at least 2 characters (e.g., UK, US)',
    })
    .max(10, { message: 'Invalid country designation' }),

  password: z
    .string({ error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(100, { message: 'Password is too long for hashing performance' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),

  isSubscribe: z.boolean({
    error: 'Subscription preference must be a true/false value',
  }),

  isLegalTermsAccepted: z
    .boolean({
      error: 'Terms flag must be a true/false value',
    })
    .refine((val) => val === true, {
      message: 'You must accept the Terms and Conditions to create an account',
    }),
});

export type TSignupPayload = z.infer<typeof signupPayloadSchema>;

export const verifyOtpSchema = z
  .object({
    otp: z
      .string()
      .trim() // Remove accidental whitespace
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d+$/, 'OTP must only contain numbers'),
  })
  .strict();

export type TVerifyOtpPayload = z.infer<typeof verifyOtpSchema>;
