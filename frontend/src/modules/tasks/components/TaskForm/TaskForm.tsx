import {
  applyTestAttributes,
  buildSchema,
  displayErrors,
  getDefaultValues,
} from "@/modules/auth/helpers/formHelper";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ErrorMessage } from "@/components/ui/errorMessage";
import { FormElement } from "@/modules/auth/components/common/FormElement";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/store";
import { Form } from "@/modules/forms/types/form.types";
import { buildFormConfig } from "../../configs/taskFormConfig";
import { FormError } from "@/modules/errors/error.types";
import { addTask, updateTask } from "../../services/tasksSlice";
import { Task } from "../../types/task.types";

interface TaskFormProps<T> {
  taskForm: Form;
  closeSheet: () => void;
  action: "add-task" | "edit-task";
  record?: T;
}
function extractFields<T extends Task | undefined>(record: T, action: string) {
  let fields = null;
  if (record?.fields && action == "edit-task") {
    fields = record.fields;
  }
  return fields;
}

function TaskForm<T>({
  taskForm,
  closeSheet,
  action,
  record,
}: TaskFormProps<T>) {
  const taskFormConfig = buildFormConfig(taskForm.fields);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormError[] | []>([]);
  const formSchema = z.object(buildSchema(taskFormConfig));
  const fields = extractFields<T>(record, action);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields ? fields : getDefaultValues(taskFormConfig),
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      const dispatchAction = (values: z.infer<typeof formSchema>) => {
        switch (action) {
          case "edit-task": {
            const payload = { ...record, fields: values } as Task;
            return dispatch(updateTask(payload));
          }
          case "add-task": {
            const payload = values;
            return dispatch(addTask(payload));
          }
        }
      };
      setLoading(true);
      setErrors([]);
      dispatchAction(values)
        .unwrap()
        .then(() => {
          setLoading(false);
          closeSheet();
        })
        .catch((error) => {
          displayErrors(error, form, setErrors);
          setLoading(false);
        });
    },
    [action, record, dispatch, closeSheet, form]
  );

  return (
    <>
      <div className="tasks-form">
        {errors.length > 0 && (
          <ErrorMessage
            className="mt-0"
            errors={errors}
            {...applyTestAttributes("add-task", "form-errors")}
          ></ErrorMessage>
        )}
        <FormElement
          onSubmit={onSubmit}
          form={form}
          formConfig={taskFormConfig}
          submitBtnLabel="Save"
          loading={loading}
        ></FormElement>
      </div>
    </>
  );
}

export default React.memo(TaskForm) as <T>(
  props: TaskFormProps<T>
) => React.ReactNode;
