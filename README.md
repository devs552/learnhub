<<<<<<< HEAD
# LearnHub - Web Development Learning Platform

A comprehensive interactive learning platform for mastering HTML, CSS, JavaScript, and React with hands-on exercises, certificates, and beautiful animations.

## Features

- **4 Complete Courses**: HTML Basics, CSS Styling, JavaScript Essentials, React Fundamentals
- **Interactive Lessons**: Detailed content with code examples and best practices
- **Mixed Exercises**: Multiple choice quizzes and code challenges with Monaco editor
- **Progress Tracking**: Track your learning progress through each course
- **Certificate Generation**: Earn and download certificates upon course completion
- **Comprehensive Animations**: Smooth page transitions, parallax effects, and micro-interactions
- **User Authentication**: Secure email/password authentication with JWT tokens
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Animations**: Framer Motion, custom CSS animations
- **Code Editor**: Monaco Editor for coding challenges
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **PDF Generation**: html2canvas and jsPDF for certificate downloads

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB instance (local or cloud via MongoDB Atlas)

### Installation

1. **Clone and setup**:
```bash
cd /vercel/share/v0-project
pnpm install
```

2. **Configure environment variables**:

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```
MONGODB_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=your-secure-secret-key-here
NODE_ENV=development
```

3. **Seed the database**:

Start the development server, then visit:
```
http://localhost:3000/api/seed
```

This will populate the database with 4 courses and their lessons/exercises.

4. **Start the dev server**:
```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Usage

### For Students

1. **Sign Up**: Create an account at `/auth/signup`
2. **Explore Courses**: View all available courses on the dashboard
3. **Learn**: Read lesson content with rich examples
4. **Practice**: Complete multiple choice quizzes and code challenges
5. **Track Progress**: Watch your progress bar fill as you complete lessons
6. **Earn Certificates**: Complete all lessons to generate a downloadable certificate

### For Developers

#### Project Structure

```
app/
├── auth/              # Authentication pages
├── dashboard/         # Student dashboard
├── courses/           # Course content pages
├── exercises/         # Exercise viewer
├── certificate/       # Certificate generation
└── api/              # Backend API routes

components/
├── auth/             # Auth components
├── courses/          # Course components
├── exercises/        # Exercise components
├── certificate/      # Certificate components
└── animations/       # Reusable animation wrappers

lib/
├── db.ts            # MongoDB connection
├── auth.ts          # Authentication utilities
├── models/          # Mongoose schemas
├── animations.ts    # Animation variants
└── useScrollAnimation.ts  # Scroll hook
```

#### Database Models

- **User**: Student account information
- **Course**: Course with embedded lessons
- **Exercise**: Quiz and code challenges
- **Progress**: Tracks user's learning progress

#### Key API Routes

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/courses` - Fetch all courses
- `GET /api/exercises` - Fetch exercises for a lesson
- `POST /api/exercises/submit` - Submit exercise answer
- `POST /api/certificates/generate` - Generate certificate
- `POST /api/users/progress` - Update user progress

## Customization

### Adding New Courses

1. Edit `/app/api/seed/route.ts`
2. Add a new course object in `coursesData` array
3. Re-run the seed endpoint

### Styling

The app uses Tailwind CSS v4 with custom animations. Modify:
- `app/globals.css` - Global styles and custom animations
- `tailwind.config.js` - Theme configuration

### Animations

All animations are defined in:
- `lib/animations.ts` - Framer Motion variants
- `app/globals.css` - CSS keyframe animations

Customize by editing these files and applying to components.

## Performance Optimizations

- Code splitting with dynamic imports (Monaco Editor)
- Image optimization with Next.js Image component
- CSS animations for better performance than JS animations
- Database indexing for faster queries
- Progressive loading of course content

## Future Enhancements

- [ ] Video lessons support
- [ ] Real-time code execution for challenges
- [ ] Discussion forums
- [ ] Leaderboards and gamification
- [ ] Mobile app
- [ ] Social sharing
- [ ] Course recommendations
- [ ] Practice mode

## Troubleshooting

### MongoDB Connection Issues

```
Error: MongoDB connection failed
```

Solution: Ensure MongoDB is running and MONGODB_URI is correct in `.env.local`

### Monaco Editor Not Loading

```
Error: Editor component failed to load
```

Solution: Clear `.next` cache and rebuild:
```bash
rm -rf .next
pnpm dev
```

### Certificate Generation Fails

Ensure all lessons are completed before attempting to generate certificate.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Happy Learning! Master web development with LearnHub.**
=======
# learnhub
course app for student
>>>>>>> 23c7fc35caea0efee20f3ec00423af268eb42860
