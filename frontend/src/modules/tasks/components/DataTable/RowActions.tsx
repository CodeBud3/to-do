import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useSheet } from "@/contexts/SheetContext";
import TaskForm from "../TaskForm/TaskForm";
import { Row } from "@tanstack/react-table";
import { Task } from "../../types/task.types";
import { useAlertDialog } from "@/hooks/AlertDialog/useAlertDialog";
import { deleteTask } from "../../services/tasksSlice";
import { AlertDialogComponent } from "@/hooks/AlertDialog/AlertDialogComponent";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";

interface RowActionsProps {
  row: Row<Task>;
}
export function RowActions({ row }: RowActionsProps) {
  const { id, fields, sequence_num } = row.original;
  const record: Task = { id, fields, sequence_num };
  const { forms } = useSelector((state: RootState) => state.forms);
  const dispatch = useDispatch<AppDispatch>();

  const { showAlert, alertParams, closeAlert } = useAlertDialog();
  const params = {
    title: "Delete Task",
    description: "This action cannot be undone.",
    confirm: "Delete",
    cancel: "Cancel",
    onConfirm: () => {
      dispatch(deleteTask(id)).unwrap().then().catch();
    },
  };

  const { openSheet, closeSheet } = useSheet();

  return (
    <>
      <AlertDialogComponent
        {...applyTestAttributes("delete-task", "alert")}
        showAlert={showAlert}
        alertParams={alertParams}
        closeAlert={closeAlert}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              openSheet(
                <TaskForm<Task>
                  closeSheet={closeSheet}
                  taskForm={forms.taskForm}
                  action="edit-task"
                  record={record}
                />,
                "Edit Task"
              )
            }
          >
            <Pencil /> <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => showAlert(params)}>
            <Trash2 />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
