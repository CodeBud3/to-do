import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  applyTestAttributes,
  buildSchema,
  displayErrors,
  getDefaultValues,
} from "@/modules/auth/helpers/formHelper";
import { FormElement } from "@/modules/auth/components/common/FormElement";
import { resetPasswordConfig } from "@/modules/auth/helpers/authFormConfig";
import { useEffect, useState } from "react";
import { ErrorMessage } from "@/components/ui/errorMessage";
import { resetPassword } from "@/modules/auth/services/user";
import { useNavigate } from "react-router-dom";
import { AlertDialogComponent } from "@/hooks/AlertDialog/AlertDialogComponent";
import { useAlertDialog } from "@/hooks/AlertDialog/useAlertDialog";
import { FormError } from "@/modules/errors/error.types";

interface ResetPasswordProps {
  token: string;
}

const formSchema = z
  .object(buildSchema(resetPasswordConfig))
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export function ResetPasswordForm({ token }: ResetPasswordProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormError[]>([]);
  const { alertParams, showAlert, closeAlert } = useAlertDialog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(resetPasswordConfig),
  });
  const navigate = useNavigate();
  const passwordWatcher = form.watch("password");
  useEffect(() => {
    // validate only if confirmPassword is dirty.
    if (form.formState.dirtyFields.confirmPassword) {
      form.trigger("confirmPassword");
    }
  }, [passwordWatcher, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setErrors([]);
    const payload = { ...values };
    delete payload.confirmPassword;
    resetPassword(payload, token)
      .then((data) => {
        setLoading(false);
        const params = {
          title: "Password Reset",
          description: data.message,
          confirm: "Confirm",
          cancel: false,
          onConfirm: () => {
            navigate("/login");
          },
        };
        showAlert(params);
      })
      .catch((error) => {
        setLoading(false);
        displayErrors(error, form, setErrors);
      });
  }
  return (
    <>
      {errors.length > 0 && (
        <ErrorMessage
          {...applyTestAttributes("reset-password", "form-errors")}
          errors={errors}
        ></ErrorMessage>
      )}
      <FormElement
        onSubmit={onSubmit}
        form={form}
        formConfig={resetPasswordConfig}
        submitBtnLabel="Save"
        loading={loading}
      ></FormElement>
      <AlertDialogComponent
        showAlert={showAlert}
        alertParams={alertParams}
        closeAlert={closeAlert}
        {...applyTestAttributes("reset-password", "alert")}
      />
    </>
  );
}
