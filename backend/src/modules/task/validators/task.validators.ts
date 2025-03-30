import { z } from "zod";
import { ObjectId } from "mongodb";

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string) => {
  try {
    return ObjectId.isValid(id);
  } catch (error) {
    return false;
  }
};

// Create task schema validation
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().max(1000, "Description is too long").optional(),
    priority: z.enum(["high", "medium", "low"], {
      errorMap: () => ({ message: "Priority must be high, medium, or low" }),
    }).optional(),
    matrix: z.enum([
      "urgent-important", 
      "not-urgent-important", 
      "urgent-not-important", 
      "not-urgent-not-important"
    ], {
      errorMap: () => ({ message: "Matrix value is invalid" }),
    }).optional(),
    status: z.enum(["todo", "in-progress", "done"], {
      errorMap: () => ({ message: "Status must be todo, in-progress, or done" }),
    }).optional(),
    due_date: z.string().datetime({ message: "Invalid date format" }).optional(),
    stack_rank: z.number().nonnegative("Stack rank must be non-negative").optional(),
    tag: z.enum(["work", "personal", "errand", "other"], {
      errorMap: () => ({ message: "Tag must be work, personal, errand, or other" }),
    }).optional(),
    sequence_num: z.number().nonnegative("Sequence number must be non-negative").optional(),
  })
});

// Update task schema validation
export const updateTaskSchema = createTaskSchema.partial();

// Schema for task ID validation
export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().refine(isValidObjectId, {
      message: "Invalid task ID format",
    }),
  }),
});

// Schema for reordering tasks
export const reorderTasksSchema = z.object({
  body: z.object({
    tasks: z.array(
      z.object({
        id: z.string().refine(isValidObjectId, {
          message: "Invalid task ID format",
        }),
        sequence_num: z.number().nonnegative("Sequence number must be non-negative"),
      })
    ).min(1, "At least one task is required"),
  }),
});

// Schema for filtering tasks
export const tasksFilterSchema = z.object({
  query: z.object({
    status: z.enum(["todo", "in-progress", "done"]).optional(),
    priority: z.enum(["high", "medium", "low"]).optional(),
    tag: z.enum(["work", "personal", "errand", "other"]).optional(),
    sort_by: z.enum(["due_date", "priority", "sequence_num", "created_at"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  }).optional(),
});
