import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/configs/interceptors";
import {
  GetTaskResponse,
  TaskResponse,
  Task,
  TaskField,
  TaskColumn,
  KanbanColumn,
} from "../types/task.types";
import { handleError } from "@/modules/errors/errorHandler";
import { ErrorDetails } from "@/types/error.types";
import { RootState } from "@/store/store";

const API_URL = "/api/tasks";
export interface AsyncThunkConfig {
  state: RootState;
  rejectValue: string; // or a custom error type
}
// Fetch Tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks", 
  async ({ viewType = 'list', sortBy, order }: { viewType?: string, sortBy?: string, order?: string } = {}) => {
    const params = new URLSearchParams();
    if (viewType) params.append('view_type', viewType);
    if (sortBy) params.append('sort_by', sortBy);
    if (order) params.append('order', order);
    
    const response = await axios.get<GetTaskResponse>(`${API_URL}?${params.toString()}`);
    return response.data;
  }
);

// Add Task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: TaskField, thunkAPI) => {
    try {
      const response = await axios.post<TaskResponse>(`${API_URL}`, task);
      return response.data;
    } catch (error) {
      const formErrors = handleError(error as ErrorDetails[]);
      return thunkAPI.rejectWithValue(formErrors);
    }
  }
);

// Update Task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task, thunkAPI) => {
    try {
      // Create a clean payload without the fields that shouldn't be sent to the API
      const { id, fields, sequence_num } = task;
      const cleanTask = { id, fields, sequence_num };
      
      const response = await axios.put<TaskResponse>(
        `${API_URL}/${task.id}`,
        cleanTask
      );
      return response.data;
    } catch (error) {
      const formErrors = handleError(error as ErrorDetails[]);
      return thunkAPI.rejectWithValue(formErrors);
    }
  }
);

// Update Task Status (for drag-and-drop)
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ taskId, status }: { taskId: string, status: string }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      
      // Try to find task in the flat tasks array first
      let task = state.tasks.tasks.find(t => t.id === taskId);
      
      // If not found and we have groupedTasks, search there
      if (!task && state.tasks.groupedTasks) {
        // Search through all columns in groupedTasks
        Object.values(state.tasks.groupedTasks).forEach((column: any) => {
          if (column.tasks) {
            const foundTask = column.tasks.find((t: any) => t.id === taskId);
            if (foundTask) {
              task = foundTask;
            }
          }
        });
      }
      
      // If still not found, look in the normalized structure
      if (!task && state.tasks.byId && state.tasks.byId[taskId]) {
        task = state.tasks.byId[taskId];
      }
      
      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      const updatePayload = {
        id: taskId,
        sequence_num: task.sequence_num,
        fields: {
          ...task.fields,
          status
        }
      };
      
      console.log("Sending update with payload:", updatePayload);
      
      const response = await axios.put<TaskResponse>(
        `${API_URL}/${taskId}`,
        updatePayload
      );
      
      return response.data;
    } catch (error) {
      const formErrors = handleError(error as ErrorDetails[]);
      return thunkAPI.rejectWithValue(formErrors);
    }
  }
);

// Delete Task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      const formErrors = handleError(error as ErrorDetails[]);
      return thunkAPI.rejectWithValue(formErrors);
    }
  }
);

// Enhanced task state with normalized structure
interface TaskState {
  // Legacy structure (maintained for backward compatibility)
  tasks: Task[];
  columns?: TaskColumn[];
  groupedTasks?: { [key: string]: KanbanColumn };
  viewType: 'list' | 'kanban';
  loading: boolean;
  error: string | null;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  // Normalized structure (new)
  byId: { [id: string]: Task };
  allIds: string[];
  statusGroups: { [status: string]: string[] };
}

const initialState: TaskState = {
  // Legacy fields
  tasks: [],
  viewType: 'list',
  loading: false,
  error: null,
  // Normalized fields
  byId: {},
  allIds: [],
  statusGroups: {},
};

