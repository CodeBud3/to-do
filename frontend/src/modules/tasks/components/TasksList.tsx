import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/tasksSlice";
import { RootState, AppDispatch } from "../store/store";
import { Columns } from "./ColumnDef/Columns";
import { DataTable } from "./DataTable/DataTable";

export default function TasksList() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    // setData(getData());
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div>
      {loading && <p>Loading tasks...</p>}
      {error && <p>Error: {error}</p>}
      <div className="container mx-auto py-10">
        <DataTable columns={Columns} data={tasks} />
      </div>
    </div>
  );
}
