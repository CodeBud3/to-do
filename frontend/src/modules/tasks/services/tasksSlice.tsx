import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/configs/interceptors";
import { GetTaskResponse, TaskResponse, Task } from "../types/task.types";
import { handleError } from "@/utils/errorHandler";
import { AppError } from "@/types/error.types";

const API_URL = "/api/tasks";

// Fetch Tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get<GetTaskResponse>(API_URL);
  return response.data;
});

// Add Task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: Task, thunkAPI) => {
    try {
      const response = await axios.post<TaskResponse>(`${API_URL}`, task);
      return response.data;
    } catch (error) {
      console.log(error);
      const message = handleError(error as AppError);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task) => {
    const response = await axios.put<TaskResponse>(
      `${API_URL}/${task.id}`,
      task
    );
    return response.data;
  }
);

// Delete Task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
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
