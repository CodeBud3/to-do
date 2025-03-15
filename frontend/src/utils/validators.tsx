import { z } from "zod";

export const requiredValidator = (label: string) =>
  z.string().min(1, { message: `${label} is required` });

export const nameValidator = z
  .string()
  .trim()
  .min(2, { message: "Must be at least 2 characters long." })
  .max(50, { message: "Cannot exceed 50 characters." })
  .regex(/^[a-zA-Z-' ]+$/, {
    message:
      "Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
  });

export const emailValidator = z
  .string()
  .trim()
  .email({ message: "Enter a valid email address." })
  .max(100, { message: "Email cannot exceed 100 characters." });

export const passwordValidator = z
  .string()
  .trim()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(64, { message: "Password cannot exceed 64 characters." })
  .regex(/[A-Z]/, {
    message: "Must include at least one uppercase letter (A-Z).",
  })
  .regex(/[a-z]/, {
    message: "Must include at least one lowercase letter (a-z).",
  })
  .regex(/\d/, { message: "Must include at least one number (0-9)." })
  .regex(/[@$!%*?&]/, {
    message: "Must include at least one special character (@$!%*?&).",
  });

export const confirmPasswordValidator = z
  .string()
  .min(1, { message: "Please confirm your password." });

export const phoneNumberValidator = z.string();
export const tncValidator = z.boolean().refine((val) => val === true, {
  message: "You must agree to the Terms and Conditions.",
});
