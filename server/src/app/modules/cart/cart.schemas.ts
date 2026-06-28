import { z } from 'zod';

const mongoObjectIdRegex = /^[0-9a-fA-F]{24}$/;

export const AddToCartSchema = z.object({
  productId: z.string().regex(mongoObjectIdRegex, 'Invalid Product ID format'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  size: z.string().optional(),
  color: z.string().optional(),
});

export type TAddToCart = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1').optional(),
  size: z.string().optional(),
  color: z.string().optional(),
});

export type TUpdateCartItem = z.infer<typeof UpdateCartItemSchema>;
