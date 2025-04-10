import { NextFunction, Request, Response } from "express";
import { UserForm } from "../models/UserForm";
import { NotFoundError } from "../../../utils/ErrorHandler";
import { Form } from "../models/Form";
import sendResponse from "../../../utils/responseHelper";

export const fetchTaskForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userForm = await UserForm.findOne({
      userId: req?.user?._id,
      formType: "taskForm",
    });
    if (!userForm) {
      return next(new NotFoundError("TaskForm"));
    }
    const taskForm = await Form.findById(userForm.formId);
    if (!taskForm) {
      return next(new NotFoundError("TaskForm"));
    }
    sendResponse(res, 200, true, "Task form fetched successfully", taskForm);
  } catch (error: any) {
    return next(error);
  }
};
