# 🎓 Mini Course Subscription Application (Black Friday Edition)

A full-stack course marketplace where users can browse, subscribe to free courses, and purchase paid courses using promo codes. Built with Next.js, Node.js/Express, and PostgreSQL.

## 🚀 Live Demo

- **Frontend**: [https://course-shop-rouge.vercel.app/](https://course-shop-rouge.vercel.app/)
- **Backend API**: [https://course-shop-backend.vercel.app/](https://course-shop-backend.vercel.app/)

## 🔑 Test Credentials

| Email | Password | Role |
|-------|----------|------|
| test1@example.com | password123 | User |
| test2@example.com | password123 | User |
| admin@example.com | admin123 | User |

## ✨ Features

### Authentication
- JWT-based authentication with secure token storage
- User signup and login with form validation
- Protected routes for authenticated users only

### Course Management
- Browse 6+ courses with thumbnails and descriptions
- View detailed course information
- Filter between free and paid courses
- Responsive course cards with hover effects

### Subscription System
- **Free Courses**: Instant one-click subscription
- **Paid Courses**: Promo code validation required
  - Valid promo code: `BFSALE25` (50% discount)
  - Mock payment system (no real transactions)
- View all subscribed courses in "My Courses" page
- Track subscription date and price paid

### UI/UX Enhancements
- Toast notifications for user feedback
- Loading skeletons for better perceived performance
- Error boundary for graceful error handling
- Custom 404 page
- Fully responsive design with TailwindCSS
- Protected route middleware

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: TailwindCSS 4
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Language**: TypeScript

### DevOps
- **Containerization**: Docker & Docker Compose
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Vercel
- **Database**: PostgreSQL (Cloud)

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── db/              # Database setup, schema, and seed
│   │   ├── middleware/      # Auth and error handling
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   └── types/           # TypeScript types
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js pages
│   │   ├── courses/[id]/    # Course detail page
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   └── my-courses/      # User's subscribed courses
│   ├── lib/                 # Reusable components
│   └── public/assets/       # Course images
└── docker-compose.yml       # Local PostgreSQL setup
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for local database)
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd mini-course-app
```

2. **Start PostgreSQL database**
```bash
docker-compose up -d
```

3. **Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mini_course_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

Initialize database and seed data:
```bash
npm run db:setup
npm run db:seed
npm run dev
```

Backend will run on `http://localhost:5000`

4. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and receive JWT token

### Courses
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get single course details

### Subscriptions
- `POST /subscribe` - Subscribe to a course (requires auth)
- `GET /my-courses` - Get user's subscribed courses (requires auth)

## 🎯 Key Features Implementation

### Promo Code Logic
- Only paid courses require promo codes
- Valid code: `BFSALE25` gives 50% discount
- Backend validates promo and calculates final price
- Original and discounted prices displayed to user

### Database Schema

**Users Table**
- id, name, email, password (hashed), created_at

**Courses Table**
- id, title, description, price, image_url, created_at

**Subscriptions Table**
- id, user_id, course_id, price_paid, subscribed_at

## 🎨 UI Highlights

- Clean, modern interface with TailwindCSS
- Responsive design (mobile, tablet, desktop)
- Loading states with skeleton screens
- Toast notifications for all actions
- Error boundaries for error handling
- Protected routes with authentication checks
- Course thumbnails and images
- Price display with discount calculation

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## 📦 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

### Backend (Vercel)
1. Import project in Vercel
2. Set root directory to `backend`
3. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`
4. Deploy

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT tokens for stateless authentication
- Protected API routes with auth middleware
- Input validation with Zod
- CORS configuration
- Environment variables for sensitive data

## 📝 Notes

- This is a mock application - no real payments are processed
- Promo codes are validated on the backend for security
- All course data is seeded from the database
- JWT tokens stored in localStorage (consider httpOnly cookies for production)


## Screenshots of working application

### SignUp Page 
![signup](assets/image-1.png)

###  Course List Page 
![home](assets/image.png)

### Course Detail Page 
![course](assets/image-2.png)

### My Course Page
![my course](assets/image-3.png)