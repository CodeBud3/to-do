import { Button } from "@/components/ui/button";
import { FormFields } from "@/modules/forms/types/form.types";
import { HeaderContext } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchTasks, SortParams } from "../../services/tasksSlice";
import { cn } from "@/lib/utils";

interface SortButtonProps<T> {
  columnObj: HeaderContext<T, unknown>;
  field: FormFields;
}

export function TableSortButton<T>({ columnObj, field }: SortButtonProps<T>) {
  const { column } = columnObj;
  const { label, internalName } = field;
  const dispatch = useDispatch<AppDispatch>();
  const { currentSort } = useSelector((state: RootState) => state.tasks);
  
  // Determine if this column is currently sorted
  const isActive = currentSort?.field === internalName;
  const currentOrder = isActive ? currentSort.order : undefined;
  
  // Handle sorting click
  const handleSort = () => {
    // Toggle sorting or set initial sort
    const newOrder = !currentOrder 
      ? 'asc'
      : currentOrder === 'asc' 
        ? 'desc' 
        : 'asc';
    
    // Special handling for priority and status fields to match backend logic
    const sortParams: SortParams = {
      sort_by: internalName,
      order: newOrder
    };
    
    // Fetch tasks with new sort parameters
    dispatch(fetchTasks(sortParams));
    
    // Update local table UI state (for any client-side UI updates)
    column.toggleSorting(newOrder === 'desc');
  };
  
  return (
    <Button
      variant="ghost"
      className={cn(
        "hover:bg-muted/30", 
        isActive && "font-medium text-primary"
      )}
      onClick={handleSort}
    >
      {label}
      {!isActive && <ArrowUpDown className="ml-2 h-4 w-4" />}
      {isActive && currentOrder === 'asc' && <ArrowUpIcon className="ml-2 h-4 w-4" />}
      {isActive && currentOrder === 'desc' && <ArrowDownIcon className="ml-2 h-4 w-4" />}
    </Button>
  );
}
