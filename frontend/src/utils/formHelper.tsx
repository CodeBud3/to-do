import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";
import { FormConfig, InitialValue } from "@/types/auth.types";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { z } from "zod";

const defaultValueMap: { [key: string]: InitialValue } = {
  checkbox: false,
  text: "",
  password: "",
  radio: "option1",
  number: 0,
  date: new Date(),
  email: "",
  url: "",
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
          <FormLabel>{c.label}</FormLabel>
          <FormControl>
            <PasswordInput
              type={c.type}
              placeholder={c.placeholder}
              {...field}
            />
          </FormControl>
        </>
      );
    case "checkbox":
      return (
        <div className="flex flex-row-reverse justify-end space-x-2">
          <FormLabel className="text-gray-500">{c.label}</FormLabel>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            ></Checkbox>
          </FormControl>
        </div>
      );
    default:
      return (
        <>
          <FormLabel>{c.label}</FormLabel>
          <FormControl>
            <Input type={c.type} placeholder={c.placeholder} {...field} />
          </FormControl>
        </>
      );
  }
};
