import { z } from "zod";
import { ErrorDetails } from "@/types/error.types";
import { ChoiceType } from "@/modules/tasks/configs/taskForms";

export type InputType =
  | "checkbox"
  | "radio"
  | "text"
  | "textarea"
  | "select"
  | "password"
  | "number"
  | "date"
  | "datetime"
  | "multiselect"
  | "email"
  | "url";

export type InitialValue = string | boolean | number | Date;

export interface FormConfig<T extends string = string> {
  key: T;
  label: string;
  type: InputType;
  validation?: z.ZodType<any> | null | undefined;
  required?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  options?: ChoiceType[];
  placeholder?: string;
  initialValue?: InitialValue;
  group?: number;
  config?: { [key: string]: boolean | string };
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
