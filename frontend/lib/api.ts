/**
 * API Client Utility
 * 
 * This module provides a centralized API client for communicating with the backend.
 * It handles:
 * - JWT token management in Authorization headers
 * - Structured error responses
 * - Type-safe request/response interfaces
 * 
 * Requirements: 2.5 - Frontend SHALL store JWT token and include in requests
 */

import axios, { AxiosError, AxiosInstance } from 'axios';

// API Base URL - defaults to localhost:3001 for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://course-shop-backend.vercel.app';

/**
 * Structured API Error
 */
export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

/**
 * User data transfer object
 */
export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  token: string;
  user: UserDTO;
}

/**
 * Course data model
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  main_image?: string;
  created_at?: string;
}

/**
 * Subscription data model
 */
export interface Subscription {
  id: string;
  userId: string;
  courseId: string;
  pricePaid: number;
  subscribedAt: string;
  course?: Course;
}

/**
 * API Client class
 */
class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include JWT token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Set JWT token for authenticated requests
   */
  setToken(token: string | null): void {
    this.token = token;
  }

  /**
   * Get current JWT token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Handle API errors and return structured error object
   */
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as { error?: string; message?: string };
      return {
        message: data.error || data.message || 'An error occurred',
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        message: 'Network error - unable to reach server',
        status: 0,
      };
    } else {
      // Error setting up request
      return {
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  /**
   * Authentication: Sign up a new user
   * POST /auth/signup
   */
  async signup(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/signup', {
      email,
      password,
      name,
    });
    return response.data;
  }

  /**
   * Authentication: Log in an existing user
   * POST /auth/login
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  /**
   * Courses: Get all courses
   * GET /courses
   */
  async getAllCourses(): Promise<Course[]> {
    const response = await this.client.get<{ courses: Course[] }>('/courses');
    return response.data.courses;
  }

  /**
   * Courses: Get a single course by ID
   * GET /courses/:id
   */
  async getCourseById(id: string): Promise<Course> {
    const response = await this.client.get<Course>(`/courses/${id}`);
    return response.data;
  }

  /**
   * Subscriptions: Subscribe to a course
   * POST /subscribe
   * Requires authentication
   */
  async subscribe(courseId: string, promoCode?: string): Promise<Subscription> {
    const response = await this.client.post<{ subscription: Subscription }>('/subscribe', {
      courseId,
      promoCode,
    });
    return response.data.subscription;
  }

  /**
   * Subscriptions: Get user's subscriptions
   * GET /my-courses
   * Requires authentication
   */
  async getMySubscriptions(): Promise<Subscription[]> {
    const response = await this.client.get<{ subscriptions: Subscription[] }>('/my-courses');
    return response.data.subscriptions;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const api = {
  /**
   * Set JWT token for authenticated requests
   */
  setToken: (token: string | null) => apiClient.setToken(token),

  /**
   * Get current JWT token
   */
  getToken: () => apiClient.getToken(),

  /**
   * Authentication: Sign up
   */
  signup: (email: string, password: string, name?: string) => 
    apiClient.signup(email, password, name),

  /**
   * Authentication: Log in
   */
  login: (email: string, password: string) => 
    apiClient.login(email, password),

  /**
   * Courses: Get all courses
   */
  getAllCourses: () => 
    apiClient.getAllCourses(),

  /**
   * Courses: Get course by ID
   */
  getCourseById: (id: string) => 
    apiClient.getCourseById(id),

  /**
   * Subscriptions: Subscribe to a course
   */
  subscribe: (courseId: string, promoCode?: string) => 
    apiClient.subscribe(courseId, promoCode),

  /**
   * Subscriptions: Get user's subscriptions
   */
  getMySubscriptions: () => 
    apiClient.getMySubscriptions(),
};

export default api;
