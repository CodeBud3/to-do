import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  applyTestAttributes,
  buildSchema,
  getDefaultValues,
} from "@/modules/auth/helpers/formHelper";
import { FormElement } from "@/modules/auth/components/common/FormElement";
import { loginConfig } from "@/modules/auth/helpers/authFormConfig";
import { login } from "@/modules/auth/services/auth.service";
import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { AuthResponse } from "@/modules/auth/types/auth.types";
import { useEffect, useState } from "react";
import { handleError } from "@/utils/errorHandler";
import { ErrorMessage } from "@/components/ui/errorMessage";
import { passwordValidator } from "@/modules/auth/helpers/validators";

const formSchema = z.object(buildSchema(loginConfig));

export function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { updateAuth } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(loginConfig),
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail") || "";
    if (savedEmail) {
      form.setValue("email", savedEmail);
      form.setValue("rememberMe", true);
    }
  }, []);
  const validateOnSubmit = (values: z.infer<typeof formSchema>) => {
    const fullSchema = formSchema.extend({
      password: passwordValidator,
    });

    const result = fullSchema.safeParse(values);
    return result;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setErrors([]);
    const result = validateOnSubmit(values);
    if (!result.success) {
      setErrors(["Incorrect email or password."]);
      setLoading(false);
      return;
    }
    const { rememberMe, ...payload } = values;
    rememberMe && localStorage.setItem("rememberedEmail", payload.email);
    !rememberMe && localStorage.removeItem("rememberedEmail");
    login(payload)
      .then((data: AuthResponse) => {
        updateAuth(data.data.user);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
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
