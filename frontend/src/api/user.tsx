import axios from "@/api/interceptors/interceptors";
import { AuthResponse } from "@/types/auth.types";

const API_URL = "/api/users";

export const forgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/forgot-password`, {
    email,
  });
  return response.data;
};

export const getLoggedInUser = async (): Promise<AuthResponse> => {
  const response = await axios.get(`${API_URL}/profile`, {
    withCredentials: true,
  });
  return response.data;
};
