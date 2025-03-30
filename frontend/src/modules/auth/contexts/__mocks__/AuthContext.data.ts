import { vi } from "vitest";
import { User } from "../../types/auth.types";

export const mockUser = {
  _id: "123456789",
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@test.com",
  role: "member",
};

export const authContextMock = {
  user: mockUser as User,
  authloading: false,
  updateAuth: vi.fn(),
  setUser: vi.fn(),
  logout: vi.fn(),
};
