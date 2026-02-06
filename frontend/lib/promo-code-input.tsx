/**
 * PromoCodeInput Component
 * 
 * Displays promo code input field with validation and price display.
 * Shows original price with strikethrough and discounted price when valid promo is applied.
 * 
 * Requirements:
 * - 6.1: Validate promo code "BFSALE25" and enable subscribe button
 * - 6.2: Display error message for invalid promo codes
 * - 6.3: Display both original and discounted prices
 * - 11.4: Display toast notifications for user actions
 * - 15.1: Display original price with strikethrough styling
 * - 15.2: Display discounted price prominently
 * - 15.3: Display discount percentage (50% OFF)
 * - 15.4: Display only original price when no promo applied
 */

import React, { useState } from 'react';
import { showSuccess, showError } from './toast';

export interface PromoCodeInputProps {
  originalPrice: number;
  onPromoApplied: (isValid: boolean, discountedPrice: number) => void;
}

/**
 * PromoCodeInput Component
 * 
 * Handles promo code input, validation, and price display with discount information.
 * 
 * @param originalPrice - The original course price
 * @param onPromoApplied - Callback when promo code is applied (valid or invalid)
 */
export function PromoCodeInput({ originalPrice, onPromoApplied }: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Valid promo code and discount percentage
  const VALID_PROMO_CODE = 'BFSALE25';
  const DISCOUNT_PERCENTAGE = 50;

  /**
   * Calculate discounted price
   */
  const calculateDiscountedPrice = (price: number): number => {
    return price * 0.5; // 50% discount
  };

  const discountedPrice = calculateDiscountedPrice(originalPrice);

  /**
   * Handle promo code application
   */
  const handleApplyPromo = () => {
    setIsApplying(true);
    setPromoError('');

    // Simulate validation delay for better UX
    setTimeout(() => {
      const trimmedCode = promoCode.trim();

      if (trimmedCode === VALID_PROMO_CODE) {
        // Valid promo code
        setIsPromoValid(true);
        setPromoError('');
        onPromoApplied(true, discountedPrice);
        showSuccess(`Promo code applied! You saved ${DISCOUNT_PERCENTAGE}%`);
      } else {
        // Invalid promo code
        setIsPromoValid(false);
        setPromoError('Invalid promo code. Please try again.');
        onPromoApplied(false, originalPrice);
        showError('Invalid promo code. Please try again.');
      }

      setIsApplying(false);
    }, 300);
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
    // Reset validation state when user types
    if (isPromoValid || promoError) {
      setIsPromoValid(false);
      setPromoError('');
      onPromoApplied(false, originalPrice);
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && promoCode.trim()) {
      handleApplyPromo();
    }
  };

  return (
    <div className="space-y-4">
      {/* Promo Code Input Section */}
      <div className="space-y-2">
        <label htmlFor="promo-code" className="block text-sm font-medium text-grey-300">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            id="promo-code"
            type="text"
            value={promoCode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter promo code"
            className="flex-1 px-4 py-2 bg-grey-800 border border-grey-700 rounded-lg text-white placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            disabled={isApplying}
            aria-label="Promo code input"
            aria-invalid={!!promoError}
            aria-describedby={promoError ? 'promo-error' : undefined}
          />
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode.trim() || isApplying}
            className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-grey-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Apply promo code"
          >
            {isApplying ? 'Applying...' : 'Apply Promo Code'}
          </button>
        </div>

        {/* Error Message */}
        {promoError && (
          <p id="promo-error" className="text-sm text-red-400" role="alert">
            {promoError}
          </p>
        )}

        {/* Success Message */}
        {isPromoValid && (
          <p className="text-sm text-green-400" role="status">
            ✓ Promo code applied successfully!
          </p>
        )}
      </div>

      {/* Price Display Section */}
      <div className="p-4 bg-grey-800 rounded-lg border border-grey-700">
        {isPromoValid ? (
          // Show both original and discounted prices when promo is valid
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-grey-400 text-sm">Original Price:</span>
              <span className="text-grey-400 line-through text-lg">
                ${originalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Discounted Price:</span>
              <span className="text-green-400 text-2xl font-bold">
                ${discountedPrice.toFixed(2)}
              </span>
            </div>
            <div className="pt-2 border-t border-grey-700">
              <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                {DISCOUNT_PERCENTAGE}% OFF
              </span>
            </div>
          </div>
        ) : (
          // Show only original price when no promo is applied
          <div className="flex items-center justify-between">
            <span className="text-grey-400">Price:</span>
            <span className="text-white text-2xl font-bold">
              ${originalPrice.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PromoCodeInput;
