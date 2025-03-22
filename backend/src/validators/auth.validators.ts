import { z } from "zod";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  requiredValidator,
} from "./validators";

export const registerSchema = z.object({
  body: z.object({
    firstName: nameValidator,
    lastName: nameValidator,
    email: emailValidator,
    password: passwordValidator,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: requiredValidator("Email"),
    password: requiredValidator("Password"),
  }),
});

export const emailSchema = z.object({
  params: z.object({
    email: emailValidator,
  }),
});
