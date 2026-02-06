/**
 * Navigation Component
 * 
 * This module provides:
 * - Navigation bar with links to Home, My Courses, Login/Signup
 * - User email display and logout button when authenticated
 * - Conditional rendering based on authentication state
 * - Glassmorphic styling
 * 
 * Requirements: 11.1, 11.2 - Glassmorphic design with black/white/grey palette
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './auth-context';
import { usePathname } from 'next/navigation';

/**
 * Navigation Component
 * 
 * Displays navigation bar with authentication-aware links and user controls
 */
export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  /**
   * Check if a link is active based on current pathname
   */
  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  /**
   * Handle logout action
   */
  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-grey-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold text-grey-900 hover:text-grey-700 transition-colors"
            >
              Mini Course Subscription
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Home Link */}
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-grey-900 text-white'
                  : 'text-grey-700 hover:bg-grey-100 hover:text-grey-900'
              }`}
            >
              Home
            </Link>

            {/* My Courses Link - Only show when authenticated */}
            {isAuthenticated && (
              <Link
                href="/my-courses"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/my-courses')
                    ? 'bg-grey-900 text-white'
                    : 'text-grey-700 hover:bg-grey-100 hover:text-grey-900'
                }`}
              >
                My Courses
              </Link>
            )}

            {/* Authentication Section */}
            {isAuthenticated ? (
              // Show user email and logout when authenticated
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-grey-300">
                <span className="text-sm text-grey-600" data-testid="user-email">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-grey-900 text-white hover:bg-grey-800 transition-colors"
                  data-testid="logout-button"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Show Login/Signup links when not authenticated
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-grey-300">
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'bg-grey-900 text-white'
                      : 'text-grey-700 hover:bg-grey-100 hover:text-grey-900'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`px-4 py-2 rounded-md text-sm font-medium bg-grey-900 text-white hover:bg-grey-800 transition-colors ${
                    isActive('/signup') ? 'ring-2 ring-grey-600' : ''
                  }`}
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Export Navigation component as default
 */
export default Navigation;
