import { z } from "zod";
import { ObjectId } from "mongodb";
import { Request, Response, NextFunction } from "express";
import { buildZodSchema } from "../../form/validators/form.validators";
import { validateRequest } from "../../../middlewares/validateReqMiddleware";

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string) => {
  try {
    return ObjectId.isValid(id);
  } catch (error) {
    return false;
  }
};

// Create task schema validation

// Schema for task ID validation
export const idSchema = z.object({
  id: z.string().refine(isValidObjectId, {
    message: "Invalid task ID format",
  }),
});

// Schema for reordering tasks
export const reorderTasksSchema = z.object({
  body: z.object({
    tasks: z
      .array(
        z.object({
          id: z.string().refine(isValidObjectId, {
            message: "Invalid task ID format",
          }),
          sequence_num: z
            .number()
            .nonnegative("Sequence number must be non-negative"),
        })
      )
      .min(1, "At least one task is required"),
  }),
});

// Schema for filtering tasks
export const tasksFilterSchema = z.object({
  query: z
    .object({
      status: z.enum(["to_do", "in_progress", "completed", "back_log"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
      tag: z.enum(["work", "personal", "errand", "other"]).optional(),
      view_type: z.enum(["list", "kanban"]).optional(),
      sort_by: z
        .enum([
          "title", 
          "description", 
          "priority", 
          "status", 
          "matrix", 
          "due_date", 
          "tag", 
          "sequence_num", 
          "stack_rank", 
          "createdAt", 
          "updatedAt"
        ])
        .optional(),
      order: z.enum(["asc", "desc"]).optional(),
      page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
      limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    })
    .optional(),
});

export const createTaskSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const form = req.form!;
  const schema = z.object({ body: buildZodSchema(form.fields) });
  validateRequest(schema)(req, res, next);
};

// Update task schema validation
export const updateTaskSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const form = req.form!;
  const schema = z.object({
    params: idSchema,
    body: z
      .object({
        sequence_num: z
          .number()
          .nonnegative("Sequence number must be non-negative"),
        id: z.string().refine(isValidObjectId, {
          message: "Invalid task ID format",
        }),
        fields: buildZodSchema(form.fields),
      })
      .strict({ message: "Unknown fields in request body" }),
  });

  validateRequest(schema)(req, res, next);
};

export const paramsIdSchema = z.object({
  params: idSchema,
});
