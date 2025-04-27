import { Request, Response, NextFunction } from "express";
import { Task } from "../models/Task";
import sendResponse from "../../../utils/responseHelper";
import { NotFoundError } from "../../../utils/ErrorHandler";
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
    // Type assertion for the user object added by passport authentication
    const userId = req.user?._id!;

    // Check if Kanban view is requested
    const viewType = req.query.view_type as string || 'list';
    const isKanbanView = viewType === 'kanban';

    // Support filtering by query parameters
    const filters: any = { userId: userId.toString() };
    if (req.query.status && !isKanbanView) filters.status = req.query.status;
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

    // Pagination (only for list view)
    const page = parseInt(req.query.page as string) || 1;
    const limit = !isKanbanView ? (parseInt(req.query.limit as string) || 50) : 0;
    const skip = !isKanbanView ? (page - 1) * limit : 0;

    // Sorting
    const sortBy = (req.query.sort_by as string) || "sequence_num";
    const order = (req.query.order as string) === "desc" ? -1 : 1;
    const sort: any = {};
    sort[sortBy] = order;

    // For Kanban view, we need to fetch all tasks regardless of status
    const tasksQuery = Task.find(filters).sort(sort);
    
    // Apply pagination for list view
    if (!isKanbanView && limit > 0) {
      tasksQuery.skip(skip).limit(limit);
    }

    const tasks = await tasksQuery.exec();
    const totalTasks = !isKanbanView && limit > 0 
      ? await Task.countDocuments(filters)
      : tasks.length;

    // For Kanban view, group tasks by status
    if (isKanbanView) {
      // Fetch all available status options from the form constants
      const statusColumns = [
        { key: "back_log", label: "Back Log" },
        { key: "to_do", label: "To do" },
        { key: "in_progress", label: "In Progress" },
        { key: "completed", label: "Completed" }
      ];
      
      // Helper function to safely get field value from either Map or Object structure
      const getFieldValue = (task: any, fieldName: string): any => {
        if (!task || !task.fields) return null;
        
        // If fields is a Map
        if (task.fields instanceof Map) {
          return task.fields.get(fieldName);
        }
        
        // If fields is a plain object
        return task.fields[fieldName];
      };
      
      // Group tasks by status
      const groupedTasks = statusColumns.reduce((acc: any, statusCol) => {
        const statusKey = statusCol.key;
        
        // Filter tasks with matching status
        const matchingTasks = tasks.filter(task => {
          const taskStatus = getFieldValue(task, 'status');
          const matches = taskStatus === statusKey;
          
          return matches;
        });
        
        acc[statusKey] = {
          id: statusKey,
          title: statusCol.label,
          tasks: matchingTasks,
          count: matchingTasks.length
        };
        return acc;
      }, {});
      
      // For Kanban response, include columns and grouped tasks
      sendResponse(res, 200, true, "Tasks retrieved successfully", {
        viewType: 'kanban',
        columns: statusColumns,
        groupedTasks,
        total: totalTasks
      });
    } else {
      // Standard list view response
      sendResponse(res, 200, true, "Tasks retrieved successfully", {
        viewType: 'list',
        tasks,
        pagination: {
          total: totalTasks,
          page,
          limit,
          pages: Math.ceil(totalTasks / limit)
        },
        sort: {
          field: sortBy,
          order: order === 1 ? "asc" : "desc"
        }
      });
    }
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
 * Helper function to resequence tasks when some are deleted or reordered
 */
const resequenceTasks = async (
  userId: string
): Promise<boolean> => {
  try {
    // Get all tasks for this user, sorted by sequence number
    const tasks = await Task.find({ userId })
      .sort({ sequence_num: 1 })
      .lean();

    // If there are no tasks or just one task, no resequencing is needed
    if (tasks.length <= 1) {
      return true;
    }

    // Start a transaction for batch updates
    const session = await startTransaction();

    try {
      // Resequence tasks with increments of 1024 to allow for future insertions
      const updates = tasks.map((task, index) => ({
        updateOne: {
          filter: { _id: task._id },
          update: { $set: { sequence_num: (index + 1) * 1024 } }
        }
      }));

      // Execute the batch update
      await Task.bulkWrite(updates, { session });
      
      // Commit the transaction
      await commitTransaction(session);
      
      return true;
    } catch (error) {
      // Roll back the transaction on error
      await rollBackTransaction(session);
      throw error;
    }
  } catch (error) {
    console.error("Error resequencing tasks:", error);
    return false;
  }
};
