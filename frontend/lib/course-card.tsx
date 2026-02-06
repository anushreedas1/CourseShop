/**
 * CourseCard Component
 * 
 * Displays a course card with title, description, price, and thumbnail image.
 * Implements glassmorphic styling and price display logic.
 * 
 * Requirements:
 * - 4.1: Display courses with title, description, price, and thumbnail
 * - 4.2: Make card clickable to navigate to course detail
 * - 4.4: Show "Free" for price = 0, numeric price for paid courses
 */

import React from 'react';
import { Course } from './api';

export interface CourseCardProps {
  course: Course;
  onClick: () => void;
  isPurchased?: boolean;
}

/**
 * CourseCard Component
 * 
 * A clickable card that displays course information with glassmorphic styling.
 * 
 * @param course - Course data including id, title, description, price, and image
 * @param onClick - Callback function when card is clicked
 * @param isPurchased - Whether the user has already purchased this course
 */
export function CourseCard({ course, onClick, isPurchased = false }: CourseCardProps) {
  /**
   * Format price display
   * - Show "Free" for price = 0
   * - Show formatted price with $ symbol for paid courses
   */
  const formatPrice = (price: number): string => {
    if (price === 0) {
      return 'Free';
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <div
      onClick={onClick}
      className="glass-card glass-hover rounded-xl p-6 cursor-pointer transition-all duration-300"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${course.title}`}
    >
      {/* Course Image */}
      <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-grey-800">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Course Title */}
      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
        {course.title}
      </h3>

      {/* Course Description */}
      <p className="text-grey-300 text-sm mb-4 line-clamp-3">
        {course.description}
      </p>

      {/* Footer: Price and View Button */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-grey-700">
        <div className="flex items-center gap-2">
          <span
            className={`text-lg font-bold ${
              course.price === 0 ? 'text-green-400' : 'text-white'
            }`}
          >
            {formatPrice(course.price)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isPurchased && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md">
              Purchased
            </span>
          )}
          <button
            className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-grey-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            aria-label={`View ${course.title}`}
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
