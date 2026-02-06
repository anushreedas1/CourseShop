import pool from '../db/connection';
import { Subscription, SubscriptionWithCourse, Course } from '../types';

const VALID_PROMO_CODE = 'BFSALE25';
const PROMO_DISCOUNT = 0.5; // 50% discount

export class SubscriptionService {
  /**
   * Validate a promotional code
   * Returns an object with valid flag and discount percentage
   */
  validatePromoCode(code: string): { valid: boolean; discount: number } {
    if (code === VALID_PROMO_CODE) {
      return { valid: true, discount: PROMO_DISCOUNT };
    }
    return { valid: false, discount: 0 };
  }

  /**
   * Calculate discounted price based on original price and discount percentage
   * Returns the discounted price rounded to 2 decimal places
   */
  calculateDiscountedPrice(originalPrice: number, discount: number): number {
    const discountedPrice = originalPrice * (1 - discount);
    // Use toFixed to ensure proper rounding for currency
    return parseFloat(discountedPrice.toFixed(2));
  }

  /**
   * Check if a user is already subscribed to a course
   * Returns true if subscribed, false otherwise
   */
  async isUserSubscribed(userId: string, courseId: string): Promise<boolean> {
    const result = await pool.query(
      'SELECT id FROM subscriptions WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    return result.rows.length > 0;
  }

  /**
   * Subscribe a user to a course
   * Handles both free and paid courses with promo code validation
   * Returns the created subscription
   */
  async subscribe(
    userId: string,
    courseId: string,
    promoCode?: string
  ): Promise<Subscription> {
    // Check if user is already subscribed
    const alreadySubscribed = await this.isUserSubscribed(userId, courseId);
    if (alreadySubscribed) {
      throw new Error('User already subscribed to this course');
    }

    // Get course details to determine price
    const courseResult = await pool.query<Course>(
      'SELECT id, title, description, price, image, main_image, created_at FROM courses WHERE id = $1',
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      throw new Error('Course not found');
    }

    const course = courseResult.rows[0];
    const coursePrice = typeof course.price === 'string' ? parseFloat(course.price) : course.price;
    let pricePaid = coursePrice;

    // Handle free courses
    if (coursePrice === 0) {
      pricePaid = 0;
    } else {
      // Handle paid courses - require valid promo code
      if (!promoCode) {
        throw new Error('Promo code required for paid courses');
      }

      const promoValidation = this.validatePromoCode(promoCode);
      if (!promoValidation.valid) {
        throw new Error('Invalid promo code');
      }

      // Calculate discounted price
      pricePaid = this.calculateDiscountedPrice(coursePrice, promoValidation.discount);
    }

    // Create subscription
    const result = await pool.query(
      'INSERT INTO subscriptions (user_id, course_id, price_paid) VALUES ($1, $2, $3) RETURNING id, user_id, course_id, price_paid, subscribed_at',
      [userId, courseId, pricePaid]
    );

    // Convert to camelCase and ensure price_paid is a number
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      courseId: row.course_id,
      pricePaid: parseFloat(row.price_paid as any),
      subscribedAt: row.subscribed_at,
    };
  }

  /**
   * Get all subscriptions for a user with course details
   * Returns an array of subscriptions with associated course data
   */
  async getUserSubscriptions(userId: string): Promise<SubscriptionWithCourse[]> {
    const result = await pool.query(
      `SELECT 
        s.id,
        s.user_id,
        s.course_id,
        s.price_paid,
        s.subscribed_at,
        c.id as course_id,
        c.title as course_title,
        c.description as course_description,
        c.price as course_price,
        c.image as course_image,
        c.main_image as course_main_image,
        c.created_at as course_created_at
      FROM subscriptions s
      JOIN courses c ON s.course_id = c.id
      WHERE s.user_id = $1
      ORDER BY s.subscribed_at DESC`,
      [userId]
    );

    // Transform the flat result into nested structure with camelCase
    const subscriptions: SubscriptionWithCourse[] = result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      courseId: row.course_id,
      pricePaid: parseFloat(row.price_paid),
      subscribedAt: row.subscribed_at,
      course: {
        id: row.course_id,
        title: row.course_title,
        description: row.course_description,
        price: parseFloat(row.course_price),
        image: row.course_image,
        main_image: row.course_main_image,
        created_at: row.course_created_at,
      },
    }));

    return subscriptions;
  }
}

export default new SubscriptionService();
