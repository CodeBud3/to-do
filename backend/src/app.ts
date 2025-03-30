import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/routes/auth.routes";
import userRoutes from "./modules/user/routes/user.routes";
import taskRoutes from "./modules/task/routes/task.routes";
import errorMiddleware from "./middlewares/errorMiddleware";
import passport from "./modules/auth/configs/passport";
import session from "express-session";
import { SESSION_CONFIG } from "./modules/auth/helpers/auth.helper";

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow cookies to be sent
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
process.env.NODE_ENV != "dev" && app.set("trust proxy", 1);
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

app.use(errorMiddleware);

export default app;
