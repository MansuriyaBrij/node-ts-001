// lib/redis.ts
import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', err => console.error('Redis error:', err));

if (process.env.USE_REDIS === 'true') {
  await redis.connect();
}
