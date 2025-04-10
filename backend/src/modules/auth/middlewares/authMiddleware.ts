import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { IUser } from "../../user/types/auth.types";
import { AuthorizationError } from "../../../utils/ErrorHandler";
import { IForm } from "../../form/types/form.types";
import { ITask } from "../../task/types/task.types";

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      user?: User;
      form?: IForm;
      taskRecord?: ITask;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check OAuth authentication
  if (req.isAuthenticated()) {
    return next();
  }

  // Check JWT Authentication
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: IUser) => {
      if (err || !user) {
        return next(new AuthorizationError());
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

export const authenticate_admin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check JWT Authentication
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: IUser) => {
      if (err || !user) {
        return next(new AuthorizationError());
      }
      if (
        user.role !== "admin" ||
        user.email === req.params.email?.toLowerCase()
      ) {
        return next(new AuthorizationError());
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
