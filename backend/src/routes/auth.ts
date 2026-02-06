import { Router, Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/AuthService';

const router = Router();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

/**
 * POST /auth/signup
 * Register a new user account
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);

    // Call AuthService to create user
    const result = await authService.signup(
      validatedData.email,
      validatedData.password,
      validatedData.name
    );

    // Return success response
    res.status(201).json({
      token: result.token,
      user: result.user,
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
      if (error.message === 'Email already exists') {
        return res.status(409).json({ error: error.message });
      }
      if (error.message === 'Invalid email format' || 
          error.message === 'Password must be at least 8 characters long') {
        return res.status(400).json({ error: error.message });
      }
    }

    // Handle unexpected errors
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /auth/login
 * Authenticate a user with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Call AuthService to authenticate user
    const result = await authService.login(
      validatedData.email,
      validatedData.password
    );

    // Return success response
    res.status(200).json({
      token: result.token,
      user: result.user,
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

    // Handle authentication errors
    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
    }

    // Handle unexpected errors
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
