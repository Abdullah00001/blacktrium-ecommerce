import { z } from 'zod';

export const CustomNotificationSchema = z.object({
  title: z.string().min(1, 'Notification title is required'),
  description: z.string().min(1, 'Notification description is required'),
  targetType: z.enum(['user', 'merchant']),
});

export type TCustomNotification = z.infer<typeof CustomNotificationSchema>;
