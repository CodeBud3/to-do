import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  applyTestAttributes,
  buildSchema,
  getDefaultValues,
} from "@/modules/auth/helpers/formHelper";
import { FormElement } from "@/modules/auth/components/common/FormElement";
import { register } from "@/modules/auth/services/auth.service";
import { signUpConfig } from "@/modules/auth/helpers/authFormConfig";
import { useEffect, useState } from "react";
import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { handleError } from "@/utils/errorHandler";
import { ErrorMessage } from "@/components/ui/errorMessage";

const formSchema = z
  .object(buildSchema(signUpConfig))
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export function SignUpForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(signUpConfig),
  });
  const { updateAuth } = useAuth();
  const passwordWatcher = form.watch("password");
  useEffect(() => {
    // validate only if confirmPassword is dirty.
    if (form.formState.dirtyFields.confirmPassword) {
      form.trigger("confirmPassword");
    }
  }, [passwordWatcher, form.trigger]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setErrors([]);
    const { confirmPassword, ...payload } = values;
    register(payload)
      .then((data) => {
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
          {...applyTestAttributes("sign-up", "form-errors")}
          errors={errors}
        ></ErrorMessage>
      )}
      <FormElement
        onSubmit={onSubmit}
        form={form}
        formConfig={signUpConfig}
        submitBtnLabel="Create account"
        loading={loading}
      ></FormElement>
    </>
  );
}
