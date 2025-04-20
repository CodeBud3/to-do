import { Request } from "express";
import { Task } from "../models/Task";
import { ITask } from "../types/task.types";

interface FilterOptions {
  userId: string;
  status?: string;
  priority?: string;
  tag?: string;
  due_date_start?: string;
  due_date_end?: string;
}

interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Service layer for handling task-related business logic
 */
export class TaskService {
  // Define sort order mappings for enum fields
  private static readonly priorityOrder: { [key: string]: number } = {
    high: 1,
    medium: 2,
    low: 3
  };

  private static readonly statusOrder: { [key: string]: number } = {
    to_do: 2,
    "in_progress": 3,
    done: 4,
    back_log: 1,
    completed: 5
  };

  private static readonly matrixOrder: { [key: string]: number } = {
    "urgent_important": 1,
    "not_urgent_important": 3,
    "urgent_not_important": 2,
    "not_urgent_not_important": 4
  };

  /**
   * Safely get a field value from a task, handling both Map and Object structures
   */
  private static getFieldValue(task: any, fieldName: string): any {
    if (!task || !task.fields || typeof task.fields !== 'object') {
      return "";
    }
    
    // Option 1: Direct property access if it's a plain object
    if (fieldName in task.fields) {
      return task.fields[fieldName];
    } 
    // Option 2: Map access if it's a Map
    else if (task.fields instanceof Map) {
      return task.fields.get(fieldName);
    }
    
    // Default fallback
    return "";
  }

  /**
   * Get tasks with filtering, sorting and pagination
   */
  public static async getTasks(
    filterOptions: FilterOptions,
    sortOptions: SortOptions,
    paginationOptions: PaginationOptions
  ): Promise<{
    tasks: ITask[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      // Fetch all tasks for this user
      const allTasks = await Task.find({ userId: filterOptions.userId.toString() });
  
      // Apply filters
      const filteredTasks = this.filterTasks(allTasks, filterOptions);
  
      // Sort tasks
      const sortedTasks = this.sortTasks(filteredTasks, sortOptions);
  
      // Apply pagination
      const { page, limit } = paginationOptions;
      const skip = (page - 1) * limit;
      const paginatedTasks = sortedTasks.slice(skip, skip + limit);
  
      return {
        tasks: paginatedTasks,
        total: filteredTasks.length,
        page,
        limit,
        pages: Math.ceil(filteredTasks.length / limit)
      };
    } catch (error) {
      console.error("Error in TaskService.getTasks:", error);
      throw error;
    }
  }

  /**
   * Extract filter parameters from request
   */
  public static extractFilterOptions(req: Request): FilterOptions {
    // Ensure userId is always a string, not undefined
    const userId = req.user?._id?.toString();
    
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    return {
      userId,
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      tag: req.query.tag as string | undefined,
      due_date_start: req.query.due_date_start as string | undefined,
      due_date_end: req.query.due_date_end as string | undefined
    };
  }

  /**
   * Extract sort parameters from request
   */
  public static extractSortOptions(req: Request): SortOptions {
    const sortBy = (req.query.sort_by as string) || "sequence_num";
    const order = (req.query.order as string) === "desc" ? "desc" : "asc";
    
    return { field: sortBy, order };
  }

  /**
   * Extract pagination parameters from request
   */
  public static extractPaginationOptions(req: Request): PaginationOptions {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    return { page, limit };
  }

  /**
   * Filter tasks based on provided filter options
   */
  private static filterTasks(tasks: ITask[], filterOptions: FilterOptions): ITask[] {
    let filteredTasks = [...tasks];
    
    if (filterOptions.status) {
      filteredTasks = filteredTasks.filter(task => 
        this.getFieldValue(task, "status") === filterOptions.status
      );
    }
    
    if (filterOptions.priority) {
      filteredTasks = filteredTasks.filter(task => 
        this.getFieldValue(task, "priority") === filterOptions.priority
      );
    }
    
    if (filterOptions.tag) {
      filteredTasks = filteredTasks.filter(task => 
        this.getFieldValue(task, "tag") === filterOptions.tag
      );
    }
    
    // Date range filtering
    if (filterOptions.due_date_start || filterOptions.due_date_end) {
      filteredTasks = filteredTasks.filter(task => {
        const dueDate = this.getFieldValue(task, "due_date") 
          ? new Date(this.getFieldValue(task, "due_date") as string) 
          : null;
        
        if (!dueDate) return false;
        
        if (filterOptions.due_date_start) {
          const startDate = new Date(filterOptions.due_date_start);
          if (dueDate < startDate) return false;
        }
        
        if (filterOptions.due_date_end) {
          const endDate = new Date(filterOptions.due_date_end);
          if (dueDate > endDate) return false;
        }
        
        return true;
      });
    }
    
    return filteredTasks;
  }

