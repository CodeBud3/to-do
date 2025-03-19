"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { buildSchema, getDefaultValues } from "@/utils/formHelper";
import { FormElement } from "./FormElement/FormElement";
import { loginConfig } from "./config";
import { login } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { AuthResponse } from "@/types/auth.types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = z.object(buildSchema(loginConfig));

export function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateAuth } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(loginConfig),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setLoading(true);
    const { rememberMe, ...payload } = values;
    login(payload)
      .then((data: AuthResponse) => {
        updateAuth(data.data.user);
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
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
        loading={loading}
      ></FormElement>
    </>
  );
}
