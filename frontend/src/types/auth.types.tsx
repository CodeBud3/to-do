import { z } from "zod";

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
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}
