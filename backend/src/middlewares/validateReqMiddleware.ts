import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import sendResponse from "../utils/responseHelper";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;
      next();
    } catch (error: any) {
      sendResponse(
        res,
        400,
        false,
        "Validation error",
        undefined,
        error.errors
      );
    }
  };
