import Redis from 'ioredis';
import { config } from '../config';

declare global {
  var redisSingleton: Redis | undefined;
}

const createRedisInstance = (): Redis => {
  const client = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD || undefined,
    db: config.REDIS_DB,
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    retryStrategy(times) {
      if (times > 3) {
        // Stop retrying to prevent blocking when Redis server is down
        return null;
      }
      return Math.min(times * 200, 1000);
    }
  });

  client.on('connect', () => console.log('🔴 Redis connected successfully.'));
  client.on('error', (err) => {
    // Silent warn on test or offline environment
    if (process.env.NODE_ENV !== 'test') {
      console.warn('⚠️ Redis Connection Warning:', err.message);
    }
  });

  return client;
};

export const redis = globalThis.redisSingleton ?? createRedisInstance();

if (process.env.NODE_ENV !== 'production') {
  globalThis.redisSingleton = redis;
}
