import axios from "@/configs/interceptors";
import {
  AuthResponse,
  LoginCredentials,
} from "@/modules/auth/types/auth.types";
import { ErrorDetails } from "@/types/error.types";
import { handleError } from "@/modules/errors/errorHandler";
import { AxiosRequestConfig } from "axios";

const API_URL = "/api/users";

export const forgotPassword = async (
  payload: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, payload);
    return response.data;
  } catch (error) {
    const formErrors = handleError(error as ErrorDetails[]);
    return Promise.reject(formErrors);
  }
};

export const getLoggedInUser = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  } catch (error) {
    const formErrors = handleError(error as ErrorDetails[]);
    return Promise.reject(formErrors);
  }
};

export const resetPassword = async (
  payload: LoginCredentials,
  token: string
): Promise<AuthResponse> => {
  try {
    const config: AxiosRequestConfig<LoginCredentials> = {};
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    const response = await axios.post(
      `${API_URL}/reset-password`,
      payload,
      config
    );
    return response.data;
  } catch (error) {
    const formErrors = handleError(error as ErrorDetails[]);
    return Promise.reject(formErrors);
  }
};
