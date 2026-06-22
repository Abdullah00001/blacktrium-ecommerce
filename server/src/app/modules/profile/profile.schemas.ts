import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z
    .string({ error: 'First name is required and must be text' })
    .trim()
    .min(1, { message: 'First name cannot be empty' })
    .max(50, { message: 'First name cannot exceed 50 characters' })
    .optional(),

  lastName: z
    .string({ error: 'Last name is required and must be text' })
    .trim()
    .min(1, { message: 'Last name cannot be empty' })
    .max(50, { message: 'Last name cannot exceed 50 characters' })
    .optional(),
  country: z
    .string({ error: 'Country is required and must be text' })
    .trim()
    .min(2, {
      message: 'Country code must be at least 2 characters (e.g., UK, US)',
    })
    .max(10, { message: 'Invalid country designation' })
    .optional(),
  phone: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Phone number is required'
          : 'Phone number must be text',
    })
    .transform((val) => val.replace(/[\s\-()]/g, ''))
    .pipe(
      z.e164({
        error:
          'Must be a valid E.164 international phone number (e.g., +14155552671)',
      })
    )
    .optional(),
  profileAvatar: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Profile avatar is required'
          : 'Profile avatar must be a string',
    })
    .regex(
      /^https?:\/\/(?:[a-zA-Z0-9.-]+\.)?s3[.-]?[a-zA-Z0-9-]*\.amazonaws\.com\/.+$/,
      {
        error: 'Profile avatar must be a valid AWS S3 URL',
      }
    )
    // Pipe the S3-validated string into the top-level URL validator
    .pipe(z.url({ error: 'Profile avatar must be a valid URL' }))
    .optional(),
  interest: z
    .array(
      z
        .string({ error: 'Each interest must be text' })
        .trim()
        .min(1, { error: 'Interest cannot be empty' })
        .max(50, { error: 'Interest cannot exceed 50 characters' }),
      { error: 'Interests must be formatted as an array/list' }
    )
    .max(5, { error: 'You can only add up to 5 interests' }) 
    .optional(),
});

export type TProfilePayload = z.infer<typeof profileSchema>;
