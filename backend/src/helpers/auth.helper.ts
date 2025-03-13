import { Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import { dayToMs } from "./common.helper";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SESSION_KEY = process.env.SESSION_KEY || "session-token";
const NODE_ENV = process.env.NODE_ENV || "dev";
const COOKIE_CONFIG: any = {
  httpOnly: true, // Prevent XSS attacks
  secure: NODE_ENV != "dev", // HTTPS in production
  sameSite: "strict", // Prevent CSRF attacks
  maxAge: dayToMs(7),
};

export const setSession = (user: IUser, res: Response): void => {
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie(SESSION_KEY, token, COOKIE_CONFIG);
};

export const clearSession = (res: Response): void => {
  res.cookie(SESSION_KEY, "", { ...COOKIE_CONFIG, maxAge: 0 });
};
