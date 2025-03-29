import axios from "@/configs/interceptors";
import {
  AuthResponse,
  LoginCredentials,
} from "@/modules/auth/types/auth.types";

const API_URL = "/api/users";

export const forgotPassword = async (
  payload: LoginCredentials
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/forgot-password`, payload);
  return response.data;
};

export const getLoggedInUser = async (): Promise<AuthResponse> => {
  const response = await axios.get(`${API_URL}/profile`);
  return response.data;
};

export const resetPassword = async (
  payload: LoginCredentials,
  token: string
): Promise<AuthResponse> => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  const response = await axios.post(`${API_URL}/reset-password`, payload);
  return response.data;
};
