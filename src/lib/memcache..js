import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy: (times) => {
    if (times > 10) return null; 
    return Math.min(times * 50, 2000);
  },
  maxRetriesPerRequest: 3,
  connectTimeout: 5000,
  reconnectOnError: (err) => {
    console.error('Redis connection error:', err);
    return true; 
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