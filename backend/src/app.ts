import express, { Application } from "express";
import authRoutes from "./routes/auth.routes";
import errorMiddleware from "./middlewares/errorMiddleware";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(errorMiddleware);

export default app;
