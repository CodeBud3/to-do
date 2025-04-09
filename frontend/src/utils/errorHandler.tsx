import { AppError, ErrorDetails } from "@/types/error.types";

export function handleError(err: AppError): ErrorDetails[] | string[] {
  let errorMessage: ErrorDetails[] | string[] = ["Something went wrong!"];
  if (err?.response?.data?.error?.details) {
    errorMessage = err.response.data.error.details;
  }
  return errorMessage;
}
