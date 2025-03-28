import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import axiosInstance from "@/configs/interceptors";
import { act } from "react";
import {
  AUTHORIZED_RESPONSE,
  UNAUTHORIZED_RESPONSE,
} from "@/configs/__mocks__/interceptor.data";

describe("App Component public routes", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.reject(UNAUTHORIZED_RESPONSE);
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
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.resolve(AUTHORIZED_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });
  test("renders dashboard page when authenticated", async () => {
    const logOutButtonText = `Logout ${AUTHORIZED_RESPONSE.data.data.user.firstName}`;

    window.history.pushState({}, "Dashboard Page", "/dashboard");

    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText(logOutButtonText)).toBeInTheDocument(); // Ensure your DashboardPage has an element containing "Dashboard"
    });
  });

  test("renders dashboard page when navigating to public routes", async () => {
    const logOutButtonText = `Logout ${AUTHORIZED_RESPONSE.data.data.user.firstName}`;
    window.history.pushState({}, "Dashboard Page", "/");
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getAllByText(logOutButtonText).length).toBeGreaterThan(0);
    });

    window.history.pushState({}, "Dashboard Page", "/login");
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getAllByText(logOutButtonText).length).toBeGreaterThan(0);
    });

    window.history.pushState({}, "Dashboard Page", "/signup");
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getAllByText(logOutButtonText).length).toBeGreaterThan(0);
    });

    window.history.pushState({}, "Dashboard Page", "/forgot-password");
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getAllByText(logOutButtonText).length).toBeGreaterThan(0);
    });

    window.history.pushState({}, "Dashboard Page", "/reset-password");
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getAllByText(logOutButtonText).length).toBeGreaterThan(0);
    });
  });
});
