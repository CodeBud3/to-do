import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { ValidationError } from "../utils/ErrorHandler";
import sendResponse from "../utils/responseHelper";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
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

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
    sendResponse(res, 200, true, "Login successful", data);
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

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Save it to the user document with an expiration
    // 3. Send an email with the reset link

    res.json({
      message: "Password reset instructions sent to your email",
    });
  } catch (error: any) {
    return next(error);
  }
};
