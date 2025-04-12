// components/SheetProvider.tsx
import { ReactNode, createContext, useContext, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";

type SheetContextType = {
  openSheet: (content: ReactNode, title?: string) => void;
  closeSheet: () => void;
};

const SheetContext = createContext<SheetContextType | null>(null);

export const useSheet = () => {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used within a SheetProvider");
  return ctx;
};

export const SheetProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState<string>("");

  const openSheet = (node: ReactNode, title = "") => {
    setContent(node);
    setTitle(title);
    setOpen(true);
  };

  const closeSheet = () => {
    setOpen(false);
    setContent(null);
    setTitle("");
  };

  return (
    <SheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle {...applyTestAttributes("sheet", "title")}>
              {title}
            </SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    </SheetContext.Provider>
  );
};
