import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent pl-3 pr-9 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      <button
        type="button"
        className="absolute right-0 text-gray-500 top-0 h-9 w-9 flex items-center justify-center rounded-full border-0 focus:outline-none focus:ring-0"
        onClick={() => setShowPassword((showPassword) => !showPassword)}
      >
        {showPassword ? <Eye className=""></Eye> : <EyeOff></EyeOff>}
      </button>
    </div>
  );
}

export { PasswordInput };
