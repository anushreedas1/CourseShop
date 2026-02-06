/**
 * My Courses Page
 * 
 * Displays all courses the authenticated user has subscribed to.
 * Fetches subscriptions from the backend API and handles loading/error/empty states.
 * Protected by ProtectedRoute wrapper component.
 * 
 * Requirements:
 * - 3.1: Protected routes require authentication (via ProtectedRoute wrapper)
 * - 9.1: Display subscribed courses with title, price paid, subscription date, and thumbnail
 * - 9.2: Fetch subscriptions from GET /my-courses API (protected)
 * - 9.3: Display empty state message when no subscriptions
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Subscription, api, ApiError } from '@/lib/api';
import { MyCoursesCard } from '@/lib/my-courses-card';
import { MyCoursesGridSkeleton } from '@/lib/skeletons';
import { showError } from '@/lib/toast';
import { ProtectedRoute } from '@/lib/protected-route';

/**
 * Custom loading component for the protected route
 */
function MyCoursesLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-900 via-grey-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-10 bg-grey-700 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-6 bg-grey-700 rounded w-96 animate-pulse"></div>
        </div>
        <MyCoursesGridSkeleton count={3} />
      </div>
    </div>
  );
}

/**
 * My Courses Page Content
 * 
 * This component contains the actual page content and is wrapped by ProtectedRoute.
 * It only renders when the user is authenticated.
 */
function MyCoursesPageContent() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user subscriptions on mount
   */
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  /**
   * Fetch all user subscriptions from the API
   */
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSubscriptions = await api.getMySubscriptions();
      setSubscriptions(fetchedSubscriptions);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to load your courses';
      
      // Handle authentication errors - redirect to login
      if (apiError.status === 401) {
        showError('Your session has expired. Please log in again.');
        router.push('/login');
        return;
      }
      
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-900 via-grey-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            My Courses
          </h1>
          <p className="text-grey-300 text-lg">
            View and manage your subscribed courses
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <MyCoursesGridSkeleton count={3} />
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Failed to Load Your Courses
            </h2>
            <p className="text-grey-300 mb-4">{error}</p>
            <button
              onClick={fetchSubscriptions}
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-grey-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && subscriptions.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="text-grey-400 text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No Courses Yet
            </h2>
            <p className="text-grey-300 mb-6">
              You haven't subscribed to any courses yet. Browse our catalog to get started!
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-grey-200 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}

        {/* Subscriptions Grid */}
        {!loading && !error && subscriptions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <MyCoursesCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * My Courses Page
 * 
 * Wraps the page content with ProtectedRoute to ensure authentication.
 * The ProtectedRoute component handles:
 * - Checking if user is authenticated (JWT exists)
 * - Redirecting to login if not authenticated
 * - Showing loading state while checking authentication
 */
export default function MyCoursesPage() {
  return (
    <ProtectedRoute loadingComponent={<MyCoursesLoadingState />}>
      <MyCoursesPageContent />
    </ProtectedRoute>
  );
}
