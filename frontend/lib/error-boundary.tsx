/**
 * Error Boundary Component
 * 
 * This module provides:
 * - React error boundary to catch rendering errors
 * - Fallback UI with error message
 * - Reload button to recover from errors
 * - Logging of errors to console
 * 
 * Requirements: 12.4 - Error boundary components to catch and display React errors gracefully
 */

'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches React rendering errors and displays a fallback UI
 * Provides a reload button to recover from errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Static method called when an error is thrown during rendering
   * Updates state to trigger fallback UI
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method called after an error is caught
   * Logs error details to console for debugging
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console for debugging
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // In production, you might want to send this to an error tracking service
    // Example: logErrorToService(error, errorInfo);
  }

  /**
   * Reset error state to allow recovery
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  /**
   * Reload the page to recover from error
   */
  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-grey-50 px-4">
          <div className="max-w-md w-full glass-light p-8 rounded-lg shadow-lg">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-grey-900 text-center mb-2">
              Oops! Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-grey-600 text-center mb-6">
              We encountered an unexpected error. Please try reloading the page.
            </p>

            {/* Error Details (in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  Error Details:
                </p>
                <p className="text-xs text-red-700 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2 bg-grey-900 text-white rounded-md hover:bg-grey-800 transition-colors font-medium"
                data-testid="reload-button"
              >
                Reload Page
              </button>
              <button
                onClick={this.resetError}
                className="flex-1 px-4 py-2 bg-white text-grey-900 border border-grey-300 rounded-md hover:bg-grey-50 transition-colors font-medium"
                data-testid="reset-button"
              >
                Try Again
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-grey-500 text-center mt-6">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

/**
 * Export ErrorBoundary component as default
 */
export default ErrorBoundary;
