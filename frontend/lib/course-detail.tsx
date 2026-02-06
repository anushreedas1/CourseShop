/**
 * CourseDetail Component
 * 
 * Displays detailed course information with subscription functionality.
 * Handles both free and paid course subscription flows.
 * 
 * Requirements:
 * - 5.1: Display course title, full description, price, and image
 * - 5.2: For free courses, show "Subscribe" button without promo input
 * - 5.3: For paid courses, show PromoCodeInput and disabled subscribe button
 * - 7.4: Display success toast and redirect on free course subscription
 * - 8.4: Display success toast on paid course subscription
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course, api, ApiError } from './api';
import { PromoCodeInput } from './promo-code-input';
import { showSuccess, showError } from './toast';
import { useAuth } from './auth-context';

export interface CourseDetailProps {
  course: Course;
}

/**
 * CourseDetail Component
 * 
 * Displays course details and handles subscription logic for both free and paid courses.
 * 
 * @param course - Course data including id, title, description, price, and image
 */
export function CourseDetail({ course }: CourseDetailProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(course.price);

  const isFree = course.price === 0;
  const isPaid = course.price > 0;

  /**
   * Handle promo code application
   */
  const handlePromoApplied = (isValid: boolean, price: number) => {
    setIsPromoValid(isValid);
    setDiscountedPrice(price);
  };

  /**
   * Handle subscription
   */
  const handleSubscribe = async () => {
    // Check authentication
    if (!isAuthenticated) {
      showError('Please log in to subscribe to courses');
      router.push('/login');
      return;
    }

    // For paid courses, ensure promo code is valid
    if (isPaid && !isPromoValid) {
      showError('Please apply a valid promo code to subscribe');
      return;
    }

    try {
      setIsSubscribing(true);

      // Call subscribe API
      const promoCode = isPaid && isPromoValid ? 'BFSALE25' : undefined;
      const subscription = await api.subscribe(course.id, promoCode);

      // Show success message
      if (isFree) {
        showSuccess('Successfully subscribed to the course!');
      } else {
        showSuccess(`Successfully subscribed! Amount paid: $${subscription.pricePaid.toFixed(2)}`);
      }

      // Redirect to My Courses page
      setTimeout(() => {
        router.push('/my-courses');
      }, 1500);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to subscribe to course';
      showError(errorMessage);
    } finally {
      setIsSubscribing(false);
    }
  };

  /**
   * Format price display
   */
  const formatPrice = (price: number): string => {
    if (price === 0) {
      return 'Free';
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Course Image */}
      <div className="w-full h-96 mb-8 overflow-hidden rounded-xl bg-grey-800">
        <img
          src={course.main_image || course.image}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Course Content */}
      <div className="glass-card rounded-xl p-8">
        {/* Course Title and Price */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-4xl font-bold text-white flex-1">
            {course.title}
          </h1>
          <div className="ml-6">
            <span
              className={`text-3xl font-bold ${
                isFree ? 'text-green-400' : 'text-white'
              }`}
            >
              {formatPrice(course.price)}
            </span>
          </div>
        </div>

        {/* Course Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">
            About This Course
          </h2>
          <p className="text-grey-300 text-lg leading-relaxed whitespace-pre-wrap">
            {course.description}
          </p>
        </div>

        {/* Subscription Section */}
        <div className="border-t border-grey-700 pt-8">
          {/* Free Course: Show Subscribe Button */}
          {isFree && (
            <div className="space-y-4">
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="w-full px-8 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-grey-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Subscribe to course"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
              </button>
              <p className="text-grey-400 text-sm text-center">
                This is a free course. Click subscribe to get instant access!
              </p>
            </div>
          )}

          {/* Paid Course: Show Promo Code Input and Subscribe Button */}
          {isPaid && (
            <div className="space-y-6">
              {/* Promo Code Input */}
              <PromoCodeInput
                originalPrice={course.price}
                onPromoApplied={handlePromoApplied}
              />

              {/* Subscribe Button */}
              <button
                onClick={handleSubscribe}
                disabled={!isPromoValid || isSubscribing}
                className="w-full px-8 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-grey-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Subscribe to course"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
              </button>

              {!isPromoValid && (
                <p className="text-grey-400 text-sm text-center">
                  Apply a valid promo code to enable subscription
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
