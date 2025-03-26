import nodemailer from "nodemailer";
import { google } from "googleapis";

const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const REDIRECT_URI = process.env.GMAIL_REDIRECT;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

interface MAIL_OPTIONS {
  from?: string;
  to: string;
  subject: string;
  title?: string;
  html?: string;
}
const DEFAULT_MAIL_OPTIONS = {
  from: process.env.EMAIL_USER,
};

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const createTransporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
  });

  return transporter;
};

export const sendEmail = async (
  mailOptions: MAIL_OPTIONS
): Promise<boolean> => {
  mailOptions = { ...DEFAULT_MAIL_OPTIONS, ...mailOptions };
  try {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error: any) {
    console.error(error.message);
    return false;
  }
};
