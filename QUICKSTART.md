# LearnHub - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Update MONGODB_URI with your MongoDB connection string
# Generate a JWT_SECRET: openssl rand -base64 32
```

### 2. Install & Run

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Seed demo data (in another terminal)
curl http://localhost:3000/api/seed
```

### 3. Access the App

**Student Side:**
- Homepage: http://localhost:3000
- Sign up to create account
- Browse courses and start learning

**Admin Side:**
- Admin Login: http://localhost:3000/admin/signin
- Email: `admin@learnhub.com`
- Password: `admin123` (⚠️ Change in production!)

---

## 🎯 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/` | Landing page with course preview |
| Student Signup | `/auth/signup` | Create student account |
| Student Signin | `/auth/signin` | Login to dashboard |
| Dashboard | `/dashboard` | View enrolled courses |
| Course | `/courses/[courseId]` | View course lessons |
| Exercises | `/exercises` | Complete course exercises |
| Certificate | `/certificate` | View & download certificate |
| Admin Login | `/admin/signin` | Admin portal access |
| Admin Dashboard | `/admin/dashboard` | View student analytics |

---

## 📚 Learning Path (Student)

1. **Signup** → Create account with email/password
2. **Browse Courses** → See HTML, CSS, JavaScript, React
3. **Select Course** → Choose course to start
4. **Learn Lessons** → Read content, see code examples
5. **Do Exercises** → Complete quizzes and code challenges
6. **Get Certificate** → Auto-generated when course complete
7. **Download** → Save certificate as PDF

---

## 👨‍💼 Admin Operations

### View Student Progress
1. Log in to admin panel
2. See "Total Students" and "Average Completion" stats
3. Click "Downloaded Certs" to see who got certificates
4. Click "View" on any student to see detailed progress

### Track Certificate Downloads
- Shows which students have downloaded certificates
- Displays download date and time
- See per-course certificate status for each student

### Filter Students
- **All**: See all registered students
- **Downloaded Certs**: Only students with downloaded certificates

---

## 🎨 Theme Features

### Neon Colors
- **Cyan** (#00d4ff) - Primary interactive elements
- **Magenta** (#ff006e) - Secondary actions
- **Lime** (#39ff14) - Success indicators
- **Dark** (#0a0e27) - Background

### Effects
- Glowing text on headings
- Animated borders on cards
- Hover animations with neon glow
- Smooth page transitions

---

## 🔧 Default Credentials

### Admin Account
```
Email: admin@learnhub.com
Password: admin123
```

### Demo Courses (after seed)
- HTML Basics
- CSS Styling
- JavaScript Essentials
- React Fundamentals

---

## 📊 Database Models

### User
- Email, name, password (hashed)
- Created date

### Admin
- Email, name, password (hashed)
- Admin privileges

### Course
- Title, description
- Lessons array
- Exercises array

### Progress
- User ID, Course ID
- Lessons completed
- Exercises completed + scores
- Certificate generated flag
- **Certificate download status + date**

---

## 🔐 Security Notes

- Passwords hashed with bcrypt
- JW T tokens expire in 7 days
- Admin and student sessions separate
- HTTPS recommended for production

---

## 🐛 Troubleshooting

**Dev server not starting?**
```bash
# Kill old processes
pkill -f "pnpm\|node"

# Start fresh
pnpm dev
```

**MongoDB connection error?**
- Check MONGODB_URI in .env.local
- Ensure MongoDB is running
- Verify network access if using cloud DB

**Admin login not working?**
- Run seed endpoint again
- Check admin email/password in .env.local
- Clear browser cache

**Styles not loading?**
- Check that globals.css is imported in layout.tsx
- Restart dev server
- Clear Next.js cache: `rm -rf .next`

---

## 📈 Next Steps

1. **Customize**: Update course content in `/lib/models/Course.ts`
2. **Branding**: Modify colors in `/app/globals.css`
3. **Deploy**: Push to Vercel or your hosting platform
4. **Scale**: Connect to production MongoDB
5. **Monitor**: Set up logging and analytics

---

## 📖 Full Documentation

- `README.md` - Complete documentation
- `SETUP.md` - Detailed setup instructions  
- `ADMIN_GUIDE.md` - Admin panel features
- `FINAL_SUMMARY.md` - Feature overview

---

**You're all set! Start learning! 🎓**
