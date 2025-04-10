export interface FieldError {
  [key: string]: {
    message: string;
    type?: string;
  };
}
export interface FormError {
  message?: string;
}

export type FormFieldError = [FormError[], FieldError];
