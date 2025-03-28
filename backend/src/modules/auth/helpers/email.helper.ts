import { NextFunction, Response } from "express";
import { sendEmail } from "../../../config/mailer";
import sendResponse from "../../../utils/responseHelper";

export const sendResetEmail = async (
  params: any,
  res: Response,
  next: NextFunction
) => {
  const mail_options = {
    subject: "Password Reset Request",
    to: params.email,
    text: `Click the link to reset your password: ${params.resetLink}`,
    html: `<p>Click <a href="${params.resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
  };
  const status = await sendEmail(mail_options);
  if (status) {
    sendResponse(
      res,
      200,
      true,
      "Please check your email for further instructions."
    );
  } else {
    next(new Error("Failed to send password reset email."));
  }
};
