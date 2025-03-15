import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { buildSchema, getDefaultValues } from "@/utils/formHelper";
import { FormElement } from "./FormElement/FormElement";
import { register } from "@/api/auth";
import { signUpConfig } from "./config";
import { useEffect } from "react";

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

  const passwordWatcher = form.watch("password");
  useEffect(() => {
    // validate only if confirmPassword is dirty.
    if (form.formState.dirtyFields.confirmPassword) {
      console.log("Triggering confirm password validation");
      form.trigger("confirmPassword");
    }
  }, [passwordWatcher, form.trigger]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { confirmPassword, ...payload } = values;
    register(payload)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <FormElement
      onSubmit={onSubmit}
      form={form}
      formConfig={signUpConfig}
      submitBtnLabel="Create account"
    ></FormElement>
  );
}
