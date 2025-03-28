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
import { AlertHookType } from "./alert.types";

export function AlertDialogComponent({
  alertParams,
  closeAlert,
}: AlertHookType) {
  if (!alertParams) return null;
  const cancelAndCloseAlert = () => {
    closeAlert();
    if (typeof alertParams.onCancel === "function") {
      alertParams.onCancel();
    }
  };

  const confirmAndcloseAlert = async () => {
    closeAlert();
    if (typeof alertParams.onConfirm === "function") {
      alertParams.onConfirm();
    }
  };
  return (
    <AlertDialog open={!!alertParams} onOpenChange={closeAlert}>
      <AlertDialogContent>
        {(alertParams.title || alertParams.description) && (
          <AlertDialogHeader>
            {alertParams.title && (
              <AlertDialogTitle>{alertParams.title}</AlertDialogTitle>
            )}
            {alertParams.description && (
              <AlertDialogDescription>
                {alertParams.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
        )}
        <AlertDialogFooter>
          {alertParams.cancel && (
            <AlertDialogCancel onClick={cancelAndCloseAlert}>
              {alertParams.cancel}
            </AlertDialogCancel>
          )}
          {alertParams.confirm && (
            <AlertDialogAction onClick={confirmAndcloseAlert}>
              {alertParams.confirm}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
