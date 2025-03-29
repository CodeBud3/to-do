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

export const LOGIN_FAILURE_RESPONSE = {
  response: {
    data: {
      success: false,
      message: "Validation Error",
      data: null,
      error: {
        code: "VALIDATION_ERROR",
        details: ["Incorrect email or password."],
      },
    },
  },
};
