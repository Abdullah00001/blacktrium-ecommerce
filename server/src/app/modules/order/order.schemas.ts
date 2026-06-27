import { z } from 'zod';

const mongoObjectIdRegex = /^[0-9a-fA-F]{24}$/;

const OrderItemSchema = z.object({
  productId: z.string().regex(mongoObjectIdRegex, 'Invalid Product ID format'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().min(0, 'Price cannot be negative'),
});

const CustomerInfoSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

const PaymentInfoSchema = z.object({
  method: z.string().min(1, 'Payment method is required'),
  status: z.enum(['pending', 'paid', 'failed']).default('pending'),
  subtotal: z.number().min(0),
  shippingFee: z.number().min(0),
  total: z.number().min(0),
});

export const CreateOrderSchema = z.object({
  merchantId: z.string().regex(mongoObjectIdRegex, 'Invalid Merchant ID format'),
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  customerInfo: CustomerInfoSchema,
  paymentInfo: PaymentInfoSchema,
});

export type TCreateOrder = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});

export type TUpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;

export const OrderQuerySchema = z.object({
  page: z.any().optional().transform((val) => (val ? Number(val) : 1)),
  limit: z.any().optional().transform((val) => (val ? Number(val) : 10)),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  orderId: z.string().optional(), // For searching by specific string ID
});

export type TOrderQuery = z.infer<typeof OrderQuerySchema>;
