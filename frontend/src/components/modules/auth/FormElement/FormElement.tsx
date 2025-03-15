import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FormConfig } from "@/types/auth.types";
import { getInputByType } from "@/utils/formHelper";
import { UseFormReturn } from "react-hook-form";

interface FormElementProps {
  onSubmit: (value: any) => void;
  form: UseFormReturn;
  formConfig: FormConfig[];
  submitBtnLabel: string;
}
export function FormElement(props: FormElementProps) {
  const { form, onSubmit, formConfig, submitBtnLabel } = props;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formConfig.map((c: FormConfig) => {
          return (
            <FormField
              control={form.control}
              name={c.key}
              key={c.key}
              render={({ field }) => (
                <FormItem className="flex flex-col flex-wrap gap-x-1">
                  {getInputByType(c, field)}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button type="submit" className="w-full">
          {submitBtnLabel}
        </Button>
      </form>
    </Form>
  );
}
