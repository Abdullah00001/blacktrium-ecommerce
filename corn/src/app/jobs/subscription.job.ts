import cron from 'node-cron';
import logger from '@/app/configs/logger.configs';
import { Queue } from 'bullmq';
import { getRedisClient } from '@/app/configs/redis.configs';

let systemQueue: Queue | null = null;

// Run every hour
cron.schedule('0 * * * *', async () => {
  logger.info('[Corn] Dispatching subscription expiration sweep...');
  try {
    if (!systemQueue) {
      systemQueue = new Queue('system-queue', { connection: getRedisClient() as any });
    }

    await systemQueue.add('sweep-expired-subscriptions', {});

    logger.info(`[Corn] Dispatched 'sweep-expired-subscriptions' job to worker.`);
  } catch (error) {
    logger.error(`[Corn] Error dispatching subscription sweep: ${error}`);
  }
});
