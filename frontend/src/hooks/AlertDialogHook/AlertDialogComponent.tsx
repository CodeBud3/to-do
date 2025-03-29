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
import { applyTestAttributes } from "@/modules/auth/helpers/formHelper";

export function AlertDialogComponent({
  alertParams,
  closeAlert,
  ...props
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
      <AlertDialogContent {...props}>
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
            <AlertDialogCancel
              {...applyTestAttributes("alert", "cancel")}
              onClick={cancelAndCloseAlert}
            >
              {alertParams.cancel}
            </AlertDialogCancel>
          )}
          {alertParams.confirm && (
            <AlertDialogAction
              {...applyTestAttributes("alert", "confirm")}
              onClick={confirmAndcloseAlert}
            >
              {alertParams.confirm}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
