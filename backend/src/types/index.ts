// Type definitions for the application

export interface User {
  id: string;
  name: string | null;
  email: string;
  password: string; // hashed
  created_at: Date;
}

export interface UserDTO {
  id: string;
  name: string | null;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  main_image?: string;
  created_at: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  courseId: string;
  pricePaid: number;
  subscribedAt: Date;
}

export interface SubscriptionWithCourse extends Subscription {
  course: Course;
}

export interface JWTPayload {
  userId: string;
}
