import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./modules/auth/configs/passport";
import { SESSION_CONFIG } from "./modules/auth/helpers/auth.helper";
import dotenv from "dotenv/config";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import { swaggerProtect } from './middlewares/swaggerProtect';
import errorMiddleware from "./middlewares/errorMiddleware";

// Import routes
import authRoutes from "./modules/auth/routes/auth.routes";
import userRoutes from "./modules/user/routes/user.routes";
import taskRoutes from "./modules/task/routes/task.routes";

// Middleware
const app: Express = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow cookies to be sent
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
process.env.NODE_ENV != "dev" && app.set("trust proxy", 1);
app.use(cookieParser());
app.use(session(SESSION_CONFIG));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Swagger API Documentation with protection
app.use('/api-docs', swaggerProtect, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

app.use(errorMiddleware);

export default app;
