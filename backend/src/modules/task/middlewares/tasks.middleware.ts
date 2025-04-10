import { NextFunction, Request, Response } from "express";
import { UserForm } from "../../form/models/UserForm";
import { NotFoundError } from "../../../utils/ErrorHandler";
import { Form } from "../../form/models/Form";
import { IForm } from "../../form/types/form.types";
import { Task } from "../models/Task";

export const loadTaskForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    // Load user form for task validations
    const userForm = await UserForm.findOne({
      userId: user?._id,
      formType: "taskForm",
    });

    if (!userForm) {
      next(new NotFoundError("User form"));
    }

    const form = (await Form.findOne(userForm?.formId)) as IForm;

    if (!form) {
      next(new NotFoundError("Task Form"));
    }
    req.form = form;
    next();
  } catch (e) {
    next(e);
  }
};

export const loadTaskRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.id!;
    const user = req.user!;
    // load task based on id and user
    const taskRecord = await Task.findOne({ _id: taskId, userId: user.id });

    if (!taskRecord) {
      return next(new NotFoundError("Task"));
    }
    req.taskRecord = taskRecord;
    next();
  } catch (e) {
    next(e);
  }
};
