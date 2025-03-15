import {
  AuthResponse,
  LoginCredentials,
  SignUpCredentials,
} from "@/types/auth.types";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://to-do-test-cjnr.onrender.com";

export const register = async (
  credentials: SignUpCredentials
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/register`,
    credentials
  );
  return response.data;
};

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const forgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/forgot-password`, {
    email,
  });
  return response.data;
};

export const getLoggedInUser = async (): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>(`${API_URL}/profile`, {
    withCredentials: true,
  });
  return response.data;
};
