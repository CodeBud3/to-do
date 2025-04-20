import { NextFunction, Request, Response } from "express";
import { FormValidationError } from "../../../utils/ErrorHandler";
import sendResponse from "../../../utils/responseHelper";
import {
  clearSession,
  COOKIE_CONFIG,
  generateApiToken,
  generateToken,
  resetFailedLoggedInAttempts,
  updateFailedLoggedInAttempts,
  validateLoginAttempt,
} from "../helpers/auth.helper";
import { User } from "../../user/models/User";
import { IUser } from "../../user/types/auth.types";
import { createUser } from "../../user/helpers/user.helpers";
import {
  commitTransaction,
  rollBackTransaction,
  startTransaction,
} from "../../../config/db";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await startTransaction();
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(
        new FormValidationError([{ message: "Email already registered." }])
      );
    }

    // Create new user
    const user = await createUser(
      {
        firstName,
        lastName,
        email,
        password,
      } as IUser,
      session
    );

    await commitTransaction(session);
    // Generate JWT token
    generateToken(user, res);

    const data = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
    sendResponse(res, 201, true, "User registered successfully.", data);
  } catch (error: any) {
    await rollBackTransaction(session);
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(
        new FormValidationError([{ message: "Incorrect email or password." }])
      );
    }

    const accountLocked = validateLoginAttempt(user);
    if (accountLocked) {
      return next(accountLocked);
    }
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      updateFailedLoggedInAttempts(user);
      return next(
        new FormValidationError([{ message: "Incorrect email or password." }])
      );
    }

    resetFailedLoggedInAttempts(user);

    // Generate and set JWT token
    generateToken(user, res);

    const data = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };

    sendResponse(res, 200, true, "Login successful", data);
  } catch (error: any) {
    return next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    clearSession(res);
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        // Manually clear the cookie
        res.clearCookie("connect.sid", { ...COOKIE_CONFIG, maxAge: 0 });
        sendResponse(res, 200, true, "Logged out successfully");
      });
    });
  } catch (error: any) {
    return next(error);
  }
};

export const fetchApiToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    const token = generateApiToken(user);
    sendResponse(res, 200, true, "API token generated successfully", token);
  } catch (error: any) {
    return next(error);
  }
};
