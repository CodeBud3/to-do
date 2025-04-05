import { render, screen } from "@testing-library/react";
import { afterAll, describe, expect, test, vi } from "vitest";
import * as AuthContext from "@/modules/auth/contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";

import Layout from "../Layout";
import { afterEach } from "node:test";
import { authContextMock } from "../../../modules/auth/contexts/__mocks__/AuthContext.data";

// Mock AuthContext
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

describe("Layout Component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test("renders loading screen when user profile is being fetched", () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      ...authContextMock,
      user: null,
      authloading: true,
    });
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("global-loader")).toBeInTheDocument();
  });

  test("navigate to login screen, if path is / and user is not logged in", async () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      ...authContextMock,
      user: null,
    });

    mocks.useLocation.mockReturnValue({ state: { from: "/" } });

    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("sidenav-trigger")).not.toBeInTheDocument();
    expect(screen.getByTestId("nav-logo")).toBeInTheDocument();
  });

  test("navigate to dashboard screen, if path is / and user is logged in", async () => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      ...authContextMock,
    });

    mocks.useLocation.mockReturnValue({ state: { from: "/" } });

    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(screen.getByTestId("sidenav-trigger")).toBeInTheDocument();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });
});
