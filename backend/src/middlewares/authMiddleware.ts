import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AuthorizationError } from "../utils/ErrorHandler";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SESSION_KEY = process.env.SESSION_KEY || "session-token";

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
    let token = req.cookies[SESSION_KEY];
    if (!token) {
      token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return next(new AuthorizationError(["Unauthorized"]));
      }
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log(decoded);
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
    console.error(error);
    next(new AuthorizationError(["Authorization failed"]));
  }
};
