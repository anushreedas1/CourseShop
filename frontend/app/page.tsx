/**
 * Home Page
 * 
 * Displays all available courses in a responsive grid layout.
 * Fetches courses from the backend API and handles loading/error states.
 * 
 * Requirements:
 * - 4.1: Display courses with title, description, price, and thumbnail
 * - 4.3: Fetch courses from GET /courses API
 * - 11.3: Responsive grid layout
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course, api, ApiError } from '@/lib/api';
import { CourseCard } from '@/lib/course-card';
import { CourseGridSkeleton } from '@/lib/skeletons';
import { showError } from '@/lib/toast';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [isAuthenticated]);

  /**
   * Fetch all courses from the API and user's subscriptions if authenticated
   */
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCourses = await api.getAllCourses();
      setCourses(fetchedCourses);

      // Fetch user's subscriptions if authenticated
      if (isAuthenticated) {
        try {
          const subscriptions = await api.getMySubscriptions();
          const purchasedIds = new Set(subscriptions.map(sub => sub.courseId));
          setPurchasedCourseIds(purchasedIds);
        } catch (err) {
          // Silently fail if subscriptions can't be fetched
          console.error('Failed to fetch subscriptions:', err);
        }
      } else {
        setPurchasedCourseIds(new Set());
      }
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to load courses';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle course card click - navigate to course detail page
   */
  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-900 via-grey-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Explore Courses
          </h1>
          <p className="text-grey-300 text-lg">
            Browse our collection of courses and start learning today
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <CourseGridSkeleton count={6} />
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Failed to Load Courses
            </h2>
            <p className="text-grey-300 mb-4">{error}</p>
            <button
              onClick={fetchCourses}
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-grey-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="text-grey-400 text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No Courses Available
            </h2>
            <p className="text-grey-300">
              Check back later for new courses
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course.id)}
                isPurchased={purchasedCourseIds.has(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
