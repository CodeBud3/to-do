import { FormConfig } from "@/modules/auth/types/auth.types";
import { requiredValidator } from "@/modules/auth/helpers/validators";
import { taskForms } from "./taskForms";
import { z } from "zod";

type FieldKey = (typeof taskForms.fields)[number]["key"];

export const taskFormConfig: FormConfig<FieldKey>[] = taskForms.fields.map(
  (field) => {
    return {
      ...field,
      options: field.choices,
      initialValue: field.default,
      validation: field.required ? requiredValidator(field.label) : z.any(),
    };
  }
);
