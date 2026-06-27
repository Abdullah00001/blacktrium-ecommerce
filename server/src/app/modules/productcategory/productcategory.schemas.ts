import { z } from 'zod';

export const CreateProductCategorySchema = z.object({
  categoryName: z.string().min(1, 'Category name cannot be empty'),
});

export type TCreateProductCategory = z.infer<typeof CreateProductCategorySchema>;

export const UpdateProductCategorySchema = z.object({
  categoryName: z.string().min(1).optional(),
  status: z.boolean().optional(),
});

export type TUpdateProductCategory = z.infer<typeof UpdateProductCategorySchema>;

export const ProductCategoryQuerySchema = z.object({
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  status: z.any().optional().transform((val) => {
    if (val === 'true' || val === true || val === '1' || val === 1) return true;
    if (val === 'false' || val === false || val === '0' || val === 0) return false;
    return undefined;
  }),
});

export type TProductCategoryQuery = z.infer<typeof ProductCategoryQuerySchema>;
