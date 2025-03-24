import jwt from "jsonwebtoken";
import { dayToMs } from "../helpers/common.helper";
import { Response } from "express";
import { IUser } from "../models/User";
import { getMongoStore } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export const SESSION_KEY = process.env.SESSION_KEY as string;
const NODE_ENV = process.env.NODE_ENV || "dev";

export const COOKIE_CONFIG: any = {
  domain: process.env.COOKIE_DOMAIN,
  path: "/",
  httpOnly: true, // Prevent XSS attacks
  secure: NODE_ENV != "dev", // HTTPS in production
  sameSite: "lax", // Prevent CSRF attacks
  maxAge: dayToMs(7),
};

export const SESSION_CONFIG: any = {
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: getMongoStore(),
  cookie: COOKIE_CONFIG,
};

export const generateToken = (user: IUser, res: Response): string => {
  const token = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie(SESSION_KEY, token, COOKIE_CONFIG);
  return token;
};
export const clearSession = (res: Response): void => {
  res.cookie(SESSION_KEY, "", { ...COOKIE_CONFIG, maxAge: 0 });
};
export const generateApiToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    {}
  );
};

export const extractProfileFromGoogle = (
  profile: any
): [string, string, string, string, string] => {
  const id = profile.id || "";
  const email = profile.emails?.[0]?.value || "";
  const firstName = profile.displayName?.split(" ")[0] || "";
  const lastName = profile.displayName?.split(" ")?.[1] || "";
  const provider = "google";
  return [id, firstName, lastName, email, provider];
};
