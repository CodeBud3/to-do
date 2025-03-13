import { Response } from "express";

export default function sendResponse(
  res: Response,
  statusCode: number = 200,
  success: boolean,
  message: String,
  data: any = undefined,
  error: any = undefined
): any {
  return res.status(statusCode).json({ success, message, data, error });
}
