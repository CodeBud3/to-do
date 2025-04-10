import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { FormFields } from "@/modules/forms/types/form.types";
import { fetchCellValue } from "@/modules/forms/utils/form.utils";

import { TableSortButton } from "../DataTable/TableSortButton";
import { RowActions } from "../DataTable/RowActions";
import { Task } from "../../types/task.types";

function actionsColumn() {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: CellContext<Task, unknown>) => (
      <RowActions row={row}></RowActions>
    ),
  };
}
function checkboxColumn() {
  return {
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
}

export function fetchTableColumns(fields: FormFields[]): ColumnDef<Task>[] {
  if (!fields) {
    return [];
  }
  return [
    checkboxColumn(),
    ...fields.map((field) => {
      return {
        accessorKey: field.internalName,
        header: (columnObj: HeaderContext<Task, unknown>) => (
          <TableSortButton<Task>
            columnObj={columnObj}
            field={field}
          ></TableSortButton>
        ),
        cell: ({ row }: CellContext<Task, unknown>) =>
          fetchCellValue<Task>(row, field),
      };
    }),
    actionsColumn(),
  ];
}
