import {
  PASSWORD_SUCCESS_RESPONSE,
  UNAUTHORIZED_PROFILE_RESPONSE,
} from "@/modules/auth/services/__mocks__/user.service.data";
import axiosInstance from "@/configs/interceptors";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import ForgotPassword from "../../pages/ForgotPasswordPage";
import { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as AuthContext from "@/modules/auth/contexts/AuthContext";
import {
  authContextMock,
  mockUser,
} from "../../contexts/__mocks__/AuthContext.data";
import { MemoryRouter } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";
vi.mock("@/modules/auth/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock useLocation
const mocks = vi.hoisted(() => ({
  useLocation: vi.fn(() => ({
    state: { from: "/login" },
  })),
}));
vi.mock("react-router-dom", async () => {
  const routerData = await vi.importActual("react-router-dom");

  return {
    ...routerData,
    useLocation: mocks.useLocation,
  };
});
// mock /forgot-password API
describe("Test Forgot Password Form component for SUCCESS response", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      ...authContextMock,
      user: null,
    });
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.reject(UNAUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/users/forgot-password") {
        return Promise.resolve(PASSWORD_SUCCESS_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  test("should render error message when empty email is provided", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );
    });

    // click forgot password button
    const button = screen.getByText("Reset Password");
    fireEvent.click(button);

    // check error message
    const errorMessage = await screen.findByText("Email is required.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("should render alert when email is entered and submitted", async () => {
    const mockNavigate = vi.fn();
    vi.spyOn(reactRouterDom, "useNavigate").mockReturnValue(mockNavigate);
    await act(async () => {
      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );
    });

    // enter email
    const emailInput = screen.getByTestId("field-email");
    fireEvent.change(emailInput, { target: { value: mockUser.email } });
    // click forgot password button
    const button = screen.getByText("Reset Password");
    fireEvent.click(button);

    // check success message is displayed
    await waitFor(() => {
      expect(screen.getByTestId("forgot-password-alert")).toBeInTheDocument();
      expect(
        screen.getByText(PASSWORD_SUCCESS_RESPONSE.data.message)
      ).toBeInTheDocument();
    });

    // click confirm should navigate to login page
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});

describe("Test Forgot Password Form component for FAILURE response", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      ...authContextMock,
      user: null,
    });
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.reject(UNAUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/users/forgot-password") {
        return Promise.reject(PASSWORD_SUCCESS_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  test("should render error message when forgot-password API failes", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );
    });
    // enter email
    const emailInput = screen.getByTestId("field-email");
    fireEvent.change(emailInput, { target: { value: mockUser.email } });
    // click forgot password button
    const button = screen.getByText("Reset Password");
    fireEvent.click(button);
    await waitFor(() => {
      expect(
        screen.getByTestId("forgot-password-form-errors")
      ).toBeInTheDocument();
    });
  });
});
