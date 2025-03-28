import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { ValidationError } from "../../../utils/ErrorHandler";
import sendResponse from "../../../utils/responseHelper";
import { generateForgotPasswordToken } from "../../auth/helpers/auth.helper";
import { sendResetEmail } from "../../../helpers/email.helper";
import { IUser } from "../types/auth.types";

export const fetchUserDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const data = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
    sendResponse(res, 200, true, "User details fetched successfully", data);
  } catch (error: any) {
    return next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.params?.email;
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      return next(new ValidationError(["User not found"]));
    }
    sendResponse(res, 200, true, "User deleted successfully");
  } catch (error: any) {
    return next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return sendResponse(
      res,
      200,
      true,
      "Please check your email for further instructions"
    );
  }
  const token = generateForgotPasswordToken(user);

  // Create Reset Link
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const params = { email, resetLink };
  return sendResetEmail(params, res, next);
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const user = req.user as IUser;
  try {
    user.password = password;
    await user.save();
    sendResponse(res, 200, true, "Password reset successfull.");
  } catch (error) {
    return next(error);
  }
};
