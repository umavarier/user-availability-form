import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryStrategy: (times) => {
    if (times > 10) return null; // Stop retrying after 10 attempts
    return Math.min(times * 50, 2000);
  },
  maxRetriesPerRequest: 10,
  connectTimeout: 5000,
  reconnectOnError: (err) => {
    console.error('Redis connection error:', err);
    return true; // Try to reconnect
  }
});

redis.on('error', (err) => {
  console.error('Redis global error:', err);
});

export const getFromCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const setInCache = async (key, value, lifetime = 86400) => {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', lifetime);
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
};