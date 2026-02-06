/**
 * Loading Skeleton Components
 * 
 * Provides skeleton loading states for course cards and course details
 * to improve perceived performance during data fetching.
 * 
 * Requirements: 11.5 - Loading states and skeleton screens
 */

import React from 'react';

/**
 * CourseCardSkeleton Component
 * 
 * Displays a loading skeleton for a course card with animated pulse effect.
 * Used on the home page while courses are being fetched.
 */
export function CourseCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-grey-700 rounded-lg mb-4"></div>
      
      {/* Title skeleton */}
      <div className="h-6 bg-grey-700 rounded mb-2 w-3/4"></div>
      
      {/* Description skeleton - 2 lines */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-grey-700 rounded w-full"></div>
        <div className="h-4 bg-grey-700 rounded w-5/6"></div>
      </div>
      
      {/* Footer skeleton - price and button */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-grey-700 rounded w-20"></div>
        <div className="h-10 bg-grey-700 rounded w-32"></div>
      </div>
    </div>
  );
}

/**
 * CourseDetailSkeleton Component
 * 
 * Displays a loading skeleton for the course detail page with animated pulse effect.
 * Used on the course detail page while course data is being fetched.
 */
export function CourseDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-10 bg-grey-700 rounded w-24 mb-6"></div>
      
      <div className="glass-card rounded-xl p-8">
        {/* Image skeleton */}
        <div className="w-full h-96 bg-grey-700 rounded-lg mb-6"></div>
        
        {/* Title skeleton */}
        <div className="h-8 bg-grey-700 rounded mb-4 w-2/3"></div>
        
        {/* Description skeleton - 4 lines */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-grey-700 rounded w-full"></div>
          <div className="h-4 bg-grey-700 rounded w-full"></div>
          <div className="h-4 bg-grey-700 rounded w-4/5"></div>
          <div className="h-4 bg-grey-700 rounded w-3/4"></div>
        </div>
        
        {/* Price section skeleton */}
        <div className="border-t border-grey-600 pt-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-grey-700 rounded w-32"></div>
            <div className="h-6 bg-grey-700 rounded w-24"></div>
          </div>
          
          {/* Promo code input skeleton (for paid courses) */}
          <div className="space-y-4">
            <div className="h-12 bg-grey-700 rounded w-full"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-grey-700 rounded flex-1"></div>
              <div className="h-12 bg-grey-700 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CourseGridSkeleton Component
 * 
 * Displays a grid of course card skeletons.
 * Useful for showing multiple loading cards at once.
 * 
 * @param count - Number of skeleton cards to display (default: 6)
 */
export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * MyCoursesCardSkeleton Component
 * 
 * Displays a loading skeleton for a subscription card on the My Courses page.
 * Similar to CourseCardSkeleton but includes subscription-specific information.
 */
export function MyCoursesCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-grey-700 rounded-lg mb-4"></div>
      
      {/* Title skeleton */}
      <div className="h-6 bg-grey-700 rounded mb-3 w-3/4"></div>
      
      {/* Subscription info skeleton - 2 lines */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-grey-700 rounded w-24"></div>
          <div className="h-4 bg-grey-700 rounded w-16"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-grey-700 rounded w-32"></div>
          <div className="h-4 bg-grey-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * MyCoursesGridSkeleton Component
 * 
 * Displays a grid of subscription card skeletons for the My Courses page.
 * 
 * @param count - Number of skeleton cards to display (default: 3)
 */
export function MyCoursesGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MyCoursesCardSkeleton key={index} />
      ))}
    </div>
  );
}
