// utils/errorHandler.js
class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details: any;
  constructor(
    statusCode: number,
    message: string,
    code: string = "INTERNAL_ERROR",
    details: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class ValidationError extends AppError {
  constructor(details: any) {
    super(400, "Validation Error", "VALIDATION_ERROR", details);
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(404, `${resource} not found`, "NOT_FOUND");
  }
}

export { AppError, ValidationError, NotFoundError };
