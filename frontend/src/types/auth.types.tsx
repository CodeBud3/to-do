import { z } from "zod";
import { ErrorDetails } from "./error.types";

export type InputType =
  | "checkbox"
  | "radio"
  | "text"
  | "password"
  | "number"
  | "date"
  | "email"
  | "url";

export type InitialValue = string | boolean | number | Date;

export interface FormConfig<T extends string = string> {
  key: T;
  label: string;
  type: InputType;
  validation?: z.ZodType<any>;
  required?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  options?: any[];
  placeholder?: string;
  initialValue?: InitialValue;
  group?: number;
}

export interface SignUpCredentials {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  tnc?: boolean;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: UserData;
  error?: ErrorDetails;
}

export interface UserData {
  user: User;
}
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager" | "member";
}

export interface AuthContextType {
  authloading: boolean;
  updateAuth: (user: User) => void;
  setUser: (user: User) => void;
  user: User | null;
  logout: () => void;
}
