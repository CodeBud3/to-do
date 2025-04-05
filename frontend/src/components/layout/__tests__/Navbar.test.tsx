import { act, render, screen } from "@testing-library/react";
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

    expect(screen.queryByTestId("sidenav-trigger")).not.toBeInTheDocument();
    expect(screen.queryByTestId("nav-logo")).toBeInTheDocument();
  });

  test("renders only sidenav when user is logged in", async () => {
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

    expect(screen.queryByTestId("sidenav-trigger")).toBeInTheDocument();
    expect(screen.queryByTestId("nav-logo")).not.toBeInTheDocument();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });
});
