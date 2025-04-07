import { Request, Response, NextFunction } from "express";
import { Task } from "../models/Task";
import { ITask, TaskResponse } from "../types/task.types";
import mongoose from "mongoose";
import sendResponse from "../../../utils/responseHelper";
import { ValidationError, NotFoundError, AuthorizationError, AppError } from "../../../utils/ErrorHandler";

/**
 * Get all tasks for the authenticated user with optional filtering
 */
export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Type assertion for the user object added by passport authentication
    const userId = req.user?._id;
    if (!userId) {
      return next(new AuthorizationError(["User not authenticated"]));
    }

    // Support filtering by query parameters
    const filters: any = { user_id: userId.toString() };
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.tag) filters.tag = req.query.tag;

    // Support for date range filtering
    if (req.query.due_date_start || req.query.due_date_end) {
      filters.due_date = {};
      if (req.query.due_date_start) {
        filters.due_date.$gte = new Date(req.query.due_date_start as string);
      }
      if (req.query.due_date_end) {
        filters.due_date.$lte = new Date(req.query.due_date_end as string);
      }
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = (req.query.sort_by as string) || 'sequence_num';
    const order = (req.query.order as string) === 'desc' ? -1 : 1;
    const sort: any = {};
    sort[sortBy] = order;

    // Execute query with pagination and sorting
    const tasks = await Task.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalTasks = await Task.countDocuments(filters);

    // Log the operation
    console.log(`Retrieved ${tasks.length} tasks for user ${userId}`);

    sendResponse(res, 200, true, "Tasks retrieved successfully", {
      tasks,
      pagination: {
        total: totalTasks,
        page,
        limit,
        pages: Math.ceil(totalTasks / limit)
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
export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = req.params.id;
    const userId = req.user?._id;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return next(new ValidationError(["Invalid task ID format"]));
    }

    // Ensure userId is defined
    if (!userId) {
      return next(new AuthorizationError(["User not authenticated"]));
    }

    // Find task with owner check for security
    const task = await Task.findOne({ _id: taskId, user_id: userId.toString() });
    
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
export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AuthorizationError(["User not authenticated"]));
    }
    
    // Get the highest sequence_num for this user to place the new task at the end
    const highestSeqTask = await Task.findOne({ user_id: userId.toString() })
      .sort({ sequence_num: -1 })
      .limit(1);
    
    const newSeqNum = highestSeqTask ? highestSeqTask.sequence_num + 1 : 0;
    
    // Prepare the task object with user ID
    const taskData: any = {
      ...req.body,
      user_id: userId.toString(),
      sequence_num: req.body.sequence_num !== undefined ? req.body.sequence_num : newSeqNum
    };
    
    // Convert ISO string to Date object if present
    if (taskData.due_date) {
      taskData.due_date = new Date(taskData.due_date);
    }
    
    // Create and save the new task
    const task = new Task(taskData);
    await task.save();
    
    console.log(`Created new task (${task._id.toString()}) for user ${userId}`);
    
    sendResponse(res, 201, true, "Task created successfully", task);
  } catch (error) {
    console.error("Error creating task:", error);
    next(error);
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = req.params.id;
    const userId = req.user?._id;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return next(new ValidationError(["Invalid task ID format"]));
    }
    
    // Ensure userId is defined
    if (!userId) {
      return next(new AuthorizationError(["User not authenticated"]));
    }
    
    // Get the existing task with owner check for security
    const existingTask = await Task.findOne({ _id: taskId, user_id: userId.toString() });
    
    if (!existingTask) {
      return next(new NotFoundError("Task"));
    }
    
    // Prepare update data
    const updateData: any = { ...req.body };
    
    // Convert ISO string to Date object if present
    if (updateData.due_date) {
      updateData.due_date = new Date(updateData.due_date);
    }
    
    // Find and update with safety checks
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user_id: userId.toString() },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      return next(new AppError(500, "Failed to update task", "UPDATE_ERROR"));
    }
    
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
export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = req.params.id;
    const userId = req.user?._id;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return next(new ValidationError(["Invalid task ID format"]));
    }
    
    // Ensure userId is defined
    if (!userId) {
      return next(new AuthorizationError(["User not authenticated"]));
    }
    
    // Find and delete with owner check for security
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, user_id: userId.toString() });
    
    if (!deletedTask) {
      return next(new NotFoundError("Task"));
    }
    
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
export const reorderTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Use a database transaction to ensure all updates succeed or fail together
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const userId = req.user?._id;
    const { tasks } = req.body as { tasks: Array<{ id: string, sequence_num: number }> };
    
    // Ensure userId is defined
    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return next(new AuthorizationError(["User not authenticated"]));
    }
    
    // Verify all tasks belong to the user
    for (const taskUpdate of tasks) {
      const task = await Task.findOne({ 
        _id: taskUpdate.id, 
        user_id: userId.toString() 
      }).session(session);
      
      if (!task) {
        // Roll back transaction if any task doesn't belong to user
        await session.abortTransaction();
        session.endSession();
        
        return next(new NotFoundError(`Task with ID ${taskUpdate.id}`));
      }
    }
    
    // Update all tasks with new sequence numbers
    const updatePromises = tasks.map(taskUpdate => 
      Task.findByIdAndUpdate(
        taskUpdate.id,
        { $set: { sequence_num: taskUpdate.sequence_num } },
        { session, new: true }
      )
    );
    
    const updatedTasks = await Promise.all(updatePromises);
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    console.log(`Reordered ${tasks.length} tasks for user ${userId}`);
    
    sendResponse(res, 200, true, "Tasks reordered successfully", updatedTasks);
  } catch (error) {
    // Roll back transaction on error
    await session.abortTransaction();
    session.endSession();
    
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
    const tasks = await Task.find({ user_id: userId }).sort({ sequence_num: 1 });
    
    // TypeScript needs explicit type casting for mongoose document
    interface TaskWithId {
      _id: mongoose.Types.ObjectId;
      sequence_num: number;
    }
    
    // Update sequence numbers to be consecutive
    const updatePromises = tasks.map((task, index) => {
      const typedTask = task as unknown as TaskWithId;
      return Task.findByIdAndUpdate(typedTask._id.toString(), { sequence_num: index });
    });
    
    await Promise.all(updatePromises);
    console.log(`Resequenced ${tasks.length} tasks for user ${userId}`);
    
    return true;
  } catch (error) {
    console.error("Error resequencing tasks:", error);
    return false;
  }
};
