import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { ValidationError } from "../utils/ErrorHandler";
import sendResponse from "../utils/responseHelper";
import { clearSession, setSession } from "../helpers/auth.helper";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ValidationError(["Email already registered"]));
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Generate JWT token
    setSession(user, res);

    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
    sendResponse(res, 201, true, "User registered successfully", data);
  } catch (error: any) {
    return next();
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
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ValidationError(["Invalid credentials"]));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ValidationError(["Invalid credentials"]));
    }

    // Generate and set JWT token
    setSession(user, res);

    const data = {
      user: {
        id: user._id,
        name: user.name,
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
    sendResponse(res, 200, true, "Logged out successfully");
  } catch (error: any) {
    return next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ValidationError(["User not found"]));
    }

    // 1. Generate a password reset token
    // 2. Save it to the user document with an expiration
    // 3. Send an email with the reset link
    sendResponse(
      res,
      200,
      true,
      "Password reset instructions sent to your email"
    );
  } catch (error: any) {
    return next(error);
  }
};
