import mongoose from "mongoose";
import { User } from "../modules/user/models/User";
import { Task } from "../modules/task/models/Task";
import { testValidTasks, testValidUser } from "./testData";
import { DEFAULT_TASK_FIELDS } from "../modules/form/constants/TaskForm.constants";
import { Form } from "../modules/form/models/Form";
import { UserForm } from "../modules/form/models/UserForm";

// Create dummy data
export const setupData = async () => {
  await User.deleteMany({});
  await Task.deleteMany({});

  const user = new User(testValidUser);
  user.save();

  const form = new Form({
    userId: user._id,
    formType: "taskForm",
    fields: DEFAULT_TASK_FIELDS,
  });

  await form.save();

  const userForm = new UserForm({
    userId: user._id,
    formId: form._id,
    formType: "taskForm",
  });
  await userForm.save();

  await Task.create({ ...testValidTasks, userId: user.id });
};
