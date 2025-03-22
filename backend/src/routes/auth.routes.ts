import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  fetchUserDetails,
  deleteUser,
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateReqMiddleware";
import {
  registerSchema,
  loginSchema,
  emailSchema,
} from "../validators/auth.validators";
import { authenticate, authenticateAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authenticate, fetchUserDetails);
router.post("/forgot-password", forgotPassword);
router.delete(
  "/admin/delete/:email",
  validateRequest(emailSchema),
  authenticateAdmin,
  deleteUser
);

export default router;
