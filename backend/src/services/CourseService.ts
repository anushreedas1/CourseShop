import pool from '../db/connection';
import { Course } from '../types';

export class CourseService {
  /**
   * Get all courses from the database
   * Returns an array of all courses with complete metadata
   */
  async getAllCourses(): Promise<Course[]> {
    const result = await pool.query<Course>(
      'SELECT id, title, description, price, image, main_image, created_at FROM courses ORDER BY created_at DESC'
    );

    // Convert price from string to number (PostgreSQL returns DECIMAL as string)
    return result.rows.map(course => ({
      ...course,
      price: parseFloat(course.price as any),
    }));
  }

  /**
   * Get a single course by ID
   * Returns the course if found, null if not found
   */
  async getCourseById(id: string): Promise<Course | null> {
    const result = await pool.query<Course>(
      'SELECT id, title, description, price, image, main_image, created_at FROM courses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    // Convert price from string to number (PostgreSQL returns DECIMAL as string)
    const course = result.rows[0];
    return {
      ...course,
      price: parseFloat(course.price as any),
    };
  }
}

export default new CourseService();
