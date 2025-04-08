import { combineReducers, UnknownAction } from "@reduxjs/toolkit";
import taskReducer from "@/modules/tasks/services/tasksSlice";
import formsReducer from "@/modules/forms/services/formSlice";
// add other reducers here

const appReducer = combineReducers({
  tasks: taskReducer,
  forms: formsReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: UnknownAction
) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