// Helper function to normalize tasks
const normalizeTasks = (tasks: Task[]) => {
  const byId: { [id: string]: Task } = {};
  const allIds: string[] = [];
  const statusGroups: { [status: string]: string[] } = {};
  
  tasks.forEach(task => {
    byId[task.id] = task;
    allIds.push(task.id);
    
    // Group by status
    const status = task.fields?.status as string || 'to_do';
    if (!statusGroups[status]) {
      statusGroups[status] = [];
    }
    statusGroups[status].push(task.id);
  });
  
  return { byId, allIds, statusGroups };
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setViewType: (state, action: PayloadAction<'list' | 'kanban'>) => {
      state.viewType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTasks.fulfilled,
        (state, action: PayloadAction<GetTaskResponse>) => {
          state.loading = false;
          const tasks = action.payload?.data?.tasks || [];
          
          // Update legacy structure
          state.tasks = tasks;
          state.viewType = action.payload?.data?.viewType || 'list';
          state.columns = action.payload?.data?.columns;
          state.groupedTasks = action.payload?.data?.groupedTasks;
          state.pagination = action.payload?.data?.pagination;
          state.sort = action.payload?.data?.sort;
          
          // Update normalized structure
          const normalized = normalizeTasks(tasks);
          state.byId = normalized.byId;
          state.allIds = normalized.allIds;
          state.statusGroups = normalized.statusGroups;
        }
      )
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(
        addTask.fulfilled,
        (state, action: PayloadAction<TaskResponse>) => {
          const newTask = action.payload.data;
          
          // Update legacy structure
          state.tasks.push(newTask);
          
          // Update normalized structure
          state.byId[newTask.id] = newTask;
          state.allIds.push(newTask.id);
          
          // Update status groups
          const status = newTask.fields?.status as string || 'to_do';
          if (!state.statusGroups[status]) {
            state.statusGroups[status] = [];
          }
          state.statusGroups[status].push(newTask.id);
          
          // Update Kanban grouped tasks if present
          if (state.groupedTasks && state.groupedTasks[status]) {
            state.groupedTasks[status].tasks.push(newTask);
            state.groupedTasks[status].count = state.groupedTasks[status].tasks.length;
          }
        }
      )
      .addCase(
        updateTask.fulfilled,
        (state, action: PayloadAction<TaskResponse>) => {
          const updatedTask = action.payload.data;
          
          // Update in the flat tasks array
          const index = state.tasks.findIndex(
            (t) => t.id === updatedTask.id
          );
          if (index !== -1) state.tasks[index] = updatedTask;
          
          // Update in normalized structure
          const oldTask = state.byId[updatedTask.id];
          const oldStatus = oldTask?.fields?.status as string || '';
          const newStatus = updatedTask.fields?.status as string || '';
          
          // Update the task in byId
          state.byId[updatedTask.id] = updatedTask;
          
          // If status has changed, update status groups
          if (oldStatus !== newStatus) {
            // Remove from old status group
            if (state.statusGroups[oldStatus]) {
              state.statusGroups[oldStatus] = state.statusGroups[oldStatus].filter(
                id => id !== updatedTask.id
              );
            }
            
            // Add to new status group
            if (!state.statusGroups[newStatus]) {
              state.statusGroups[newStatus] = [];
            }
            state.statusGroups[newStatus].push(updatedTask.id);
          }
          
          // Also update in the groupedTasks for Kanban view
          if (state.groupedTasks) {
            // First pass - find and remove the task from its current column
            let taskFound = false;
            
            Object.keys(state.groupedTasks).forEach(columnKey => {
              const column = state.groupedTasks![columnKey];
              const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
              
              if (taskIndex !== -1) {
                // Remove task from current column
                column.tasks.splice(taskIndex, 1);
                column.count = column.tasks.length;
                taskFound = true;
              }
            });
            
            // Add the task to the appropriate column based on its status
            if (state.groupedTasks[newStatus]) {
              state.groupedTasks[newStatus].tasks.push(updatedTask);
              state.groupedTasks[newStatus].count = state.groupedTasks[newStatus].tasks.length;
            }
          }
        }
      )
      .addCase(
        updateTaskStatus.fulfilled,
        (state, action: PayloadAction<TaskResponse>) => {
          const updatedTask = action.payload.data;
          
          // Update in flat tasks array
          const index = state.tasks.findIndex(
            (t) => t.id === updatedTask.id
          );
          if (index !== -1) state.tasks[index] = updatedTask;
          
          // Update in normalized structure
          const oldTask = state.byId[updatedTask.id];
          const oldStatus = oldTask?.fields?.status as string || '';
          const newStatus = updatedTask.fields?.status as string || '';
          
          // Update the task in byId
          state.byId[updatedTask.id] = updatedTask;
          
          // If status has changed, update status groups
          if (oldStatus !== newStatus) {
            // Remove from old status group
            if (state.statusGroups[oldStatus]) {
              state.statusGroups[oldStatus] = state.statusGroups[oldStatus].filter(
                id => id !== updatedTask.id
              );
            }
            
            // Add to new status group
            if (!state.statusGroups[newStatus]) {
              state.statusGroups[newStatus] = [];
            }
            state.statusGroups[newStatus].push(updatedTask.id);
          }
        }
      )
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        const deletedTaskId = action.payload;
        
        // Get the task status before removing it
        const deletedTask = state.byId[deletedTaskId];
        const taskStatus = deletedTask?.fields?.status as string || '';
        
        // Update legacy structure
        state.tasks = state.tasks.filter((task) => task.id !== deletedTaskId);
        
        // Update normalized structure
        delete state.byId[deletedTaskId];
        state.allIds = state.allIds.filter(id => id !== deletedTaskId);
        
        // Update status groups
        if (state.statusGroups[taskStatus]) {
          state.statusGroups[taskStatus] = state.statusGroups[taskStatus].filter(
            id => id !== deletedTaskId
          );
        }
        
        // Update Kanban view if needed
        if (state.groupedTasks && taskStatus && state.groupedTasks[taskStatus]) {
          state.groupedTasks[taskStatus].tasks = state.groupedTasks[taskStatus].tasks.filter(
            t => t.id !== deletedTaskId
          );
          state.groupedTasks[taskStatus].count = state.groupedTasks[taskStatus].tasks.length;
        }
      });
  },
});

// Export selectors for the normalized state
export const selectTaskById = (state: RootState, taskId: string) => state.tasks.byId[taskId];
export const selectAllTasks = (state: RootState) => state.tasks.allIds.map(id => state.tasks.byId[id]);
export const selectTasksByStatus = (state: RootState, status: string) => 
  (state.tasks.statusGroups[status] || []).map(id => state.tasks.byId[id]);

export const { setViewType } = tasksSlice.actions;
export default tasksSlice.reducer;
