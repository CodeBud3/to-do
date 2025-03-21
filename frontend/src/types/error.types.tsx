export interface AppError extends Error {
  response: ErrorResponse;
}

export interface ErrorResponse {
  data: ErrorResponseData;
}

export interface ErrorResponseData {
  success: boolean;
  message: string;
  error?: ErrorDetails;
  data?: any;
}

export interface ErrorDetails {
  code: string;
  details: any[];
}
