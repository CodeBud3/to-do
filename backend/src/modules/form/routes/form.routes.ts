import express from "express";
import { authenticate } from "../../auth/middlewares/authMiddleware";
import { fetchTaskForm } from "../controllers/form.controllers";

const router = express.Router();
router.use(authenticate);
router.get("/taskForm", fetchTaskForm);

export default router;
