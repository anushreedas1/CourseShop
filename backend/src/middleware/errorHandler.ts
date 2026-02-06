import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * Catches all unhandled errors and returns appropriate HTTP responses
 * 
 * Requirements: 12.1, 12.2
 * - Returns appropriate HTTP status codes (400, 401, 404, 500)
 * - Returns JSON responses with error messages
 * - Logs errors to console
 */
export const errorHandler = (
  err: Error | AppError | z.ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error to console
  console.error('Error occurred:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Zod validation errors (400)
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  // Handle known error messages with specific status codes
  if (err instanceof Error) {
    const message = err.message;

    // Authentication errors (401)
    if (
      message === 'Invalid credentials' ||
      message === 'No token provided' ||
      message === 'Invalid token' ||
      message === 'Token expired' ||
      message === 'Unauthorized'
    ) {
      res.status(401).json({ error: message });
      return;
    }

    // Not found errors (404)
    if (
      message === 'Course not found' ||
      message === 'User not found' ||
      message === 'Subscription not found' ||
      message.includes('not found')
    ) {
      res.status(404).json({ error: message });
      return;
    }

    // Conflict errors (409)
    if (
      message === 'Email already exists' ||
      message === 'User already subscribed to this course' ||
      message.includes('already exists')
    ) {
      res.status(409).json({ error: message });
      return;
    }

    // Validation/Bad request errors (400)
    if (
      message === 'Invalid email format' ||
      message === 'Password must be at least 8 characters long' ||
      message === 'Invalid promo code' ||
      message === 'Promo code required for paid courses' ||
      message.includes('Invalid') ||
      message.includes('required')
    ) {
      res.status(400).json({ error: message });
      return;
    }
  }

  // Default to 500 Internal Server Error for unhandled cases
  res.status(500).json({
    error: 'Internal server error',
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * This eliminates the need for try-catch blocks in every route
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(404, `Route ${req.method} ${req.path} not found`);
  next(error);
};
