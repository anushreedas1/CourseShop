/**
 * Protected Route Wrapper Component
 * 
 * This component wraps pages that require authentication.
 * It checks if the user is authenticated (JWT exists) and:
 * - Redirects to login if not authenticated
 * - Renders the protected page if authenticated
 * - Shows loading state while checking authentication
 * 
 * Requirements:
 * - 3.1: Protected routes require authentication
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { showError } from '@/lib/toast';

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

/**
 * Default loading component
 */
function DefaultLoadingComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-900 via-grey-800 to-black flex items-center justify-center">
      <div className="glass-card rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-grey-300">Loading...</p>
      </div>
    </div>
  );
}

/**
 * ProtectedRoute Component
 * 
 * Wraps protected pages and handles authentication checks.
 * 
 * @param children - The protected page content to render when authenticated
 * @param redirectTo - The path to redirect to when not authenticated (default: '/login')
 * @param loadingComponent - Custom loading component to show while checking auth
 * 
 * @example
 * ```tsx
 * export default function MyCoursesPage() {
 *   return (
 *     <ProtectedRoute>
 *       <div>My protected content</div>
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export function ProtectedRoute({
  children,
  redirectTo = '/login',
  loadingComponent,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  /**
   * Redirect to login if not authenticated
   */
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showError('Please log in to access this page');
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  /**
   * Show loading state while checking authentication
   */
  if (isLoading) {
    return loadingComponent || <DefaultLoadingComponent />;
  }

  /**
   * Don't render if not authenticated (will redirect)
   */
  if (!isAuthenticated) {
    return null;
  }

  /**
   * Render protected content if authenticated
   */
  return <>{children}</>;
}

/**
 * Export default for convenience
 */
export default ProtectedRoute;
