import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.util.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 10000
    });

    logger.info('MongoDB connection established');
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB connection closed');
};

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB runtime error', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
