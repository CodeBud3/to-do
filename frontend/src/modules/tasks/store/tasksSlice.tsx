import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "@/configs/interceptors";
import axios from "axios";
import { Task } from "../types/task.types";

const API_URL = "src/modules/tasks/__mocks__/tasks.json";

// Fetch Tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get<Task[]>(API_URL);
  return response.data;
});

// Add Task
export const addTask = createAsyncThunk("tasks/addTask", async (task: Task) => {
  const response = await axios.post<Task>(`${API_URL}`, task);
  return response.data;
});

// Update Task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task) => {
    const response = await axios.put<Task>(`${API_URL}/${task.id}`, task);
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
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
