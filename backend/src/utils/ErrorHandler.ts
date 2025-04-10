import { ErrorDetails } from "../types/error.types";

// utils/errorHandler.js
class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details: ErrorDetails[] | null;
  constructor(
    statusCode: number,
    message: string,
    code: string = "INTERNAL_ERROR",
    details: ErrorDetails[] | null = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class AuthorizationError extends AppError {
  constructor() {
    super(401, "Authorization Error", "UNAUTHORIZED");
  }
}
class ValidationError extends AppError {
  constructor(details: ErrorDetails[]) {
    super(400, "Validation Error", "VALIDATION_ERROR", details);
  }
}

class FormValidationError extends ValidationError {
  constructor(details: ErrorDetails[]) {
    const errorDetails = details.map((detail) => ({
      code: "formError",
      path: ["body", "formError"],
      ...detail,
    }));
    super(errorDetails);
  }
}
class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(404, `${resource} not found`, "NOT_FOUND");
  }
}

export {
  AppError,
  ValidationError,
  NotFoundError,
  AuthorizationError,
  FormValidationError,
};
