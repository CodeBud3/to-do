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

export function FormElement(props: any) {
  const getInputByType = (c: any, field: any) => {
    switch (c.type) {
      case "password":
        return (
          <>
            <FormLabel>{c.label}</FormLabel>
            <PasswordInput
              type={c.type}
              placeholder={c.placeholder}
              {...field}
            />
          </>
        );
      case "checkbox":
        return (
          <div className="flex flex-row-reverse justify-end space-x-2">
            <FormLabel className="text-gray-500">{c.label}</FormLabel>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            ></Checkbox>
          </div>
        );
      default:
        return (
          <>
            <FormLabel>{c.label}</FormLabel>
            <Input type={c.type} placeholder={c.placeholder} {...field} />
          </>
        );
    }
  };
  const { form, onSubmit, formConfig } = props;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formConfig.map((c: any) => {
          return (
            <FormField
              control={form.control}
              name={c.key}
              key={c.key}
              render={({ field }) => (
                <FormItem className="flex flex-col flex-wrap gap-x-1">
                  <FormControl>{getInputByType(c, field)}</FormControl>
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
