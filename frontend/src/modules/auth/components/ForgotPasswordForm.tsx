"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  applyTestAttributes,
  buildSchema,
  getDefaultValues,
} from "@/modules/auth/helpers/formHelper";
import { FormElement } from "@/modules/auth/components/common/FormElement";
import { forgotPasswordConfig } from "@/modules/auth/helpers/authFormConfig";
import { AuthResponse } from "@/modules/auth/types/auth.types";
import { useState } from "react";
import { handleError } from "@/utils/errorHandler";
import { ErrorMessage } from "@/components/ui/errorMessage";
import { forgotPassword } from "@/api/user";
import { useAlertDialog } from "@/hooks/AlertDialogHook/AlertDialogHook";
import { useNavigate } from "react-router-dom";
import { AlertDialogComponent } from "@/hooks/AlertDialogHook/AlertDialogComponent";

const formSchema = z.object(buildSchema(forgotPasswordConfig));

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(forgotPasswordConfig),
  });
  const { alertParams, showAlert, closeAlert } = useAlertDialog();
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setErrors([]);
    forgotPassword(values)
      .then((data: AuthResponse) => {
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
        setErrors(handleError(error));
      });
  }
  return (
    <>
      {errors.length > 0 && (
        <ErrorMessage
          errors={errors}
          {...applyTestAttributes("forgot-password", "form-errors")}
        ></ErrorMessage>
      )}
      <FormElement
        onSubmit={onSubmit}
        form={form}
        formConfig={forgotPasswordConfig}
        submitBtnLabel="Reset Password"
        loading={loading}
      ></FormElement>
      <AlertDialogComponent
        showAlert={showAlert}
        alertParams={alertParams}
        closeAlert={closeAlert}
      />
    </>
  );
}
