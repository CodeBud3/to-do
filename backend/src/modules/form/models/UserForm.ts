import mongoose from "mongoose";
import { IUserForm } from "../types/form.types";

const userFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    formType: { type: String, enum: ["taskForm"], required: true },
  },
  { timestamps: true }
);
userFormSchema.index({ userId: 1 });
userFormSchema.index({ userId: 1, formType: 1 }, { unique: true });

export const UserForm = mongoose.model<IUserForm>("UserForm", userFormSchema);
