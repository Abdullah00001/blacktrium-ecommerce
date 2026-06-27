import { z } from 'zod';

const mongoObjectIdRegex = /^[0-9a-fA-F]{24}$/;

export const CreateProductSchema = z.object({
  merchantId: z.string().regex(mongoObjectIdRegex, 'Invalid Merchant ID format'),
  categoryId: z.string().regex(mongoObjectIdRegex, 'Invalid Category ID format'),
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().min(1, 'Product description is required').max(2000),
  location: z.string().min(1, 'Event location is required'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  currency: z.string().optional().default('Euros'),
  stockQuantity: z.number().int().min(0, 'Quantity must be at least 0').default(0),
  colors: z.array(z.string()).optional().default([]),
  materials: z.array(z.string()).optional().default([]),
  sizes: z.array(z.string()).optional().default([]),
  shippingCost: z.number().min(0, 'Shipping cost cannot be negative'),
  shippingCurrency: z.string().optional().default('Euros'),
  discount: z.number().min(0).max(100).optional().default(0),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
});

export type TCreateProduct = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  categoryId: z.string().regex(mongoObjectIdRegex, 'Invalid Category ID format').optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  location: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  colors: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  shippingCost: z.number().min(0).optional(),
  shippingCurrency: z.string().optional(),
  discount: z.number().min(0).max(100).optional(),
  images: z.array(z.string().url()).min(1).optional(),
});

export type TUpdateProduct = z.infer<typeof UpdateProductSchema>;

export const AdminUpdateProductStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export type TAdminUpdateProductStatus = z.infer<typeof AdminUpdateProductStatusSchema>;

export const ProductQuerySchema = z.object({
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  merchantId: z.string().optional(),
});

export type TProductQuery = z.infer<typeof ProductQuerySchema>;
