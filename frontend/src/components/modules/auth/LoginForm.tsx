"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { buildSchema, getDefaultValues } from "@/utils/formHelper";
import { FormElement } from "./FormElement/FormElement";
import { loginConfig } from "./config";
import { getLoggedInUser, login } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { AuthResponse, UserData } from "@/types/auth.types";
import { useNavigate } from "react-router-dom";

const formSchema = z.object(buildSchema(loginConfig));

export function LoginForm() {
  const { updateAuth } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(loginConfig),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { rememberMe, ...payload } = values;
    login(payload)
      .then((data: AuthResponse) => {
        updateAuth(data.data.user);
        navigate("/");
      })
      .catch((error) => {
        console.log("failed to login", error);
      });
  }
  return (
    <>
      <FormElement
        onSubmit={onSubmit}
        form={form}
        formConfig={loginConfig}
        submitBtnLabel="Sign in"
      ></FormElement>
    </>
  );
}
