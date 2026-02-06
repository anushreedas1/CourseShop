/**
 * Course Detail Page
 * 
 * Displays detailed information about a specific course.
 * Fetches course data by ID and handles loading/error states.
 * 
 * Requirements:
 * - 5.4: Fetch course from GET /courses/:id API
 * - Handle 404 errors for invalid course IDs
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Course, api, ApiError } from '@/lib/api';
import { CourseDetail } from '@/lib/course-detail';
import { CourseDetailSkeleton } from '@/lib/skeletons';
import { showError } from '@/lib/toast';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  /**
   * Fetch course by ID from the API
   */
  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCourse = await api.getCourseById(courseId);
      setCourse(fetchedCourse);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to load course';
      setError(errorMessage);
      
      // Show error toast
      if (apiError.status === 404) {
        showError('Course not found');
      } else {
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-900 via-grey-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-grey-300 hover:text-white transition-colors"
          aria-label="Back to courses"
        >
          <span className="text-xl">←</span>
          <span>Back to Courses</span>
        </button>

        {/* Loading State */}
        {loading && <CourseDetailSkeleton />}

        {/* Error State */}
        {!loading && error && (
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              {error.includes('not found') ? 'Course Not Found' : 'Failed to Load Course'}
            </h2>
            <p className="text-grey-300 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-grey-200 transition-colors"
              >
                Back to Home
              </button>
              {!error.includes('not found') && (
                <button
                  onClick={fetchCourse}
                  className="px-6 py-3 bg-grey-700 text-white rounded-lg font-medium hover:bg-grey-600 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Course Detail */}
        {!loading && !error && course && (
          <CourseDetail course={course} />
        )}
      </div>
    </div>
  );
}
