import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import errorMiddleware from "./middlewares/errorMiddleware";
import passport from "./config/passport";
import session from "express-session";
import { SESSION_CONFIG } from "./helpers/auth.helper";

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
app.use(session(SESSION_CONFIG));
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(errorMiddleware);

export default app;
