import { FormConfig } from "@/types/auth.types";
import {
  confirmPasswordValidator,
  emailValidator,
  nameValidator,
  passwordValidator,
  requiredValidator,
  tncValidator,
} from "@/utils/validators";
import { z } from "zod";

export const signUpConfig: FormConfig<
  "firstName" | "lastName" | "email" | "password" | "confirmPassword" | "tnc"
>[] = [
  {
    key: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    validation: requiredValidator("First name").and(nameValidator),
    group: 1,
  },
  {
    key: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    validation: requiredValidator("Last name").and(nameValidator),
    group: 1,
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    validation: requiredValidator("Email").and(emailValidator),
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    validation: requiredValidator("Password").and(passwordValidator),
  },
  {
    key: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Enter your password",
    validation: confirmPasswordValidator,
  },
  {
    key: "tnc",
    label: "I agree to the Terms of Service and Privacy Policy",
    type: "checkbox",
    validation: tncValidator,
  },
];

export const loginConfig: FormConfig<"email" | "password" | "rememberMe">[] = [
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    validation: requiredValidator("Email").and(emailValidator),
  },
  {
    key: "password",
    label: "Password",
    config: { forgotPassword: true, label: "Forgot Password?" },
    type: "password",
    placeholder: "Enter your password",
    validation: requiredValidator("Password"),
  },
  {
    key: "rememberMe",
    label: "Remember Me",
    type: "checkbox",
    validation: z.boolean().default(false).optional(),
  },
];

export const forgotPasswordConfig: FormConfig<"email">[] = [
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    validation: requiredValidator("Email").and(emailValidator),
  },
];

export const resetPasswordConfig: FormConfig<"password" | "confirmPassword">[] =
  [
    {
      key: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      validation: requiredValidator("Password").and(passwordValidator),
    },
    {
      key: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Enter your password",
      validation: confirmPasswordValidator,
    },
  ];
