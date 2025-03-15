"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { buildSchema, getDefaultValues } from "@/utils/formHelper";
import { FormElement } from "./FormElement/FormElement";
import { loginConfig } from "./config";
import { getLoggedInUser, login } from "@/api/auth";

const formSchema = z.object(buildSchema(loginConfig));

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(loginConfig),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { rememberMe, ...payload } = values;
    login(payload)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const verifyLogin = () => {
    console.log("Verifying login...");
    // Add verification logic here
    getLoggedInUser()
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <FormElement
        onSubmit={onSubmit}
        form={form}
        formConfig={loginConfig}
        submitBtnLabel="Sign in"
      ></FormElement>
      <button onClick={verifyLogin}>Verify</button>
    </>
  );
}
