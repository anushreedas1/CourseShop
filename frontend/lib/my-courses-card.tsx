/**
 * MyCoursesCard Component
 * 
 * Displays a subscription card with course information and subscription details.
 * Shows course title, thumbnail, price paid, and formatted subscription date.
 * Implements glassmorphic styling for a modern aesthetic.
 * 
 * Requirements:
 * - 9.1: Display course title, thumbnail, price paid, and subscription date
 * - 9.4: Format subscription date in human-readable format
 */

import React from 'react';
import { Subscription } from './api';

export interface MyCoursesCardProps {
  subscription: Subscription;
}

/**
 * MyCoursesCard Component
 * 
 * A card that displays subscription information with glassmorphic styling.
 * 
 * @param subscription - Subscription data including course details, price paid, and subscription date
 */
export function MyCoursesCard({ subscription }: MyCoursesCardProps) {
  /**
   * Format subscription date in human-readable format
   * Example: "January 15, 2024" or "Dec 25, 2023"
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Format: "Month Day, Year" (e.g., "January 15, 2024")
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Format price paid display
   * - Show "Free" for price = 0
   * - Show formatted price with $ symbol for paid courses
   */
  const formatPrice = (price: number): string => {
    if (price === 0) {
      return 'Free';
    }
    return `$${price.toFixed(2)}`;
  };

  // Extract course data from subscription
  const course = subscription.course;

  // Handle case where course data might not be populated
  if (!course) {
    return (
      <div className="glass-card rounded-xl p-6">
        <p className="text-grey-400">Course data unavailable</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300">
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
      <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
        {course.title}
      </h3>

      {/* Subscription Details */}
      <div className="space-y-2 pt-4 border-t border-grey-700">
        {/* Price Paid */}
        <div className="flex items-center justify-between">
          <span className="text-grey-400 text-sm">Price Paid:</span>
          <span
            className={`text-lg font-bold ${
              subscription.pricePaid === 0 ? 'text-green-400' : 'text-white'
            }`}
          >
            {formatPrice(subscription.pricePaid)}
          </span>
        </div>

        {/* Subscription Date */}
        <div className="flex items-center justify-between">
          <span className="text-grey-400 text-sm">Subscribed:</span>
          <span className="text-grey-300 text-sm">
            {formatDate(subscription.subscribedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MyCoursesCard;
