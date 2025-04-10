import ERRORS from "@/modules/errors/Error.constants";
import {
  FieldError,
  FormError,
  FormFieldError,
} from "@/modules/errors/error.types";
import { AppError, ErrorDetails } from "@/types/error.types";

export function handleAppErrors(error: AppError) {
  let errorMessage: ErrorDetails[] = [ERRORS.APP_ERROR];
  if (error.response?.data?.error?.details) {
    errorMessage = error.response.data.error.details;
  }
  return errorMessage;
}

export function handleError(errorDetails: ErrorDetails[]) {
  return buildFormErrorObject(errorDetails);
}

export const buildFormErrorObject = (
  errors: ErrorDetails[]
): FormFieldError => {
  try {
    const formErrors: FormError[] = [];
    const fieldErrors: FieldError = {};
    errors.forEach((error) => {
      const key = error.path![1];
      const message = { message: error.message, type: "manual" };
      if (key === ERRORS.FORM_ERROR_TYPE) {
        formErrors.push(message);
      } else {
        fieldErrors[key] = message;
      }
    });
    return [formErrors, fieldErrors];
  } catch {
    return [[ERRORS.FORM_ERROR], {}];
  }
};
