export interface AppError extends Error {
  response: ErrorResponse;
}

export interface ErrorResponse {
  data: ErrorResponseData;
}

export interface ErrorResponseData {
  success: boolean;
  message: string;
  error?: ErrorData;
  data?: null;
}

export interface ErrorDetails {
  code?: string;
  message: string;
  path?: string[];
}
export interface ErrorData {
  details: ErrorDetails[];
}
