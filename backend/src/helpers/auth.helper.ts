import { Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import { dayToMs } from "./common.helper";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SESSION_KEY = process.env.SESSION_KEY || "session-token";
const NODE_ENV = process.env.NODE_ENV || "dev";
const COOKIE_CONFIG: any = {
  httpOnly: NODE_ENV != "dev", // Prevent XSS attacks
  secure: true, // HTTPS in production
  sameSite: "none", // Prevent CSRF attacks
  maxAge: dayToMs(7),
};

export const setSession = (user: IUser, res: Response): string => {
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.header;
  res.cookie(SESSION_KEY, token, COOKIE_CONFIG);
  return token;
};

export const clearSession = (res: Response): void => {
  res.cookie(SESSION_KEY, "", { ...COOKIE_CONFIG, maxAge: 0 });
};

export const generateApiToken = (user: IUser): string => {
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {});
  return token;
};
