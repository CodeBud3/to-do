import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../services/tasksSlice";
import { RootState, AppDispatch } from "../../../store/store";
import { fetchTableColumns } from "./ColumnDef/ColumnDef";
import { DataTable } from "./DataTable/DataTable";
import TaskForm from "./TaskForm/TaskForm";
import { fetchForm } from "@/modules/forms/services/formSlice";
import { ColumnDef } from "@tanstack/react-table";
import { Task, TaskField } from "../types/task.types";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/contexts/SheetContext";

export default function TasksList() {
  const { openSheet, closeSheet } = useSheet();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, currentSort } = useSelector((state: RootState) => state.tasks);
  const { forms } = useSelector((state: RootState) => state.forms);
  const columns: ColumnDef<Task>[] = useMemo(
    () => fetchTableColumns(forms.taskForm?.fields),
    [forms]
  );

  // Fetch tasks with initial sorting when component mounts
  useEffect(() => {
    // Default sort by sequence_num if no sort is set
    const initialSort = currentSort || { sort_by: 'sequence_num', order: 'asc' };
    dispatch(fetchTasks(initialSort));
    // Only run once on component mount
  }, [dispatch]);

  // Fetch form definition if not already loaded
  useEffect(() => {
    if (!forms.taskForm) {
      dispatch(fetchForm("taskForm"));
    }
  }, [dispatch, forms.taskForm]);

  return (
    <div className="container mx-auto py-7">
      {forms.taskForm && (
        <>
          <div className="table-actions flex justify-end">
            <Button
              variant="default"
              onClick={() =>
                openSheet(
                  <TaskForm<TaskField>
                    closeSheet={closeSheet}
                    taskForm={forms.taskForm}
                    action="add-task"
                  />,
                  "Add Task"
                )
              }
            >
              Add Task
            </Button>
          </div>
          <div className="py-3">
            <DataTable columns={columns} data={tasks} />
          </div>
        </>
      )}
    </div>
  );
}
