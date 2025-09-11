import { IUser } from "../modules/user/types/auth.types";

export const testValidUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "Test@001",
} as IUser;

export const testValidTasks = {
  fields: {
    title: "Creating a test task",
    description: "This is a test description. It will be used in test data",
  },
  seq_number: 0,
};
