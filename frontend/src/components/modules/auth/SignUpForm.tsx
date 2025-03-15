"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { buildSchema, getDefaultValues } from "@/utils/formHelper";
import { FormElement } from "./FormElement/FormElement";
import { FormConfig } from "@/types/auth.types";

const signUpConfig: FormConfig[] = [
  {
    key: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    validation: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    group: 1,
  },
  {
    key: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    validation: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    group: 1,
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    validation: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    validation: z.string().min(6, {
      message: "Password must be at least 6 character.",
    }),
  },
  {
    key: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Enter your password",
    validation: z.string().min(6, {
      message: "Password must be at least 6 character.",
    }),
  },
  {
    key: "tnc",
    label: "I agree to the Terms of Services and Privacy Policy",
    type: "checkbox",
    validation: z.boolean().default(false).optional(),
  },
];
const formSchema = z
  .object(buildSchema(signUpConfig))
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(signUpConfig),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <FormElement
      onSubmit={onSubmit}
      form={form}
      formConfig={signUpConfig}
    ></FormElement>
  );
}
