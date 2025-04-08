import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/configs/interceptors";
import { Form, FormResponse } from "../types/form.types";

const API_URL = "/api/forms";

// Fetch Form
export const fetchForm = createAsyncThunk(
  "forms/fetchForm",
  async (formType: string) => {
    const response = await axios.get<FormResponse>(`${API_URL}/${formType}`);
    return response.data;
  }
);

interface FormState {
  forms: { [key: string]: Form };
  loading: boolean;
  error: string | null;
}

const initialState: FormState = {
  forms: {},
  loading: false,
  error: null,
};

const formSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchForm.fulfilled,
        (state, action: PayloadAction<FormResponse>) => {
          state.loading = false;
          const formType = action.payload?.data.formType;
          state.forms[formType] = action.payload?.data;
        }
      )
      .addCase(fetchForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default formSlice.reducer;
