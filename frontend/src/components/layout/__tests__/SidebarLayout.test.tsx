import axiosInstance from "@/configs/interceptors";
import { AuthProvider } from "@/modules/auth/contexts/AuthContext";
import { AUTHORIZED_PROFILE_RESPONSE } from "@/modules/auth/services/__mocks__/user.service.data";
import { MemoryRouter } from "react-router-dom";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { act, render, screen } from "@testing-library/react";
import SidebarLayout from "../SidebarLayout";
import Dashboard from "@/modules/dashboard/pages/DashboardPage";
import TasksPage from "@/modules/tasks/pages/TasksPage";
import { Provider } from "react-redux";
import store from "@/store/store";
import { SheetProvider } from "@/contexts/SheetContext";

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

describe("Sidebar Layout component with dashboard", () => {
  beforeAll(() => {
    vi.spyOn(axiosInstance, "get").mockImplementation((url: string) => {
      if (url === "/api/users/profile") {
        return Promise.resolve(AUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.resetAllMocks();
  });
  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SheetProvider>
            <AuthProvider>
              <MemoryRouter>
                <SidebarLayout>
                  <Dashboard></Dashboard>
                </SidebarLayout>
              </MemoryRouter>
            </AuthProvider>
          </SheetProvider>
        </Provider>
      );
    });
  });
  test("should render Dashboard component without crashing", () => {
    expect(screen.getByTestId("side-nav-user-profile")).toBeInTheDocument();
  });

  test("should render dashboard page with welcome message", () => {
    expect(
      screen.getByText(
        `Hello, ${AUTHORIZED_PROFILE_RESPONSE.data.data.user.firstName}`
      )
    ).toBeInTheDocument();
  });
});

describe("Sidebar Layout component with Tasks", () => {
  beforeAll(() => {
    vi.spyOn(axiosInstance, "get").mockImplementation((url: string) => {
      if (url === "/api/users/profile") {
        return Promise.resolve(AUTHORIZED_PROFILE_RESPONSE);
      } else if (url === "/api/tasks") {
        return Promise.resolve([]);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.resetAllMocks();
  });
  beforeEach(async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SheetProvider>
            <AuthProvider>
              <MemoryRouter>
                <SidebarLayout>
                  <TasksPage></TasksPage>
                </SidebarLayout>
              </MemoryRouter>
            </AuthProvider>
          </SheetProvider>
        </Provider>
      );
    });
  });
  test("should render TasksPage component without crashing", () => {
    expect(screen.getByTestId("side-nav-user-profile")).toBeInTheDocument();
  });

  test("should render TasksPage with list of tasks", () => {
    expect(screen.getByText(`My Tasks`)).toBeInTheDocument();
  });
});
