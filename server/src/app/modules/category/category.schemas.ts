import { z } from 'zod';

// ========================
// Category Schemas
// ========================

export const CreateCategorySchema = z.object({
  categoryName: z
    .string({
      message: 'Category name is required',
    })
    .min(1, 'Category name cannot be empty'),
  categoryImage: z
    .url({
      message: 'Category image URL is required',
    })
});

export type TCreateCategory = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  categoryName: z.string().min(1, 'Category name cannot be empty').optional(),
  categoryImage: z.url({ message: 'Must be a valid URL' }).optional(),
  status: z.boolean().optional(),
});

export type TUpdateCategory = z.infer<typeof UpdateCategorySchema>;

export const CategoryQuerySchema = z.object({
  page: z
    .any()
    .optional()
    .transform((val) => (val ? Number(val) : 1)),
  limit: z
    .any()
    .optional()
    .transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  status: z
    .any()
    .optional()
    .transform((val) => {
      if (val === 'true' || val === true || val === '1' || val === 1) return true;
      if (val === 'false' || val === false || val === '0' || val === 0) return false;
      return undefined;
    }),
});

export type TCategoryQuery = z.infer<typeof CategoryQuerySchema>;

// ========================
// SubCategory Schemas
// ========================

export const CreateSubCategorySchema = z.object({
  categoryId: z
    .string({
      message: 'Category ID is required',
    })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID format'),
  subCategoryName: z
    .string({
      message: 'Subcategory name is required',
    })
    .min(1, 'Subcategory name cannot be empty'),
});

export type TCreateSubCategory = z.infer<typeof CreateSubCategorySchema>;

export const UpdateSubCategorySchema = z.object({
  subCategoryName: z.string().min(1, 'Subcategory name cannot be empty').optional(),
  status: z.boolean().optional(),
});

export type TUpdateSubCategory = z.infer<typeof UpdateSubCategorySchema>;

export const SubCategoryQuerySchema = z.object({
  category: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
      message: 'Invalid Category ID format',
    }),
  page: z
    .any()
    .optional()
    .transform((val) => (val ? Number(val) : 1)),
  limit: z
    .any()
    .optional()
    .transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  status: z
    .any()
    .optional()
    .transform((val) => {
      if (val === 'true' || val === true || val === '1' || val === 1) return true;
      if (val === 'false' || val === false || val === '0' || val === 0) return false;
      return undefined;
    }),
});

export type TSubCategoryQuery = z.infer<typeof SubCategoryQuerySchema>;
