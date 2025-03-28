import { z } from "zod";
import {
  emailValidator,
  passwordValidator,
} from "../../auth/validators/validators";

export const emailParamsSchema = z.object({
  params: z.object({
    email: emailValidator,
  }),
});

export const emailSchema = z.object({
  body: z.object({
    email: emailValidator,
  }),
});

export const passwordSchema = z.object({
  body: z.object({
    password: passwordValidator,
  }),
});
