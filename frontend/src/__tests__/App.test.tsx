import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import axiosInstance from "@/configs/interceptors";
import { act } from "react";
import {
  AUTHORIZED_PROFILE_RESPONSE,
  UNAUTHORIZED_PROFILE_RESPONSE,
} from "@/modules/auth/services/__mocks__/user.service.data";
import { MockPointerEvent } from "@/test/setup";
import { LOGOUT_SUCCESS_RESPONSE } from "@/modules/auth/services/__mocks__/auth.service.data";

describe("App Component public routes", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.reject(UNAUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test("renders without crashing", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getAllByTestId("global-loader")).toBeTruthy();
  });

  test("renders 404 page on unknown route", async () => {
    window.history.pushState({}, "Not Found Page", "/random-route");

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText("404 Not Found")).toBeInTheDocument();
    });
  });

  test("renders login page when navigating to /", async () => {
    window.history.pushState({}, "Empty State", "/");

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });
  });

  test("renders login page when navigating to protected route", async () => {
    window.history.pushState({}, "Dashboard page", "/dashboard");

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });
  });

  test("renders login page when navigating to /login", async () => {
    window.history.pushState({}, "Login Page", "/login");

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    });
  });

  test("renders sign up page when navigating to /signup", async () => {
    window.history.pushState({}, "Signup Page", "/signup");

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText("Create an account")).toBeInTheDocument();
    });
  });

  test("renders Forgot password page when navigating to /forgot-password", async () => {
    window.history.pushState({}, "Forgot Password", "/forgot-password");

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    });
  });
});
test("renders login page when navigating to /reset-password without token", async () => {
  window.history.pushState({}, "Reset Password", "/reset-password");
  await act(async () => {
    render(<App />);
  });
  await waitFor(() => {
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });
});

test("renders reset-password page when navigating to /reset-password with token", async () => {
  window.history.pushState(
    {},
    "Reset Password",
    "/reset-password?token=abc12345"
  );
  await act(async () => {
    render(<App />);
  });
  await waitFor(() => {
    expect(screen.getByText("Reset your password")).toBeInTheDocument();
  });
});
describe("App Component protected routes", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false, // Default match result
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.resolve(AUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });
  test("renders dashboard page when authenticated", async () => {
    window.history.pushState({}, "Dashboard Page", "/dashboard");

    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("sidenav-trigger")).toBeInTheDocument();
    });
  });

  test("renders dashboard page when navigating to empty routes", async () => {
    await act(async () => {
      render(<App />);
    });

    window.history.pushState({}, "Home Page", "/");

    await waitFor(() => {
      expect(screen.getByTestId("sidenav-trigger")).toBeInTheDocument();
    });
  });

  test("renders dashboard page when navigating to login route", async () => {
    await act(async () => {
      render(<App />);
    });

    window.history.pushState({}, "Login Page", "/login");

    await waitFor(() => {
      expect(screen.getByTestId("sidenav-trigger")).toBeInTheDocument();
    });
  });

  test("renders dashboard page when navigating to signup route", async () => {
    await act(() => {
      render(<App />);
    });

    window.history.pushState({}, "Signup Page", "/signup");

    await waitFor(() => {
      expect(screen.getByTestId("sidenav-trigger")).toBeInTheDocument();
    });
  });

  test("renders dashboard page when navigating to forgot password route", async () => {
    await act(() => {
      render(<App />);
    });

    window.history.pushState({}, "Forgot password Page", "/forgot-password");

    await waitFor(() => {
      expect(screen.getByTestId("sidenav-trigger")).toBeInTheDocument();
    });
  });

  test("renders dashboard page when navigating to reset password route", async () => {
    await act(() => {
      render(<App />);
    });

    window.history.pushState({}, "Reset password Page", "/reset-password");

    await waitFor(() => {
      expect(screen.getByTestId("sidenav-trigger")).toBeInTheDocument();
    });
  });

  test("should logout successfully and navigate to login", async () => {
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/auth/logout") {
        return Promise.resolve(LOGOUT_SUCCESS_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });

    await act(() => {
      render(<App />);
    });

    await waitFor(async () => {
      const userProfile = screen.getByTestId("side-nav-user-profile");
      fireEvent.click(userProfile);
      await fireEvent.pointerDown(
        userProfile,
        new MockPointerEvent("pointerdown", {
          bubbles: true,
          ctrlKey: false,
          button: 0,
        })
      );
    });
    await waitFor(async () => {
      const logout = screen.getByTestId("menu-logout");
      fireEvent.click(logout);
    });
    // await waitFor(() => {
    //   expect(screen.getByText(`Sign in to your account`)).toBeInTheDocument();
    // });
  });
});
