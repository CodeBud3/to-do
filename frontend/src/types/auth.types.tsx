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
export interface FormConfig {
  key: string;
  label: string;
  type: InputType;
  validation: any;
  required?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  options?: any[];
  placeholder?: string;
  initialValue?: InitialValue;
  group?: number;
}
