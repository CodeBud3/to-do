import { fireEvent, render, screen } from "@testing-library/react";
import { afterAll, describe, expect, test, vi } from "vitest";
import * as AuthContext from "@/modules/auth/contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";

import Navbar from "../Layout";
import { afterEach } from "node:test";
import { authContextMock } from "../../../modules/auth/contexts/__mocks__/AuthContext.data";

// Mock AuthContext
vi.mock("@/modules/auth/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Layout Component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test("renders only Logo and not Logout button when user is not logged in", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      ...authContextMock,
      user: null,
    });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("nav-logout")).not.toBeInTheDocument();
    expect(screen.getByTestId("nav-logo")).toBeInTheDocument();
  });

  test("renders both Logo and Logout button when user is logged in", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue(authContextMock);
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("nav-logout")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logo")).toBeInTheDocument();
  });

  test("renders both Logo and Logout button when user is logged in", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue(authContextMock);
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("nav-logout")).toBeInTheDocument();
    expect(screen.getByTestId("nav-logo")).toBeInTheDocument();
  });

  test("logout should be called on click of logout button", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue(authContextMock);
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const button = screen.getByTestId("nav-logout");
    fireEvent.click(button);
    expect(authContextMock.logout).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    vi.clearAllMocks();
  });
});
