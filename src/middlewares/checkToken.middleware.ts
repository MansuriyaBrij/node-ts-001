import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '#lib/prisma';
import { isBlacklisted } from '#lib/tokenBlacklist';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const checkToken = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // 👇 Check if token is blacklisted
    if (await isBlacklisted(token)) {
      return res.status(401).json({ 
        status: false,
        message: 'Token has been revoked'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded !== 'object' || !('userId' in decoded)) {
        return res.status(401).json({ 
          status: false,
          message: 'Invalid token structure'
        });
      }

      // 👇 Find user by ID from JWT payload
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId as number },
      });

      if (!user) {
        return res.status(401).json({ 
          status: false,
          message: 'User not found'
        });
      }

      req.user = user; // Attach user to request
      next();
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: 'Invalid or expired token'
      });
    }
  };
};
