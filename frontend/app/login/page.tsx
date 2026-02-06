'use client';

/**
 * Login Page
 * 
 * Provides user authentication functionality with:
 * - Email and password input fields
 * - Client-side validation (email format, required fields)
 * - API integration for user login
 * - JWT token storage and automatic authentication
 * - Toast notifications for success/error states
 * - Redirect to home page on success
 * 
 * Requirements: 2.1, 2.2, 2.5
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { showSuccess, showError } from '@/lib/toast';
import { ApiError } from '@/lib/api';

/**
 * Email validation regex
 * Validates basic email format: user@domain.ext
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Form validation errors interface
 */
interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

/**
 * Login Page Component
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * Validate email format
   */
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required';
    }
    if (!EMAIL_REGEX.test(email)) {
      return 'Invalid email format';
    }
    return undefined;
  };

  /**
   * Validate password is not empty
   */
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    return undefined;
  };

  /**
   * Validate all form fields
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      showError('Please fix the validation errors');
      return;
    }

    setIsLoading(true);

    try {
      // Call login API
      await login(email, password);

      // Show success message
      showSuccess('Welcome back! Login successful.');

      // Redirect to home page
      router.push('/');
    } catch (error) {
      // Handle API errors
      const apiError = error as ApiError;
      
      // Check if it's an authentication error
      if (apiError.status === 401 || apiError.message.toLowerCase().includes('invalid') || 
          apiError.message.toLowerCase().includes('credentials')) {
        setErrors({ general: 'Invalid email or password' });
        showError('Invalid email or password');
      } else {
        setErrors({ general: apiError.message });
        showError(apiError.message || 'Failed to log in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle email field blur (validate on blur)
   */
  const handleEmailBlur = () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
    } else {
      setErrors(prev => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  /**
   * Handle password field blur (validate on blur)
   */
  const handlePasswordBlur = () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors(prev => ({ ...prev, password: passwordError }));
    } else {
      setErrors(prev => {
        const { password, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-900 via-grey-800 to-black p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-grey-400">
              Log in to continue your learning journey
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-grey-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className={`w-full px-4 py-3 bg-grey-800/50 border rounded-lg text-white placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-grey-700'
                }`}
                placeholder="you@example.com"
                disabled={isLoading}
                required
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-grey-300 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                className={`w-full px-4 py-3 bg-grey-800/50 border rounded-lg text-white placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-grey-700'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white text-black font-semibold rounded-lg hover:bg-grey-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-grey-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-grey-400 text-sm">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-white font-medium hover:underline focus:outline-none focus:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-grey-400 text-sm hover:text-white transition-colors focus:outline-none focus:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
