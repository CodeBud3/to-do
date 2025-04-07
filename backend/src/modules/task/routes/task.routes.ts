import express from "express";
import { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask, 
  reorderTasks 
} from "../controllers/task.controller";
import { validateRequest } from "../../../middlewares/validateReqMiddleware";
import { 
  createTaskSchema, 
  updateTaskSchema, 
  reorderTasksSchema,
  taskIdSchema,
  tasksFilterSchema
} from "../validators/task.validators";
import { authenticate } from "../../auth/middlewares/authMiddleware";

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// Apply task validation middleware
router.get("/", validateRequest(tasksFilterSchema), getTasks);
router.get("/:id", validateRequest(taskIdSchema), getTask);
router.post("/", validateRequest(createTaskSchema), createTask);
router.put("/:id", validateRequest(updateTaskSchema), updateTask);
router.delete("/:id", validateRequest(taskIdSchema), deleteTask);
router.patch("/reorder", validateRequest(reorderTasksSchema), reorderTasks);

export default router;
