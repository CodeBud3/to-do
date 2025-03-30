import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterAll, describe, expect, test, vi } from "vitest";
import { AuthProvider } from "@/modules/auth/contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";

import Navbar from "../Layout";
import { afterEach } from "node:test";
import axiosInstance from "@/configs/interceptors";
import {
  AUTHORIZED_PROFILE_RESPONSE,
  UNAUTHORIZED_PROFILE_RESPONSE,
} from "@/modules/auth/services/__mocks__/user.service.data";
import { LOGOUT_SUCCESS_RESPONSE } from "@/modules/auth/services/__mocks__/auth.service.data";

// Mock window
Object.defineProperty(window, "location", {
  value: {
    ...window.location,
    assign: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
});
describe("Layout Component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test("renders only Logo and not Logout button when user is not logged in", async () => {
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.reject(UNAUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    expect(screen.queryByTestId("nav-logout")).not.toBeInTheDocument();
    expect(screen.getByTestId("nav-logo")).toBeInTheDocument();
  });

  test("renders both Logo and Logout button when user is logged in", async () => {
    vi.spyOn(axiosInstance, "get").mockImplementation((url) => {
      if (url === "/api/users/profile") {
        return Promise.resolve(AUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });

    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/auth/logout") {
        return Promise.resolve(LOGOUT_SUCCESS_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
    // vi.spyOn(AuthContext, "useAuth").mockReturnValue(authContextMock);
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    expect(screen.queryByTestId("nav-logout")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logo")).toBeInTheDocument();
  });

  test("should not show logout button once logged out", async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </AuthProvider>
      );
    });
    const button = screen.getByTestId("nav-logout");
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByTestId("nav-logout")).not.toBeInTheDocument();
    });
  });

  test("should show logout button to retry if logout fails", async () => {
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/auth/logout") {
        return Promise.reject(LOGOUT_SUCCESS_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </AuthProvider>
      );
    });
    const button = screen.getByTestId("nav-logout");
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByTestId("nav-logout")).toBeInTheDocument();
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });
});
