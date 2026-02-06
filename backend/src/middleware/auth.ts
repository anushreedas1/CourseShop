import { Request, Response, NextFunction } from 'express';
import authService from '../services/AuthService';

// Extend Express Request type to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Authentication middleware for protected routes
 * Extracts JWT from Authorization header, validates it, and attaches userId to request
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header missing' });
      return;
    }

    // Check if Authorization header follows Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid authorization format. Expected: Bearer <token>' });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    // Validate token
    const payload = authService.verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Attach userId to request object
    req.userId = payload.userId;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