  /**
   * Sort tasks based on provided sort options
   */
  private static sortTasks(tasks: ITask[], sortOptions: SortOptions): ITask[] {
    const { field: sortBy, order } = sortOptions;
    const sortOrder = order === "asc" ? 1 : -1;
    const sortedTasks = [...tasks];
    
    if (sortBy === "priority") {
      return sortedTasks.sort((a, b) => {
        const aValue = String(this.getFieldValue(a, "priority") || "");
        const bValue = String(this.getFieldValue(b, "priority") || "");
        const aOrder = this.priorityOrder[aValue] || 99;
        const bOrder = this.priorityOrder[bValue] || 99;
        return sortOrder === 1 ? aOrder - bOrder : bOrder - aOrder;
      });
    }
    else if (sortBy === "status") {
      return sortedTasks.sort((a, b) => {
        const aValue = String(this.getFieldValue(a, "status") || "");
        const bValue = String(this.getFieldValue(b, "status") || "");
        const aOrder = this.statusOrder[aValue] || 99;
        const bOrder = this.statusOrder[bValue] || 99;
        return sortOrder === 1 ? aOrder - bOrder : bOrder - aOrder;
      });
    }
    else if (sortBy === "matrix") {
      return sortedTasks.sort((a, b) => {
        const aValue = String(this.getFieldValue(a, "matrix") || "");
        const bValue = String(this.getFieldValue(b, "matrix") || "");
        const aOrder = this.matrixOrder[aValue] || 99;
        const bOrder = this.matrixOrder[bValue] || 99;
        return sortOrder === 1 ? aOrder - bOrder : bOrder - aOrder;
      });
    }
    else if (sortBy === "due_date") {
      return sortedTasks.sort((a, b) => {
        const aDate = this.getFieldValue(a, "due_date") 
          ? new Date(this.getFieldValue(a, "due_date") as string).getTime() 
          : 0;
        const bDate = this.getFieldValue(b, "due_date") 
          ? new Date(this.getFieldValue(b, "due_date") as string).getTime() 
          : 0;
        return sortOrder === 1 ? aDate - bDate : bDate - aDate;
      });
    }
    else if (sortBy === "title" || sortBy === "description" || sortBy === "tag") {
      return sortedTasks.sort((a, b) => {
        const aValue = String(this.getFieldValue(a, sortBy) || "");
        const bValue = String(this.getFieldValue(b, sortBy) || "");
        return sortOrder === 1 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      });
    }
    else if (sortBy === "sequence_num" || sortBy === "stack_rank") {
      return sortedTasks.sort((a, b) => {
        const aValue = sortBy === "sequence_num" 
          ? a.sequence_num || 0 
          : Number(this.getFieldValue(a, "stack_rank")) || 0;
        const bValue = sortBy === "sequence_num" 
          ? b.sequence_num || 0 
          : Number(this.getFieldValue(b, "stack_rank")) || 0;
        return sortOrder === 1 ? aValue - bValue : bValue - aValue;
      });
    }
    else if (sortBy === "createdAt" || sortBy === "updatedAt") {
      return sortedTasks.sort((a, b) => {
        const aDate = a[sortBy as keyof typeof a] as Date;
        const bDate = b[sortBy as keyof typeof b] as Date;
        return sortOrder === 1 
          ? aDate.getTime() - bDate.getTime() 
          : bDate.getTime() - aDate.getTime();
      });
    }
    else {
      // Default to sequence_num
      return sortedTasks.sort((a, b) => {
        return sortOrder === 1 
          ? (a.sequence_num || 0) - (b.sequence_num || 0) 
          : (b.sequence_num || 0) - (a.sequence_num || 0);
      });
    }
  }
}
