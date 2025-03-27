import express from "express";
import {
  authenticate,
  authenticate_admin,
} from "../middlewares/authMiddleware";
import {
  deleteUser,
  fetchUserDetails,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller";
import { validateRequest } from "../middlewares/validateReqMiddleware";
import {
  emailParamsSchema,
  emailSchema,
  passwordSchema,
} from "../validators/user.validators";

const router = express.Router();

router.get("/profile", authenticate, fetchUserDetails);
router.post("/forgot-password", validateRequest(emailSchema), forgotPassword);

router.delete(
  "/admin/delete/:email",
  validateRequest(emailParamsSchema),
  authenticate_admin,
  deleteUser
);
router.post(
  "/reset-password",
  validateRequest(passwordSchema),
  authenticate,
  resetPassword
);
export default router;
