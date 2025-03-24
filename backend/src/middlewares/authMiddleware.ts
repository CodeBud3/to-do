import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
import { AuthorizationError } from "../utils/ErrorHandler";
import passport from "passport";

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      user?: User;
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
        return next(new AuthorizationError(["Unauthorized"]));
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
        return next(new AuthorizationError(["Unauthorized"]));
      }
      if (
        user.role !== "admin" ||
        user.email === req.params.email?.toLowerCase()
      ) {
        return next(
          new AuthorizationError([
            "Unauthorized. You are not allowed to perform this operation.",
          ])
        );
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
