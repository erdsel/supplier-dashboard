import { createClient } from 'redis';
import logger from '../utils/logger';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    connectTimeout: 5000,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (error) => {
  logger.warn('Redis Client Error (continuing without cache):', error);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

redisClient.on('disconnect', () => {
  logger.warn('Redis Client Disconnected');
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.warn('Redis connection failed, continuing without cache:', error);
  }
};

// Graceful wrapper for Redis operations
export const safeRedisOperation = async (operation: () => Promise<any>): Promise<any> => {
  try {
    if (redisClient.isOpen) {
      return await operation();
    }
    return null;
  } catch (error) {
    logger.warn('Redis operation failed, continuing without cache:', error);
    return null;
  }
};

export default redisClient;