import { z, ZodString, ZodTypeAny } from "zod";
import { IFormFields } from "../types/form.types";

export const buildZodSchema = (fields: IFormFields[]) => {
  const shape: Record<string, ZodTypeAny> = {};
  for (const field of fields) {
    const key = field.internalName;
    let baseSchema: ZodTypeAny;

    switch (field.type) {
      case "text":
        baseSchema = z
          .string({
            required_error: `${field.label} is required.`,
            invalid_type_error: `${field.label} must be a string.`,
          })
          .max(255, `${field.label} is too long.`);
        break;

      case "textarea":
        baseSchema = z
          .string({ invalid_type_error: `${field.label} must be a string.` })
          .max(1000, `${field.label} is too long.`);
        break;

      case "number":
        baseSchema = z
          .preprocess((val) => Number(val), z.number())
          .refine((val) => !isNaN(val), {
            message: `Invalid value for ${field.label}.`,
          });
        break;

      case "datetime":
        baseSchema = z
          .string({
            invalid_type_error: `${field.label} must be a datetime string.`,
          })
          .datetime({ message: `Invalid value for ${field.label}.` })
          .transform((val) => new Date(val));
        break;

      case "select":
        if (field.options && Object.keys(field.options).length > 0) {
          const choiceKeys = field.options.map((opt) => opt.key);
          baseSchema = z.enum([...(choiceKeys as [string, ...string[]])]);
        } else {
          baseSchema = z.string();
        }
        break;

      default:
        baseSchema = z.any();
    }

    if (!field.required) {
      baseSchema = baseSchema.optional();
    } else {
      baseSchema = (baseSchema as ZodString).min(
        1,
        `${field.label} is required.`
      );
    }

    shape[key] = baseSchema;
  }

  return z.object(shape).strict({ message: "Unknown fields in request body" }); // Disallow unexpected keys
};
