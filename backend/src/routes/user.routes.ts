import express from "express";
import {
  authenticate,
  authenticate_admin,
} from "../middlewares/authMiddleware";
import {
  deleteUser,
  fetchUserDetails,
  forgotPassword,
} from "../controllers/user.controller";
import { validateRequest } from "../middlewares/validateReqMiddleware";
import { emailParamsSchema, emailSchema } from "../validators/auth.validators";

const router = express.Router();

router.get("/profile", authenticate, fetchUserDetails);
router.post("/forgot-password", validateRequest(emailSchema), forgotPassword);

router.delete(
  "/admin/delete/:email",
  validateRequest(emailParamsSchema),
  authenticate_admin,
  deleteUser
);

export default router;
