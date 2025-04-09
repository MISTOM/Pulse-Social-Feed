import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(); // No token, continue but user will be null
  }

  try {
    // Extract the token (Bearer TOKEN_STRING)
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }

    // Verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      // Don't include password in the returned user object
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return next(); // User not found, continue but user will be null
    }

    // Add the user to the request object
    req.user = user;
    return next();
  } catch (error) {
    // Invalid token, continue but user will be null
    return next();
  }
};