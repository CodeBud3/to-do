import mongoose, { ClientSession } from "mongoose";
import { DEFAULT_TASK_FIELDS } from "../../form/constants/TaskForm.constants";
import { Form } from "../../form/models/Form";
import { UserForm } from "../../form/models/UserForm";
import { User } from "../models/User";
import { IUser } from "../types/auth.types";

export const createUser = async (
  userPayload: IUser,
  session: mongoose.mongo.ClientSession
): Promise<IUser> => {
  const user = new User(userPayload);
  await user.save({ session });
  await createUserForm(user, session);
  return user;
};

export const createUserForm = async (
  userDoc: IUser,
  session: mongoose.mongo.ClientSession
) => {
  const existingForm = await Form.findOne({
    userId: userDoc._id,
    formType: "taskForm",
  });
  if (!existingForm) {
    const form = new Form({
      userId: userDoc._id,
      formType: "taskForm",
      fields: DEFAULT_TASK_FIELDS,
    });

    await form.save({ session });

    // 2. Create UserForm entry
    const userForm = new UserForm({
      userId: userDoc._id,
      formId: form._id,
      formType: "taskForm",
    });
    await userForm.save({ session });
  }
};

export const deleteUserAndAssociations = async (
  email: string,
  session: ClientSession
): Promise<IUser | null> => {
  const deletedUser = await User.findOneAndDelete({ email }, { session });
  if (!deletedUser) {
    return deletedUser;
  }
  await deleteUserForm(deletedUser._id, session);
  await deleteUserTask(deletedUser._id, session);
  return deletedUser;
};

export const deleteUserForm = async (
  userId: mongoose.Types.ObjectId,
  session: ClientSession
) => {
  const userForms = await UserForm.find({ userId });
  if (userForms.length) {
    const formIds = userForms.map((uf) => uf.formId);
    await UserForm.deleteMany({ userId }, { session });
    await Form.deleteMany({ _id: { $in: formIds } }, { session });
  }
};

export const deleteUserTask = async (
  userId: mongoose.Types.ObjectId,
  session: ClientSession
) => {
  await UserForm.deleteMany({ userId }, { session });
};
