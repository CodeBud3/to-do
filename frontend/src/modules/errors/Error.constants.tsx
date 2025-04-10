const ERRORS = {
  APP_ERROR: {
    message: "Something went wrong!",
    code: "INTERNAL_ERROR",
    path: ["body", "formError"],
  },
  FORM_ERROR: {
    message: "Something went wrong!",
  },
  FORM_ERROR_TYPE: "formError",
};

export default ERRORS;
