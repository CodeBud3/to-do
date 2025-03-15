export const buildSchema = (configs: any) => {
  const schema: any = {};
  configs.forEach((c: any) => {
    schema[c.key] = c.validation;
  });
  return schema;
};

export const getDefaultValues = (configs: any) => {
  const defaults: any = {};
  configs.forEach((c: any) => {
    defaults[c.key] = c.value;
  });
  return defaults;
};
