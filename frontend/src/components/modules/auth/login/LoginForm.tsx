"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  applyTestAttributes,
  buildSchema,
  getDefaultValues,
} from "@/utils/formHelper";
import { FormElement } from "@/components/modules/auth/common/FormElement";
import { loginConfig } from "@/configs/authFormConfig";
import { login } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { AuthResponse } from "@/types/auth.types";
import { useState } from "react";
import { handleError } from "@/utils/errorHandler";
import { ErrorMessage } from "@/components/ui/errorMessage";

const formSchema = z.object(buildSchema(loginConfig));

export function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { updateAuth } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(loginConfig),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setErrors([]);
    const { rememberMe, ...payload } = values;
    login(payload)
      .then((data: AuthResponse) => {
        updateAuth(data.data.user);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("failed to login", error);
        setErrors(handleError(error));
      });
  }
  return (
    <>
      {errors.length > 0 && (
        <ErrorMessage
          errors={errors}
          {...applyTestAttributes("sign-in", "form-errors")}
        ></ErrorMessage>
      )}
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
