import { z } from "zod";
import { emailValidator, nameValidator, passwordValidator } from "./validators";

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
    email: emailValidator,
    password: passwordValidator,
  }),
});
