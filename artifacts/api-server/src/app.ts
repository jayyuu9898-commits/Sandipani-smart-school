import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logger } from './lib/logger';
import router from './routes';

const app = express();

app.use((req, res, next) => {
  req.log = logger.child({});
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// API routes
app.use('/api', router);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // The path to the frontend build artifacts, relative to the project root.
  const frontendBuildPath = path.resolve(process.cwd(), 'artifacts/sandipani/dist/public');
  logger.info('Serving frontend from: %s', frontendBuildPath);

  // Serve static files (JS, CSS, images, etc.)
  app.use('/', express.static(frontendBuildPath));

  // SPA fallback: For any request that is not an API route and not a file,
  // send back the main index.html file. This allows React Router to handle the route.
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

export default app;
