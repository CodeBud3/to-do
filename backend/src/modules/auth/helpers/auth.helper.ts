import jwt from "jsonwebtoken";
import { dayToMs, minToMS } from "../../../helpers/common.helper";
import { NextFunction, Response } from "express";
import { User } from "../../user/models/User";
import { getMongoStore } from "../../../config/db";
import { IUser } from "../../user/types/auth.types";
import { FormValidationError } from "../../../utils/ErrorHandler";
import {
  LOCKED_FOR_IN_MINS,
  MAX_NO_OF_LOGIN_ATTEMPTS,
} from "../constants/auth.constants";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export const SESSION_KEY = process.env.SESSION_KEY as string;
const NODE_ENV = process.env.NODE_ENV || "dev";

export const COOKIE_CONFIG: any = {
  httpOnly: true, // Prevent XSS attacks
  secure: NODE_ENV != "dev", // HTTPS in production
  sameSite: NODE_ENV != "dev" ? "none" : "lax", // Prevent CSRF attacks
  maxAge: dayToMs(7),
  path: "/",
};
export const SESSION_CONFIG: any = {
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: getMongoStore(),
  cookie: COOKIE_CONFIG,
};

export const generateToken = (user: IUser, res: Response): void => {
  const token = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie(SESSION_KEY, token, COOKIE_CONFIG);
};

export const generateForgotPasswordToken = (user: IUser): string => {
  // Generate JWT token valid for 15 minutes
  return jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    JWT_SECRET!,
    {
      expiresIn: "15m",
    }
  );
};

export const clearSession = (res: Response): void => {
  res.cookie(SESSION_KEY, "", { ...COOKIE_CONFIG, maxAge: 0 });
};

export const generateApiToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    {}
  );
};

export const extractProfile = (
  profile: any
): [string, string, string, string] => {
  const id = profile.id || "";
  const email = profile.emails?.[0]?.value || "";
  let firstName = profile.displayName?.split(" ")[0] || "";
  const lastName = profile.displayName?.split(" ")?.[1] || "";
  if (!firstName) {
    firstName = email.split("@")[0];
  }
  return [id, firstName, lastName, email];
};

export const handleAuthResponse = async (
  profile: any,
  provider: string,
  done: any
) => {
  try {
    const [id, firstName, lastName, email] = extractProfile(profile);
    let user = await User.findOne({
      email: email,
    });
    if (user && !user.oAuthProfileId) {
      user.oAuthProfileId = id;
      user.provider = provider;
      await user.save();
    }
    if (!user) {
      // Create new user
      user = new User({
        oAuthProfileId: id,
        firstName,
        lastName,
        email,
        provider,
      });
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

export const updateFailedLoggedInAttempts = async (user: IUser) => {
  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
  if (user.failedLoginAttempts >= MAX_NO_OF_LOGIN_ATTEMPTS) {
    user.lockUntil = new Date(Date.now() + minToMS(LOCKED_FOR_IN_MINS));
  }
  await user.save();
};

export const resetFailedLoggedInAttempts = async (user: IUser) => {
  if (user.failedLoginAttempts != 0 || user.lockUntil) {
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }
};

export const validateLoginAttempt = (user: IUser) => {
  const { accountLocked, lockTimeLeft } = user.isLocked();
  console.log(accountLocked, lockTimeLeft);
  if (accountLocked && lockTimeLeft > 0) {
    return new FormValidationError([
      {
        message: `Account locked due to too many failed attempts. Reset your password or try again in ${lockTimeLeft} seconds.`,
      },
    ]);
  }
  return null;
};
