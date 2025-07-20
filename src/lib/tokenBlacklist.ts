// lib/tokenBlacklist.ts
import { prisma } from '#lib/prisma';
import { redis } from '#lib/redis';

const useRedis = process.env.USE_REDIS === 'true';

// Add token to blacklist
export const blacklistToken = async (token: string, expiresAt: Date) => {
  if (useRedis) {
    const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    await redis.set(`bl:${token}`, 'blacklisted', { EX: ttl });
  } else {
    await prisma.blacklistedToken.create({
      data: { token, expiresAt },
    });
  }
};

// Check if token is blacklisted
export const isBlacklisted = async (token: string): Promise<boolean> => {
  if (useRedis) {
    const result = await redis.get(`bl:${token}`);
    return result === 'blacklisted';
  } else {
    const result = await prisma.blacklistedToken.findUnique({ where: { token } });
    return !!result;
  }
};
