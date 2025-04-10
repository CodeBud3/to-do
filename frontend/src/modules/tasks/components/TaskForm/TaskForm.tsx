import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { addTask } from "../../services/tasksSlice";
import { Form } from "@/modules/forms/types/form.types";
import { buildFormConfig } from "../../configs/taskFormConfig";
import { FormError } from "@/modules/errors/error.types";

interface TaskFormProps {
  taskForm: Form;
}
export const TaskForm = React.memo(({ taskForm }: TaskFormProps) => {
  const taskFormConfig = buildFormConfig(taskForm.fields);
  const dispatch = useDispatch<AppDispatch>();
  // const { tasks } = useSelector((state: RootState) => state.tasks);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormError[] | []>([]);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const formSchema = z.object(buildSchema(taskFormConfig));
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(taskFormConfig),
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const payload = values;
      setErrors([]);
      dispatch(addTask(payload))
        .unwrap()
        .then(() => {
          setLoading(false);
          setOpenSheet(false);
        })
        .catch((error) => {
          displayErrors(error, form, setErrors);
          setLoading(false);
        });
    },
    [form, dispatch]
  );

  const sheetStatusChange = (open: boolean) => {
    setOpenSheet(open);
    form.reset();
  };

  return (
    <Sheet open={openSheet} onOpenChange={sheetStatusChange}>
      <SheetTrigger asChild>
        <Button variant="default">Add Task</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Task</SheetTitle>
          {/* <SheetDescription></SheetDescription> */}
        </SheetHeader>
        <div className="tasks-form">
          {errors.length > 0 && (
            <ErrorMessage
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
      </SheetContent>
    </Sheet>
  );
});
