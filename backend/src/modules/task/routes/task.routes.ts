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
  taskIdSchema,
  tasksFilterSchema,
} from "../validators/task.validators";
import { authenticate } from "../../auth/middlewares/authMiddleware";
import { loadTaskForm } from "../middlewares/tasks.middleware";

const router = express.Router();

// All task routes require authentication
router.use(authenticate);
router.use(loadTaskForm);
// Apply task validation middleware
router.get("/", validateRequest(tasksFilterSchema), getTasks);
router.get("/:id", validateRequest(taskIdSchema), getTask);
router.post("/", createTaskSchema, createTask);
router.put("/:id", createTaskSchema, updateTask);
router.delete("/:id", validateRequest(taskIdSchema), deleteTask);
router.patch("/reorder", validateRequest(reorderTasksSchema), reorderTasks);

export default router;
