import express, { type Request, type Response, type NextFunction } from "express";
import pinoHttp from "pino-http";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "./lib/logger";
import router from "./routes";

const app = express();

app.use(
  pinoHttp({
    logger,
  })
);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// API routes
app.use("/api", router);


// Serve frontend in production
if (process.env.NODE_ENV === "production") {

  const frontendBuildPath = path.resolve(
    process.cwd(),
    "artifacts/sandipani/dist/public"
  );

  logger.info(
    "Serving frontend from: %s",
    frontendBuildPath
  );


  app.use(
    "/",
    express.static(frontendBuildPath)
  );


  // React Router fallback
  app.use(
    (req: Request, res: Response, next: NextFunction) => {

      if (req.path.startsWith("/api")) {
        return next();
      }

      res.sendFile(
        path.join(frontendBuildPath, "index.html")
      );

    }
  );

}


export default app;
