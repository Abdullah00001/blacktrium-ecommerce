import { Job, Worker } from 'bullmq';

import logger from '@/app/configs/logger.configs';
import { getRedisClient } from '@/app/configs/redis.configs';
import { requestContext } from '@/app/configs/requestContext.configs';
import { SubscriptionModel } from '@/app/schemas/subscription/subscription.schema';
import { BusinessProfileModel } from '@/app/schemas/businessprofile/businessprofile.schema';
import { BusinessModel } from '@/app/schemas/business/business.schema';

export const createSystemWorker = (): Worker => {
  const SystemWorker = new Worker(
    'system-queue',
    async (job: Job) => {
      const { id, name, data } = job;
      const traceId = (job.data as any)?.traceId ?? 'NO_TRACE_ID';
      return requestContext.run({ traceId }, async () => {
        try {
          switch (name) {
            case 'expire-subscription': {
              const { subscriptionId } = data as { subscriptionId: string };
              const sub = await SubscriptionModel.findById(subscriptionId);
              if (!sub || sub.status !== 'active') return;

              // Verify it is actually expired
              if (sub.expiresAt && sub.expiresAt.getTime() <= Date.now()) {
                sub.status = 'expired';
                await sub.save();

                const profile = await BusinessProfileModel.findOne({ subscriptionId: sub._id });
                if (profile) {
                  profile.status = 'inactive';
                  await profile.save();
                  await BusinessModel.updateMany({ businessProfileId: profile._id }, { $set: { status: 'inactive' } });
                }
                logger.info(`Subscription ${subscriptionId} has expired.`);
              }
              return;
            }
            case 'sweep-expired-subscriptions': {
              const now = new Date();
              const expiredSubscriptions = await SubscriptionModel.find({
                expiresAt: { $lte: now },
                status: 'active',
              });

              for (const sub of expiredSubscriptions) {
                sub.status = 'expired';
                await sub.save();

                const profile = await BusinessProfileModel.findOne({ subscriptionId: sub._id });
                if (profile) {
                  profile.status = 'inactive';
                  await profile.save();
                  await BusinessModel.updateMany({ businessProfileId: profile._id }, { $set: { status: 'inactive' } });
                }
              }
              logger.info(`Processed ${expiredSubscriptions.length} expired subscriptions during sweep.`);
              return;
            }
            default:
              logger.warn(`Unknown job name: ${name}`);
              return;
          }
        } catch (error) {
          logger.error(
            `Error processing job ${name}: ${(error as Error).message}`
          );
          throw error;
        }
      });
    },
    {
      connection: getRedisClient() as any,
    }
  );

  SystemWorker.on('completed', (job: Job) => {
    const traceId = (job.data as any)?.traceId ?? 'NO_TRACE_ID';
    requestContext.run({ traceId }, () => {
      logger.info(`Job Name : ${job.name} Job Id : ${job.id} Completed`);
    });
  });

  SystemWorker.on('failed', (job: Job | undefined, error: Error) => {
    if (!job) {
      logger.error(
        `A job failed but the job data is undefined.\nError:\n${error}`
      );
      return;
    }
    const traceId = (job.data as any)?.traceId ?? 'NO_TRACE_ID';
    requestContext.run({ traceId }, () => {
      logger.error(
        `Job Name : ${job.name} Job Id : ${job.id} Failed\nError:\n${error}`
      );
    });
  });

  return SystemWorker;
};
