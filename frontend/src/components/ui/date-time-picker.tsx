import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";

interface DateTimePickerFormProps {
  value: string;
  handleChange: (date: string) => void;
}
export function DateTimePickerForm(props: DateTimePickerFormProps) {
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [openPopOver, setOpenPopOver] = useState<boolean>(false);

  const onCancel = () => {
    setOpenPopOver(false);
  };

  const onSave = () => {
    props.handleChange(dateTime.toISOString());
    setOpenPopOver(false);
  };
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      setDateTime(date);
    }
  }

  useEffect(() => {
    if (props.value) {
      setDateTime(new Date(props.value));
    }
  }, [props.value]);

  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = dateTime;
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    setDateTime(newDate);
  }

  return (
    <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
      <PopoverTrigger asChild>
        <Button
          {...applyTestAttributes("date-time", "trigger")}
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !dateTime && "text-muted-foreground"
          )}
          onClick={() => setOpenPopOver(true)}
        >
          {props.value ? (
            format(new Date(props.value), "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <div>
            <Calendar
              mode="single"
              selected={dateTime}
              onSelect={handleDateSelect}
              initialFocus
            />
            <div className="flex gap-3 justify-center">
              <Button
                {...applyTestAttributes("date-time", "cancel")}
                onClick={onCancel}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                {...applyTestAttributes("date-time", "save")}
                onClick={onSave}
                variant="default"
              >
                Save
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i + 1)
                  .reverse()
                  .map((hour) => (
                    <Button
                      {...applyTestAttributes("time-hour", hour.toString())}
                      key={hour}
                      size="icon"
                      variant={
                        dateTime && dateTime.getHours() % 12 === hour % 12
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    {...applyTestAttributes("time-minutes", minute.toString())}
                    key={minute}
                    size="icon"
                    variant={
                      dateTime && dateTime.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    {...applyTestAttributes("time-format", ampm)}
                    key={ampm}
                    size="icon"
                    variant={
                      dateTime &&
                      ((ampm === "AM" && dateTime.getHours() < 12) ||
                        (ampm === "PM" && dateTime.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
