import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/connection';
import { User, UserDTO, JWTPayload } from '../types';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export class AuthService {
  /**
   * Hash a plaintext password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare a plaintext password with a hashed password
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT token with user ID in payload
   */
  generateToken(userId: string): string {
    const payload: JWTPayload = { userId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  /**
   * Verify and decode a JWT token
   * Returns the payload if valid, null if invalid
   */
  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Register a new user with email, password, and optional name
   * Returns the created user (without password) and JWT token
   */
  async signup(
    email: string,
    password: string,
    name?: string
  ): Promise<{ user: UserDTO; token: string }> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password length
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const result = await pool.query<User>(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, hashedPassword, name || null]
    );

    const user = result.rows[0];
    const userDTO: UserDTO = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // Generate JWT token
    const token = this.generateToken(user.id);

    return { user: userDTO, token };
  }

  /**
   * Authenticate a user with email and password
   * Returns the user (without password) and JWT token
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: UserDTO; token: string }> {
    // Find user by email
    const result = await pool.query<User>(
      'SELECT id, email, name, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const userDTO: UserDTO = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // Generate JWT token
    const token = this.generateToken(user.id);

    return { user: userDTO, token };
  }
}

export default new AuthService();
