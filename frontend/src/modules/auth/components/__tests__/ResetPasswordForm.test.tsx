import {
  RESET_PASSWORD_SUCCESS_RESPONSE,
  RESET_PASSWORD_FAILURE_RESPONSE,
} from "@/modules/auth/services/__mocks__/user.service.data";
import axiosInstance from "@/configs/interceptors";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { ResetPasswordForm } from "../ResetPasswordForm";
import {
  INVALID_FORM_FIELD_VALUE,
  RESET_PASSWORD_FORM_FIELDS,
  TOKEN,
  VALID_FORM_FIELD_VALUE,
} from "../__mocks__/authForm.data";
import * as reactRouterDom from "react-router-dom";

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

describe("RESET Password Form component for SUCCESS response", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/users/reset-password") {
        return Promise.resolve(RESET_PASSWORD_SUCCESS_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  test("renders without crashing", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ResetPasswordForm token={TOKEN} />
        </MemoryRouter>
      );
    });
    expect(screen.getByText("Save")).toBeTruthy();
  });

  test("should render error messages based on field validations", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ResetPasswordForm token={TOKEN} />
        </MemoryRouter>
      );
    });

    await waitFor(async () => {
      for (const field of RESET_PASSWORD_FORM_FIELDS) {
        for (const value of INVALID_FORM_FIELD_VALUE[field.key]) {
          const inputField = screen.getByTestId(field.fieldTestId);
          for (const data of value.data) {
            fireEvent.change(inputField, { target: { value: data } });
            screen.getByTestId("button-submit").click();
            await waitFor(() => {
              const errorLabel = screen.queryByTestId(field.errorTestId);
              expect(errorLabel?.textContent).equal(value.errorMessage);
            });
          }
        }
      }
    });
  });

  test("should display error message for confirmPassword if password is changed", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ResetPasswordForm token={TOKEN} />
        </MemoryRouter>
      );
    });

    await act(() => {
      for (const field of RESET_PASSWORD_FORM_FIELDS) {
        const inputField = screen.getByTestId(field.fieldTestId);
        fireEvent.change(inputField, {
          target: { value: VALID_FORM_FIELD_VALUE[field.key] },
        });
      }
    });
    await act(() => {
      fireEvent.change(screen.getByTestId("field-password"), {
        target: { value: `${VALID_FORM_FIELD_VALUE["password"]}a` },
      });
    });
    screen.getByTestId("button-submit").click();
    await waitFor(() => {
      const errorLabel = screen.getByTestId("errormsg-confirmpassword");
      expect(errorLabel.textContent).equal("Passwords do not match.");
    });
  });

  test("should render alert message for successful reset", async () => {
    const mockNavigate = vi.fn();
    vi.spyOn(reactRouterDom, "useNavigate").mockReturnValue(mockNavigate);
    await act(async () => {
      render(
        <MemoryRouter>
          <ResetPasswordForm token={TOKEN} />
        </MemoryRouter>
      );
    });

    await waitFor(async () => {
      for (const field of RESET_PASSWORD_FORM_FIELDS) {
        const inputField = screen.getByTestId(field.fieldTestId);
        await fireEvent.change(inputField, {
          target: { value: VALID_FORM_FIELD_VALUE[field.key] },
        });
      }
    });
    screen.getByTestId("button-submit").click();
    await waitFor(() => {
      const errorLabel = screen.queryByTestId("reset-password-form-errors");
      expect(errorLabel).not.toBeInTheDocument();
      expect(screen.getByTestId("reset-password-alert")).toBeInTheDocument();
      expect(
        screen.getByText(RESET_PASSWORD_SUCCESS_RESPONSE.data.message)
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

describe("Reset password Form component for FAILURE response", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.spyOn(axiosInstance, "post").mockImplementation((url) => {
      if (url === "/api/users/reset-password") {
        return Promise.reject(RESET_PASSWORD_FAILURE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  test("should display error message when reset-password fails", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ResetPasswordForm token={TOKEN} />
        </MemoryRouter>
      );
    });

    await act(async () => {
      for (const field of RESET_PASSWORD_FORM_FIELDS) {
        const inputField = screen.getByTestId(field.fieldTestId);
        await fireEvent.change(inputField, {
          target: { value: VALID_FORM_FIELD_VALUE[field.key] },
        });
      }
      screen.getByTestId("button-submit").click();
    });

    await waitFor(() => {
      const errorLabel = screen.getByTestId("reset-password-form-errors");
      expect(errorLabel).toBeInTheDocument();
    });
  });
});
