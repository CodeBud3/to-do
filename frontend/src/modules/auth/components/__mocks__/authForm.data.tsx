export const LOGIN_FORM_FIELDS = [
  { key: "email", fieldTestId: "field-email", errorTestId: "errormsg-email" },
  {
    key: "loginPassword",
    fieldTestId: "field-password",
    errorTestId: "errormsg-password",
  },
] as const;

export const SIGN_UP_FORM_FIELDS = [
  {
    key: "firstName",
    fieldTestId: "field-firstname",
    errorTestId: "errormsg-firstname",
  },
  {
    key: "lastName",
    fieldTestId: "field-lastname",
    errorTestId: "errormsg-lastname",
  },
  { key: "email", fieldTestId: "field-email", errorTestId: "errormsg-email" },
  {
    key: "password",
    fieldTestId: "field-password",
    errorTestId: "errormsg-password",
  },
  {
    key: "confirmPassword",
    fieldTestId: "field-confirmpassword",
    errorTestId: "errormsg-confirmpassword",
  },
  { key: "tnc", fieldTestId: "field-tnc", errorTestId: "errormsg-tnc" },
] as const;
export const RESET_PASSWORD_FORM_FIELDS = [
  {
    key: "password",
    fieldTestId: "field-password",
    errorTestId: "errormsg-password",
  },
  {
    key: "confirmPassword",
    fieldTestId: "field-confirmpassword",
    errorTestId: "errormsg-confirmpassword",
  },
] as const;
export const INVALID_FORM_FIELD_VALUE = {
  firstName: [
    {
      data: [""],
      errorMessage: "First name is required.",
    },
    {
      data: ["a"],
      errorMessage: "Must be at least 2 characters long.",
    },
    {
      data: ["invalidName2", "123456", "John@", "John$", "John#"],
      errorMessage:
        "Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
    },
  ],
  lastName: [
    {
      data: [""],
      errorMessage: "First name is required.",
    },
    {
      data: ["a"],
      errorMessage: "Must be at least 2 characters long.",
    },
    {
      data: ["invalidName2", "123456", "John@", "John$", "John#"],
      errorMessage:
        "Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
    },
  ],
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
  password: [
    {
      data: [""],
      errorMessage: "Password is required.",
    },
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
  confirmPassword: [
    {
      data: [""],
      errorMessage: "Please confirm your password.",
    },
    {
      data: ["pass"],
      errorMessage: "Passwords do not match",
    },
  ],
  tnc: [
    {
      data: [false],
      errorMessage: "You must agree to the Terms and Conditions.",
    },
  ],
};

export const VALID_FORM_FIELD_VALUE = {
  firstName: "Jo-hn 'First",
  lastName: "Do-e 'Last",
  email: "johndoe@test.com",
  loginPassword: "Test@001",
  password: "Test@001",
  confirmPassword: "Test@001",
  tnc: true,
};

export const TOKEN = "123abc#efg";
