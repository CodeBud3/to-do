import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils"; // ShadCN utility for styling (optional)

interface ErrorMessageProps {
  errors?: string[] | string | null;
  className?: string;
}

export const ErrorMessage = ({ errors, className }: ErrorMessageProps) => {
  if (!errors) return null;

  const errorList = Array.isArray(errors) ? errors : [errors];

  return (
    <div
      className={cn("bg-red-100 text-red-700 p-3 rounded-md my-4", className)}
    >
      <div className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-5 w-5 text-red-700" />
        <span>Error</span>
      </div>
      <ul className="mt-2 text-sm list-disc list-inside">
        {errorList.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
