import { cn } from "@/lib/utils"; // If using shadcn/utils, otherwise remove this import

const GlobalLoader = () => {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50"
      )}
    >
      <div className="h-12 w-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoader;
