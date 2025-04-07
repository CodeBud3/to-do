import { Button } from "@/components/ui/button";
import {
  CellContext,
  Column,
  ColumnDef,
  HeaderContext,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Task } from "../../types/task.types";
import { Checkbox } from "@/components/ui/checkbox";
import { taskForms } from "../../configs/taskForms";
const sortButton = ({ column }: { column: Column<Task> }, label: string) => {
  // sorting to happen at server
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

const tableActionColumn = {
  id: "select",
  header: ({ table }: HeaderContext<Task, unknown>) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }: CellContext<Task, unknown>) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};
export const Columns: ColumnDef<Task>[] = [
  tableActionColumn,
  ...taskForms.fields.map((field) => {
    return {
      accessorKey: field.key,
      header: (columnObj: HeaderContext<Task, unknown>) =>
        sortButton(columnObj, field.label),
      cell: ({ row }: CellContext<Task, unknown>) => (
        <span>{row.getValue(field.key)}</span>
      ),
    };
  }),
];
