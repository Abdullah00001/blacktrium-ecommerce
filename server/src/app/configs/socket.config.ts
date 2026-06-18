import { Server as HttpServer } from 'node:http';

import { Server as SocketServer } from 'socket.io';

import corsConfiguration from '@/app/configs/cors.configs';
import logger from '@/app/configs/logger.configs';
import {
  socketAuthMiddleware,
  socketTraceMiddleware,
} from '@/app/middlewares/socket.middlewares';

let io: SocketServer | null = null;

const initializeSocket = (server: HttpServer): SocketServer => {
  if (io) return io;

  io = new SocketServer(server, {
    cors: corsConfiguration,
  });

  io.use(socketTraceMiddleware);
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} - ${reason}`);
    });
  });

  logger.info('[Socket] Initialized');
  return io;
};

export const getSocketServer = (): SocketServer => {
  if (!io) {
    throw new Error('Socket server not initialized');
  }

  return io;
};

export default initializeSocket;
