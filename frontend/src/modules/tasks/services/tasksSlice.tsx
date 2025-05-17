import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/configs/interceptors";
import {
  GetTaskResponse,
  TaskResponse,
  Task,
  TaskField,
} from "../types/task.types";
import { handleError } from "@/modules/errors/errorHandler";
import { ErrorDetails } from "@/types/error.types";
import { RootState } from "@/store/store";

const API_URL = "/api/tasks";
export interface AsyncThunkConfig {
  state: RootState;
  rejectValue: string; // or a custom error type
}

// Sort parameters interface
export interface SortParams {
  sort_by?: string;
  order?: 'asc' | 'desc';
}

// Fetch Tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks", 
  async (sortParams?: SortParams) => {
    // Construct query parameters for sorting
    let url = API_URL;
    if (sortParams) {
      const queryParams = new URLSearchParams();
      if (sortParams.sort_by) {
        queryParams.append('sort_by', sortParams.sort_by);
      }
      if (sortParams.order) {
        queryParams.append('order', sortParams.order);
      }
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${API_URL}?${queryString}`;
      }
    }
    
    const response = await axios.get<GetTaskResponse>(url);
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
      const response = await axios.put<TaskResponse>(
        `${API_URL}/${task.id}`,
        task
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
  loading: boolean;
  error: string | null;
  currentSort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSortField: (state, action: PayloadAction<{ field: string, order: 'asc' | 'desc' }>) => {
      state.currentSort = {
        field: action.payload.field,
        order: action.payload.order
      };
    }
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
          state.tasks = action.payload?.data?.tasks;
          // Update current sort if returned from API
          if (action.payload?.data?.sort) {
            state.currentSort = {
              field: action.payload.data.sort.field,
              order: action.payload.data.sort.order as 'asc' | 'desc'
            };
          }
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

export default tasksSlice.reducer;
