import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Loader from "@/components/ui/loader";
import { FormConfig } from "@/types/auth.types";
import { applyTestAttributes, getInputByType } from "@/utils/formHelper";
import { UseFormReturn } from "react-hook-form";

interface FormElementProps {
  onSubmit: (value: any) => void;
  form: UseFormReturn;
  formConfig: FormConfig[];
  submitBtnLabel: string;
  loading: boolean;
}
export function FormElement(props: FormElementProps) {
  const { form, onSubmit, formConfig, submitBtnLabel, loading } = props;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
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
