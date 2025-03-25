// middleware/errorMiddleware.js
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import sendResponse from "../utils/responseHelper";
import { AppError } from "../utils/ErrorHandler";

const errorMiddleware: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message);

  if (err instanceof AppError) {
    return sendResponse(res, err.statusCode, false, err.message, null, {
      code: err.code,
      details: err.details,
    });
  }

  return sendResponse(
    res,
    500,
    false,
    "Something went wrong! Please try again in sometime.",
    null,
    {
      code: "INTERNAL_ERROR",
    }
  );
};

export default errorMiddleware;
