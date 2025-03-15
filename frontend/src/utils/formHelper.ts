import { FormConfig, InitialValue } from "@/types/auth.types";

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
export const buildSchema = (configs: FormConfig[]) => {
  const schema: { [key: string]: any } = {};
  configs.forEach((c: FormConfig) => {
    schema[c.key] = c.validation;
  });
  return schema;
};

export const getDefaultValues = (configs: FormConfig[]) => {
  const defaults: { [key: string]: InitialValue } = {};
  configs.forEach((c: FormConfig) => {
    defaults[c.key] = c.initialValue || defaultValueMap[c.type];
  });
  return defaults;
};
