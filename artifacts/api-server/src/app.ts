import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";à
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };àaa
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// CORS configuration - allow frontend from same origin and common dev ports
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost',
      'http://127.0.0.1',
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) > -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

if (process.env.NODE_ENV === 'production') {
  // 📂 Sahi path jo 'dist/public' folder ko target karega
  const frontendPath = path.join(__dirname, '../../sandipani/dist/public');
  app.use(express.static(frontendPath));
  
  // 🌐 SPA fallback - RegEx pattern bina kisi crash ke index.html serve karega
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

export default app;
