import { Request, Response, NextFunction } from "express";
import { Task } from "../models/Task";
import { NotFoundError } from "../../../utils/ErrorHandler";
import sendResponse from "../../../utils/responseHelper";
import { TaskService } from "../services/task.service";
import {
  commitTransaction,
  rollBackTransaction,
  startTransaction,
} from "../../../config/db";

/**
 * Get all tasks for the authenticated user with optional filtering
 */
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract request parameters using service helper methods
    const filterOptions = TaskService.extractFilterOptions(req);
    const sortOptions = TaskService.extractSortOptions(req);
    const paginationOptions = TaskService.extractPaginationOptions(req);
    
    // Get tasks with filtering, sorting and pagination via service
    const { tasks, total, page, limit, pages } = await TaskService.getTasks(
      filterOptions,
      sortOptions,
      paginationOptions
    );
    
    // Send response
    sendResponse(res, 200, true, "Tasks retrieved successfully", {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages
      },
      sort: {
        field: sortOptions.field,
        order: sortOptions.order
      }
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    next(error);
  }
};

/**
 * Get a specific task by ID
 */
export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskId = req.params.id!;
    const userId = req.user?._id!;

    // Find task with owner check for security
    const task = await Task.findOne({
      _id: taskId,
      userId: userId.toString(),
    });

    if (!task) {
      return next(new NotFoundError("Task"));
    }

    sendResponse(res, 200, true, "Task retrieved successfully", task);
  } catch (error) {
    console.error(`Error fetching task ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * Create a new task
 */
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id!;

    // Get the highest sequence_num for this user to place the new task at the end
    const highestSeqTask = await Task.findOne({ userId: userId.toString() })
      .sort({ sequence_num: -1 })
      .limit(1);

    const newSeqNum = highestSeqTask ? highestSeqTask.sequence_num + 1 : 0;

    // Prepare the task object with user ID
    const taskData: any = {
      fields: {
        ...req.body,
      },
      userId: userId.toString(),
      sequence_num:
        req.body.sequence_num !== undefined ? req.body.sequence_num : newSeqNum,
    };

    // Create and save the new task
    const task = new Task(taskData);
    await task.save();

    sendResponse(res, 201, true, "Task created successfully", task);
  } catch (error) {
    console.error("Error creating task:", error);
    next(error);
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskId = req.params.id;
    const userId = req.user?._id!;
    const taskRecord = req.taskRecord!;

    taskRecord.set({ ...req.body, userId });
    const updatedTask = await taskRecord.save();

    console.log(`Updated task ${taskId} for user ${userId}`);

    sendResponse(res, 200, true, "Task updated successfully", updatedTask);
  } catch (error) {
    console.error(`Error updating task ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskId = req.params.id;
    const userId = req.user?._id!;
    const taskRecord = req.taskRecord!;
    // Find and delete with owner check for security
    await taskRecord.deleteOne();

    console.log(`Deleted task ${taskId} for user ${userId}`);

    // Re-sequence the remaining tasks to maintain order
    await resequenceTasks(userId.toString());

    sendResponse(res, 200, true, "Task deleted successfully");
  } catch (error) {
    console.error(`Error deleting task ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * Re-order multiple tasks at once
 */
export const reorderTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Use a database transaction to ensure all updates succeed or fail together
  const session = await startTransaction();

  try {
    const userId = req.user?._id!;
    const { tasks } = req.body as {
      tasks: Array<{ id: string; sequence_num: number }>;
    };

    // Verify all tasks belong to the user
    for (const taskUpdate of tasks) {
      const task = await Task.findOne({
        _id: taskUpdate.id,
        userId: userId.toString(),
      }).session(session);

      if (!task) {
        // Roll back transaction if any task doesn't belong to user
        await rollBackTransaction(session);

        return next(new NotFoundError(`Task with ID ${taskUpdate.id}`));
      }
    }

    // Update all tasks with new sequence numbers
    const updatePromises = tasks.map((taskUpdate) =>
      Task.findByIdAndUpdate(
        taskUpdate.id,
        { $set: { sequence_num: taskUpdate.sequence_num } },
        { session, new: true }
      )
    );

    const updatedTasks = await Promise.all(updatePromises);

    // Commit the transaction
    await commitTransaction(session);

    console.log(`Reordered ${tasks.length} tasks for user ${userId}`);

    sendResponse(res, 200, true, "Tasks reordered successfully", updatedTasks);
  } catch (error) {
    // Roll back transaction on error
    await rollBackTransaction(session);

    console.error("Error reordering tasks:", error);
    next(error);
  }
};

/**
 * Helper function to re-sequence tasks after deletion
 */
const resequenceTasks = async (userId: string): Promise<boolean> => {
  try {
    // Get all tasks for the user ordered by current sequence
    const tasks = await Task.find({ userId: userId }).sort({
      sequence_num: 1,
    });

    // Update sequence numbers to be consecutive
    const updatePromises = tasks.map((task, index) => {
      return Task.findByIdAndUpdate(task.id.toString(), {
        sequence_num: index,
      });
    });

    await Promise.all(updatePromises);
    console.log(`Resequenced ${tasks.length} tasks for user ${userId}`);

    return true;
  } catch (error) {
    console.error("Error resequencing tasks:", error);
    return false;
  }
};
