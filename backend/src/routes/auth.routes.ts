import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateReqMiddleware";
import { registerSchema, loginSchema } from "../validators/auth.validators";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);

export default router;
