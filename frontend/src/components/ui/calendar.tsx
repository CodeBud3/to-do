import * as React from "react";
import { DayFlag, DayPicker, SelectionState, UI } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-2",
        month: "flex flex-col gap-4",
        [UI.MonthCaption]:
          "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1 relative",
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 top-1 z-51"
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 top-1 z-51"
        ),
        [UI.MonthGrid]: "w-full border-collapse space-x-1",
        [UI.Weekdays]: "flex",
        [UI.Weekday]:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        [UI.Week]: "flex w-full mt-2",
        [UI.Day]: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        [UI.DayButton]: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100 hover:aria-selected:bg-transparent"
        ),
        [SelectionState.range_start]:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        [SelectionState.range_end]:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        [SelectionState.selected]:
          "bg-primary text-primary-foreground hover:bg-primary z-21 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        [DayFlag.today]: "bg-accent text-accent-foreground",
        [DayFlag.outside]:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        [DayFlag.disabled]: "text-muted-foreground opacity-50",
        [SelectionState.range_middle]:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        [DayFlag.hidden]: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
