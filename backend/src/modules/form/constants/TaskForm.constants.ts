import { IFormFields } from "../types/form.types";

export const DEFAULT_TASK_FIELDS: IFormFields[] = [
  {
    internalName: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter title",
    required: true,
  },
  {
    internalName: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter description",
    required: false,
  },
  {
    internalName: "priority",
    label: "Priority",
    type: "select",
    placeholder: "Select priority",
    defaultValue: "medium",
    required: false,
    options: [
      { key: "high", label: "High" },
      { key: "medium", label: "Medium" },
      { key: "low", label: "Low" },
    ],
  },
  {
    internalName: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    defaultValue: "to_do",
    required: false,
    options: [
      { key: "to_do", label: "To do" },
      { key: "in_progress", label: "In progress" },
      { key: "completed", label: "Completed" },
      { key: "back_log", label: "Back Log" },
    ],
  },
  {
    internalName: "due_date",
    label: "Due date",
    type: "datetime",
    placeholder: "Choose date & time",
    required: false,
  },
  {
    internalName: "tag",
    label: "Tag",
    type: "select",
    placeholder: "Select tags",
    required: false,
    options: [
      { key: "work", label: "Work" },
      { key: "personal", label: "Personal" },
      { key: "errands", label: "Errands" },
    ],
  },
  {
    internalName: "matrix",
    label: "Matrix",
    type: "select",
    placeholder: "Select matrix",
    defaultValue: "not_urgent_important",
    required: false,
    options: [
      {
        key: "urgent_important",
        label: "Urgent and important",
      },
      {
        key: "not_urgent_important",
        label: "Not urgent and important",
      },
      {
        key: "urgent_not_important",
        label: "Urgent and not important",
      },
      {
        key: "not_urgent_not_important",
        label: "Not urgent and not important",
      },
    ],
  },
];
