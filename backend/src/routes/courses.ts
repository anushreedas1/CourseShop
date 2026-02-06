import { Router, Request, Response } from 'express';
import courseService from '../services/CourseService';

const router = Router();

/**
 * GET /courses
 * Get all available courses
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const courses = await courseService.getAllCourses();
    
    res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /courses/:id
 * Get a specific course by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await courseService.getCourseById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
