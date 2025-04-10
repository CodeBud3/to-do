import { Button } from "@/components/ui/button";
import { FormFields } from "@/modules/forms/types/form.types";
import { HeaderContext } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

interface SortButtonProps<T> {
  columnObj: HeaderContext<T, unknown>;
  field: FormFields;
}
export function TableSortButton<T>({ columnObj, field }: SortButtonProps<T>) {
  const { column } = columnObj;
  const { label } = field;
  // sorting to happen at server
  return (
    <Button
      variant="ghost"
      className=""
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
