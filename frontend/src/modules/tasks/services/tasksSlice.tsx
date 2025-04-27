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
      
      if (!task) {
        console.error(`Task with ID ${taskId} not found in any collection`);
        return thunkAPI.rejectWithValue("Task not found");
      }
      
      // Create a clean update object with only the required fields
      // to avoid validation errors
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

interface TaskState {
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
}

const initialState: TaskState = {
  tasks: [],
  viewType: 'list',
  loading: false,
  error: null,
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
          state.tasks = action.payload?.data?.tasks || [];
          state.viewType = action.payload?.data?.viewType || 'list';
          state.columns = action.payload?.data?.columns;
          state.groupedTasks = action.payload?.data?.groupedTasks;
          state.pagination = action.payload?.data?.pagination;
          state.sort = action.payload?.data?.sort;
        }
      )
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(
        addTask.fulfilled,
        (state, action: PayloadAction<TaskResponse>) => {
          state.tasks.push(action.payload.data);
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
          
          // Also update in the groupedTasks for Kanban view
          if (state.groupedTasks) {
            // Get the task's status from its fields
            const taskStatus = updatedTask.fields?.status as string || '';
            let taskFound = false;
            
            // First pass - find and remove the task from its current column
            Object.keys(state.groupedTasks).forEach(columnKey => {
              const column = state.groupedTasks![columnKey];
              const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
              
              if (taskIndex !== -1) {
                // Remove task from current column
                column.tasks.splice(taskIndex, 1);
                taskFound = true;
              }
            });
            
            // Add the task to the appropriate column based on its status
            if (state.groupedTasks[taskStatus]) {
              state.groupedTasks[taskStatus].tasks.push(updatedTask);
            } else {
              console.warn(`Column for status '${taskStatus}' not found in Kanban board`);
            }
            
            // If task wasn't found in any column or status isn't recognized,
            // refresh the task list to ensure consistent state
            if (!taskFound && !state.groupedTasks[taskStatus]) {
              console.warn("Task wasn't found in any column, refreshing tasks...");
              // We'll trigger a refresh on the component side
            }
          }
        }
      )
      .addCase(
        updateTaskStatus.fulfilled,
        (state, action: PayloadAction<TaskResponse>) => {
          const index = state.tasks.findIndex(
            (t) => t.id === action.payload.data.id
          );
          if (index !== -1) state.tasks[index] = action.payload.data;
        }
      )
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export const { setViewType } = tasksSlice.actions;
export default tasksSlice.reducer;
