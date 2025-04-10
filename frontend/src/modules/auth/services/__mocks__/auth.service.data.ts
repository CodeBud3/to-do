export const LOGIN_SUCCESS_RESPONSE = {
  data: {
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: "123456789",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@test.com",
      },
    },
  },
};

export const LOGIN_FAILURE_RESPONSE = [
  {
    code: "formError",
    path: ["body", "formError"],
    message: "Incorrect email or password.",
  },
];

export const REGISTER_SUCCESS_RESPONSE = {
  data: {
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: "67e90cbe022fe25b7f225550",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@test.com",
      },
    },
  },
};

export const REGISTER_FAILURE_RESPONSE = [
  {
    code: "formError",
    path: ["body", "formError"],
    message: "Email already registered.",
  },
];

export const LOGOUT_SUCCESS_RESPONSE = {
  data: {
    success: true,
    message: "User logged out successfully",
  },
};
