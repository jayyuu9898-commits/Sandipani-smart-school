# Sandipani Smart School - Deployment Guide

## Production Deployment

### Environment Setup

1. Create a `.env` file with required variables (see `.env.example`):
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
PORT=3000
NODE_ENV=production
```

2. Install dependencies:
```bash
pnpm install
```

### Build & Start

1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

The application will:
- Build the frontend (React + Vite) to `artifacts/sandipani/dist/public`
- Build the backend API server to `artifacts/api-server/dist`
- Start on the configured PORT (default: 3000)
- Serve frontend from the same server in production
- Proxy API requests to `/api/*` routes

### Architecture

**Frontend:**
- React 19.1.0 with Vite
- Tailwind CSS + Radix UI components
- Framer Motion animations
- @tanstack/react-query for data management
- Wouter for routing

**Backend:**
- Express.js API server
- Drizzle ORM for database queries
- Pino for logging
- CORS properly configured

**Database:**
- Supabase PostgreSQL
- Row-Level Security (RLS) for data isolation
- Role-based access control

### Security Features

1. **Authentication:** Supabase Auth with email/password and Google OAuth
2. **Authorization:** 
   - Role-based access control (admin, teacher, student)
   - Row-Level Security policies on all tables
   - Account approval system before access

3. **Data Protection:**
   - Students can only access their own data
   - Teachers can only access their assigned classes
   - Admins have full management access
   - All sensitive data filtered at database level

4. **Environment:**
   - All secrets in environment variables
   - No hardcoded credentials
   - CORS properly configured

### Health Check

The API includes a health check endpoint:
```bash
curl http://localhost:3000/api/healthz
```

Expected response:
```json
{"status":"ok"}
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build completes without errors
- [ ] Health check endpoint responds
- [ ] Frontend loads without CORS errors
- [ ] Admin login works
- [ ] Teacher login works
- [ ] Student login works
- [ ] Role-based page access works
- [ ] No sensitive data in logs

### Troubleshooting

**Port Already in Use:**
```bash
PORT=8000 npm start
```

**Build Failures:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
npm run build
```

**Supabase Connection Issues:**
- Verify VITE_SUPABASE_URL is correct
- Verify VITE_SUPABASE_ANON_KEY is correct
- Check Supabase project is active
- Verify RLS policies are enabled

### Docker Deployment (Optional)

```dockerfile
FROM node:24-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
RUN npm run build

# Start
ENV NODE_ENV=production
ENV PORT=3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t sandipani-smart-school .
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=... \
  -e VITE_SUPABASE_ANON_KEY=... \
  -e PORT=3000 \
  sandipani-smart-school
```
