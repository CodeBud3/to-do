import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";
import { FormConfig } from "@/types/auth.types";
import {
  ControllerRenderProps,
  UseFormReturn,
  type FieldValues,
} from "react-hook-form";

interface FormElementProps {
  onSubmit: (value: any) => void;
  form: UseFormReturn;
  formConfig: FormConfig[];
}
export function FormElement(props: FormElementProps) {
  const getInputByType = (
    c: FormConfig,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    switch (c.type) {
      case "password":
        return (
          <>
            <FormLabel>{c.label}</FormLabel>
            <FormControl>
              <PasswordInput
                type={c.type}
                placeholder={c.placeholder}
                {...field}
              />
            </FormControl>
          </>
        );
      case "checkbox":
        return (
          <div className="flex flex-row-reverse justify-end space-x-2">
            <FormLabel className="text-gray-500">{c.label}</FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              ></Checkbox>
            </FormControl>
          </div>
        );
      default:
        return (
          <>
            <FormLabel>{c.label}</FormLabel>
            <FormControl>
              <Input type={c.type} placeholder={c.placeholder} {...field} />
            </FormControl>
          </>
        );
    }
  };
  const { form, onSubmit, formConfig } = props;
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
          Sign In
        </Button>
      </form>
    </Form>
  );
}
