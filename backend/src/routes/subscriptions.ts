import { Router, Response } from 'express';
import { z } from 'zod';
import subscriptionService from '../services/SubscriptionService';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Validation schema for subscribe request
const subscribeSchema = z.object({
  courseId: z.string().uuid('Invalid course ID format'),
  promoCode: z.string().optional(),
});

/**
 * POST /subscribe
 * Subscribe to a course (protected route)
 * Requires authentication via JWT token
 */
router.post('/subscribe', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Validate request body
    const validatedData = subscribeSchema.parse(req.body);

    // userId is attached by authMiddleware
    const userId = req.userId!;

    // Call SubscriptionService to create subscription
    const subscription = await subscriptionService.subscribe(
      userId,
      validatedData.courseId,
      validatedData.promoCode
    );

    // Return success response
    res.status(201).json({
      subscription,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    // Handle business logic errors
    if (error instanceof Error) {
      // User already subscribed
      if (error.message === 'User already subscribed to this course') {
        return res.status(409).json({ error: error.message });
      }
      
      // Course not found
      if (error.message === 'Course not found') {
        return res.status(404).json({ error: error.message });
      }
      
      // Invalid promo code
      if (error.message === 'Invalid promo code') {
        return res.status(400).json({ error: error.message });
      }
      
      // Promo code required for paid courses
      if (error.message === 'Promo code required for paid courses') {
        return res.status(400).json({ error: error.message });
      }
    }

    // Handle unexpected errors
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /my-courses
 * Get all subscriptions for the authenticated user (protected route)
 * Requires authentication via JWT token
 */
router.get('/my-courses', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // userId is attached by authMiddleware
    const userId = req.userId!;

    // Call SubscriptionService to get user subscriptions
    const subscriptions = await subscriptionService.getUserSubscriptions(userId);

    // Return success response
    res.status(200).json({
      subscriptions,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error('Get my courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
