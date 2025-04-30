const authFieldErrorCode = {
  required: "Required",
  nameTooSmall: "Must be at least 2 characters long.",
  nameInvalid:
    "Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
  emailInvalid: "Enter a valid email address.",
  passwordTooSmall: "Password must be at least 8 characters long.",
  passwordInvalidUpperCase: "Must include at least one uppercase letter (A-Z).",
  passwordInvalidLowerCase: "Must include at least one lowercase letter (a-z).",
  passwordInvalidNumber: "Must include at least one number (0-9).",
  passwordInvalidSpecialChar:
    "Must include at least one special character (@$!%*?&).",
  unknownFields: "Unknown fields in request body",
};
export const authValidationFailureData = [
  {
    type: "Empty payload",
    data: {},
    expectedErrorMessage: [
      { path: "firstName", message: authFieldErrorCode.required },
      { path: "lastName", message: authFieldErrorCode.required },
      { path: "email", message: authFieldErrorCode.required },
      { path: "password", message: authFieldErrorCode.required },
    ],
  },
  {
    type: "Empty string and unknown field",
    data: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      unknownField: "",
      unknownField1: "",
    },
    expectedErrorMessage: [
      { path: "firstName", message: authFieldErrorCode.nameTooSmall },
      { path: "firstName", message: authFieldErrorCode.nameInvalid },
      { path: "lastName", message: authFieldErrorCode.nameTooSmall },
      { path: "lastName", message: authFieldErrorCode.nameInvalid },
      { path: "email", message: authFieldErrorCode.emailInvalid },
      { path: "password", message: authFieldErrorCode.passwordTooSmall },
      {
        path: "password",
        message: authFieldErrorCode.passwordInvalidUpperCase,
      },
      {
        path: "password",
        message: authFieldErrorCode.passwordInvalidLowerCase,
      },
      { path: "password", message: authFieldErrorCode.passwordInvalidNumber },
      {
        path: "password",
        message: authFieldErrorCode.passwordInvalidSpecialChar,
      },
      {
        message: authFieldErrorCode.unknownFields,
      },
    ],
  },
  {
    type: "Invalid fields case 1",
    data: {
      firstName: "a",
      lastName: "a",
      email: "a",
      password: "a",
    },
    expectedErrorMessage: [
      { path: "firstName", message: authFieldErrorCode.nameTooSmall },
      { path: "lastName", message: authFieldErrorCode.nameTooSmall },
      { path: "email", message: authFieldErrorCode.emailInvalid },
      { path: "password", message: authFieldErrorCode.passwordTooSmall },
      {
        path: "password",
        message: authFieldErrorCode.passwordInvalidUpperCase,
      },
      { path: "password", message: authFieldErrorCode.passwordInvalidNumber },
      {
        path: "password",
        message: authFieldErrorCode.passwordInvalidSpecialChar,
      },
    ],
  },
  {
    type: "Invalid fields case 2",
    data: {
      firstName: "a1",
      lastName: "a1",
      email: "a@",
      password: "aA",
    },
    expectedErrorMessage: [
      { path: "firstName", message: authFieldErrorCode.nameInvalid },
      { path: "lastName", message: authFieldErrorCode.nameInvalid },
      { path: "email", message: authFieldErrorCode.emailInvalid },
      { path: "password", message: authFieldErrorCode.passwordTooSmall },
      { path: "password", message: authFieldErrorCode.passwordInvalidNumber },
      {
        path: "password",
        message: authFieldErrorCode.passwordInvalidSpecialChar,
      },
    ],
  },
  {
    type: "Invalid fields case 3",
    data: {
      firstName: "a#",
      lastName: "a@",
      email: "a@a",
      password: "aA1",
    },
    expectedErrorMessage: [
      { path: "firstName", message: authFieldErrorCode.nameInvalid },
      { path: "lastName", message: authFieldErrorCode.nameInvalid },
      { path: "email", message: authFieldErrorCode.emailInvalid },
      { path: "password", message: authFieldErrorCode.passwordTooSmall },
      {
        path: "password",
        message: authFieldErrorCode.passwordInvalidSpecialChar,
      },
    ],
  },
  {
    type: "Invalid fields case 4",
    data: {
      firstName: "a - a ",
      lastName: "a'a",
      email: "a@a.",
      password: "aA1@",
    },
    expectedErrorMessage: [
      { path: "email", message: authFieldErrorCode.emailInvalid },
      { path: "password", message: authFieldErrorCode.passwordTooSmall },
    ],
  },
];
