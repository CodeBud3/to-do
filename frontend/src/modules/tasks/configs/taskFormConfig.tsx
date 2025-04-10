import { FormConfig } from "@/modules/auth/types/auth.types";
import { requiredValidator } from "@/modules/auth/helpers/validators";
import { z } from "zod";
import { FormFields } from "@/modules/forms/types/form.types";

export const buildFormConfig = (fields: FormFields[]): FormConfig<string>[] => {
  return fields.map((field) => {
    return {
      ...field,
      key: field.internalName,
      initialValue: field.defaultValue,
      options: field.options ? Object.values(field?.options) : [],
      validation: field.required ? requiredValidator(field.label) : z.any(),
    };
  });
};
