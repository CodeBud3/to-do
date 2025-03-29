import { UNAUTHORIZED_PROFILE_RESPONSE } from "@/modules/auth/services/__mocks__/user.service.data";
import axiosInstance from "@/configs/interceptors";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as AuthContext from "@/modules/auth/contexts/AuthContext";
import { authContextMock } from "../../contexts/__mocks__/AuthContext.data";
import { MemoryRouter } from "react-router-dom";
import {
  LOGIN_FAILURE_RESPONSE,
  LOGIN_SUCCESS_RESPONSE,
} from "../../services/__mocks__/auth.service.data";
import { LoginForm } from "../LoginForm";
import {
  INVALID_FIELD_VALUE,
  VALID_FIELD_VALUE,
} from "../__mocks__/authForm.data";
vi.mock("@/modules/auth/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));
const loginFields = ["Email", "Password"] as const;
describe("Login Form component UI Validations", () => {
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
      if (url === "/api/auth/login") {
        return Promise.resolve(LOGIN_SUCCESS_RESPONSE);
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
          <LoginForm />
        </MemoryRouter>
      );
    });
    expect(screen.getByText("Sign in")).toBeTruthy();
  });

  test("should render error message when all the fields are empty", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );
    });
    await waitFor(() => {
      // click submit button
      screen.getByTestId("button-submit").click();

      // check error message
      loginFields.forEach((field) => {
        const errorLabel = screen.getByTestId(
          `errormsg-${field.toLowerCase()}`
        );
        expect(errorLabel.textContent).equal(`${field} is required.`);
      });
    });
  });

  test("should render error message when invalid email is passed", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );
    });
    await waitFor(() => {
      // click submit button
      INVALID_FIELD_VALUE["email"].forEach((value) => {
        const emailInput = screen.getByTestId("field-email");
        fireEvent.change(emailInput, { target: { value } });

        screen.getByTestId("button-submit").click();

        const errorLabel = screen.getByTestId(`errormsg-email`);
        expect(errorLabel.textContent).equal(`Enter a valid email address.`);
      });
    });
  });

  test("should render error message when invalid password is passed", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );
    });
    await waitFor(() => {
      const emailInput = screen.getByTestId("field-email");
      fireEvent.change(emailInput, {
        target: { value: VALID_FIELD_VALUE["email"] },
      });
      INVALID_FIELD_VALUE["password"].forEach((value) => {
        const passwordInput = screen.getByTestId("field-password");
        fireEvent.change(passwordInput, { target: { value } });

        screen.getByTestId("button-submit").click();

        expect(screen.getByTestId(`sign-in-form-errors`)).toBeInTheDocument();
        expect(
          screen.getByText("Incorrect email or password.")
        ).toBeInTheDocument();
      });
    });
  });

  test("should verify no error message is displayed when successfully logged in", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );
    });
    await waitFor(() => {
      // click submit button

      loginFields.forEach((fieldName) => {
        const fieldNameLowerCase =
          fieldName.toLowerCase() as keyof typeof VALID_FIELD_VALUE;
        const loginInput = screen.getByTestId(`field-${fieldNameLowerCase}`);
        fireEvent.change(loginInput, {
          target: { value: VALID_FIELD_VALUE[fieldNameLowerCase] },
        });
      });

      screen.getByTestId("button-submit").click();
    });
    await waitFor(() => {
      loginFields.forEach((fieldName) => {
        const fieldNameLowerCase = fieldName.toLowerCase();
        const errorLabel = screen.queryByTestId(
          `errormsg-${fieldNameLowerCase}`
        );
        expect(errorLabel).not.toBeInTheDocument();
      });
    });
  });

  test("should verify email is populated if user has opted for rememberMe and logged in successfully", async () => {
    vi.spyOn(global.Storage.prototype, "getItem").mockImplementation((key) => {
      return key === "rememberedEmail" ? VALID_FIELD_VALUE["email"] : null;
    });
    await act(async () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );
    });
    await waitFor(() => {
      const emailInput = screen.getByTestId("field-email");
      expect(emailInput).toHaveValue(VALID_FIELD_VALUE["email"]);

      const rememberMeCheckbox = screen.getByTestId("field-rememberme");
      expect(rememberMeCheckbox).toHaveAttribute("data-state", "checked");
      const passwordInput = screen.getByTestId("field-password");
      fireEvent.change(passwordInput, {
        target: { value: VALID_FIELD_VALUE["password"] },
      });

      fireEvent.click(screen.getByTestId("button-submit"));
      expect(
        screen.queryByTestId(`sign-in-form-errors`)
      ).not.toBeInTheDocument();
    });
  });
});

describe("Login Form component FAILURE response", () => {
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
      if (url === "/api/auth/login") {
        return Promise.reject(LOGIN_FAILURE_RESPONSE);
      }
      return Promise.reject(new Error("Not Found"));
    });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  test("should verify error message is displayed when incorrect credential is entered", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );
    });
    await waitFor(() => {
      // click submit button

      loginFields.forEach((fieldName) => {
        const fieldNameLowerCase =
          fieldName.toLowerCase() as keyof typeof VALID_FIELD_VALUE;
        const loginInput = screen.getByTestId(`field-${fieldNameLowerCase}`);
        fireEvent.change(loginInput, {
          target: { value: VALID_FIELD_VALUE[fieldNameLowerCase] },
        });
      });

      screen.getByTestId("button-submit").click();
    });
    await waitFor(() => {
      expect(screen.getByTestId(`sign-in-form-errors`)).toBeInTheDocument();
      expect(
        screen.getByText("Incorrect email or password.")
      ).toBeInTheDocument();
    });
  });
});
