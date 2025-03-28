import express from "express";
import {
  register,
  login,
  logout,
  fetchApiToken,
} from "../controllers/auth.controller";
import { validateRequest } from "../../../middlewares/validateReqMiddleware";
import { registerSchema, loginSchema } from "../validators/auth.validators";
import passport from "passport";
import { authenticate } from "../middlewares/authMiddleware";

const CLIENT_URL = process.env.CLIENT_URL;

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/api-token", authenticate, fetchApiToken);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login`,
    successRedirect: `${CLIENT_URL}/dashboard`,
    session: true,
  })
);
// Redirect user to Microsoft login
router.get("/microsoft", passport.authenticate("microsoft"));

// Microsoft redirects back to this route after login
router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", {
    failureRedirect: `${CLIENT_URL}/login`,
    successRedirect: `${CLIENT_URL}/dashboard`,
    session: true, // Enable session storage
  })
);

export default router;
