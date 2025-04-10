import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Loader from "@/components/ui/loader";
import { FormConfig } from "@/modules/auth/types/auth.types";
import {
  applyTestAttributes,
  getInputByType,
} from "@/modules/auth/helpers/formHelper";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";

interface FormElementProps<T extends FieldValues> {
  onSubmit: (values: T) => void;
  form: UseFormReturn;
  formConfig: FormConfig[];
  submitBtnLabel: string;
  loading: boolean;
}
export function FormElement<T extends FieldValues>(props: FormElementProps<T>) {
  const { form, onSubmit, formConfig, submitBtnLabel, loading } = props;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
        className="space-y-4 contents"
        noValidate
      >
        {formConfig.map((c: FormConfig) => {
          return (
            <FormField
              control={form.control}
              name={c.key}
              key={c.key}
              render={({ field }) => (
                <FormItem className="flex flex-col flex-wrap gap-x-1">
                  {getInputByType(c, field)}
                  <FormMessage {...applyTestAttributes("errormsg", c.key)} />
                </FormItem>
              )}
            />
          );
        })}
        <Button
          type="submit"
          {...applyTestAttributes("button", "submit")}
          disabled={loading}
          className="w-full"
        >
          {submitBtnLabel}
          <span>{loading && <Loader></Loader>}</span>
        </Button>
      </form>
    </Form>
  );
}
