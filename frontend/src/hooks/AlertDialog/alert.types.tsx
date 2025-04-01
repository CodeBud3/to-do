export type AlertType = null | React.ReactNode | string | boolean;
export type CallBackType = (() => void) | null;
export interface AlertParams {
  title?: AlertType;
  description?: AlertType;
  cancel?: AlertType;
  confirm?: AlertType;
  onCancel?: CallBackType;
  onConfirm?: CallBackType;
}

export interface AlertHookType {
  showAlert: (params: AlertParams) => void;
  closeAlert: () => void;
  alertParams: AlertParams | null;
}
