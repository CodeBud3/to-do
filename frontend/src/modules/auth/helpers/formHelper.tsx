import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePickerForm } from "@/components/ui/date-time-picker";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormConfig, InitialValue } from "@/modules/auth/types/auth.types";
import { ErrorDetails } from "@/types/error.types";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const defaultValueMap: { [key: string]: InitialValue } = {
  checkbox: false,
  text: "",
  textarea: "",
  password: "",
  number: 0,
  email: "",
  url: "",
};

export interface FormError {
  [key: string]: {
    message: string;
    type: "manual";
  };
}
export const buildFormErrorObject = (errors: ErrorDetails[]): FormError => {
  const formErrors: FormError = {};
  errors.forEach((error) => {
    if (error?.path) {
      const [_, key] = error.path;
      formErrors[key] = { message: error.message, type: "manual" };
    }
  });
  return formErrors;
};
export const buildSchema = <T extends string>(configs: FormConfig<T>[]) => {
  return configs.reduce((acc, c) => {
    if (c.validation) {
      acc[c.key] = c.validation;
    }
    return acc;
  }, {} as Record<T, z.ZodType<any>>);
};

export const getDefaultValues = (configs: FormConfig[]) => {
  const defaults: { [key: string]: InitialValue } = {};
  configs.forEach((c: FormConfig) => {
    defaults[c.key] = c.initialValue || defaultValueMap[c.type];
  });
  return defaults;
};

export const getInputByType = (
  c: FormConfig,
  field: ControllerRenderProps<FieldValues, string>
) => {
  switch (c.type) {
    case "password":
      return (
        <>
          <FormLabel
            className="flex justify-between"
            {...applyTestAttributes("label", c.key)}
          >
            {c.label}
            {c.config?.forgotPassword && (
              <Link
                to="/forgot-password"
                {...applyTestAttributes("forgot-password", "link")}
              >
                <div className="text-sm text-gray-500">{c.config.label}</div>
              </Link>
            )}
          </FormLabel>
          <FormControl>
            <PasswordInput
              type={c.type}
              placeholder={c.placeholder}
              visibilityKey={c.key}
              {...field}
              {...applyTestAttributes("field", c.key)}
            />
          </FormControl>
        </>
      );
    case "checkbox":
      return (
        <div className="flex flex-row-reverse justify-end space-x-2">
          <FormLabel
            {...applyTestAttributes("label", c.key)}
            className="text-gray-500"
          >
            {c.label}
          </FormLabel>
          <FormControl>
            <Checkbox
              {...applyTestAttributes("field", c.key)}
              checked={field.value}
              onCheckedChange={field.onChange}
            ></Checkbox>
          </FormControl>
        </div>
      );
    case "textarea":
      return (
        <>
          <FormLabel {...applyTestAttributes("label", c.key)}>
            {c.label}
          </FormLabel>
          <FormControl>
            <Textarea
              {...applyTestAttributes("field", c.key)}
              placeholder={c.placeholder}
              {...field}
            />
          </FormControl>
        </>
      );
    case "select":
      return (
        <>
          <FormLabel {...applyTestAttributes("label", c.key)}>
            {c.label}
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={c.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {c.options?.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </>
      );
    case "datetime":
      return (
        <>
          <FormLabel {...applyTestAttributes("label", c.key)}>
            {c.label}
          </FormLabel>
          <FormControl>
            <DateTimePickerForm
              handleChange={field.onChange}
              value={field.value}
            />
          </FormControl>
        </>
      );
    default:
      return (
        <>
          <FormLabel {...applyTestAttributes("label", c.key)}>
            {c.label}
          </FormLabel>
          <FormControl>
            <Input
              {...applyTestAttributes("field", c.key)}
              type={c.type}
              placeholder={c.placeholder}
              {...field}
            />
          </FormControl>
        </>
      );
  }
};

export const applyTestAttributes = (
  type: string,
  key: string
): { [key: string]: boolean | string } => {
  return {
    [`data-test-${type.toLowerCase()}-${key.toLowerCase()}`]: true,
    "data-testid": `${type.toLowerCase()}-${key.toLowerCase()}`,
  };
};
