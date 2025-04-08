import { FieldType, Task } from "@/modules/tasks/types/task.types";
import { FormFields } from "../types/form.types";
import { Row } from "@tanstack/react-table";
import { format } from "date-fns";

export const fetchRowValueByFieldType = (
  value: FieldType,
  field: FormFields
): string => {
  switch (field.type) {
    case "select":
      if (field.options?.length) {
        const [choice] = field.options.filter((opt) => opt.key === value);
        return choice ? choice.label : "--";
      }
      return "--";
    case "datetime":
      return typeof value === "string"
        ? format(new Date(value), "MM/dd/yyyy HH:mm")
        : "--";
    default:
      return value ? value.toString() : "--";
  }
};
export const fetchCellValue = (row: Row<Task>, field: FormFields) => {
  const taskFields = row.original.fields;
  const rowValue = taskFields[field.internalName];
  return <span>{fetchRowValueByFieldType(rowValue, field)}</span>;
};
