import {
  AuthResponse,
  LoginCredentials,
  SignUpCredentials,
} from "@/modules/auth/types/auth.types";
import axios from "@/configs/interceptors";
import { handleError } from "@/modules/errors/errorHandler";
import { ErrorDetails } from "@/types/error.types";

const API_URL = "/api/auth";

export const register = async (
  credentials: SignUpCredentials
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/register`,
      credentials
    );
    return response.data;
  } catch (error) {
    const formErrors = handleError(error as ErrorDetails[]);
    return Promise.reject(formErrors);
  }
};

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    const formErrors = handleError(error as ErrorDetails[]);
    return Promise.reject(formErrors);
  }
};

export const logOut = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const formErrors = handleError(error as ErrorDetails[]);
    return Promise.reject(formErrors);
  }
};
