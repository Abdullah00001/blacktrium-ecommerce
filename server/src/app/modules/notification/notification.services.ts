import admin from 'firebase-admin';
import { UserModel } from '@/app/schemas/user/user.schema';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { getEmailQueue } from '@/app/queues/queues';
import { TCustomNotification } from '@/app/modules/notification/notification.schemas';

export const sendCustomNotificationService = async ({
  payload,
  traceId,
}: {
  payload: TCustomNotification;
  traceId: string;
}): Promise<void> => {
  const { title, description, targetType } = payload;

  // 1. Fetch target users
  let query: Record<string, any> = { role: 'user' };

  if (targetType === 'merchant') {
    // Find all users who have a business profile
    const businessProfiles = await BusinessProfileModel.find({}, { userId: 1 });
    const merchantUserIds = businessProfiles.map((bp) => bp.userId);
    
    query = {
      _id: { $in: merchantUserIds },
      role: 'user', // Ensure they are still users
    };
  } else {
    // targetType === 'user'
    // Find all users who DO NOT have a business profile (normal app users)
    const businessProfiles = await BusinessProfileModel.find({}, { userId: 1 });
    const merchantUserIds = businessProfiles.map((bp) => bp.userId);
    
    query = {
      _id: { $nin: merchantUserIds },
      role: 'user',
    };
  }

  const users = await UserModel.find(
    query,
    { email: 1, fcmToken: 1 }
  );

  if (!users || users.length === 0) return;

  // 2. Extract tokens and emails
  const tokens = users
    .map((u) => u.fcmToken)
    .filter((token): token is string => !!token);
    
  const emails = users.map((u) => u.email).filter(Boolean);

  // 3. Send Push Notifications via FCM (batches of 500 max per multicast)
  if (tokens.length > 0) {
    const message = {
      notification: {
        title,
        body: description,
      },
      tokens, // Note: For production with >500 tokens, chunk array into sizes of 500
    };

    try {
      // Chunk tokens if greater than 500 (firebase limit)
      const chunkSize = 500;
      for (let i = 0; i < tokens.length; i += chunkSize) {
        const chunk = tokens.slice(i, i + chunkSize);
        await admin.messaging().sendEachForMulticast({ ...message, tokens: chunk });
      }
    } catch (error) {
      console.error(`[${traceId}] FCM Multicast Error:`, error);
      // We don't throw here to ensure emails still attempt to process
    }
  }

  // 4. Send Emails via Queue
  // We can push individual jobs, or a bulk job if worker supports it.
  // Pushing individual jobs ensures retry logic per user.
  if (emails.length > 0) {
    const emailQueue = getEmailQueue();
    const jobs = emails.map((email) => ({
      name: 'send-custom-notification-email',
      data: {
        email,
        title,
        description,
        traceId,
      },
    }));
    
    // Add all to queue in bulk for performance
    await emailQueue.addBulk(jobs);
  }
};
