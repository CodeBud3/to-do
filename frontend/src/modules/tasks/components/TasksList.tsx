import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../services/tasksSlice";
import { RootState, AppDispatch } from "../../../store/store";
import { fetchTableColumns } from "./ColumnDef/ColumnDef";
import { DataTable } from "./DataTable/DataTable";
import { TaskForm } from "./TaskForm/TaskForm";
import { fetchForm } from "@/modules/forms/services/formSlice";
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "../types/task.types";

export default function TasksList() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { forms } = useSelector((state: RootState) => state.forms);
  const columns: ColumnDef<Task>[] = useMemo(
    () => fetchTableColumns(forms.taskForm?.fields),
    [forms]
  );
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

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
            <TaskForm taskForm={forms.taskForm} />
          </div>
          <div className="py-3">
            <DataTable columns={columns} data={tasks} />
          </div>
        </>
      )}
    </div>
  );
}
