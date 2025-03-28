import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../utils/ErrorHandler";
import sendResponse from "../../../utils/responseHelper";
import {
  clearSession,
  COOKIE_CONFIG,
  generateApiToken,
  generateToken,
} from "../helpers/auth.helper";
import { User } from "../../user/models/User";
import { IUser } from "../../user/types/auth.types";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ValidationError(["Email already registered"]));
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();

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
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new ValidationError(["Incorrect email or password."]));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ValidationError(["Incorrect email or password."]));
    }

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
