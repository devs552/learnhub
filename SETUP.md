# LearnHub Setup Guide

## Quick Start

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew install mongodb-community
   brew services start mongodb-community

   # Ubuntu/Debian
   sudo apt-get install mongodb
   sudo systemctl start mongodb

   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   ```
   
   The default `.env.local` should work:
   ```
   MONGODB_URI=mongodb://localhost:27017/learning-platform
   JWT_SECRET=dev-secret-key-change-in-production
   ```

3. **Start the application**:
   ```bash
   pnpm dev
   ```

4. **Seed the database**:
   - Visit: `http://localhost:3000/api/seed`
   - You should see: `"Database seeded successfully"`

5. **Start learning**:
   - Visit: `http://localhost:3000`
   - Sign up or check `/auth/signin`

### Option 2: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas account**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a new project and cluster

2. **Get connection string**:
   - From Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Update `.env.local`**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learning-platform?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-here
   ```

4. **Run the app**:
   ```bash
   pnpm dev
   ```

5. **Seed the database**:
   - Visit: `http://localhost:3000/api/seed`

## Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URI` | MongoDB connection string | Required for database |
| `JWT_SECRET` | Random secret string | For token signing. Change in production! |
| `NODE_ENV` | development/production | Optional (defaults to development) |

## Generate JWT Secret

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShift)
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Minimum 0 -Maximum 256)}))
```

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: 
- Check MongoDB is running: `mongod --version`
- Start MongoDB: `brew services start mongodb-community` (macOS)
- Check `MONGODB_URI` in `.env.local`

### "Cannot find module" Error

```
Error: Cannot find module '@monaco-editor/react'
```

**Solution**:
```bash
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Port 3000 Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Seed API Returns Error

If `/api/seed` returns an error:

1. Ensure MongoDB is connected
2. Check `.env.local` has correct `MONGODB_URI`
3. Try clearing the collections first (if you want)
4. Revisit `/api/seed`

## Production Deployment

1. **Set environment variables** on your hosting platform (Vercel, AWS, etc.):
   - `MONGODB_URI` - your production database
   - `JWT_SECRET` - strong random secret

2. **Generate new JWT secret**:
   ```bash
   openssl rand -base64 32
   ```

3. **Deploy**:
   ```bash
   pnpm build
   pnpm start
   ```

4. **Seed production database**:
   - Visit: `https://your-app.com/api/seed`

## Next Steps

1. Sign up at `/auth/signup`
2. Explore courses on the dashboard
3. Complete lessons and exercises
4. Earn certificates

## Getting Help

- Check logs in `.next` folder
- Enable debug mode: `DEBUG=* pnpm dev`
- Review the README.md for feature details

---

Happy learning!
