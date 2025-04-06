import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/tasksSlice";
import { RootState, AppDispatch } from "../store/store";
import { Columns } from "./ColumnDef/Columns";
import { DataTable } from "./DataTable/DataTable";
import { TaskForm } from "./TaskForm/TaskForm";

export default function TasksList() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    // setData(getData());
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-7">
      <div className="table-actions flex justify-end">
        <TaskForm />
      </div>
      <div className="py-3">
        <DataTable columns={Columns} data={tasks} />
      </div>
    </div>
  );
}
