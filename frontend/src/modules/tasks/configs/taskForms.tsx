import { InputType } from "@/modules/auth/types/auth.types";

export interface TaskFormType {
  id: string;
  formType: "taskForm";
  fields: FieldType[];
}

export interface ChoiceType {
  id: string;
  key: string;
  label: string;
}
export interface FieldType {
  id: string;
  key: string;
  label: string;
  type: InputType;
  placeholder: string;
  required?: boolean;
  default?: string;
  choices?: ChoiceType[];
}
export const taskForms: TaskFormType = {
  id: "formId1",
  formType: "taskForm",
  fields: [
    {
      id: "fieldId1",
      key: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      required: true,
    },
    {
      id: "fieldId3",
      key: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
      required: false,
    },
    {
      id: "fieldId4",
      key: "priority",
      label: "Priority",
      type: "select",
      placeholder: "Select priority",
      default: "medium",
      required: false,
      choices: [
        { id: "choice1", key: "high", label: "High" },
        { id: "choice2", key: "medium", label: "Medium" },
        { id: "choice3", key: "low", label: "Low" },
      ],
    },
    {
      id: "fieldId5",
      key: "status",
      label: "Status",
      type: "select",
      placeholder: "Select status",
      default: "todo",
      required: false,
      choices: [
        { id: "choice1", key: "todo", label: "To do" },
        { id: "choice2", key: "in-progress", label: "In progress" },
        { id: "choice3", key: "completed", label: "Completed" },
        { id: "choice4", key: "backLog", label: "Back Log" },
      ],
    },
    {
      id: "fieldId6",
      key: "due_data",
      label: "Due date",
      type: "datetime",
      placeholder: "Choose date & time",
      required: false,
    },
    {
      id: "fieldId7",
      key: "tags",
      label: "Tags",
      type: "multiselect",
      placeholder: "Select tags",
      required: false,
      choices: [
        { id: "choice1", key: "work", label: "Work" },
        { id: "choice2", key: "personal", label: "Personal" },
        { id: "choice3", key: "errands", label: "Errands" },
      ],
    },
  ],
};
