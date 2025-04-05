import axiosInstance from "@/configs/interceptors";
import { AUTHORIZED_PROFILE_RESPONSE } from "@/modules/auth/services/__mocks__/user.service.data";
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { UserProfile } from "../UserProfile";
import { authContextMock } from "@/modules/auth/contexts/__mocks__/AuthContext.data";
import * as AuthContext from "@/modules/auth/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";

// vi.mock("@/components/ui/sidebar", () => ({
//   useSidebar: () => {
//     return {
//       isMobile: false,
//     };
//   },
// }));

vi.mock("@/modules/auth/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));
describe("User profile component", () => {
  beforeAll(() => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      ...authContextMock,
    });
    vi.spyOn(axiosInstance, "get").mockImplementation((url: string) => {
      if (url === "/api/users/profile") {
        return Promise.resolve(AUTHORIZED_PROFILE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });

  beforeEach(async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500, // Set your desired width
    });
    await act(() => {
      render(
        <SidebarProvider>
          <UserProfile></UserProfile>
        </SidebarProvider>
      );
    });
  });
  test("should render UserProfile component without crashing", () => {
    expect(screen.getByTestId("side-nav-user-profile")).toBeInTheDocument();
  });
});
