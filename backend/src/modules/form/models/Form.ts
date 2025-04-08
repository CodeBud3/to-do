import mongoose from "mongoose";
import { IForm } from "../types/form.types";

export const fieldTypes = [
  "text",
  "textarea",
  "number",
  "datetime",
  "select",
  "checkbox",
];

const OptionsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  { minimize: false, strict: true }
);

const fieldSchema = new mongoose.Schema(
  {
    internalName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: fieldTypes,
      required: true,
    },
    options: {
      type: [OptionsSchema],
      default: [],
    },
    defaultValue: { type: String, default: "" },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: "Enter a value" },
    isDefault: { type: Boolean, default: true },
    internalUse: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true, minimize: false, strict: true }
);

const formSchema = new mongoose.Schema(
  {
    formType: { type: String, enum: ["taskForm"], required: true },
    fields: {
      type: [fieldSchema],
      default: [],
    },
  },
  { timestamps: true, minimize: false, strict: true }
);

export const Form = mongoose.model<IForm>("Form", formSchema);
