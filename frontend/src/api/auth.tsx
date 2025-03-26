import {
  AuthResponse,
  LoginCredentials,
  SignUpCredentials,
} from "@/types/auth.types";
import axios from "@/api/interceptors/interceptors";

const API_URL = "/api/auth";

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

export const logOut = async (): Promise<AuthResponse> => {
  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};
