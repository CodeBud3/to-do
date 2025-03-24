import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  fetchUserDetails,
  deleteUser,
  fetchApiToken,
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateReqMiddleware";
import {
  registerSchema,
  loginSchema,
  emailSchema,
} from "../validators/auth.validators";
import {
  authenticate,
  authenticate_admin,
} from "../middlewares/authMiddleware";
import passport from "passport";
// import { COOKIE_CONFIG } from "../helpers/auth.helper";

const CLIENT_URL = process.env.CLIENT_URL;

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/profile", authenticate, fetchUserDetails);
router.post("/forgot-password", forgotPassword);
router.get("/api-token", authenticate, fetchApiToken);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login`,
    session: true,
  }),
  (req, res, next) => {
    console.log("User after login:", req.user); // Check if user exists
    console.log("Session:", req.session); // Check if session is created
    console.log("Cookies in req:", JSON.stringify(req.cookies)); // Verify cookies in request
    console.log("Headers Sent:", JSON.stringify(res.getHeaders())); // Check headers before response
    // res.cookie("connect.sid", req.sessionID, COOKIE_CONFIG);
    // console.log(
    //   "✅ Headers after manually setting cookie:",
    //   JSON.stringify(res.getHeaders())
    // );
    res.redirect(`${CLIENT_URL}/dashboard`);
  }
);
router.delete(
  "/admin/delete/:email",
  validateRequest(emailSchema),
  authenticate_admin,
  deleteUser
);

export default router;
