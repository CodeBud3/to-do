import express from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../controllers/task.controller";
import { validateRequest } from "../../../middlewares/validateReqMiddleware";
import {
  createTaskSchema,
  reorderTasksSchema,
  paramsIdSchema,
  tasksFilterSchema,
  updateTaskSchema,
} from "../validators/task.validators";
import { authenticate } from "../../auth/middlewares/authMiddleware";
import { loadTaskForm, loadTaskRecord } from "../middlewares/tasks.middleware";

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// Apply task validation middleware
router.get("/", validateRequest(tasksFilterSchema), getTasks);
router.get("/:id", validateRequest(paramsIdSchema), getTask);
router.post("/", loadTaskForm, createTaskSchema, createTask);
router.put("/:id", loadTaskForm, updateTaskSchema, loadTaskRecord, updateTask);
router.delete(
  "/:id",
  validateRequest(paramsIdSchema),
  loadTaskRecord,
  deleteTask
);
router.patch("/reorder", validateRequest(reorderTasksSchema), reorderTasks);

export default router;
