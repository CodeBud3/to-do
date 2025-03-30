export const LOGIN_FORM_FIELDS = [
  { key: "email", fieldTestId: "field-email", errorTestId: "errormsg-email" },
  {
    key: "loginPassword",
    fieldTestId: "field-password",
    errorTestId: "errormsg-password",
  },
] as const;
export const INVALID_FORM_FIELD_VALUE = {
  email: [
    {
      data: [""],
      errorMessage: "Email is required.",
    },
    {
      data: ["invalidEmail", "invalidEmail@a", "invalidemail.com"],
      errorMessage: "Enter a valid email address.",
    },
  ],
  loginPassword: [
    {
      data: [""],
      errorMessage: "Password is required.",
    },
    {
      data: ["p", "password", "p@ssword", "p@ssword1", "p@ssworD"],
      errorMessage: "Incorrect email or password.",
    },
  ],
  registerPassword: [
    {
      data: ["p"],
      errorMessage: "Password must be at least 8 characters long.",
    },
    {
      data: ["password"],
      errorMessage: "Must include at least one uppercase letter (A-Z).",
    },
    {
      data: ["passworD"],
      errorMessage: "Must include at least one number (0-9).",
    },
    {
      data: ["passwordD0"],
      errorMessage: "Must include at least one special character (@$!%*?&).",
    },
    {
      data: ["PASSWORD@0"],
      errorMessage: "Must include at least one lowercase letter (a-z).",
    },
    {
      data: ["passworD@"],
      errorMessage: "Must include at least one number (0-9).",
    },
  ],
};

export const VALID_FORM_FIELD_VALUE = {
  email: "johndoe@test.com",
  loginPassword: "Test@001",
  registerPassword: "Test@001",
  registerConfirmPassword: "Test@001",
};

export const TOKEN = "123abc#efg";
