import { createContext, useContext, useState, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
type AlertDialogType = null | React.ReactNode | string | boolean;
type CallBackType = (() => void) | null;
interface OpenDialogParameters {
  title?: AlertDialogType;
  description?: AlertDialogType;
  cancel?: AlertDialogType;
  confirm?: AlertDialogType;
  onCancel?: CallBackType;
  onConfirm?: CallBackType;
}

interface AlertDialogContextType {
  openDialog: (params: OpenDialogParameters) => void;
  closeDialog: () => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(
  undefined
);

export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      "useAlertDialog must be used within an AlertDialogProvider"
    );
  }
  return context;
};

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<AlertDialogType>(null);
  const [description, setDescription] = useState<AlertDialogType>("");
  const [cancel, setCancel] = useState<AlertDialogType>("");
  const [confirm, setConfirm] = useState<AlertDialogType>("");
  const [onCancel, setOnCancel] = useState<CallBackType>(null);
  const [onConfirm, setOnConfirm] = useState<CallBackType>(null);

  const cancelAndCloseDialog = () => {
    closeDialog();
    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  const confirmAndcloseDialog = async () => {
    closeDialog();
    if (typeof onConfirm === "function") {
      onConfirm();
    }
  };

  const openDialog = ({
    title = "",
    description = "",
    cancel = "Cancel",
    confirm = "Confirm",
    onCancel = null,
    onConfirm = null,
  }: OpenDialogParameters) => {
    setTitle(title);
    setDescription(description);
    setCancel(cancel);
    setConfirm(confirm);
    setOnCancel(() => onCancel);
    setOnConfirm(() => onConfirm);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setCancel("");
    setConfirm("");
  };

  return (
    <AlertDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          {(title || description) && (
            <AlertDialogHeader>
              {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
              {description && (
                <AlertDialogDescription>{description}</AlertDialogDescription>
              )}
            </AlertDialogHeader>
          )}
          <AlertDialogFooter>
            {cancel && (
              <AlertDialogCancel onClick={cancelAndCloseDialog}>
                {cancel}
              </AlertDialogCancel>
            )}
            {confirm && (
              <AlertDialogAction onClick={confirmAndcloseDialog}>
                {confirm}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};
