export const UNAUTHORIZED_RESPONSE = {
  data: {
    success: false,
    message: "Authorization Error",
    data: null,
    error: {
      code: "UNAUTHORIZED",
      details: ["Unauthorized"],
    },
  },
};

export const AUTHORIZED_RESPONSE = {
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
