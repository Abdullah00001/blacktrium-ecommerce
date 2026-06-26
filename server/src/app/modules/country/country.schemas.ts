import { z } from 'zod';

export const CountryQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  status: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    }),
});

export type TCountryQuery = z.infer<typeof CountryQuerySchema>;

export const UpdateCountryStatusSchema = z.object({
  status: z.boolean({
    message: 'Status is required and must be a boolean',
  }),
});

export type TUpdateCountryStatus = z.infer<typeof UpdateCountryStatusSchema>;
