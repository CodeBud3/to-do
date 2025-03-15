import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AuthorizationError } from "../utils/ErrorHandler";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new AuthorizationError(["Unauthorized"]));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new AuthorizationError(["Invalid token"]));
    }

    req.user = {
      id: user._id.toString(),
      firstName: user.firstName.toString(),
      lastName: user.lastName.toString(),
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error: any) {
    next(new AuthorizationError(["Authorization failed"]));
  }
};
