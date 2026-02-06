/**
 * 404 Not Found Page
 * 
 * Displays a user-friendly 404 error message when a page is not found.
 * Provides navigation options to return to the home page.
 * 
 * Requirements:
 * - 12.1: Display appropriate error messages for 404 errors
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Not Found Page Component
 * 
 * This page is automatically shown by Next.js when:
 * - A route doesn't exist
 * - notFound() is called in a page/component
 * - A dynamic route parameter doesn't match any data
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-900 via-grey-800 to-black p-4">
      <div className="w-full max-w-2xl">
        {/* 404 Card */}
        <div className="glass-card rounded-2xl p-12 shadow-2xl text-center">
          {/* 404 Icon/Number */}
          <div className="mb-6">
            <div className="text-8xl font-bold text-white mb-2">404</div>
            <div className="text-4xl mb-4">🔍</div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-grey-300 text-lg mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Go Back Button */}
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-grey-700 text-white font-semibold rounded-lg hover:bg-grey-600 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-offset-2 focus:ring-offset-grey-900 transition-all"
            >
              ← Go Back
            </button>

            {/* Home Button */}
            <Link
              href="/"
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-grey-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-grey-900 transition-all"
            >
              🏠 Back to Home
            </Link>
          </div>

          {/* Additional Help Text */}
          <div className="mt-8 pt-8 border-t border-grey-700">
            <p className="text-grey-400 text-sm">
              Looking for something specific?{' '}
              <Link
                href="/"
                className="text-white hover:underline focus:outline-none focus:underline"
              >
                Browse our courses
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
