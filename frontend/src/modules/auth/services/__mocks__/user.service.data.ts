export const UNAUTHORIZED_PROFILE_RESPONSE = [];

export const AUTHORIZED_PROFILE_RESPONSE = {
  data: {
    success: true,
    message: "User details fetched successfully",
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

export const FORGOT_PASSWORD_SUCCESS_RESPONSE = {
  data: {
    success: true,
    message: "Please check your email for further instructions.",
  },
};

export const RESET_PASSWORD_SUCCESS_RESPONSE = {
  data: { success: true, message: "Password reset successfull." },
};

export const RESET_PASSWORD_FAILURE_RESPONSE = null;
