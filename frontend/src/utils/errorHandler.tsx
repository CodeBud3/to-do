import { AppError } from "@/types/error.types";

export function handleError(err: AppError): string[] {
  let errorMessage = ["Something went wrong!"];
  if (err?.response?.data?.error?.details) {
    errorMessage = err.response.data.error.details;
  }
  return errorMessage;
}
