import {
  commitTransaction,
  rollBackTransaction,
  startTransaction,
} from "../../config/db";
import {
  createUserForm,
  deleteUserForm,
} from "../../modules/user/helpers/user.helpers";
import { User } from "../../modules/user/models/User";

export const up = async () => {
  try {
    console.log("Running migration: Add user forms");
    const users = await User.find();

    for (const user of users) {
      const session = await startTransaction();
      try {
        // create Task form for the user if not present
        await createUserForm(user, session);
        commitTransaction(session);
      } catch (e) {
        rollBackTransaction(session);
        console.log(`Failed to create User form for user :: ${user.id}`);
      }
    }

    console.log("Migration completed");
  } catch (e) {
    console.log("Migration failed :: ", e);
  }
};

export const down = async () => {
  try {
    console.log("Rolling back migration: Remove default tag");
    const users = await User.find();

    for (const user of users) {
      const session = await startTransaction();
      try {
        // create Task form for the user if not present
        await deleteUserForm(user.id, session);
        commitTransaction(session);
      } catch (e) {
        rollBackTransaction(session);
        console.log(`Failed to delete User form for user :: ${user.id}`);
      }
    }

    console.log("Rollback completed");
  } catch (e) {
    console.log("Migration failed :: ", e);
  }
};
