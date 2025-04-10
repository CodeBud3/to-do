import { InputType } from "@/modules/auth/types/auth.types";

export interface FormResponse {
  data: Form;
}

export interface Form {
  _id: string;
  formType: string;
  fields: FormFields[];
  createdBy: string;
}

export interface FormFields {
  internalName: string;
  label: string;
  type: InputType;
  options?: FormFieldOptions[];
  required: boolean;
  placeholder: string;
  defaultValue: string;
  isDefault: boolean;
  internalUse?: boolean;
  hidden?: boolean;
}

export interface FormFieldOptions {
  key: string;
  label: string;
}
