"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { buildSchema, getDefaultValues } from "@/utils/formHelper";
import { FormElement } from "./FormElement/FormElement";

const signUpConfig = [
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    value: "",
    validation: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    value: "",
    validation: z.string().min(1, {
      message: "Password must be at least 1 character.",
    }),
  },
];
const formSchema = z.object(buildSchema(signUpConfig));

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
