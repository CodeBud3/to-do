import { Document, Types } from "mongoose";

export type FormType = "taskForm";
export interface IUserForm extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  formId: Types.ObjectId;
  formType: FormType;
}

export interface IForm extends Document {
  _id: Types.ObjectId;
  formType: FormType;
  fields: IFormFields[];
  createdBy: Types.ObjectId;
}

export interface IFormFields {
  internalName: string;
  label: string;
  type: string;
  options?: IFormFieldOptions[];
  required?: boolean;
  placeholder?: string;
  isDefault?: boolean;
  defaultValue?: string;
  internalUse?: boolean;
  hidden?: boolean;
}

export interface IFormFieldOptions {
  key: string;
  label: string;
}
