import { Provider } from "react-redux";
import { store } from "../store/store";
import TasksList from "../components/TasksList";

export default function TasksPage() {
  return (
    <Provider store={store}>
      <h2 className="font-bold text-2xl pt-4">My Tasks</h2>

      <TasksList />
    </Provider>
  );
}
