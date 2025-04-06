import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { taskFormConfig } from "../../configs/taskFormConfig";
import {
  applyTestAttributes,
  buildSchema,
  getDefaultValues,
} from "@/modules/auth/helpers/formHelper";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ErrorMessage } from "@/components/ui/errorMessage";
import { FormElement } from "@/modules/auth/components/common/FormElement";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addTask } from "../../store/tasksSlice";
import { Task } from "../../types/task.types";

const formSchema = z.object(buildSchema(taskFormConfig));

export function TaskForm() {
  const dispatch = useDispatch<AppDispatch>();
  // const { tasks } = useSelector((state: RootState) => state.tasks);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[] | []>([]);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(taskFormConfig),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const payload = values as Task;

    setErrors(["Error"]);
    setErrors([]);
    dispatch(addTask(payload))
      .then(() => {
        setLoading(false);
        setOpenSheet(false);
      })
      .catch((e) => console.error(e));
  }
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
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
}
