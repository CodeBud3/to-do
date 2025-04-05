import { useState } from "react";

import { AlertHookType, AlertParams } from "./alert.types";

export const useAlertDialog = (): AlertHookType => {
  const [alertParams, setAlertParams] = useState<AlertParams | null>(null);

  const showAlert = (params: AlertParams) => {
    setAlertParams(params);
  };

  const closeAlert = () => {
    setAlertParams(null);
  };

  return {
    alertParams,
    showAlert,
    closeAlert,
  };
};
